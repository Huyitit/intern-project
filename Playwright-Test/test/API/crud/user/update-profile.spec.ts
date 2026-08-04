import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { updateUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { tcUU02, tcUU06, tcUU07, tcUU08 } from '../../../../src/data/test_data/crud/user/update-profile.data';

test.describe('User - Update Profile & Authorization (PUT /users/{id})', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-UU-02: Valid Update (Owner)', { tag: ['@smoke', '@regression'] }, async ({ isolatedUser }) => {
    const record = tcUU02(isolatedUser.userId);

    const userService = isolatedUser.service;
    const response = await userService.updateUser(isolatedUser.userId, record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, updateUserResponseSchema);

    const body = await response.json();
    expect(body.user.full_name).toBe(record.payload.user.full_name);
  });

  test('TC-UU-06: User Updating Another User (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    const record = tcUU06();

    const userService = isolatedUser.service;
    const response = await userService.updateUser(record.payload.targetId, record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-07: Update user with No Token', { tag: '@regression' }, async ({ isolatedUser, anonymousUser }) => {
    const record = tcUU07(isolatedUser.userId);

    const userService = anonymousUser.service;
    const response = await userService.updateUser(isolatedUser.userId, record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-UU-08: Update user with Expired / Invalid Token', { tag: '@regression' }, async ({ request, isolatedUser }) => {
    const record = tcUU08(isolatedUser.userId);

    const response = await request.put(`/api/users/${isolatedUser.userId}`, {
      data: record.payload,
      headers: { Authorization: 'Bearer invalid.token' },
    });

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
