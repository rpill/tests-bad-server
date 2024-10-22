import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  reporter: 'list',
  workers: 1,
  timeout: 7 * 1000,
  testDir: './__tests__',
  outputDir: './tmp/artifacts',
  use: {
    baseURL: 'http://localhost/api',
  },
  projects: [
    { name: 'setup', testMatch: /global\.setup\.ts/ },
    {
      name: 'api',
      testMatch: /tests\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
});
