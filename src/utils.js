import fs from 'fs';
import fetch from 'node-fetch';

const API_URL = 'http://localhost/api';

const getCsrfToken = async () => {
  const response = await fetch(`${API_URL}/auth/csrf-token`, {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Ошибка при получении CSRF токена');
  }

  const data = await response.json();
  return data.csrfToken;
};

const acquireAccount = async (email, password) => {
  const name = 'test';
  const csrfToken = await getCsrfToken();

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error('Ошибка при регистрации во время подготовки к тестам');
  }

  const res = await response.json();

  return {
    name,
    email,
    password,
  };
};

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export {
  acquireAccount,
  delay
};