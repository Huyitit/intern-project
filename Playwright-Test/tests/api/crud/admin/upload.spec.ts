import { expect } from '@playwright/test';
import { test } from '../../../../src/api/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/core/assertions/base';
import { HttpStatus } from '../../../../src/core/config/httpStatus';
import {
  tcAVT02,
  tcAVT03,
  tcAVT04,
  tcCSV02,
  tcCSV03,
  tcCSV04,
} from '../../../../src/data/datasets/crud/admin/upload.data';

test.describe('Admin - Upload Operations (POST Avatar / CSV)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.describe('Avatar Uploads', () => {
    // TC-AVT-02: Admin uploads avatar for another user
    test('TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcAVT02();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadAvatar(isolatedUser.userId, record.payload as any);
          
      await expect(async () => {
        await expectations.expectStatus(response, 200);
      }, {
        message: "TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
    });

    // TC-AVT-03: Missing avatar file in payload
    test('TC-AVT-03: Upload attempt with missing image payload should return client error (400/406)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcAVT03();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadAvatar(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
    });

    // TC-AVT-04: Uploading non-image file type (e.g. text/plain)
    test('TC-AVT-04: Non-image file upload should be rejected safely (400/415/500)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcAVT04();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadAvatar(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.UNSUPPORTED_MEDIA_TYPE, HttpStatus.INTERNAL_SERVER_ERROR]);
    });
  });

  test.describe('CSV Uploads', () => {
    // TC-CSV-02: Admin updates user profile via CSV upload
    test('TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcCSV02();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadCsv(isolatedUser.userId, record.payload as any);

      await expect(async () => {
        await expectations.expectStatus(response, 200);
      }, {
        message: "TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
    });

    // TC-CSV-03: Missing CSV file in payload
    test('TC-CSV-03: Upload attempt with missing CSV payload should return client error (400/406)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcCSV03();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadCsv(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
    });

    // TC-CSV-04: Invalid/missing required CSV headers
    test('TC-CSV-04: Upload attempt with invalid CSV headers should be rejected (400/406)', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
      const record = tcCSV04();

      const userService = isolatedAdmin.service;
      const response = await userService.uploadCsv(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.NOT_ACCEPTABLE]);
    });
  });
});
