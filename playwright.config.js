import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 2,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...require('@playwright/test').devices['Desktop Firefox'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...require('@playwright/test').devices['Pixel 5'] },
    },
  ],
});
