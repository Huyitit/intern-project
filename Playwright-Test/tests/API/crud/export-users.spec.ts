import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';

test.describe('GET /api/users/export Test Suite @crud', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-01: Admin exports user list
  test('TC-EXP-01: Admin should successfully export user list (200 OK)', async ({ adminService }) => {
    const startTime = Date.now();
    let attempt = 1;
    
    await expect(async () => {
      const elapsedSeconds = ((Date.now() - startTime) / 1000);
      console.log(`Poll Attempt ${attempt++} Elapsed: `, elapsedSeconds);

      const response = await adminService.exportUsers();
      
      await expectations.expectStatus(response, HttpStatus.OK);

      const body = await response.json();
      await expectations.toBeArray(body.users);
    }, {
      message: "Test Slow API Response"
    }).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    })
  });

  // TC-EXP-02: Standard user forbidden from exporting users
  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', async ({ normalService }) => {
    const response = await normalService.exportUsers();

    await expectations.expectStatus(response, HttpStatus.FORBIDDEN);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', async ({ anonymousService }) => {
    const response = await anonymousService.exportUsers();

    await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
  });
});
