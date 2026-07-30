import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';
import { cleanupTestData } from '../../../src/data/cleanup';
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { registerUserAndGetInfo, loginUser, createOwnerService } from '../../../src/api/helpers/actions/actions';
import { ApiData } from '../../../src/data/test_data/api.test.data';

test.describe('Upload Avatar Test Suite', { tag: ['@crud', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  // TC-AVT-01: Owner uploads valid PNG avatar image
  test('TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)', { tag: ['@smoke', '@regression'] }, async ({ request, authService }) => {
    await expect(async () => {
      const record = ApiData.uploadAvatar['TC-AVT-01']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);
      const token = await loginUser(record, authService, expectations);

      const ownerService = await createOwnerService(request, token);
      const response = await ownerService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatus(response, record.expectedStatus);

      const body = await response.json();
      expect(body.success).toBe(true);
      expect(body.message).toBe('Avatar uploaded successfully');
      expect(body.avatar_url).toContain('/uploads/avatars/');
    }, {
      message: "TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)",
    }).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    })
  });

  // TC-AVT-02: Admin uploads avatar for another user
  test('TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)', { tag: '@regression' }, async ({ adminService, authService }) => {
    await expect(async () => {
      const record = ApiData.uploadAvatar['TC-AVT-02']();
      const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

      const response = await adminService.uploadAvatar(userId, record.payload as any);

      await expectations.expectStatus(response, record.expectedStatus);
    }, {
      message: "TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)",
    }).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [Number(process.env.POLL_INTERVAL_FAST), Number(process.env.POLL_INTERVAL_NORMAL)],
    })
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
