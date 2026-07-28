import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { AuthClient } from '../../../src/api/clients/auth.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import {
  loginResponseSchema,
  authErrorResponseSchema,
} from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { registerUser } from '../../../src/api/helpers/actions/register';

test.describe('POST /api/auth/login Test Suite', () => {
  let authService: AuthService;
  let expectations: Expectations;

  test.beforeEach(({ request }) => {
    const authClient = new AuthClient(request);
    authService = new AuthService(authClient);
    expectations = new Expectations();
  });

  // TC-LOG-01: Valid Login
  test('TC-LOG-01: should successfully login with valid credentials (200 OK)', async () => {
    const record = ApiData.login['TC-LOG-01']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, loginResponseSchema);
    await expectations.expectToken(response, loginResponseSchema, true);
  });

  // TC-LOG-02: Auth Failure (Wrong Password)
  test('TC-LOG-02: should return 401 Unauthorized for incorrect password', async () => {
    const record = ApiData.login['TC-LOG-02']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-03: Auth Failure (User Not Found)
  test('TC-LOG-03: should return 401 Unauthorized for non-existent user', async () => {
    const record = ApiData.login['TC-LOG-03']();

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-04: Missing Fields
  test('TC-LOG-04: should return 400 Bad Request when missing password field', async () => {
    const record = ApiData.login['TC-LOG-04']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-05: Empty Object
  test('TC-LOG-05: should return 400 Bad Request when user object is empty', async () => {
    const record = ApiData.login['TC-LOG-05']();

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-06: Flat Payload
  test('TC-LOG-06: should return 400 Bad Request when payload is missing user wrapper', async () => {
    const record = ApiData.login['TC-LOG-06']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-07: SQL Injection
  test('TC-LOG-07: should reject SQL injection payload safely', async () => {
    const record = ApiData.login['TC-LOG-07']();

    const response = await authService.login(record.payload);

    const validRejectStatuses = [400, 401, 404, 409];
    expect(validRejectStatuses.includes(response.status())).toBeTruthy();
  });

  // TC-LOG-08: Multi-Device Login
  test('TC-LOG-08: should allow multi-device login and return valid tokens for both', async ({ request }) => {
    const record = ApiData.login['TC-LOG-08']();
    await registerUser(record, authService, expectations);

    // First device login
    const response1 = await authService.login(record.payload);
    await expectations.expectStatus(response1, record.expectedStatus);
    const body1 = await response1.json();
    const token1 = body1.token;

    // Second device login
    const response2 = await authService.login(record.payload);
    await expectations.expectStatus(response2, record.expectedStatus);
    const body2 = await response2.json();
    const token2 = body2.token;

    expect(token1).toBeTruthy();
    expect(token2).toBeTruthy();

    // Verify both tokens are valid for subsequent API calls
    const userService1 = new UserService(new ApiClient(request, token1));
    const userService2 = new UserService(new ApiClient(request, token2));

    const userProfile1 = await userService1.getById(body1.user.id.toString());
    await expectations.expectStatus(userProfile1, 200);

    const userProfile2 = await userService2.getById(body2.user.id.toString());
    await expectations.expectStatus(userProfile2, 200);
  });
});
