import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { updateUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';
import { registerUserAndGetInfo, createTargetUser } from '../../../../src/api/helpers/actions/actions';

test.describe('Admin - Update User (PUT /users/{id})', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-UU-01: Valid Update (Admin)', { tag: ['@smoke', '@regression'] }, async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-01']();

    const { id: userId } = await registerUserAndGetInfo(record, authService, expectations);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);
  });

  test('TC-UU-03: User Not Found', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.updateUser['TC-UU-03']();

    const updatePayload = { user: { id: record.payload.targetId, ...record.payload.user } };
    const response = await adminService.updateUser(record.payload.targetId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-04: Missing Body', { tag: '@regression' }, async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-04']();
    const { userId } = await createTargetUser(authService);

    const response = await adminService.updateUser(userId, record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-05: Validation Failure', { tag: '@regression' }, async ({ authService, adminService }) => {
    const record = ApiData.updateUser['TC-UU-05']();
    const { userId } = await createTargetUser(authService);

    const updatePayload = { user: { id: userId, ...record.payload.user } };
    const response = await adminService.updateUser(userId, updatePayload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
