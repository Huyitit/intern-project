# Data-Driven Testing (DDT) Solution Proposal for Login API

This document presents the architecture, data models, and implementation steps for Data-Driven Testing (DDT) applied to the Login API in [Playwright-Test/tests/API/auth/login.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/login.spec.ts).

## 1. Executive Summary & Goals

### Objective
Transition the Login API test suite from individual hardcoded test blocks to a **Data-Driven Testing (DDT)** architecture.

### Key Benefits
- **Centralized Test Data**: All test inputs (`username`, `password`, payload wrappers) and expected outcomes reside in a strongly typed dataset module.
- **Maintainability**: Adding new test scenarios (e.g. boundary checks, injection attempts) requires adding data objects without writing duplicated test logic.
- **Dynamic Playwright Integration**: Playwright automatically generates individual parameterized test cases (`test(tcId: description)`) in reports and CLI logs.

---

## 2. Proposed Architecture

```
+-------------------------------------------------------------+
|              src/data/test_data/login.dataset.ts            |
|                                                             |
|   Array of LoginTestCaseRecord objects                      |
|   [{ tcId: 'TC-LOG-01', username, password, ... }, ...]     |
+-------------------------------------------------------------+
                              |
                              v (Iterates dataset)
+-------------------------------------------------------------+
|             tests/API/auth/login.spec.ts                    |
|                                                             |
|   loginTestCases.forEach((tc) => {                          |
|     test(`${tc.tcId}: ${tc.description}`, async (...) => {  |
|       // Pre-register user if required                      |
|       // Construct payload from tc.username & tc.password   |
|       // Send POST /api/auth/login                          |
|       // Assert status and Zod schema                       |
|     });                                                     |
|   });                                                       |
+-------------------------------------------------------------+
```

---

## 3. Detailed Data Model & Dataset Implementation

### Step 1: Create [src/data/test_data/login.dataset.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/src/data/test_data/login.dataset.ts)

Define the `LoginTestCaseRecord` interface and export the dataset array:

```typescript
import { UserDataGenerator } from '../generators/user-data.generator';
import { loginResponseSchema, authErrorResponseSchema } from '../../api/helpers/schemas/auth.schema';
import { ZodTypeAny } from 'zod';

export interface LoginTestCaseRecord {
  tcId: string;
  description: string;
  username?: string;
  password?: string;
  payloadType?: 'standard' | 'missingPassword' | 'emptyObject' | 'unwrapped';
  shouldRegisterFirst?: boolean;
  expectedStatus: number;
  expectedSchema: ZodTypeAny;
}

export function getLoginTestCases(): LoginTestCaseRecord[] {
  const validUser = {
    username: UserDataGenerator.validUsername(),
    password: UserDataGenerator.validPassword(),
  };

  return [
    {
      tcId: 'TC-LOG-01',
      description: 'Valid login with correct credentials',
      username: validUser.username,
      password: validUser.password,
      shouldRegisterFirst: true,
      expectedStatus: 200,
      expectedSchema: loginResponseSchema,
    },
    {
      tcId: 'TC-LOG-02',
      description: 'Auth failure with incorrect password',
      username: validUser.username,
      password: 'wrong_password_123!',
      shouldRegisterFirst: true,
      expectedStatus: 401,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-LOG-03',
      description: 'Auth failure for non-existent user',
      username: UserDataGenerator.nonExistentUsername(),
      password: UserDataGenerator.validPassword(),
      shouldRegisterFirst: false,
      expectedStatus: 401,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-LOG-04',
      description: 'Missing password field in payload',
      username: validUser.username,
      payloadType: 'missingPassword',
      shouldRegisterFirst: true,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-LOG-05',
      description: 'Empty user payload object',
      payloadType: 'emptyObject',
      shouldRegisterFirst: false,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-LOG-06',
      description: 'Missing root user wrapper in body',
      username: validUser.username,
      password: validUser.password,
      payloadType: 'unwrapped',
      shouldRegisterFirst: true,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-LOG-07',
      description: 'SQL Injection attempt in credentials',
      username: "test' OR '1'='1",
      password: "' OR '1'='1",
      shouldRegisterFirst: false,
      expectedStatus: 401,
      expectedSchema: authErrorResponseSchema,
    },
  ];
}
```

---

## 4. Parameterized Test Spec Implementation

### Step 2: Refactor [login.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/login.spec.ts)

Iterate over the dataset to execute all test cases dynamically:

```typescript
import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { getLoginTestCases } from '../../../src/data/test_data/login.dataset';

test.describe('POST /api/auth/login Data-Driven Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  const testCases = getLoginTestCases();

  for (const tc of testCases) {
    test(`${tc.tcId}: ${tc.description}`, async ({ authService }) => {
      // 1. Setup pre-registered user if required by test case
      if (tc.shouldRegisterFirst && tc.username && tc.password) {
        const registerRes = await authService.register({
          user: {
            username: tc.username,
            password: tc.password,
            full_name: 'Test Setup User',
            role: 'user',
          },
        });
        await expectations.expectStatus(registerRes, 201);
      }

      // 2. Construct request payload based on payloadType
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

      // 3. Send login API request
      const response = await authService.login(payload);

      // 4. Assert response status and schema
      await expectations.expectStatus(response, tc.expectedStatus);
      await expectations.expectSchema(response, tc.expectedSchema);
    });
  }
});
```

---

## 5. Comparison: Hardcoded vs. Data-Driven Approach

| Attribute | Hardcoded Spec Files | Data-Driven Approach (DDT) |
| :--- | :--- | :--- |
| **Code Duplication** | High (Repeated `test(...)` blocks with identical call patterns) | Zero (Single parameterized loop) |
| **Adding New Scenarios** | Write a new 10-line `test(...)` block in spec file | Add 1 data object to dataset array |
| **Separation of Concerns** | Data logic mixed with assertion code | Clean separation between test data and execution |
| **Reporting** | Static test names | Dynamic test names parameterized by `tcId` & `description` |
