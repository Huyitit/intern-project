import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { ApiClient } from '../../../src/api/clients/api.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { UserService } from '../../../src/api/services/user.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { updateUserResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { UserBuilder } from '../../../src/data/builders/user.builder';

test.describe('PUT /api/users/:id Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  async function createTargetUser(authService: AuthService): Promise<{ userId: number; token: string }> {
    const newUser = new UserBuilder().setValidNewUser().build();
    const registerRes = await authService.register({ user: newUser });
    const userId = (await registerRes.json()).user.id;

    const loginRes = await authService.login({
      user: { username: newUser.username, password: newUser.password }
    });
    const token = (await loginRes.json()).token;

    return { userId, token };
  }

  async function cleanupTargetUser(userId: number, adminService: UserService) {
    if (userId && adminService) {
      try {
        await adminService.delete(userId.toString());
      } catch {}
    }
  }

  test('TC-UU-01: Valid Update (Admin)', async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-01']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-02: Valid Update (Owner)', async ({ request, authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-02']();
    const { userId, token: testUserToken } = await createTargetUser(authService);
    const testUserService = new UserService(new ApiClient(request, testUserToken));

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await testUserService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-03: User Not Found', async ({ adminService }) => {
    const record = ApiData.updateUser['TC-UU-03']();

    const updatePayload = { user: { id: record.payload.targetId, ...record.payload.user } };
    const response = await adminService.updateUser(record.payload.targetId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-UU-04: Missing Body', async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-04']();
    const { userId } = await createTargetUser(authService);

    const response = await adminService.updateUser(userId, record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-05: Validation Failure', async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-05']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-06: User Updating Another User', async ({ request, authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-06']();
    const { userId, token: testUserToken } = await createTargetUser(authService);
    const testUserService = new UserService(new ApiClient(request, testUserToken));

    const updatePayload = { user: { id: record.payload.targetId, ...record.payload.user } };
    const response = await testUserService.updateUser(record.payload.targetId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-07: No Token', async ({ authService, anonymousService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-07']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await anonymousService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await cleanupTargetUser(userId, adminService);
  });

  test('TC-UU-08: Expired Token', async ({ request, authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-08']();
    const { userId } = await createTargetUser(authService);
    const invalidService = new UserService(new ApiClient(request, 'invalid.token'));

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await invalidService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);

    await cleanupTargetUser(userId, adminService);
  });
});
