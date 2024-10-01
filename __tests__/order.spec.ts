import { test, expect } from '@playwright/test';

test.afterEach(async () => {
  await new Promise(res => setTimeout(res, 2000));
});

test('Нормализован лимит', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/orders/all?page=2&limit=1000`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });
  const data = await response.json();
  expect(response.ok()).toBeTruthy();
  expect(data.pagination.pageSize).toBeLessThanOrEqual(100);
});

test('При избыточной аггрегации, уязвимой к инъекции должна быть ошибка', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/orders/all?status[$expr][$function][body]='function%20(status)%20%7B%20return%20status%20%3D%3D%3D%20%22completed%22%20%7D'&status[$expr][$function][lang]=js&status[$expr][$function][args][0]=%24status`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });
  expect(response.ok()).toBeFalsy();
});

test('Санитизирован комментарий', async ({ request }) => {
  const response = await request.post(`${process.env.API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    data: {
      "payment": "online",
      "email": "test@test.ru",
      "phone": "+71234567890",
      "address": "Spb Vosstania 1",
      "total": 750,
      "items": [
        "66edb93e9b289d24854b30de"
      ],
      "comment": "Catch you <img src=\"https://placehold.co/1\" onload=\"javascript:(function () {window.alert('hello!')})();\">"
    }
  });
  const data = await response.json();
  expect(data.comment).not.toEqual("Catch you <img src=\"https://placehold.co/1\" onload=\"javascript:(function () {window.alert('hello!')})();\">");
});

test('Уязвимость телефона', async ({ request }) => {
  const response = await request.post(`${process.env.API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    data: {
      "address": "Васильевская 86",
      "payment": "online",
      "phone": "111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111a",
      "total": 2200,
      "email": "maxim_91@inbox.ru",
      "items": ["66601a7857ecac94459696d0", "66601a8657ecac94459696d4"]
    }
  });

  expect(response.status()).toEqual(400);
});

test('Проверка роли (у пользователя отсутствует доступ к базе всех заказов)', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/orders/all`, {
    headers: {
      'Authorization': `Bearer ${process.env.USER_TOKEN}`
    }
  });

  expect(response.ok()).toBeFalsy();
  expect(response.status()).toEqual(403);
});