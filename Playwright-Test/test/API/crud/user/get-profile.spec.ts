import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { getUserByIdResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';

import {
  tcGI02,
  tcGI05,
  tcGI06,
  tcGU11,
  tcGU12,
  tcGU13,
} from '../../../../src/data/test_data/crud/user/get-profile.data';

test.describe('User - Profile & User List Access (GET)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-GI-02: User fetches their own profile', { tag: ['@smoke', '@regression'] }, async ({ isolatedUser }) => {
    const record = tcGI02();

    const userService = isolatedUser.service;
    const response = await userService.getById(isolatedUser.userId.toString());

    await expectations.expectStatus(response, 200);
    await expectations.expectSchema(response, getUserByIdResponseSchema);
    
    const body = await response.json();
    expect(body.user.id).toBe(isolatedUser.userId);
  });

  test('TC-GI-05: User accessing another user profile (403 Forbidden)', { tag: '@regression' }, async ({ authService, isolatedUser }) => {
    const record = tcGI05();
    const otherUser = await authService.createTargetUser();

    const userService = isolatedUser.service;
    const response = await userService.getById(otherUser.userId.toString());
    await expectations.expectStatus(response, 403);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GI-06: Fetch user profile with No Token (401/403)', { tag: '@regression' }, async ({ anonymousUser, isolatedUser }) => {
    const record = tcGI06();

    const userService = anonymousUser.service;
    const response = await userService.getById(isolatedUser.userId.toString());
    await expectations.expectStatus(response, HttpStatus.UNAUTHORIZED);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-11: should reject requests with no token', { tag: '@regression' }, async ({ anonymousUser }) => {
    const record = tcGU11();

    const userService = anonymousUser.service;
    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, HttpStatus.UNAUTHORIZED);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-12: should reject requests with invalid token', { tag: '@regression' }, async ({ request }) => {
    const record = tcGU12();

    const response = await request.get('/api/users', { headers: { Authorization: 'Bearer invalid.token' } });
    await expectations.expectStatus(response, HttpStatus.UNAUTHORIZED);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GU-13: should reject standard user requests for user list (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    const record = tcGU13();

    const userService = isolatedUser.service;
    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, 403);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
