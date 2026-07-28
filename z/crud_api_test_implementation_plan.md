# Implement User CRUD API Test Suite

## Context

Implement the ~40 test cases from [users_api_test_plan.md](file:///home/huycao/Desktop/intern-project/users_api_test_plan.md) into the existing Playwright project. The implementation follows the established **Client → Service → Spec** architecture with Builder/Generator data patterns.

## Proposed Changes

### Phase 1: Infrastructure

---

#### [MODIFY] [endpoints.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/src/api/config/endpoints.ts)

- Add `userById: (id) => '/api/users/${id}'` helper (already exists but verify consistency).
- Ensure `users: '/api/users'` is present (already exists).

---

#### [NEW] `src/api/services/user.service.ts`

- Create `UserService extends BaseService<User>`.
- Inherits `create()`, `getById()`, `delete()` from `BaseService`.
- Add new methods:
  - `getUsers(params: { page, limit, keyword, sortBy, order })` — builds query string and calls `GET /api/users?...`
  - `updateUser(id: string, payload: object)` — calls `PUT /api/users/{id}`

---

#### [NEW] `src/api/helpers/schemas/user.schema.ts`

New Zod schemas for user CRUD response validation:

- `userObjectSchema` — reusable base user shape (`id`, `full_name`, `username`, `phone`, `email`, `role`, `create_at?`)
- `getUsersResponseSchema` — `{ success: true, users: userObjectSchema[], message?: string }`
- `getUserByIdResponseSchema` — `{ success: true, user: userObjectSchema }`
- `createUserResponseSchema` — `{ success: true, user: userObjectSchema }` (with `create_at`)
- `updateUserResponseSchema` — `{ success: true, user: userObjectSchema }`
- `deleteUserResponseSchema` — `{ success: true, message: string }`

The existing `authErrorResponseSchema` from [auth.schema.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/src/api/helpers/schemas/auth.schema.ts) will be reused for all error responses.

---

### Phase 2: GET Tests

---

#### [NEW] `tests/API/users/get-users.spec.ts`

- **Setup**: `beforeAll` logs in as admin (via `AuthService`) and stores the JWT token. Creates a `UserService` with `ApiClient(request, adminToken)`. Also logs in as a standard user for forbidden tests.
- **Test Cases**: TC-GU-01 through TC-GU-13 (functional, pagination edge cases, auth/role).
- **Assertions**: Uses `expectStatus`, `expectSchema` with `getUsersResponseSchema` and `authErrorResponseSchema`.

---

#### [NEW] `tests/API/users/get-user-by-id.spec.ts`

- **Setup**: Same admin/user login pattern. Dynamically registers a test user to know a valid ID.
- **Test Cases**: TC-GI-01 through TC-GI-06.
- **Key Pattern**: Tests both admin access and owner access, plus cross-user forbidden access.

---

### Phase 3: POST/PUT/DELETE Tests

---

#### [NEW] `tests/API/users/create-user.spec.ts`

- **Setup**: Admin login for creation. User login for forbidden tests.
- **Test Cases**: TC-CU-01 through TC-CU-08.
- **Cleanup**: `afterAll` deletes any created test users via `UserService.delete()`.

---

#### [NEW] `tests/API/users/update-user.spec.ts`

- **Setup**: Admin login. Dynamically creates a test user. Also logs in as that user to get a user-role token.
- **Test Cases**: TC-UU-01 through TC-UU-08.
- **Key Pattern**: Tests admin updating any user, owner updating self, cross-user forbidden, and validation failures.

---

#### [NEW] `tests/API/users/delete-user.spec.ts`

- **Setup**: Admin login. Creates disposable users specifically for deletion tests.
- **Test Cases**: TC-DU-01 through TC-DU-05.
- **Key Pattern**: Each delete test creates its own user in `beforeEach` to avoid test interdependence.

---

#### [DELETE] `tests/API/crud/get.spec.ts`

- Remove the empty placeholder file since it will be superseded by the new `tests/API/users/` structure.

## Architecture Diagram

```text
src/api/
├── clients/
│   ├── api.client.ts          ← reused (GET/POST/PUT/DELETE + token)
│   └── auth.client.ts         ← reused (login/register, no token)
├── services/
│   ├── base.service.ts        ← reused (generic CRUD)
│   ├── auth.service.ts        ← reused (login, register)
│   └── user.service.ts        ← NEW (extends BaseService)
├── helpers/
│   ├── assertions/base.ts     ← reused (expectStatus, expectSchema, expectToken)
│   └── schemas/
│       ├── auth.schema.ts     ← reused (authErrorResponseSchema)
│       └── user.schema.ts     ← NEW (user CRUD response schemas)
├── data/
│   ├── builders/user.builder.ts  ← reused
│   └── generators/user-data.generator.ts  ← reused
└── models/user.model.ts       ← reused

tests/API/
├── auth/
│   ├── register.spec.ts       ← existing
│   └── login.spec.ts          ← existing
└── users/                     ← NEW directory
    ├── get-users.spec.ts      ← Phase 2 (TC-GU-01 to TC-GU-13)
    ├── get-user-by-id.spec.ts ← Phase 2 (TC-GI-01 to TC-GI-06)
    ├── create-user.spec.ts    ← Phase 3 (TC-CU-01 to TC-CU-08)
    ├── update-user.spec.ts    ← Phase 3 (TC-UU-01 to TC-UU-08)
    └── delete-user.spec.ts    ← Phase 3 (TC-DU-01 to TC-DU-05)
```

## Verification Plan

### Automated Tests

After each phase, run the corresponding tests:

```bash
# Phase 2
npx playwright test tests/API/users/get-users.spec.ts
npx playwright test tests/API/users/get-user-by-id.spec.ts

# Phase 3
npx playwright test tests/API/users/create-user.spec.ts
npx playwright test tests/API/users/update-user.spec.ts
npx playwright test tests/API/users/delete-user.spec.ts

# Full suite
npx playwright test tests/API/users/
```
