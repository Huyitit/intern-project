# API Test Tagging Strategy Report: Smoke & Regression

This report categorizes all API test cases in [tests/API](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API) into two primary test suites: **Smoke Tests** (`@smoke`) and **Regression Tests** (`@regression`).

---

## Strategy & Tagging Definitions

- **Smoke Tests (`@smoke`)**:
  A lightweight subset of critical happy-path tests executed on every deployment/PR to quickly verify system health, core authentication, and primary CRUD capabilities.

- **Regression Tests (`@regression`)**:
  The complete test suite covering all functional, edge-case, negative validation, boundary condition, security (SQL injection), authorization (403), and Data-Driven Tests (DDT) to ensure no existing functionality breaks after code changes.

---

## 1. Smoke Test Cases (`@smoke`)

Smoke tests verify that core endpoints respond successfully (`200 OK`, `201 Created`) with valid payloads.

### System Health
File: [health.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/system/health.spec.ts)
- `TC-HLT-01`: Public health check returns `200 OK`.

### Authentication Suite
File: [login.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/login.spec.ts)
- `TC-LOG-01`: Valid user login with correct credentials (`200 OK`).
- `TC-LOG-09`: Admin login (`200 OK`).
- `TC-LOG-10`: User login (`200 OK`).

File: [register.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/register.spec.ts)
- `TC-REG-01`: Valid user self-registration with dynamic payload (`201 Created`).

### User Management & CRUD Suite
File: [create-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/create-user.spec.ts)
- `TC-CU-01`: Valid user creation by Admin (`201 Created`).

File: [get-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/get-users.spec.ts)
- `TC-GU-01`: Fetch first page of users with default params (`200 OK`).

File: [get-user-by-id.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/get-user-by-id.spec.ts)
- `TC-GI-01`: Admin fetches any user by ID (`200 OK`).
- `TC-GI-02`: User fetches their own profile (`200 OK`).

File: [update-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/update-user.spec.ts)
- `TC-UU-01`: Valid user update by Admin (`200 OK`).
- `TC-UU-02`: Valid user update by Owner (`200 OK`).

File: [delete-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/delete-user.spec.ts)
- `TC-DU-01`: Valid user deletion by Admin (`200 OK`).

File: [upload-avatar.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-avatar.spec.ts)
- `TC-AVT-01`: Owner uploads valid PNG avatar image (`200 OK`).

File: [upload-csv.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-csv.spec.ts)
- `TC-CSV-01`: Owner updates profile via CSV upload (`200 OK`).

File: [export-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/export-users.spec.ts)
- `TC-EXP-01`: Admin exports user list (`200 OK`).

---

## 2. Regression Test Cases (`@regression`)

Regression testing includes all tests from the Smoke suite plus all negative, boundary, authorization, data-driven, and security tests.

### System & Authentication Suite
Files: [health.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/system/health.spec.ts), [login.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/login.spec.ts), [register.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/auth/register.spec.ts)

- `TC-HLT-01`: Public health check (`200 OK`).
- `TC-LOG-01` to `TC-LOG-10`: All valid, invalid password (`401`), non-existent user (`401`), missing fields (`400`), empty payload (`400`), unwrapped body (`400`), SQL injection attempt (`400`/`401`), multi-device login (`200 OK`), and role-based login tests.
- `TC-DDT-LOG-01` to `TC-DDT-LOG-09`: Data-Driven Tests covering all login permutation datasets.
- `TC-REG-01` to `TC-REG-08`: Registration happy path (`201`), duplicate username (`409`), missing required fields (`400`), short field length (`400`), invalid email format (`400`), flat payload (`400`), self-registration as admin (`400`), and SQL injection protection (`201`/sanitized).

### CRUD & User Management Suite

#### Create User ([create-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/create-user.spec.ts))
- `TC-CU-01`: Valid creation (`201 Created`).
- `TC-CU-02`: Duplicate username (`409 Conflict`).
- `TC-CU-03`: Missing required fields (`400 Bad Request`).
- `TC-CU-04`: Empty payload (`400 Bad Request`).
- `TC-CU-05`: Invalid data types (`400 Bad Request`).
- `TC-CU-06`: Invalid email format (`400 Bad Request`).
- `TC-CU-07`: Standard user forbidden from creating users (`403 Forbidden`).
- `TC-CU-08`: Request without token (`401/406 Unauthorized`).

#### Get Users List ([get-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/get-users.spec.ts))
- `TC-GU-01`: Default pagination (`200 OK`).
- `TC-GU-02`: Page out of bounds (`200 OK`, empty list).
- `TC-GU-03`: Filter by username keyword (`200 OK`).
- `TC-GU-04`: Sort by username ascending (`200 OK`).
- `TC-GU-05`: Sort by ID descending (`200 OK`).
- `TC-GU-06`: Limit results per page (`200 OK`).
- `TC-GU-07`: Missing query params (`200 OK`).
- `TC-GU-08`: Negative page value handling (`400/500`).
- `TC-GU-09`: Invalid sort column handling (`200/400`).
- `TC-GU-10`: No overlapping pages (`200 OK`).
- `TC-GU-11`: Missing token (`401/406`).
- `TC-GU-12`: Invalid token (`401/406`).
- `TC-GU-13`: Standard user forbidden (`403 Forbidden`).

#### Get User By ID ([get-user-by-id.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/get-user-by-id.spec.ts))
- `TC-GI-01`: Admin fetches any user by ID (`200 OK`).
- `TC-GI-02`: User fetches own profile (`200 OK`).
- `TC-GI-03`: Non-existent user ID (`409 Conflict`).
- `TC-GI-04`: Invalid ID format (`400 Bad Request`).
- `TC-GI-05`: User accessing another user profile (`403 Forbidden`).
- `TC-GI-06`: Missing token (`401/406`).

#### Update User ([update-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/update-user.spec.ts))
- `TC-UU-01`: Valid Admin update (`200 OK`).
- `TC-UU-02`: Valid Owner update (`200 OK`).
- `TC-UU-03`: User not found (`409 Conflict`).
- `TC-UU-04`: Missing payload body (`400 Bad Request`).
- `TC-UU-05`: Validation failure (`400 Bad Request`).
- `TC-UU-06`: User updating another user (`403 Forbidden`).
- `TC-UU-07`: Missing token (`401/406`).
- `TC-UU-08`: Expired/invalid token (`403/406`).

#### Delete User ([delete-user.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/delete-user.spec.ts))
- `TC-DU-01`: Valid Admin deletion (`200 OK`).
- `TC-DU-02`: Delete non-existent user (`409 Conflict`).
- `TC-DU-03`: Idempotency check on deleted user (`500/409`).
- `TC-DU-04`: Standard user forbidden from deleting (`403 Forbidden`).
- `TC-DU-05`: Missing token (`401/406`).

#### Upload Avatar ([upload-avatar.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-avatar.spec.ts))
- `TC-AVT-01`: Owner uploads valid PNG avatar (`200 OK`).
- `TC-AVT-02`: Admin uploads avatar for target user (`200 OK`).
- `TC-AVT-03`: Missing avatar payload (`400/406`).
- `TC-AVT-04`: Non-image file type upload (`400/415/500`).
- `TC-AVT-05`: User updating another user avatar (`403 Forbidden`).
- `TC-AVT-06`: Missing token (`401/406`).

#### Upload CSV ([upload-csv.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/upload-csv.spec.ts))
- `TC-CSV-01`: Owner profile update via CSV (`200 OK`).
- `TC-CSV-02`: Admin profile update via CSV (`200 OK`).
- `TC-CSV-03`: Missing CSV payload (`400/406`).
- `TC-CSV-04`: Invalid CSV headers (`400/406`).
- `TC-CSV-05`: User updating another user profile via CSV (`403 Forbidden`).
- `TC-CSV-06`: Missing token (`401/406`).

#### Export Users ([export-users.spec.ts](file:///home/huycao/Desktop/intern-project/Playwright-Test/tests/API/crud/export-users.spec.ts))
- `TC-EXP-01`: Admin exports user list (`200 OK`).
- `TC-EXP-02`: Standard user forbidden from exporting (`403 Forbidden`).
- `TC-EXP-03`: Missing token (`401/406`).

---

## 3. Summary Count Table

| Test Suite | Total Tests | Smoke Tests (`@smoke`) | Regression Tests (`@regression`) |
| --- | --- | --- | --- |
| **System Health** | 1 | 1 | 1 |
| **Auth (Login & DDT)** | 19 | 3 | 19 |
| **Auth (Register)** | 8 | 1 | 8 |
| **CRUD (Create User)** | 8 | 1 | 8 |
| **CRUD (Get Users List)** | 13 | 1 | 13 |
| **CRUD (Get User By ID)** | 6 | 2 | 6 |
| **CRUD (Update User)** | 8 | 2 | 8 |
| **CRUD (Delete User)** | 5 | 1 | 5 |
| **CRUD (Upload Avatar)** | 6 | 1 | 6 |
| **CRUD (Upload CSV)** | 6 | 1 | 6 |
| **CRUD (Export Users)** | 3 | 1 | 3 |
| **Total** | **83** | **15** | **83** |

---

## 4. Execution Commands

### Running Smoke Tests Only

```bash
npx playwright test --grep '@smoke'
```

### Running Full Regression Suite

```bash
npx playwright test --grep '@regression'
```

### Combining Tags in Test Annotations

In your Playwright spec files, tag tests using either title tags or option tags:

```typescript
// Example Title Tagging:
test('TC-LOG-01: Valid user login @smoke @regression', async ({ authService }) => { ... });

// Example Option Tagging:
test('TC-LOG-01: Valid user login', { tag: ['@smoke', '@regression'] }, async ({ authService }) => { ... });
```
