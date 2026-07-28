import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { cleanupTestData } from '../../../src/data/cleanup';
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { createTargetUser } from '../../../src/api/helpers/actions/createTargetUser';

const dummyPngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

test.describe('PUT /api/users/:id/avatar Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  // TC-AVT-01: Owner uploads valid PNG avatar image
  test('TC-AVT-01: Owner should successfully upload PNG avatar (200 OK)', async ({ request, authService }) => {
    const { userId, token } = await createTargetUser(authService);
    const ownerService = new UserService(new ApiClient(request, token));

    const response = await ownerService.uploadAvatar(userId, {
      avatar: {
        name: 'test_avatar.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    });

    await expectations.expectStatus(response, 200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message).toBe('Avatar uploaded successfully');
    expect(body.avatar_url).toContain('/uploads/avatars/');
  });

  // TC-AVT-02: Admin uploads avatar for another user
  test('TC-AVT-02: Admin should successfully upload avatar for any user (200 OK)', async ({ adminService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await adminService.uploadAvatar(userId, {
      avatar: {
        name: 'admin_upload.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    });

    await expectations.expectStatus(response, 200);
  });

  // TC-AVT-03: Missing avatar file in payload
  test('TC-AVT-03: Upload attempt with missing image payload should return client error (400/406)', async ({ adminService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await adminService.uploadAvatar(userId, {});

    await expectations.expectStatusIn(response, [400, 406]);
  });

  // TC-AVT-04: Uploading non-image file type (e.g. text/plain)
  test('TC-AVT-04: Non-image file upload should be rejected safely (400/415/500)', async ({ adminService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await adminService.uploadAvatar(userId, {
      avatar: {
        name: 'test_doc.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('This is a text file not an image'),
      },
    });

    await expectations.expectStatusIn(response, [400, 415, 500]);
  });

  // TC-AVT-05: Non-owner standard user updating another user's avatar
  test('TC-AVT-05: User should be forbidden from updating another user avatar (403 Forbidden)', async ({ normalService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await normalService.uploadAvatar(userId, {
      avatar: {
        name: 'forbidden.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    });

    await expectations.expectStatus(response, 403);
  });

  // TC-AVT-06: Anonymous request without token
  test('TC-AVT-06: Anonymous upload request without token should be rejected (401/406)', async ({ anonymousService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await anonymousService.uploadAvatar(userId, {
      avatar: {
        name: 'anon.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    });

    await expectations.expectStatusIn(response, [401, 403, 406]);
  });
});
