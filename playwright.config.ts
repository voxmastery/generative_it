import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  retries: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:4200',
    trace: 'on-first-retry',
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },
  webServer: {
    command: 'npm start',
    port: 4200,
    reuseExistingServer: true,
    timeout: 120_000,
  },
  // Useful presets if you later want cross-device checks.
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
});

