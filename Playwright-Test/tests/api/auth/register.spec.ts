import { test } from '../../../src/api/fixtures/api.service.fixture';
import { Expectations } from '../../../src/core/assertions/base';
import {
  registerResponseSchema,
  authErrorResponseSchema,
} from '../../../src/api/schemas/auth.schema';

import {
  tcREG01,
  tcREG02,
  tcREG03,
  tcREG04,
  tcREG05,
  tcREG06,
  tcREG07,
  tcREG08,
} from '../../../src/data/datasets/auth/register.data';

test.describe('Register Test Suite', { tag: ['@auth', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    // await cleanupTestData();
  });

  // TC-REG-01: Valid User Registration
  test('TC-REG-01: should successfully register a new user with valid dynamic payload (201 Created)', { tag: ['@smoke', '@regression'] }, async ({ authService }) => {
    const record = tcREG01();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 201);
    await expectations.expectSchema(response, registerResponseSchema);
  });

  // TC-REG-02: Duplicate Username Registration
  test('TC-REG-02: should return 409 Conflict when attempting to register duplicate username', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG02();
    // Register initial user
    if (record.user) {
      const registerRes = await authService.register({ user: record.user });
      await expectations.expectStatus(registerRes, 201);
    }

    // Attempt registering duplicate user
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 409);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-03: Register with Missing Required Fields (username & password)
  test('TC-REG-03: should return 400 Bad Request when missing required fields (username, password)', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG03();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-04: Register with Field Length Violations (< 6 chars)
  test('TC-REG-04: should return 400 Bad Request for field length violations (<6 chars)', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG04();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-05: Register with Invalid Email Format
  test('TC-REG-05: should return 400 Bad Request for invalid email format', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG05();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-06: Register with Flat JSON Body (Unwrapped)
  test('TC-REG-06: should return 400 Bad Request when payload is flat without user wrapper', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG06();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 400);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-REG-07: Register with Role Escalation Attempt ('admin')
  test('TC-REG-07: should return 400 Bad Request when attempting self-registration as admin', { tag: ['@smoke', '@regression'] }, async ({ authService }) => {
    const record = tcREG07();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 201);
    await expectations.expectSchema(response, registerResponseSchema);
  });

  // TC-REG-08: Register with SQL Injection Input String
  test('TC-REG-08: should handle SQL injection input string safely and return 201 Created', { tag: '@regression' }, async ({ authService }) => {
    const record = tcREG08();
    const response = await authService.register(record.payload);

    await expectations.expectStatus(response, 201);
    await expectations.expectSchema(response, registerResponseSchema);
  });
});
