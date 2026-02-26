import fetch from 'node-fetch';

const API_URL = 'http://localhost:8080/api';

const getCsrfSession = async () => {
  const response = await fetch(`${API_URL}/auth/csrf-token`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(
      `Ошибка при получении CSRF токена: ${response.status()} ${response.statusText()}`,
    );
  }

  const { csrfToken } = await response.json();
  if (!csrfToken) {
    throw new Error('CSRF токен не получен на этапе подготовки тестов');
  }

  const setCookie = response.headers.raw()['set-cookie'] || [];
  const csrfCookie = setCookie
    .map(cookieHeader => cookieHeader.split(';')[0])
    .find(cookiePair => cookiePair.startsWith('_csrf='));

  if (!csrfCookie) {
    throw new Error('CSRF cookie (_csrf) не получена на этапе подготовки тестов');
  }

  return { csrfToken, csrfCookie };
};

const acquireAccount = async (email, password) => {
  const name = 'test';
  const { csrfToken, csrfCookie } = await getCsrfSession();

  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,
      Cookie: csrfCookie,
    },
    body: JSON.stringify({
      name,
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ошибка при регистрации во время подготовки к тестам: ${response.status()} ${response.statusText()}`);
  }

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