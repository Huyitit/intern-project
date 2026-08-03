import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { registerUserAndGetInfo } from '../../../../src/api/helpers/actions/actions';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { deleteUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

test.describe('Admin - Delete User (DELETE /users/{id})', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-DU-01: Valid Deletion (Admin)', { tag: ['@smoke', '@regression'] }, async ({ authService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-01']();
    const { id: targetUserId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await adminService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, deleteUserResponseSchema);

    // Verify it's actually deleted
    const getRes = await adminService.getById(targetUserId.toString());
    await expectations.expectStatus(getRes, HttpStatus.CONFLICT);
  });

  test('TC-DU-02: Delete Non-Existent User', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.deleteUser['TC-DU-02']();

    const response = await adminService.delete(record.payload.targetId);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-DU-03: Idempotency Check', { tag: '@regression' }, async ({ authService, adminService }) => {
    const record = ApiData.deleteUser['TC-DU-03']();
    const { id: targetUserId } = await registerUserAndGetInfo(record, authService, expectations);

    // First deletion
    const res1 = await adminService.delete(targetUserId.toString());
    await expectations.expectStatus(res1, record.expectedStatus);

    // Second deletion of the same ID
    const res2 = await adminService.delete(targetUserId.toString());
    await expectations.expectStatus(res2, HttpStatus.INTERNAL_SERVER_ERROR);
    await expectations.expectSchema(res2, crudErrorResponseSchema);
  });
});
