import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { AuthClient } from '../../../src/api/clients/auth.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { UserService } from '../../../src/api/services/user.service';
import { ApiClient } from '../../../src/api/clients/api.client';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { createUserResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { env } from '../../../src/api/config/env';

test.describe('POST /api/users Test Suite', () => {
  let expectations: Expectations;
  const createdUserIds: number[] = [];

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async ({ request }) => {
    const authServiceForTeardown = new AuthService(new AuthClient(request));
    const loginRes = await authServiceForTeardown.login({
      user: { username: env.User.admin.username, password: env.User.admin.password }
    });
    const adminToken = (await loginRes.json()).token;
    const teardownService = new UserService(new ApiClient(request, adminToken));
    for (const id of createdUserIds) {
      try { await teardownService.delete(id.toString()); } catch {}
    }
  });

  test('TC-CU-01: Valid User Creation (Admin)', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-01']();
    
    const response = await adminService.create(record.payload as any);
    
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, createUserResponseSchema);
    
    const body = await response.json();
    expect(body.user.username).toBe(record.payload.user.username);
    createdUserIds.push(body.user.id);
    await expectations.expectUserCreatedOnDatabase(record.payload as any);
  });

  test('TC-CU-02: Duplicate Username', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-02']();

    // Initial creation
    const res1 = await adminService.create({ user: record.user } as any);
    await expectations.expectStatus(res1, 201);
    createdUserIds.push((await res1.json()).user.id);

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
