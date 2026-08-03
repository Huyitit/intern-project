import { APIResponse, expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { getUserByIdResponseSchema, crudErrorResponseSchema, createUserResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { tcGI01, tcGI03, tcGI04 } from '../../../../src/data/test_data/crud/admin/get-user-by-id.data';
import { HttpStatus } from '../../../../src/api/config/httpStatus';

test.describe('Admin - Get User By Id (GET /users/{id})', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-GI-01: Admin fetches any user by ID', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin}) => {
    const record = tcGI01();
    const userService = isolatedAdmin.service;

    const registerResponse = await userService.create(record.payload as any);
    await expectations.expectStatus(registerResponse, HttpStatus.CREATED);
    await expectations.expectSchema(registerResponse, createUserResponseSchema);

    const registerBody = await registerResponse.json();

    const response = await userService.getById(registerBody!.user.id.toString());
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUserByIdResponseSchema);
    
    const body = await response.json();
    expect(body.user.id).toBe(registerBody!.user.id);
  });

  test('TC-GI-03: Fetch a non-existent user ID', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGI03();

    const userService = isolatedAdmin.service;
    const response = await userService.getById(record.payload.targetId);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-GI-04: Invalid ID Format', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGI04();

    const userService = isolatedAdmin.service;
    const response = await userService.getById(record.payload.targetId);
    await expectations.expectStatus(response, record.expectedStatus);
  });
});
