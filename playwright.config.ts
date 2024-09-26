import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './__tests__',
  outputDir: './tmp/artifacts',
  use: {
    baseURL: 'http://localhost/api',
  },
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'api',
      use: {
        ...devices['Desktop Chrome'],
      },
      dependencies: ['setup'],
    },
  ],
});