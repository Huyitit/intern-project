import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { getUserByIdResponseSchema, crudErrorResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { registerUserAndGetInfo, createTargetUser } from '../../../src/api/helpers/actions/actions';

test.describe('Get User By Id Test Suite', { tag: ['@crud', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-GI-01: Admin fetches any user by ID', { tag: ['@smoke', '@regression'] }, async ({ authService, adminService }) => {
    const record = ApiData.getUserById['TC-GI-01']();
    const {id: testUserId} = await registerUserAndGetInfo(record, authService, expectations);

    const response = await adminService.getById(testUserId.toString());
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUserByIdResponseSchema);
    
    const body = await response.json();
    expect(body.user.id).toBe(testUserId);
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

  test('TC-GI-03: Fetch a non-existent user ID', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.getUserById['TC-GI-03']();

    const response = await adminService.getById(record.payload.targetId);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GI-04: Invalid ID Format', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.getUserById['TC-GI-04']();

    const response = await adminService.getById(record.payload.targetId);
    await expectations.expectStatus(response, record.expectedStatus);
  });

  test('TC-GI-05: User accessing another user profile', { tag: '@regression' }, async ({ authService, normalService }) => {
    const record = ApiData.getUserById['TC-GI-05']();
    const {id: testUserId} = await registerUserAndGetInfo(record, authService, expectations);

    const response = await normalService.getById(testUserId.toString());
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GI-06: No Token', { tag: '@regression' }, async ({ authService, anonymousService }) => {
    const record = ApiData.getUserById['TC-GI-06']();
    const {id: testUserId} = await registerUserAndGetInfo(record, authService, expectations);

    const response = await anonymousService.getById(testUserId.toString());
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
