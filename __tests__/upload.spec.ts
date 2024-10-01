import fs from 'fs';
import path from 'path';
import { test, expect } from '@playwright/test';

test.afterEach(async () => {
  await new Promise(res => setTimeout(res, 2000));
});

test('Нельзя использовать оригинальное имя файл при формировании пути', async ({ request }) => {
  const imagePath = path.join(process.cwd(), 'data/mimage.png');
  const image = fs.readFileSync(imagePath);

  const response = await request.post(`${process.env.API_URL}/upload`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    multipart: {
      file: {
        name: imagePath,
        mimeType: 'image/jpeg',
        buffer: image
      }
    }
  });
  const data = await response.json();

  expect(path.basename(data.fileName)).not.toEqual(path.basename(imagePath));
  expect(response.ok()).toBeTruthy();
});

test('Размер файлов должен быть лимитирован по минимуму (больше 2kb)', async ({ request }) => {
  const imagePath = path.join(process.cwd(), 'data/simage.png');
  const image = fs.readFileSync(imagePath);

  const response = await request.post(`${process.env.API_URL}/upload`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    multipart: {
      file: {
        name: imagePath,
        mimeType: 'image/jpeg',
        buffer: image
      }
    }
  });

  expect(response.ok()).toBeFalsy();
});

test('Размер файлов должен быть лимитирован по максимуму (меньше 10mb)', async ({ request }) => {
  const imagePath = path.join(process.cwd(), 'data/bimage.png');
  const image = fs.readFileSync(imagePath);

  const response = await request.post(`${process.env.API_URL}/upload`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    multipart: {
      file: {
        name: imagePath,
        mimeType: 'image/jpeg',
        buffer: image
      }
    }
  });

  expect(response.ok()).toBeFalsy();
});

test('Проверка метаданных загружаемого изображения', async ({ request }) => {
  const response = await request.post(`${process.env.API_URL}/upload`, {
    headers: {
      'Authorization': `Bearer ${process.env.ADMIN_TOKEN}`
    },
    multipart: {
      file: {
        name: 'image.png',
        mimeType: 'image/jpeg',
        buffer: Buffer.alloc(1024 * 1024 * 5)
      }
    }
  });

  expect(response.ok()).toBeFalsy();
});