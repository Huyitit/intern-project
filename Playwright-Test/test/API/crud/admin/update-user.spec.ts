import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { updateUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { tcUU01, tcUU03, tcUU04, tcUU05 } from '../../../../src/data/test_data/crud/admin/update-user.data';

test.describe('Admin - Update User (PUT /users/{id})', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-UU-01: Valid Update (Admin)', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin, isolatedUser }) => {
    const record = tcUU01(isolatedUser.userId);

    const userService = isolatedAdmin.service;
    const response = await userService.updateUser(isolatedUser.userId, record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);
  });

  test('TC-UU-03: User Not Found', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcUU03();

    const userService = isolatedAdmin.service;
    const response = await userService.updateUser(record.payload.id, {
      user: {
        id: record.payload.id,
        ...record.payload.user
      }
    });

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-04: Missing Body', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
    const record = tcUU04(isolatedUser.userId);

    const userService = isolatedAdmin.service;
    const response = await userService.updateUser(isolatedUser.userId, record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-05: Validation Failure', { tag: '@regression' }, async ({ isolatedAdmin, isolatedUser }) => {
    const record = tcUU05(isolatedUser.userId);

    const userService = isolatedAdmin.service;
    const response = await userService.updateUser(isolatedUser.userId, record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
