// Filet de tests E2E VÉRITAS — config Playwright.
// Sert les fichiers statiques en local (serveur hermétique) et lance Chromium.
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 45000,
  expect: { timeout: 10000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: 'http://localhost:8099',
    headless: true,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'node tests/serve.cjs',
    url: 'http://localhost:8099/VERITAS_v1.2.html',
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
});
