import fs from 'fs';
import fetch from 'node-fetch';

const API_URL = 'http://localhost/api';

const acquireAccount = async (email, password) => {
  const name = 'test';

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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