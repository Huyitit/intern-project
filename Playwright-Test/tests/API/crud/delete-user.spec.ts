import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { AuthClient } from '../../../src/api/clients/auth.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { UserService } from '../../../src/api/services/user.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { deleteUserResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { UserBuilder } from '../../../src/data/builders/user.builder';

test.describe('DELETE /api/users/:id Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  async function createDisposableUser(authService: AuthService): Promise<number> {
    const newUser = new UserBuilder().setValidNewUser().build();
    const registerRes = await authService.register({ user: newUser });
    return (await registerRes.json()).user.id;
  }

  async function safeCleanupUser(userId: number, adminService: UserService) {
    if (userId && adminService) {
      try {
        await adminService.delete(userId.toString());
      } catch {}
    }
  }

  test('TC-DU-01: Valid Deletion (Admin)', async ({ authService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-01']();
    const targetUserId = await createDisposableUser(authService);

    const response = await adminService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, deleteUserResponseSchema);

    // Verify it's actually deleted
    const getRes = await adminService.getById(targetUserId.toString());
    await expectations.expectStatus(getRes, 409);
  });

  test('TC-DU-02: Delete Non-Existent User', async ({ adminService }) => {
    const record = ApiData.deleteUser['TC-DU-02']();

    const response = await adminService.delete(record.payload.targetId);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-DU-03: Idempotency Check', async ({ authService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-03']();
    const targetUserId = await createDisposableUser(authService);

    // First deletion
    const res1 = await adminService.delete(targetUserId.toString());
    await expectations.expectStatus(res1, record.expectedStatus);

    // Second deletion of the same ID
    const res2 = await adminService.delete(targetUserId.toString());
    await expectations.expectStatus(res2, 500);
    await expectations.expectSchema(res2, authErrorResponseSchema);
  });

  test('TC-DU-04: User Role Forbidden', async ({ authService, normalService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-04']();
    const targetUserId = await createDisposableUser(authService);

    const response = await normalService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await safeCleanupUser(targetUserId, adminService);
  });

  test('TC-DU-05: No Token', async ({ authService, anonymousService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-05']();
    const targetUserId = await createDisposableUser(authService);

    const response = await anonymousService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await safeCleanupUser(targetUserId, adminService);
  });
});
