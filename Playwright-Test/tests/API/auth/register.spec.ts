import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import {
  registerResponseSchema,
  authErrorResponseSchema,
} from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';
import { registerUser } from '../../../src/api/helpers/actions/register';

test.describe('POST /api/auth/register Test Suite (REST & Security Standard)', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-REG-01: Valid User Registration
  test('TC-REG-01: should successfully register a new user with valid dynamic payload (201 Created)', async ({ authService }) => {
    const record = ApiData.register['TC-REG-01']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, registerResponseSchema);
  });

  // TC-REG-02: Duplicate Username Registration
  test('TC-REG-02: should return 409 Conflict when attempting to register duplicate username', async ({ authService }) => {
    const record = ApiData.register['TC-REG-02']();
    // Register initial user
    await registerUser(record, authService, expectations);

    // Attempt registering duplicate user
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-03: Register with Missing Required Fields (username & password)
  test('TC-REG-03: should return 400 Bad Request when missing required fields (username, password)', async ({ authService }) => {
    const record = ApiData.register['TC-REG-03']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-04: Register with Field Length Violations (< 6 chars)
  test('TC-REG-04: should return 400 Bad Request for field length violations (<6 chars)', async ({ authService }) => {
    const record = ApiData.register['TC-REG-04']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-05: Register with Invalid Email Format
  test('TC-REG-05: should return 400 Bad Request for invalid email format', async ({ authService }) => {
    const record = ApiData.register['TC-REG-05']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-06: Register with Flat JSON Body (Unwrapped)
  test('TC-REG-06: should return 400 Bad Request when payload is flat without user wrapper', async ({ authService }) => {
    const record = ApiData.register['TC-REG-06']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-07: Register with Role Escalation Attempt ('admin')
  test('TC-REG-07: should return 400 Bad Request when attempting self-registration as admin', async ({ authService }) => {
    const record = ApiData.register['TC-REG-07']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-08: Register with SQL Injection Input String
  test('TC-REG-08: should handle SQL injection input string safely and return 201 Created', async ({ authService }) => {
    const record = ApiData.register['TC-REG-08']();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, registerResponseSchema);
  });
});
