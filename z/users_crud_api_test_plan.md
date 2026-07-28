# User Management API Test Scenarios (`/api/users`)

**Project**: User Management Application (Backend Service)
**Module**: User CRUD Operations (`GET`, `POST`, `PUT`, `DELETE /api/users`)
**Role**: Senior QA Automation Engineer
**Base URL**: `http://localhost:3000/api`
**Authentication**: JWT Bearer Token via `Authorization: Bearer <token>` header
**Roles**: `admin` (full CRUD access), `user` (own-profile access only)

**Standardized Error Response Schema**:

```typescript
{
  success: false,
  message?: string,             // optional top-level summary
  errors: [{ code: string, message: string }]  // required array
}
```

---

## 1. GET /api/users - List Users (Pagination, Search, Sort)

**Access**: Admin only (`authenticate` + `checkAdminRole`)

### 1.1 Functional Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-GU-01** | **Valid Request**: Fetch first page of users with default params | `GET /api/users?page=1&limit=10&keyword=&sortBy=id&order=asc` | `200 OK` | **1.** `success: true`. **2.** `users` is a non-empty array. **3.** Each user object contains `id`, `full_name`, `username`, `phone`, `email`, `role`, `create_at`. **4.** All returned users have `role: "user"`. |
| **TC-GU-02** | **Empty Result**: Fetch a page beyond available data | `GET /api/users?page=9999&limit=10&keyword=&sortBy=id&order=asc` | `200 OK` | **1.** `success: true`. **2.** `users: []` (empty array). **3.** `message: "No more users"`. |
| **TC-GU-03** | **Search by Keyword**: Filter users by username substring | `GET /api/users?page=1&limit=10&keyword=admin&sortBy=id&order=asc` | `200 OK` | **1.** `success: true`. **2.** Every returned user's `username` contains the keyword `"admin"`. |
| **TC-GU-04** | **Sort Ascending**: Sort users by `username` in ascending order | `GET /api/users?page=1&limit=10&keyword=&sortBy=username&order=asc` | `200 OK` | **1.** `success: true`. **2.** Users array is sorted alphabetically by `username` (A to Z). |
| **TC-GU-05** | **Sort Descending**: Sort users by `id` in descending order | `GET /api/users?page=1&limit=10&keyword=&sortBy=id&order=desc` | `200 OK` | **1.** `success: true`. **2.** Users array is sorted by `id` descending (highest first). |
| **TC-GU-06** | **Pagination Limit**: Verify `limit` parameter caps results | `GET /api/users?page=1&limit=2&keyword=&sortBy=id&order=asc` | `200 OK` | **1.** `success: true`. **2.** `users.length <= 2`. |

### 1.2 Pagination & Query Parameter Edge Cases

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-GU-07** | **Missing Query Params**: Omit all query parameters | `GET /api/users` | `500` or `200` | **1.** Verify the server does not crash. **2.** If `500`, validate error body: `success: false`, `errors` array with `code: "server_error"`. |
| **TC-GU-08** | **Invalid Page Number**: Use negative page value | `GET /api/users?page=-1&limit=10&keyword=&sortBy=id&order=asc` | `400` or `500` | **1.** Verify the server handles gracefully without crashing. |
| **TC-GU-09** | **Invalid Sort Column**: Use a non-existent column for `sortBy` | `GET /api/users?page=1&limit=10&keyword=&sortBy=nonexistent&order=asc` | `500` | **1.** Verify the server returns error gracefully. **2.** `success: false`. |
| **TC-GU-10** | **Pagination Consistency**: Fetch page 1 and page 2 and verify no overlap | `GET /api/users?page=1&limit=5...` then `GET /api/users?page=2&limit=5...` | `200 OK` | **1.** No user `id` appears in both pages. **2.** Combined count matches total available (up to 10). |

### 1.3 Authentication & Authorization Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-GU-11** | **No Token**: Access without Authorization header | `GET /api/users?page=1&limit=10&keyword=&sortBy=id&order=asc` (no `Authorization` header) | `406` | **1.** `success: false`. **2.** `errors` array with `code: "auth_required"`, `message: "Token is required"`. |
| **TC-GU-12** | **Invalid Token**: Access with malformed/expired JWT | `GET /api/users?...` with `Authorization: Bearer invalid.token.here` | `403` | **1.** `success: false`. **2.** `errors` array with `code: "auth_invalid"`, `message: "Token is expired or invalid"`. |
| **TC-GU-13** | **User Role Forbidden**: Standard user attempts to list all users | `GET /api/users?...` with valid user-role JWT | `403` | **1.** `success: false`. **2.** `errors` array with `code: "forbidden"`, `message: "You do not have permission to perform this action"`. |

---

## 2. GET /api/users/:id - Get User by ID

**Access**: Owner or Admin (`authenticate` + `checkOwnerOrAdmin`)

### 2.1 Functional Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-GI-01** | **Valid Request (Admin)**: Admin fetches any user by ID | `GET /api/users/1` with admin JWT | `200 OK` | **1.** `success: true`. **2.** `user` object contains `id`, `full_name`, `username`, `phone`, `email`, `role`. **3.** `user.id` matches the requested ID. |
| **TC-GI-02** | **Valid Request (Owner)**: User fetches their own profile | `GET /api/users/{ownId}` with own user JWT | `200 OK` | **1.** `success: true`. **2.** Returned `user.id` matches the authenticated user's ID. |
| **TC-GI-03** | **User Not Found**: Fetch a non-existent user ID | `GET /api/users/99999` with admin JWT | `409` | **1.** `success: false`. **2.** `errors` array with `code: "not_found"`, `message: "Cannot find user"`. |
| **TC-GI-04** | **Invalid ID Format**: Use a non-numeric ID | `GET /api/users/abc` with admin JWT | `500` | **1.** Verify the server does not crash with an unhandled exception. |

### 2.2 Role-Based Authorization Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-GI-05** | **User Accessing Another User**: Standard user tries to view another user's profile | `GET /api/users/{otherId}` with user JWT (where `otherId != ownId`) | `403` | **1.** `success: false`. **2.** `errors` array with `code: "forbidden"`, `message: "You do not have permission to update this profile"`. |
| **TC-GI-06** | **No Token**: Access without Authorization header | `GET /api/users/1` (no header) | `406` | **1.** `success: false`. **2.** `errors` array with `code: "auth_required"`, `message: "Token is required"`. |

---

## 3. POST /api/users - Create User

**Access**: Admin only (`authenticate` + `checkAdminRole` + `validate(registerUserSchema)`)

### 3.1 Functional Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CU-01** | **Valid Creation**: Admin creates a new user with all valid fields | `POST /api/users` with body `{ "user": { "full_name": "Test User", "username": "testuser01", "password": "pass123456", "phone": "0912345678", "email": "test@example.com", "role": "user" } }` | `201 Created` | **1.** `success: true`. **2.** `user` object contains `id`, `full_name`, `username`, `phone`, `email`, `role`, `create_at`. **3.** `user.username` matches input. **4.** No `password` or `hashed_password` in response. |
| **TC-CU-02** | **Duplicate Username**: Create user with an already existing username | `POST /api/users` with duplicate `username` | `409` | **1.** `success: false`. **2.** `errors` array with `code: "conflict"`, `message: "Username already exists"`. |
| **TC-CU-03** | **Missing Required Fields**: Omit `username` from body | `POST /api/users` with body missing `username` | `400` | **1.** `success: false`. **2.** `errors` array contains validation issue for `username`. |
| **TC-CU-04** | **Short Fields**: Use values below minimum length | `POST /api/users` with `username: "ab"`, `password: "12"` | `400` | **1.** `success: false`. **2.** `errors` array contains min-length validation messages. |
| **TC-CU-05** | **Invalid Email Format**: Use malformed email | `POST /api/users` with `email: "not-an-email"` | `400` | **1.** `success: false`. **2.** `errors` array with `code: "invalid_email"`, `message` describing email format error. |
| **TC-CU-06** | **Missing `user` Wrapper**: Send flat payload without `user` object | `POST /api/users` with body `{ "full_name": "...", "username": "..." }` | `400` | **1.** `success: false`. **2.** `errors` array with `code: "invalid_type"`, `message` describing missing `user` wrapper. |

### 3.2 Role-Based Authorization Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-CU-07** | **User Role Forbidden**: Standard user attempts to create a user | `POST /api/users` with valid user-role JWT | `403` | **1.** `success: false`. **2.** `errors` array with `code: "forbidden"`, `message: "You do not have permission to perform this action"`. |
| **TC-CU-08** | **No Token**: Request without Authorization header | `POST /api/users` (no header) | `406` | **1.** `success: false`. **2.** `errors` array with `code: "auth_required"`, `message: "Token is required"`. |

---

## 4. PUT /api/users/:id - Update User

**Access**: Owner or Admin (`authenticate` + `checkOwnerOrAdmin` + `validate(userSchema)`)

### 4.1 Functional Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UU-01** | **Valid Update (Admin)**: Admin updates any user's full_name | `PUT /api/users/{id}` with body `{ "user": { "id": {id}, "full_name": "Updated Name", "username": "...", "role": "user" } }` | `200 OK` | **1.** `success: true`. **2.** `user.full_name` matches the updated value. |
| **TC-UU-02** | **Valid Update (Owner)**: User updates their own profile | `PUT /api/users/{ownId}` with own JWT and valid body | `200 OK` | **1.** `success: true`. **2.** Updated fields reflect in response. |
| **TC-UU-03** | **User Not Found**: Update a non-existent user | `PUT /api/users/99999` with admin JWT and body containing `{ "user": { "id": 99999, ... } }` | `409` | **1.** `success: false`. **2.** `errors` array with `code: "not_found"`, `message: "Cannot find user"`. |
| **TC-UU-04** | **Missing Body**: Send request with no `user` object | `PUT /api/users/{id}` with empty body `{}` | `400` | **1.** `success: false`. **2.** `errors` array with `code: "invalid_type"`, `message` describing missing user wrapper. |
| **TC-UU-05** | **Validation Failure**: Send fields below minimum length | `PUT /api/users/{id}` with `full_name: "AB"` | `400` | **1.** `success: false`. **2.** `errors` array with min-length validation messages. |

### 4.2 Role-Based Authorization Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-UU-06** | **User Updating Another User**: Standard user tries to update a different user's profile | `PUT /api/users/{otherId}` with user JWT | `403` | **1.** `success: false`. **2.** `errors` array with `code: "forbidden"`, `message: "You do not have permission to update this profile"`. |
| **TC-UU-07** | **No Token**: Request without Authorization header | `PUT /api/users/{id}` (no header) | `406` | **1.** `success: false`. **2.** `errors` array with `code: "auth_required"`, `message: "Token is required"`. |
| **TC-UU-08** | **Expired Token**: Use an expired JWT | `PUT /api/users/{id}` with expired token | `403` | **1.** `success: false`. **2.** `errors` array with `code: "auth_invalid"`, `message: "Token is expired or invalid"`. |

---

## 5. DELETE /api/users/:id - Delete User

**Access**: Admin only (`authenticate` + `checkAdminRole`)

### 5.1 Functional Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-DU-01** | **Valid Deletion**: Admin deletes an existing user | `DELETE /api/users/{id}` with admin JWT | `200 OK` | **1.** `success: true`. **2.** `message: "User deleted successfully"`. **3.** Subsequent `GET /api/users/{id}` returns `409`. |
| **TC-DU-02** | **Delete Non-Existent User**: Admin deletes a user that does not exist | `DELETE /api/users/99999` with admin JWT | `500` | **1.** `success: false`. **2.** `errors` array with `code: "server_error"`, `message: "Internal Server Error"`. |
| **TC-DU-03** | **Idempotency Check**: Delete the same user twice | `DELETE /api/users/{id}` twice in sequence with admin JWT | 1st: `200`, 2nd: `500` | **1.** First call succeeds. **2.** Second call returns error (user already deleted). |

### 5.2 Role-Based Authorization Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Expected Response / Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-DU-04** | **User Role Forbidden**: Standard user attempts to delete a user | `DELETE /api/users/{id}` with user-role JWT | `403` | **1.** `success: false`. **2.** `errors` array with `code: "forbidden"`, `message: "You do not have permission to perform this action"`. |
| **TC-DU-05** | **No Token**: Request without Authorization header | `DELETE /api/users/{id}` (no header) | `406` | **1.** `success: false`. **2.** `errors` array with `code: "auth_required"`, `message: "Token is required"`. |

---

## 6. Cross-Cutting Concerns & Security Tests

| Test Case ID | Test Scenario | Request Detail | Expected Status | Validation Points |
| :--- | :--- | :--- | :--- | :--- |
| **TC-SEC-01** | **SQL Injection in Search**: Inject SQL via `keyword` query param | `GET /api/users?page=1&limit=10&keyword=' OR 1=1 --&sortBy=id&order=asc` with admin JWT | `200` or `500` | **1.** Server does not expose database error stack traces. **2.** No unauthorized data leakage. |
| **TC-SEC-02** | **XSS in User Input**: Create user with script tag in `full_name` | `POST /api/users` with `full_name: "<script>alert(1)</script>"` | `201` or `400` | **1.** If stored, verify the value is sanitized or escaped on retrieval. |
| **TC-SEC-03** | **Password Not Exposed**: Verify `hashed_password` is never returned | All `GET` and `POST /api/users` responses | Any success status | **1.** Response body must never contain `password` or `hashed_password` fields. |
| **TC-SEC-04** | **Role Escalation**: User tries to set `role: "admin"` via update | `PUT /api/users/{ownId}` with body containing `role: "admin"` | `400` | **1.** Zod schema rejects `role: "admin"` for user-created updates. **2.** If accepted, verify role is not actually changed in DB. |

---

## 7. Test Environment & Prerequisites

| Item | Detail |
| :--- | :--- |
| **Base URL** | `http://localhost:3000/api` |
| **Admin Account** | Seeded admin account (`username: admin123`, `password: admin123`) |
| **User Account** | Dynamically registered via `POST /api/auth/register` in `beforeAll` hook |
| **Authentication** | Login via `POST /api/auth/login` to obtain JWT token |
| **Headers** | `Content-Type: application/json`, `Authorization: Bearer <token>` |
| **Test Framework** | Playwright Test (`@playwright/test`) |
| **Data Generation** | `UserDataGenerator` (faker-based) for dynamic test payloads |
| **Schema Validation** | Zod schemas validated via `expectSchema()` assertion helper |

---

## 8. Implementation Notes for Playwright

- **Token Management**: Login as admin and user in `beforeAll` hooks. Store tokens for reuse across tests. Use admin token for admin-only endpoints, user token for owner-only and forbidden tests.
- **Test Isolation**: Each `POST` (create) test should generate unique usernames using `UserDataGenerator.validUsername()` to avoid conflicts across parallel runs.
- **Cleanup Strategy**: Use `afterAll` hooks to delete dynamically created test users via `DELETE /api/users/{id}` with admin token.
- **Pagination Verification**: For sort/pagination tests, create a known dataset of 5+ users in `beforeAll`, then assert ordering and page boundaries.
- **Schema Contracts**: Create Zod schemas for `getUsersResponseSchema`, `getUserByIdResponseSchema`, `createUserResponseSchema`, `updateUserResponseSchema`, and `deleteUserResponseSchema` in `auth.schema.ts` (or a new `user.schema.ts` in the Playwright project).
