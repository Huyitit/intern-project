import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { registerUserAndGetInfo } from '../../../../src/api/helpers/actions/actions';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

test.describe('User - Delete Authorization (DELETE /users/{id})', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-DU-04: User Role Forbidden to delete user (403 Forbidden)', { tag: '@regression' }, async ({ authService, normalService }) => {
    const record = ApiData.deleteUser['TC-DU-04']();
    const { id: targetUserId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await normalService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-DU-05: Delete user with No Token', { tag: '@regression' }, async ({ authService, anonymousService }) => {
    const record = ApiData.deleteUser['TC-DU-05']();
    const { id: targetUserId } = await registerUserAndGetInfo(record, authService, expectations);

    const response = await anonymousService.delete(targetUserId.toString());

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
