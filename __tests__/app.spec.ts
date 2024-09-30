import { test, expect } from '@playwright/test';

test('cors() содержит параметры и не пустой', async ({ request }) => {
  const response = await request.get(`${process.env.API_URL}/customers`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    }
  });
  expect(response.headers()).toHaveProperty('access-control-allow-origin', 'http://localhost:5173');
});

test('Отсутствует рейт-лимитер', async ({ request }) => {
  const promises: Promise<any>[] = [];
  for (let i = 0; i < 50; i++) {
    promises.push(request.get(`${process.env.API_URL}/customers`, {
      headers: {
        'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
      }
    }));
  }
  const responses = await Promise.all(promises)
  // console.log(responses.map(response => response.status()))
  expect(responses.every((response) => response.status() === 200)).toBeTruthy();
});

test('Лимит на размер body', async ({ request }) => {
  const response = await request.post(`${process.env.API_URL}/orders`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    data: {
      "address": "1".repeat(100000000),
      "payment": "online",
      "phone": '1',
      "total": 2200,
      "email": "maxim_91@inbox.ru",
      "items": ["66601a7857ecac94459696d0", "66601a8657ecac94459696d4"]
    }
  });

  expect(response.ok()).toBeFalsy();
  // expect(response.status()).toEqual(413);
});