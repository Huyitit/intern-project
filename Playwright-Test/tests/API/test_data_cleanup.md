# Test Data Cleanup Strategies in Playwright API Tests

This document presents how test data cleanup is implemented across the API test suite located in [Playwright-Test/tests/API](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API).

## Overview

In API test automation, managing test data cleanup is critical to prevent database pollution, avoid duplicate key conflicts, and maintain test isolation. The Playwright API test suite utilizes four main strategies for data cleanup:

1. **Suite-Level Batch Teardown (`test.afterAll`)**
2. **Inline Test-Level Helper Cleanup (`safeCleanupUser`)**
3. **Self-Cleaning Test Operations (Inherent Endpoint Teardown)**
4. **Database Reseeding and Reset Scripts (`TRUNCATE` / Seed)**

---

## 1. Suite-Level Batch Teardown (`test.afterAll`)

In test suites where multiple test cases create users in the database (such as user creation tests), an array tracks all generated resource IDs during test execution. Once all tests in the suite finish, a `test.afterAll` hook authenticates as an admin and deletes all accumulated records in batch.

### Implementation Example

Found in [create-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/create-user.spec.ts#L15-L31):

```typescript
test.describe('POST /api/users Test Suite', () => {
  let expectations: Expectations;
  const createdUserIds: number[] = [];

  test.afterAll(async ({ request }) => {
    const authServiceForTeardown = new AuthService(new AuthClient(request));
    const loginRes = await authServiceForTeardown.login({
      user: { username: env.User.admin.username, password: env.User.admin.password }
    });
    const adminToken = (await loginRes.json()).token;
    const teardownService = new UserService(new ApiClient(request, adminToken));
    for (const id of createdUserIds) {
      try {
        await teardownService.delete(id.toString());
      } catch {}
    }
  });

  test('TC-CU-01: Valid User Creation (Admin)', async ({ adminService }) => {
    const record = ApiData.createUser['TC-CU-01']();
    const response = await adminService.create(record.payload as any);
    const body = await response.json();
    createdUserIds.push(body.user.id);
  });
});
```

### Key Highlights
- **ID Tracking**: `createdUserIds` array pushes newly created record IDs during test execution.
- **Admin Privilege Escalation**: Creates an isolated admin service during teardown to ensure permission to delete resources.
- **Fault-Tolerant Execution**: Uses `try { ... } catch {}` so that if an individual deletion fails or was already removed, remaining cleanup steps continue without breaking the suite teardown.

---

## 2. Inline Test-Level Helper Cleanup (`safeCleanupUser`)

For test suites testing `GET` or `PUT` endpoints (such as `get-user-by-id.spec.ts` or `update-user.spec.ts`), tests create disposable target users before executing assertions. An inline helper function cleans up the user immediately after test assertions complete.

### Implementation Example

Found in [update-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/update-user.spec.ts#L32-L38):

```typescript
async function cleanupTargetUser(userId: number, adminService: UserService) {
  if (userId && adminService) {
    try {
      await adminService.delete(userId.toString());
    } catch {}
  }
}

test('TC-UU-01: Valid Update (Admin)', async ({ authService, adminService }) => {
  const record = ApiData.updateUser['TC-UU-01']();
  const { userId } = await createTargetUser(authService);

  const updatePayload = { user: { id: userId, ...record.payload.user } };
  const response = await adminService.updateUser(userId, updatePayload);

  await expectations.expectStatus(response, record.expectedStatus);
  await expectations.expectSchema(response, updateUserResponseSchema);

  await cleanupTargetUser(userId, adminService);
});
```

### Key Highlights
- **Immediate Resource Release**: Data exists only for the duration of the single test.
- **Defensive Guard**: Checks `if (userId && adminService)` to prevent null pointer exceptions during cleanup.

---

## 3. Self-Cleaning Test Operations

Certain tests perform endpoint operations where the action being tested is itself a deletion request.

### Implementation Example

Found in [delete-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/delete-user.spec.ts#L33-L45):

```typescript
test('TC-DU-01: Valid Deletion (Admin)', async ({ authService, adminService }) => {
  const record = ApiData.deleteUser['TC-DU-01']();
  const targetUserId = await createDisposableUser(authService);

  // The operation under test performs the cleanup
  const response = await adminService.delete(targetUserId.toString());

  await expectations.expectStatus(response, record.expectedStatus);
  await expectations.expectSchema(response, deleteUserResponseSchema);
});
```

### Key Highlights
- Zero extra cleanup code is needed because the system state is naturally cleaned by the API action under test.

---

## 4. Database Reseeding and Pre-Test State Reset (`TRUNCATE`)

In addition to test-level cleanup routines, global database cleanliness is maintained using database reset scripts.

### Implementation Example

Found in [seed.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/src/data/seed.ts#L23-L25):

```typescript
async function main() {
  console.log('Starting seed...');

  // Delete current data before seeding
  await pool.query('TRUNCATE TABLE users');

  // Seed default admin user and 50 standard test users
  ...
}
```

### Key Highlights
- Executable via `npm run seed` before running full test suites to ensure a predictable state.
- Wipes transient data left by interrupted test runs.

---

## Summary Comparison Table

| Cleanup Strategy | Primary Usage | Location | Benefits |
| :--- | :--- | :--- | :--- |
| **Suite `afterAll` Teardown** | Creation tests (`POST /api/users`) | [create-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/create-user.spec.ts) | Centralized cleanup, handles multi-user creation |
| **Inline Helper Cleanup** | Profile and Update tests (`GET`, `PUT`) | [get-user-by-id.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/get-user-by-id.spec.ts), [update-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/update-user.spec.ts) | Fast, isolated per-test cleanup |
| **Self-Cleaning Operations** | Deletion tests (`DELETE /api/users/:id`) | [delete-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/delete-user.spec.ts) | Efficient, no redundant cleanup code |
| **Database `TRUNCATE` / Reseed** | Pre-test environment preparation | [seed.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/src/data/seed.ts) | Complete state reset, prevents stale test artifacts |
