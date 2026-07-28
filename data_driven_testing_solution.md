# Data-Driven API Testing Solution: Mother Class Data Repository Pattern

This architecture uses a central Mother Class (`ApiData` or `apiData`) defined in TypeScript under `src/data/test_data/api.test.data.ts`. The mother class acts as the centralized data store for all API test datasets, mapping each test case ID to its dedicated data record.

---

## 1. Project Directory Structure

```
Playwright-Test/
├── src/
│   └── data/
│       ├── builders/
│       │   └── user.builder.ts
│       ├── generators/
│       │   └── user-data.generator.ts
│       └── test_data/
│           └── api.test.data.ts           <-- Central Mother Class storing test dataset records
└── tests/
    └── API/
        └── auth/
            └── login.spec.ts              <-- Spec file fetching data directly from ApiData
```

---

## 2. Mother Class Implementation (`src/data/test_data/api.test.data.ts`)

The mother class `ApiData` (or `apiData`) defines strongly typed dataset records for each test module. You can edit any test case's payload or expected status code directly within this TypeScript file.

```typescript
import { UserBuilder } from "../builders/user.builder";
import { UserDataGenerator } from "../generators/user-data.generator";

export interface TestCaseRecord<T = any> {
  tcId: string;
  description: string;
  payload: T;
  expectedStatus: number;
}

export class ApiData {
  /**
   * Login API Test Datasets (Mapped by TC-ID)
   */
  static readonly login = {
    'TC-LOG-01': {
      tcId: 'TC-LOG-01',
      description: 'Valid login with correct credentials',
      payload: {
        user: {
          username: 'testuser_valid_01',
          password: 'ValidPassword123!',
        },
      },
      expectedStatus: 200,
    },
    'TC-LOG-02': {
      tcId: 'TC-LOG-02',
      description: 'Auth failure with incorrect password',
      payload: {
        user: {
          username: 'testuser_valid_01',
          password: 'wrong_password123!',
        },
      },
      expectedStatus: 401,
    },
    'TC-LOG-03': {
      tcId: 'TC-LOG-03',
      description: 'Auth failure for non-existent user',
      payload: {
        user: {
          username: 'ghost_user_nonexistent_9999',
          password: 'ValidPassword123!',
        },
      },
      expectedStatus: 401,
    },
    'TC-LOG-04': {
      tcId: 'TC-LOG-04',
      description: 'Missing password field in payload',
      payload: {
        user: {
          username: 'testuser_valid_01',
        },
      },
      expectedStatus: 400,
    },
    'TC-LOG-05': {
      tcId: 'TC-LOG-05',
      description: 'Empty user payload object',
      payload: {
        user: {},
      },
      expectedStatus: 400,
    },
    'TC-LOG-06': {
      tcId: 'TC-LOG-06',
      description: 'Missing root user wrapper in body',
      payload: {
        username: 'testuser_valid_01',
        password: 'ValidPassword123!',
      },
      expectedStatus: 400,
    },
    'TC-LOG-07': {
      tcId: 'TC-LOG-07',
      description: 'SQL Injection attempt in credentials',
      payload: {
        user: {
          username: "' OR '1'='1",
          password: "' OR '1'='1",
        },
      },
      expectedStatus: 401,
    },
    'TC-LOG-08': {
      tcId: 'TC-LOG-08',
      description: 'Multi-device login for same user',
      payload: {
        user: {
          username: 'testuser_valid_01',
          password: 'ValidPassword123!',
        },
      },
      expectedStatus: 200,
    },
  };

  /**
   * User CRUD Datasets can be added here or in child classes extending ApiData
   */
  static readonly users = {
    // Add User CRUD data records here...
  };
}
```

---

## 3. Modular Class Inheritance Alternative (Sub-Classes)

If you prefer separating dataset files per module while keeping a common base mother class:

```typescript
// Mother Base Class
export class BaseApiData {
  static getRecord<T>(dataset: Record<string, T>, tcId: string): T {
    const record = dataset[tcId];
    if (!record) {
      throw new Error(`Data record for test case ${tcId} not found.`);
    }
    return record;
  }
}

// Module Sub-Class extending Mother Class
export class LoginApiData extends BaseApiData {
  static readonly records = ApiData.login;
}
```

---

## 4. Test Spec Mapping (`login.spec.ts`)

In `tests/API/auth/login.spec.ts`, test cases fetch their data records directly from `ApiData.login`:

```typescript
import { test, expect } from '@playwright/test';
import { ApiClient } from '../../../src/api/clients/api.client';
import { AuthClient } from '../../../src/api/clients/auth.client';
import { AuthService } from '../../../src/api/services/auth.service';
import { UserService } from '../../../src/api/services/user.service';
import { UserBuilder } from '../../../src/data/builders/user.builder';
import { UserDataGenerator } from '../../../src/data/generators/user-data.generator';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { loginResponseSchema, authErrorResponseSchema } from '../../../src/api/helpers/schemas/auth.schema';
import { ApiData } from '../../../src/data/test_data/api.test.data';

test.describe('POST /api/auth/login Test Suite', () => {
  let authService: AuthService;
  let expectations: Expectations;

  test.beforeAll(async ({ request }) => {
    const authClient = new AuthClient(request);
    authService = new AuthService(authClient);
    expectations = new Expectations();

    // Dynamically register the valid user defined in TC-LOG-01's data record
    const validCredentials = ApiData.login['TC-LOG-01'].payload.user;
    const newUser = new UserBuilder()
      .setUserName(validCredentials.username)
      .setPassword(validCredentials.password)
      .setFull_name(UserDataGenerator.validFullname())
      .setPhone(UserDataGenerator.validPhone())
      .setEmail(UserDataGenerator.validEmail())
      .setRole('user')
      .build();

    await authService.register({ user: newUser });
  });

  test.beforeEach(({ request }) => {
    const authClient = new AuthClient(request);
    authService = new AuthService(authClient);
    expectations = new Expectations();
  });

  // TC-LOG-01: Valid Login
  test('TC-LOG-01: Valid Login', async () => {
    const record = ApiData.login['TC-LOG-01'];
    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, loginResponseSchema);
    await expectations.expectToken(response, loginResponseSchema, true);
  });

  // TC-LOG-02: Auth Failure (Wrong Password)
  test('TC-LOG-02: Auth Failure (Wrong Password)', async () => {
    const record = ApiData.login['TC-LOG-02'];
    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-03: Auth Failure (User Not Found)
  test('TC-LOG-03: Auth Failure (User Not Found)', async () => {
    const record = ApiData.login['TC-LOG-03'];
    const response = await authService.login(record.payload);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-04: Missing Fields (No Password)
  test('TC-LOG-04: Missing Fields (No Password)', async () => {
    const record = ApiData.login['TC-LOG-04'];
    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-05: Missing Fields (Empty Object)
  test('TC-LOG-05: Missing Fields (Empty Object)', async () => {
    const record = ApiData.login['TC-LOG-05'];
    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-06: Malformed Payload (Flat Body)
  test('TC-LOG-06: Malformed Payload (Flat Body)', async () => {
    const record = ApiData.login['TC-LOG-06'];
    const response = await authService.login(record.payload as any);

    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, authErrorResponseSchema);
  });

  // TC-LOG-07: SQL Injection Attempt
  test('TC-LOG-07: SQL Injection Attempt', async () => {
    const record = ApiData.login['TC-LOG-07'];
    const response = await authService.login(record.payload);

    const validRejectStatuses = [400, 401, 404, 409];
    expect(validRejectStatuses.includes(response.status())).toBeTruthy();
  });

  // TC-LOG-08: Multi-Device Login
  test('TC-LOG-08: Multi-Device Login', async ({ request }) => {
    const record = ApiData.login['TC-LOG-08'];

    const response1 = await authService.login(record.payload);
    await expectations.expectStatus(response1, record.expectedStatus);
    const body1 = await response1.json();

    const response2 = await authService.login(record.payload);
    await expectations.expectStatus(response2, record.expectedStatus);
    const body2 = await response2.json();

    expect(body1.token).toBeTruthy();
    expect(body2.token).toBeTruthy();

    const userService1 = new UserService(new ApiClient(request, body1.token));
    const userService2 = new UserService(new ApiClient(request, body2.token));

    const userProfile1 = await userService1.getById(body1.user.id.toString());
    await expectations.expectStatus(userProfile1, 200);

    const userProfile2 = await userService2.getById(body2.user.id.toString());
    await expectations.expectStatus(userProfile2, 200);
  });
});
```

---

## 5. Key Advantages

1. **Mother Class Pattern**: Centralized data management inside `src/data/test_data/api.test.data.ts` (`ApiData` class).
2. **TypeScript Intelligence**: Full Intellisense autocomplete, type checking, and refactoring support when editing datasets.
3. **Independent Data Editing**: Each test case has a dedicated record (`TC-LOG-01`, `TC-LOG-02`, etc.) in the mother class. Editing payloads or expected status codes is done independently in one file.
4. **Direct Test Spec Mapping**: Test specs fetch records via `ApiData.login['TC-ID']` and pass `record.payload` directly to API calls.
