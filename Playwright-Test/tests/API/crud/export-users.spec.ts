import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';

test.describe('Export CSV Test Suite', { tag: ['@crud', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-01: Admin exports user list
  test('TC-EXP-01: Admin should successfully export user list (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ adminService }) => {

    let attempt = 1;
    // const response = await adminService.exportUsers();

    const startTime = Date.now();

    await expect.poll(async () => {
      const elapsedSeconds = ((Date.now() - startTime) / 1000);
      console.log(`Poll Attempt ${attempt++} Elapsed: `, elapsedSeconds);
      const response = await adminService.exportUsers();
      

      return response.status();
    }, {
      message: "Test Slow API Response",
      timeout: Number(process.env.EXPECT_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    }).toBe(HttpStatus.OK);


    
    // await expect(async () => {
    //   const elapsedSeconds = ((Date.now() - startTime) / 1000);
    //   console.log(`Poll Attempt ${attempt++} Elapsed: `, elapsedSeconds);

      // await expectations.expectStatus(response, HttpStatus.OK);
    //   const body = await response.json();
    //   expect(body.success).toBe(true);
    //   await expectations.toBeArray(body.users);
    // }, {
    //   message: "Test Slow API Response"
    // }).toPass({
    //   timeout: Number(process.env.EXPECT_TIMEOUT),
    //   intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    // })


  });

  // TC-EXP-02: Standard user forbidden from exporting users
  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', { tag: '@regression' }, async ({ normalService }) => {
    const response = await normalService.exportUsers();

    await expectations.expectStatus(response, HttpStatus.FORBIDDEN);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousService }) => {
    const response = await anonymousService.exportUsers();

    await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
  });
});
