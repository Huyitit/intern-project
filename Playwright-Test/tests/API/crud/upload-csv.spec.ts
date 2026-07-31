import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';
import { cleanupTestData } from '../../../src/data/cleanup';
import { registerUserAndGetInfo, loginUser, createOwnerService } from '../../../src/api/helpers/actions/actions';
import { ApiData } from '../../../src/data/test_data/api.test.data';

test.describe('Upload CSV Test Suite', { tag: ['@crud', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  // TC-CSV-01: Owner uploads valid CSV file to update profile
  test('TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ request, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-01']();

    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);
    const token = await loginUser(record, authService, expectations);
    const ownerService = await createOwnerService(request, token);

    await expect( async () => {

      const response = await ownerService.uploadCsv(userId, record.payload as any);

      await expectations.expectStatus(response, record.expectedStatus);
    }, {
      message: "TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)",
    }
    ).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    })
  });

  // TC-CSV-02: Admin updates user profile via CSV upload
  test('TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)', { tag: '@regression' }, async ({ adminService, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-02']();
    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await adminService.uploadCsv(userId, record.payload as any);

    await expect( async () => {

    await expectations.expectStatus(response, record.expectedStatus);
    } ,
    {
      message: "TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)",
    }
    ).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    })
  });

  // TC-CSV-03: Missing CSV file in payload
  test('TC-CSV-03: Upload attempt with missing CSV payload should return client error (400/406)', { tag: '@regression' }, async ({ adminService, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-03']();
    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await adminService.uploadCsv(userId, record.payload as any);

    await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
  });

  // TC-CSV-04: Invalid/missing required CSV headers
  test('TC-CSV-04: Upload attempt with invalid CSV headers should be rejected (400/406)', { tag: '@regression' }, async ({ adminService, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-04']();
    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await adminService.uploadCsv(userId, record.payload as any);

    await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
  });

  // TC-CSV-05: Non-owner standard user updating another user via CSV
  test('TC-CSV-05: User should be forbidden from updating another user profile via CSV (403 Forbidden)', { tag: '@regression' }, async ({ normalService, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-05']();
    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await normalService.uploadCsv(userId, record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
  });

  // TC-CSV-06: Anonymous upload request without token
  test('TC-CSV-06: Anonymous upload request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousService, authService }) => {
    const record = ApiData.uploadCsv['TC-CSV-06']();
    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await anonymousService.uploadCsv(userId, record.payload as any);

    await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
  });
});
