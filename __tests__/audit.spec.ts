import { test, expect } from '@playwright/test';
import shell from 'shelljs';

test('Аудит backend пакетов', () => {
  const result = shell.exec('npm audit', { cwd: `${process.env.GITHUB_WORKSPACE}/backend`, silent: true });

  expect(result.code).toEqual(0);
});

test('Аудит frontend пакетов', () => {
  const result = shell.exec('npm audit', { cwd: `${process.env.GITHUB_WORKSPACE}/frontend`, silent: true });

  expect(result.code).toEqual(0);
});