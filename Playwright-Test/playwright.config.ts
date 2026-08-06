import { defineConfig, devices } from '@playwright/test';
import { env } from './src/api/config/env';
export default defineConfig({
  /* Run data seeding file before run test */
  globalSetup: require.resolve('./src/data/seed.ts'),
  // Delete all data after all tests
  globalTeardown: require.resolve('./src/data/cleanup.ts'),
  // Test timeout from central TIMEOUTS config
  timeout: Number(process.env.TIMEOUT) || 30000,

  // expect: {
  //   timeout: Number(process.env.EXPECT_TIMEOUT) || 5000
  // },

  testDir: '.',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 0 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 5,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI 
  ? [
      ["blob", {outputDir: "playwright-report/blob"}],
      ['html', { outputFolder: "playwright-report/html"}],
      ['./custom-reporter.ts']
    ] 
  : [
      ['dot'],
      ['html', {open: 'always', outputFolder: "playwright-report/html"}],
      ['./custom-reporter.ts']
    ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.baseUrl || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on',

  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'chromium',
    //   use: { ...devices['Desktop Chrome'] },
    // },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grepInvert: /@hard/,
    },

    // @hard tagged tests 

    {
      name: 'hard-test',
      dependencies: [ 'firefox' ],
      use: { ...devices['Desktop Firefox']},
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
