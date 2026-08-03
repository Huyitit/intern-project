import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { registerUserAndGetInfo } from '../../../../src/api/helpers/actions/actions';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

test.describe('Admin - Upload Operations (POST Avatar / CSV)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test.describe('Avatar Uploads', () => {
    // TC-AVT-02: Admin uploads avatar for another user
    test('TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)', { tag: '@regression' }, async ({ adminService, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-02']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await adminService.uploadAvatar(userId, record.payload as any);
          
      await expect(async () => {
        await expectations.expectStatus(response, record.expectedStatus);
      }, {
        message: "TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
    });

    // TC-AVT-03: Missing avatar file in payload
    test('TC-AVT-03: Upload attempt with missing image payload should return client error (400/406)', { tag: '@regression' }, async ({ adminService, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-03']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await adminService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
    });

    // TC-AVT-04: Uploading non-image file type (e.g. text/plain)
    test('TC-AVT-04: Non-image file upload should be rejected safely (400/415/500)', { tag: '@regression' }, async ({ adminService, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-04']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await adminService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.UNSUPPORTED_MEDIA_TYPE, HttpStatus.INTERNAL_SERVER_ERROR]);
    });
  });

  test.describe('CSV Uploads', () => {
    // TC-CSV-02: Admin updates user profile via CSV upload
    test('TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)', { tag: '@regression' }, async ({ adminService, authService }) => {
      const record = ApiData.uploadCsv['TC-CSV-02']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await adminService.uploadCsv(userId, record.payload as any);

      await expect(async () => {
        await expectations.expectStatus(response, record.expectedStatus);
      }, {
        message: "TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
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
  });
});
