import { expect } from '@playwright/test';
import { test } from "../../../src/api/helpers/fixtures/api.service.fixture";
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';
import {
  loginResponseSchema,
  authErrorResponseSchema,
} from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { registerUser } from '../../../src/api/helpers/actions/actions';
import { getLoginTestCases } from '../../../src/data/test_data/login.dataset';
import cleanupTestData from '../../../src/data/cleanup';

test.describe('POST /api/auth/login Test Suite @auth', () => {
  let expectations: Expectations;

  test.beforeEach(({ request }) => {
    expectations = new Expectations();
  });

  // TC-LOG-01: Valid Login
  test('TC-LOG-01: should successfully login with valid credentials (200 OK)', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-01']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, loginResponseSchema);
    await expectations.expectToken(response, loginResponseSchema, true);
  });

  // TC-LOG-02: Auth Failure (Wrong Password)
  test('TC-LOG-02: should return 401 Unauthorized for incorrect password', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-02']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-03: Auth Failure (User Not Found)
  test('TC-LOG-03: should return 401 Unauthorized for non-existent user', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-03']();

    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-04: Missing Fields
  test('TC-LOG-04: should return 400 Bad Request when missing password field', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-04']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-05: Empty Object
  test('TC-LOG-05: should return 400 Bad Request when user object is empty', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-05']();

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-06: Flat Payload
  test('TC-LOG-06: should return 400 Bad Request when payload is missing user wrapper', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-06']();
    await registerUser(record, authService, expectations);

    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-07: SQL Injection
  test('TC-LOG-07: should reject SQL injection payload safely', async ({ authService }) => {
    const record = ApiData.login['TC-LOG-07']();

    const response = await authService.login(record.payload);

    await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.UNAUTHORIZED, HttpStatus.NOT_FOUND, HttpStatus.CONFLICT]);
  });

  // TC-LOG-08: Multi-Device Login
  test('TC-LOG-08: should allow multi-device login and return valid tokens for both', async ({ request, authService }) => {
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
    await expectations.expectStatus(userProfile1, HttpStatus.OK);

    const userProfile2 = await userService2.getById(body2.user.id.toString());
    await expectations.expectStatus(userProfile2, HttpStatus.OK);
  });
});

test.describe('POST /api/auth/login Data-Driven Tests @auth', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  const ddtTestCases = getLoginTestCases();

  test.afterAll(async () => {
    await cleanupTestData();
  })
  for (const tc of ddtTestCases) {
    test(`${tc.tcId}: ${tc.description}`, async ({ authService }) => {
      // Setup pre-registered user if required
      if (tc.shouldRegisterFirst && tc.username) {
        const passwordToRegister = tc.registerPassword ?? tc.password;
        if (passwordToRegister) {
          const registerRes = await authService.register({
            user: {
              username: tc.username,
              password: passwordToRegister,
              full_name: 'DDT Setup User',
              role: 'user',
            },
          });
          await expectations.expectStatus(registerRes, HttpStatus.CREATED);
        }
      }

      // Construct request body based on payloadType
      let payload: any;
      if (tc.payloadType === 'emptyObject') {
        payload = { user: {} };
      } else if (tc.payloadType === 'missingPassword') {
        payload = { user: { username: tc.username } };
      } else if (tc.payloadType === 'unwrapped') {
        payload = { username: tc.username, password: tc.password };
      } else {
        payload = { user: { username: tc.username, password: tc.password } };
      }

      const response = await authService.login(payload);

      await expectations.expectStatus(response, tc.expectedStatus);
      await expectations.expectSchema(response, tc.expectedSchema);
    });
  }
});
