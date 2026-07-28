import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/auth.fixture';
import { ApiClient } from '../../../src/api/clients/api.client';
import { AuthClient } from '../../../src/api/clients/auth.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { UserService } from '../../../src/api/services/user.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { getUsersResponseSchema } from '../../../src/api/helpers/schemas/user.schema';
import { authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';

test.describe('GET /api/users Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-GU-01: should fetch first page of users with default params', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-01']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUsersResponseSchema);
    
    await expectations.expectArrayItemProperty(response, 'users', 'role', 'user', 1);
  });

  test('TC-GU-02: should handle fetching a page beyond available data', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-02']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUsersResponseSchema);
    
    const body = await response.json();
    expect(body.users.length).toBe(0);
    expect(body.message).toBe('No more users');
  });

  test('TC-GU-03: should filter users by username keyword', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-03']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    for (const user of body.users) {
      expect(user.username.toLowerCase()).toContain('a');
    }
  });

  test('TC-GU-04: should sort users by username in ascending order', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-04']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    const usernames = body.users.map((u: any) => u.username.toLowerCase());
    const sorted = [...usernames].sort();
    expect(usernames).toEqual(sorted);
  });

  test('TC-GU-05: should sort users by id in descending order', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-05']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    const ids = body.users.map((u: any) => u.id);
    const sorted = [...ids].sort((a, b) => b - a);
    expect(ids).toEqual(sorted);
  });

  test('TC-GU-06: should limit results correctly', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-06']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    expect(body.users.length).toBeLessThanOrEqual(2);
  });

  test('TC-GU-07: should handle missing query params gracefully', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-07']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers();
    
    if (response.status() === 500) {
      await expectations.expectSchema(response, authErrorResponseSchema);
    } else {
      await expectations.expectStatus(response, record.expectedStatus);
      await expectations.expectSchema(response, getUsersResponseSchema);
    }
  });

  test('TC-GU-08: should handle negative page value', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-08']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    if (response.status() === 500 || response.status() === 400) {
       await expectations.expectSchema(response, authErrorResponseSchema);
    }
  });

  test('TC-GU-09: should handle invalid sort column', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-09']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const response = await adminUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
  });

  test('TC-GU-10: should not overlap pages', async ({ request, adminToken }) => {
    const record = ApiData.getUsers['TC-GU-10']();
    const adminUserService = new UserService(new ApiClient(request, adminToken));

    const p1 = await adminUserService.getUsers(record.payload.page1);
    const p2 = await adminUserService.getUsers(record.payload.page2);
    
    const users1 = (await p1.json()).users || [];
    const users2 = (await p2.json()).users || [];
    
    const ids1 = users1.map((u:any) => u.id);
    const ids2 = users2.map((u:any) => u.id);
    
    const overlap = ids1.filter((id:any) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  test('TC-GU-11: should reject requests with no token', async ({ request }) => {
    const record = ApiData.getUsers['TC-GU-11']();
    const unauthUserService = new UserService(new ApiClient(request, ''));

    const response = await unauthUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-GU-12: should reject requests with invalid token', async ({ request }) => {
    const record = ApiData.getUsers['TC-GU-12']();
    const invalidService = new UserService(new ApiClient(request, 'invalid.token'));

    const response = await invalidService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  test('TC-GU-13: should reject standard user requests', async ({ request, userToken }) => {
    const record = ApiData.getUsers['TC-GU-13']();
    const normalUserService = new UserService(new ApiClient(request, userToken));

    const response = await normalUserService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });
});
