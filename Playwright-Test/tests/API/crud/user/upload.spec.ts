import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { registerUserAndGetInfo, loginUser, createOwnerService } from '../../../../src/api/helpers/actions/actions';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

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
    test('TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ request, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-01']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);
      const token = await loginUser(record, authService, expectations);

      const ownerService = await createOwnerService(request, token);
      const response = await ownerService.uploadAvatar(userId, record.payload as any);    

      await expect(async () => {
        await expectations.expectStatus(response, record.expectedStatus);

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
    test('TC-AVT-05: User should be forbidden from updating another user avatar (403 Forbidden)', { tag: '@regression' }, async ({ normalService, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-05']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await normalService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatus(response, record.expectedStatus);
    });

    // TC-AVT-06: Anonymous request without token
    test('TC-AVT-06: Anonymous upload request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousService, authService }) => {
      const record = ApiData.uploadAvatar['TC-AVT-06']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await anonymousService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
    });
  });

  test.describe('CSV Uploads', () => {
    // TC-CSV-01: Owner uploads valid CSV file to update profile
    test('TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ request, authService }) => {
      const record = ApiData.uploadCsv['TC-CSV-01']();

      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);
      const token = await loginUser(record, authService, expectations);
      const ownerService = await createOwnerService(request, token);

      await expect(async () => {
        const response = await ownerService.uploadCsv(userId, record.payload as any);
        await expectations.expectStatus(response, record.expectedStatus);
      }, {
        message: "TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)",
      }).toPass({
        timeout: Number(process.env.POLL_TIMEOUT),
        intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
      });
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
});
