import { expect } from '@playwright/test';
import { test } from '../../../../src/api/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/core/assertions/base';
import { HttpStatus } from '../../../../src/core/config/httpStatus';
import { deleteUserResponseSchema, crudErrorResponseSchema, createUserResponseSchema } from '../../../../src/api/schemas/user.schema';
import { tcDU01, tcDU02, tcDU03 } from '../../../../src/data/datasets/crud/admin/delete-user.data';

test.describe('Admin - Delete User (DELETE /users/{id})', { tag: ['@api', '@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-DU-01: Valid Deletion (Admin)', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin, isolatedUser }) => {
    const record = tcDU01();

    const adminService = isolatedAdmin.service;
    const response = await adminService.delete(isolatedUser.userId.toString());

    await expectations.expectStatus(response, 200);
    await expectations.expectSchema(response, deleteUserResponseSchema);

    // Verify it's actually deleted
    const getRes = await isolatedAdmin.service.getById(isolatedUser.userId.toString());
    await expectations.expectStatus(getRes, HttpStatus.CONFLICT);
  });

  test('TC-DU-02: Delete Non-Existent User', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcDU02();

    const adminService = isolatedAdmin.service;
    const response = await adminService.delete(record.payload.targetId);

    await expectations.expectStatus(response, 500);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-DU-03: Idempotency Check', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcDU03();

    const adminService = isolatedAdmin.service;

    // Register User
    const registerResponse = await adminService.create({ user: record.user! } as any);
    await expectations.expectStatus(registerResponse, HttpStatus.CREATED);
    await expectations.expectSchema(registerResponse, createUserResponseSchema);

    const resBody = await registerResponse.json();
    const userId = resBody.user.id;

    // First deletion
    const res1 = await adminService.delete(userId.toString());
    await expectations.expectStatus(res1, 200);
    await expectations.expectSchema(res1, deleteUserResponseSchema);

    // Second deletion of the same ID
    const res2 = await adminService.delete(userId.toString());
    await expectations.expectStatus(res2, HttpStatus.INTERNAL_SERVER_ERROR);
    await expectations.expectSchema(res2, crudErrorResponseSchema);
  });
});
