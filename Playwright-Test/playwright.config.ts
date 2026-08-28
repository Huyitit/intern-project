import { defineConfig, devices } from '@playwright/test';
import { env } from './src/core/config/env';
export default defineConfig({
  /* Run data seeding file before run test */
  globalSetup: require.resolve('./src/data/seeders/seed.ts'),
  // Delete all data after all tests
  globalTeardown: require.resolve('./src/data/seeders/cleanup.ts'),
  // Test timeout from central TIMEOUTS config
  timeout: Number(process.env.TIMEOUT) || 30000,
  expect: {
    timeout: Number(process.env.EXPECT_TIMEOUT) || 5000
  },

  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI
    ? [
      ["blob", { outputDir: "playwright-report/blob" }],
      ['html', { outputFolder: "playwright-report/html" }],
      ['dot'],
      ['./custom-reporter.ts']
    ]
    : [
      ['dot'],
      ['html', { open: 'always', outputFolder: "playwright-report/html" }],
      ['./custom-reporter.ts']
    ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'e2e-test',
      testDir: './tests/e2e',
      use: { 
        baseURL: env.uiBaseUrl || "http://localhost:5173",
        ...devices['Desktop Firefox'],
        trace: 'on' 
      },
      grepInvert: [/@hard/]
    },

    {
      name: 'e2e-hard-test',
      dependencies: ['e2e-test'],
      testDir: './tests/e2e',
      use: {
        baseURL: env.uiBaseUrl || 'http://localhost:5173',
        ...devices['Desktop Firefox'] },
      grep: /@hard/,
      repeatEach: process.env.CI ? 100 : 0,
      ...(process.env.CI ? {} : { workers: 6 }),
      retries: 0,
      timeout: 10000
    },

    {
      name: 'api-smoke-test',
      testDir: './tests/api',
      use: { 
        baseURL: env.baseUrl || 'http://localhost:3000',
        ...devices['Desktop Firefox'] },
      grep: [/@smoke/],
      repeatEach: 5,
    },

    // @regression tests
    {
      name: 'api-regression-test',
      testDir: './tests/api',
      use: { 
        baseURL: env.baseUrl || 'http://localhost:3000',
        ...devices['Desktop Firefox'] },
      grep: [/@regression/],
      grepInvert: [/@hard/],
      repeatEach: 5,
    },
    // @hard tagged tests 

    {
      name: 'api-hard-test',
      dependencies: ['api-regression-test'],
      testDir: './tests/api',
      use: { 
        baseURL: env.baseUrl || 'http://localhost:3000',
        ...devices['Desktop Firefox'] },
      grep: /@hard/,
      repeatEach: 200,
      ...(process.env.CI ? {} : { workers: 6 }),
      retries: 0,
    },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'cd backend npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
