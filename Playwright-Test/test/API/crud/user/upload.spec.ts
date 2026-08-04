import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';

import {
  tcAVT01,
  tcAVT05,
  tcAVT06,
  tcCSV01,
  tcCSV05,
  tcCSV06,
} from '../../../../src/data/test_data/crud/user/upload.data';

test.describe('User - Upload Operations & Authorization (POST Avatar / CSV)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test.describe('Avatar Uploads', () => {
    // TC-AVT-01: Owner uploads valid PNG avatar image
    test('TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ isolatedUser }) => {
      const record = tcAVT01();

      const userService = isolatedUser.service;
      const response = await userService.uploadAvatar(isolatedUser.userId, record.payload as any);    

      await expect(async () => {
        await expectations.expectStatus(response, 200);

        const body = await response.json();
        expect(body.success).toBe(true);
        expect(body.message).toBe('Avatar uploaded successfully');
        expect(body.avatar_url).toContain('/uploads/avatars/');
      }, {
        message: "TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)",
      }).toPass({
        timeout: Number(process.env.EXPECT_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
    });

    // TC-AVT-05: Non-owner standard user updating another user's avatar
    test('TC-AVT-05: User should be forbidden from updating another user avatar (403 Forbidden)', { tag: '@regression' }, async ({ authService, isolatedUser }) => {
      const record = tcAVT05();
      const otherUser = await authService.createTargetUser();

      const userService = isolatedUser.service;
      const response = await userService.uploadAvatar(otherUser.userId, record.payload as any);

      await expectations.expectStatus(response, 403);
    });

    // TC-AVT-06: Anonymous request without token
    test('TC-AVT-06: Anonymous upload request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousUser, isolatedUser }) => {
      const record = tcAVT06();

      const userService = anonymousUser.service;
      const response = await userService.uploadAvatar(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
    });
  });

  test.describe('CSV Uploads', () => {
    // TC-CSV-01: Owner uploads valid CSV file to update profile
    test('TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ isolatedUser }) => {
      const record = tcCSV01();

      await expect(async () => {
        const userService = isolatedUser.service;
        const response = await userService.uploadCsv(isolatedUser.userId, record.payload as any);
        await expectations.expectStatus(response, 200);
      }, {
        message: "TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
    });

    // TC-CSV-05: Non-owner standard user updating another user via CSV
    test('TC-CSV-05: User should be forbidden from updating another user profile via CSV (403 Forbidden)', { tag: '@regression' }, async ({ authService, isolatedUser }) => {
      const record = tcCSV05();
      const otherUser = await authService.createTargetUser();

      const userService = isolatedUser.service;
      const response = await userService.uploadCsv(otherUser.userId, record.payload as any);

      await expectations.expectStatus(response, 403);
    });

    // TC-CSV-06: Anonymous upload request without token
    test('TC-CSV-06: Anonymous upload request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousUser, isolatedUser }) => {
      const record = tcCSV06();

      const userService = anonymousUser.service;
      const response = await userService.uploadCsv(isolatedUser.userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
    });
  });
});
