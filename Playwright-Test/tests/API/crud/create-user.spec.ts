import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';
import { createUserResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { cleanupTestData } from '../../../src/data/cleanup';

test.describe('POST /api/users Test Suite @crud', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  test('TC-CU-01: Valid User Creation (Admin)', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-01']();
    
    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, createUserResponseSchema);
    
    const body = await response.json();
    expect(body.user.username).toBe(record.payload.user.username);
    await expectations.expectUserCreatedOnDatabase(record.payload as any);
  });

  test('TC-CU-02: Duplicate Username', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-02']();

    // Initial creation
    const res1 = await adminService.create({ user: record.user } as any);
    await expectations.expectStatus(res1, HttpStatus.CREATED);

    // Duplicate creation attempt
    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-03: Missing Required Fields', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-03']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-04: Empty Payload', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-04']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-05: Invalid Data Types', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-05']();

    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-06: Invalid Email Format', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-06']();

    const response = await adminService.create(record.payload as any);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-07: Standard User forbidden to create', async ({ normalService }) => {
    const record = ApiData.createUser['TC-CU-07']();

    const response = await normalService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-CU-08: No Token', async ({ anonymousService }) => {
    const record = ApiData.createUser['TC-CU-08']();

    const response = await anonymousService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });
});
