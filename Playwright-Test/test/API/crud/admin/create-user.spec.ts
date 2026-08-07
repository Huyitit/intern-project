import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { createUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import {
  tcCU01,
  tcCU02,
  tcCU03,
  tcCU04,
  tcCU05,
  tcCU06,
} from '../../../../src/data/test_data/crud/admin/create-user.data';

test.describe('Admin - Create User (POST /users)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-CU-01: Valid User Creation (Admin)', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin }) => {
    const record = tcCU01();
    
    const userService = isolatedAdmin.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 203);
    await expectations.expectSchema(response, createUserResponseSchema);
    
    const body = await response.json();
    expect(body.user.username).toBe(record.payload.user.username);

    await expect(async () => {
      await expectations.expectUserCreatedOnDatabase(record.payload as any);
    }).toPass({
      timeout: Number(process.env.POLL_TIMEOUT),
      intervals: [(Number(process.env.POLL_INTERVAL_NORMAL))]
    });
  });

  test('TC-CU-02: Duplicate Username', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcCU02();

    const userService = isolatedAdmin.service;
    // Initial creation
    const res1 = await userService.create({ user: record.user } as any);
    await expectations.expectStatus(res1, 201);

    // Duplicate creation attempt
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 409);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-03: Missing Required Fields', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcCU03();

    const userService = isolatedAdmin.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-04: Empty Payload', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcCU04();

    const userService = isolatedAdmin.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-05: Invalid Data Types', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcCU05();

    const userService = isolatedAdmin.service;
    const response = await userService.create(record.payload as any);
    
    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-06: Invalid Email Format', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcCU06();

    const userService = isolatedAdmin.service;
    const response = await userService.create(record.payload as any);
    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
