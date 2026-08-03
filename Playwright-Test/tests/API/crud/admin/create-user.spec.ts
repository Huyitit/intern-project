import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { createUserResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import { ApiData } from '../../../../src/data/test_data/api.test.data';

test.describe('Admin - Create User (POST /users)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  test('TC-CU-01: Valid User Creation (Admin)', { tag: ['@smoke', '@regression'] }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-01']();
    
    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
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

  test('TC-CU-02: Duplicate Username', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-02']();

    // Initial creation
    const res1 = await adminService.create({ user: record.user } as any);
    await expectations.expectStatus(res1, 201);

    // Duplicate creation attempt
    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-03: Missing Required Fields', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-03']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-04: Empty Payload', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-04']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-05: Invalid Data Types', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-05']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });

  test('TC-CU-06: Invalid Email Format', { tag: '@regression' }, async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-06']();

    const response = await adminService.create(record.payload as any);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, crudErrorResponseSchema);
  });
});
