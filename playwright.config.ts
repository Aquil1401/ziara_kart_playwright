import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
  path: path.resolve(__dirname, '.env'),
});

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  /* In CI retry twice; locally 0 retries so exactly 15 tests run cleanly */
  retries: process.env.CI ? 2 : 0,
  /* 1 worker locally ensures headed mode never fights for desktop window focus */
  workers: process.env.CI ? 2 : 1,
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  /* Reporting and failure artifacts */
  reporter: [
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
    ['list']
  ],

  use: {
    baseURL: process.env.BASE_URL || 'https://ziarakart.vercel.app',
    /* Capture screenshots ONLY when a test fails */
    screenshot: 'only-on-failure',
    /* Retain trace & video only on failures */
    trace: 'retain-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15000,
    navigationTimeout: 30000,
    launchOptions: {
      args: [
        '--disable-background-timer-throttling',
        '--disable-backgrounding-occluded-windows',
        '--disable-renderer-backgrounding',
      ],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
      },
    },
  ],
});
