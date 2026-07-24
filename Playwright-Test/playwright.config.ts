import { defineConfig, devices, expect, APIResponse } from '@playwright/test';
import { env } from './src/api/config/env';
import { ZodTypeAny } from 'zod';
/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */


/**
 * Extend expect function to verify API schema with Zod schema
 */
// expect.extend({
//   async toMatchSchema(received: APIResponse, schema: ZodTypeAny) {
//     const response = await received.json();
//     const result = await schema.safeParseAsync(response);
//     if (result.success) {
//       return {
//         message: () => "schema matched",
//         pass: true,
//       };
//     } else {
//       return {
//         message: () =>
//           "Result does not match schema: " +
//           result.error.issues.map((issue) => issue.message).join("\n") +
//           "\n" +
//           "Details: " +
//           JSON.stringify(result.error, null, 2),
//         pass: false,
//       };
//     }
//   },
// });
 

export default defineConfig({
  testDir: '.',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: env.baseUrl || 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
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
