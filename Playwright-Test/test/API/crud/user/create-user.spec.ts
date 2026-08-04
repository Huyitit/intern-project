import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { tcCU07, tcCU08 } from '../../../../src/data/test_data/crud/user/create-user.data';

test.describe('User - Create User Authorization (POST /users)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-CU-07: Standard User forbidden to create user (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    const record = tcCU07();

    const userService = isolatedUser.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 403);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-08: No Token create attempt rejected (401/403)', { tag: '@regression' }, async ({ anonymousUser }) => {
    const record = tcCU08();

    const userService = anonymousUser.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 406);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
