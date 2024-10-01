import { test, expect } from '@playwright/test';

test.afterEach(async () => {
  await new Promise(res => setTimeout(res, 2000));
});

test('Нормализован лимит', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/customers?limit=1000`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });
  const data = await response.json();
  expect(response.ok()).toBeTruthy();
  expect(data.pagination.pageSize).toBeLessThan(1000);
});

test('Экранирование при поиске', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/customers?search=1+1[]`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });
  expect(response.ok()).toBeTruthy();
});

test('Проверка роли (у пользователя отсутствует доступ к базе всех пользователей)', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/customers`, {
    headers: {
      'Authorization': `Bearer ${process.env.USER_TOKEN}`
    }
  });

  expect(response.ok()).toBeFalsy();
  expect(response.status()).toEqual(403);
});