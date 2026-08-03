import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { ApiClient } from '../../../../src/api/clients/api.client';
import { UserService } from '../../../../src/api/services/user.service';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { getUserByIdResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';
import { registerUserAndGetInfo, createTargetUser } from '../../../../src/api/helpers/actions/actions';

test.describe('User - Profile & User List Access (GET)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-GI-02: User fetches their own profile', { tag: ['@smoke', '@regression'] }, async ({ request, authService }) => {
    const record = ApiData.getUserById['TC-GI-02']();
    const { userId, token } = await createTargetUser(authService);

    const ownerUserService = new UserService(new ApiClient(request, token));
    const response = await ownerUserService.getById(userId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUserByIdResponseSchema);
    
    const body = await response.json();
    expect(body.user.id).toBe(userId);
  });

  test('TC-GI-05: User accessing another user profile (403 Forbidden)', { tag: '@regression' }, async ({ authService, normalService }) => {
    const record = ApiData.getUserById['TC-GI-05']();
    const { id: testUserId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await normalService.getById(testUserId.toString());
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GI-06: Fetch user profile with No Token (401/403)', { tag: '@regression' }, async ({ authService, anonymousService }) => {
    const record = ApiData.getUserById['TC-GI-06']();
    const { id: testUserId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await anonymousService.getById(testUserId.toString());
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-11: should reject requests with no token', { tag: '@regression' }, async ({ request }) => {
    const record = ApiData.getUsers['TC-GU-11']();
    const unauthUserService = new UserService(new ApiClient(request, ''));

    const response = await unauthUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-12: should reject requests with invalid token', { tag: '@regression' }, async ({ request }) => {
    const record = ApiData.getUsers['TC-GU-12']();
    const invalidService = new UserService(new ApiClient(request, 'invalid.token'));

    const response = await invalidService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-13: should reject standard user requests for user list (403 Forbidden)', { tag: '@regression' }, async ({ request, userToken }) => {
    const record = ApiData.getUsers['TC-GU-13']();
    const normalUserService = new UserService(new ApiClient(request, userToken));

    const response = await normalUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
