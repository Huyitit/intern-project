import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus'
test.describe('Admin - Export CSV (GET /users/export)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-01: Admin exports user list
  test('TC-EXP-01: Admin should successfully export user list (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin }) => {
    let attempt = 1;
    const startTime = Date.now();

    await expect.poll(async () => {
      const elapsedSeconds = ((Date.now() - startTime) / 1000);
      console.log(`Poll Attempt ${attempt++} Elapsed: `, elapsedSeconds);
      
      const response = await isolatedAdmin.service.exportUsers();

      const body = await response.json();
      return body.success;
    }, {
      message: "Test Slow API Response",
      timeout: Number(process.env.EXPECT_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    }).toBe(true);
  });

  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    
    const userService = isolatedUser.service;
    const response = await userService.exportUsers();

    await expectations.expectStatus(response, HttpStatus.FORBIDDEN);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousUser }) => {
    const response = await anonymousUser.service.exportUsers();

    await expectations.expectStatus(response, HttpStatus.UNAUTHORIZED);
  });
});
