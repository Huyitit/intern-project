import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

test.describe('User - Create User Authorization (POST /users)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-CU-07: Standard User forbidden to create user (403 Forbidden)', { tag: '@regression' }, async ({ normalService }) => {
    const record = ApiData.createUser['TC-CU-07']();

    const response = await normalService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-08: No Token create attempt rejected (401/403)', { tag: '@regression' }, async ({ anonymousService }) => {
    const record = ApiData.createUser['TC-CU-08']();

    const response = await anonymousService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
