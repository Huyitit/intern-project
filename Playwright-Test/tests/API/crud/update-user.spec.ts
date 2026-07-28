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
import { cleanupTestData } from '../../../src/data/cleanup';
import { registerUserAndGetId } from '../../../src/api/helpers/actions/registerUserAndGetId';
import { loginUser } from '../../../src/api/helpers/actions/login';
import { createTargetUser } from '../../../src/api/helpers/actions/createTargetUser';

test.describe('PUT /api/users/:id Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });
  //what I function return : userId - registerUserAndGetId
  // token

  test('TC-UU-01: Valid Update (Admin)', async ({ authService, adminService }) => {

    // Create a user
    // Change User attributes value 
    // Update it 
    const record = ApiData.updateUser['TC-UU-01']();

    // Register and get user id
    const userId = await registerUserAndGetId(record, authService, expectations);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);
  });

  test('TC-UU-02: Valid Update (Owner)', async ({ request, authService }) => {

    // Create a User and login it
    // Change User attributes value 
    // User update it self 
    const record = ApiData.updateUser['TC-UU-02']();
    const userId = await registerUserAndGetId(record, authService, expectations);
    const token = await loginUser(record, authService, expectations);

    const userService = new UserService(new ApiClient(request, token));
    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await userService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);
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
  });

  test('TC-UU-05: Validation Failure', async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-05']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-UU-06: User Updating Another User', async ({ normalService }) => {
    const record = ApiData.updateUser['TC-UU-06']();

    const updatePayload = { user: { id: record.payload.targetId, ...record.payload.user } };
    const response = await normalService.updateUser(record.payload.targetId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-UU-07: No Token', async ({ authService, anonymousService }) => {
    const record = ApiData.updateUser['TC-UU-07']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await anonymousService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-UU-08: Expired Token', async ({ request, authService }) => {
    const record = ApiData.updateUser['TC-UU-08']();
    const { userId } = await createTargetUser(authService);
    const invalidService = new UserService(new ApiClient(request, 'invalid.token'));

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await invalidService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });
});
