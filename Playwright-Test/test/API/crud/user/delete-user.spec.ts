import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { tcDU04, tcDU05 } from '../../../../src/data/test_data/crud/user/delete-user.data';

test.describe('User - Delete Authorization (DELETE /users/{id})', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-DU-04: User Role Forbidden to delete user (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    const record = tcDU04();

    const userService = isolatedUser.service;
    const response = await userService.delete(isolatedUser.userId.toString());

    await expectations.expectStatus(response, 403);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-DU-05: Delete user with No Token', { tag: '@regression' }, async ({ isolatedUser, anonymousUser }) => {
    const record = tcDU05();

    const userService = anonymousUser.service;
    const response = await userService.delete(isolatedUser.userId.toString());

    await expectations.expectStatus(response, HttpStatus.UNAUTHORIZED);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
