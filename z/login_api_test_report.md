# Login API Test Scenarios (`POST /api/auth/login`)

The following test scenarios cover positive flows (token & response validation), negative flows (authentication failures), and edge cases (schema validations) for the Login API endpoint.

| Test Case ID | Test Scenario Description | Request Payload / Detail | Expected Status | Validation Points & Assertions | Environment Considerations |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC-LOG-01** | **Valid Login:** Authenticate successfully with correct username and password | `{ "user": { "username": "valid_user", "password": "valid_password" } }` | `200 OK` | **1.** Verify `user` object contains `id`, `full_name`, `username`, `phone`, `email`, `role`.<br>**2.** Verify `token` is a valid, non-empty JWT string (decode to check expiry if possible).<br>**3.** Schema validation against `loginResponseSchema`. | **Staging/Local**: Ensure the user account exists in the seed database prior to execution. |
| **TC-LOG-02** | **Auth Failure (Wrong Password):** Attempt to login with an incorrect password | `{ "user": { "username": "valid_user", "password": "wrong_password123!" } }` | `401 Unauthorized` | **1.** Verify response body does not contain a `token`.<br>**2.** Verify standardized error structure: `{ "errors": [ { "code": "...", "message": "..." } ] }`.<br>**3.** Verify error message is safely generic (e.g., "Invalid credentials"). | Ensure rate limiting isn't triggered if tests run in parallel. |
| **TC-LOG-03** | **Auth Failure (User Not Found):** Attempt to login with a non-existent username | `{ "user": { "username": "non_existent_ghost", "password": "valid_password" } }` | `401 Unauthorized` | **1.** Verify standardized error structure.<br>**2.** Verify error message matches TC-LOG-02 exactly to prevent Account Enumeration attacks (Security best practice). | N/A |
| **TC-LOG-04** | **Missing Fields (No Password):** Attempt to login without providing a password | `{ "user": { "username": "valid_user" } }` | `400 Bad Request` | **1.** Verify schema validation error array is returned.<br>**2.** `errors` array must contain an issue for missing password (`code: "invalid_type"` or similar). | N/A |
| **TC-LOG-05** | **Missing Fields (Empty Object):** Attempt to login with an empty user object | `{ "user": {} }` | `400 Bad Request` | **1.** Verify 400 Bad Request.<br>**2.** Verify `errors` array flags both missing `username` and `password`. | N/A |
| **TC-LOG-06** | **Malformed Payload (Flat Body):** Payload is missing the required `user` wrapper | `{ "username": "valid_user", "password": "valid_password" }` | `400 Bad Request` | **1.** Verify validation middleware catches the missing root property.<br>**2.** Verify no internal 500 error occurs due to null reference. | N/A |
| **TC-LOG-07** | **SQL Injection Attempt:** Attempt to bypass authentication using SQLi payload | `{ "user": { "username": "' OR '1'='1", "password": "' OR '1'='1" } }` | `401 Unauthorized` (or `400`) | **1.** Verify the ORM escapes the characters safely.<br>**2.** Ensure no internal database error stack trace (500) is returned. | Test against local DB to verify query safety. |
| **TC-LOG-08** | **Multi-Device Login:** Same user logs in sequentially from two different clients/IPs | Login Request 1, then Login Request 2 | `200 OK` | **1.** Verify both requests succeed and return valid JWT tokens.<br>**2.** Verify both tokens are valid for subsequent API calls (unless the system enforces strict single-session concurrency). | Simulate different User-Agents or IPs if possible. |

## 💡 Test Strategy & Implementation Notes for Playwright

* **Token Validation**: In Playwright, extract the returned `token` from `TC-LOG-01` and verify it has three parts separated by dots (`split('.').length === 3`), which is the standard JWT structure.
* **Schema Validation**: Reuse your Zod validation middleware wrapper `expectSchema()` against a newly created `loginResponseSchema` to ensure strict contract adherence.
* **Security Note**: As observed in typical backend architectures, make sure the backend returns the *exact same* generic error (e.g. `401 Unauthorized`, "Invalid credentials") for both **TC-LOG-02** and **TC-LOG-03**. If it returns different messages (like "User not found" vs "Wrong password"), log a security bug for **Account Enumeration**.

---

## Defect & Bug Logs

### BUG-LOG-01: Incorrect Status Code (`409 Conflict`) & Username Enumeration Vulnerability on Login

| Field | Description |
| --- | --- |
| **Bug ID** | `BUG-LOG-01` |
| **Severity** | **High** |
| **Module / Endpoint** | `POST /api/auth/login` |
| **Source Code Location** | `auth.controller.ts` (Lines ~85-95) |
| **Status** | **FIXED** (Originally returned HTTP 409) |
| **Summary** | Endpoint returns HTTP 409 Conflict with message `"Cannot find user"` when username does not exist. |
| **Steps to Reproduce** | 1. Send `POST http://localhost:3000/api/auth/login` with body `{ "user": { "username": "nonexistent_ghost", "password": "password123" } }`. |
| **Expected Behavior (REST / Security Standard)** | Endpoint should return `HTTP 401 Unauthorized` with a generic message `"Invalid credentials"` or `"Invalid username or password"`. |
| **Actual Behavior** | Returns `HTTP 409 Conflict` with `{"success": false, "message": "Cannot find user"}`. |
| **Root Cause Analysis** | In `auth.controller.ts`: `if (currentUser === null) return res.status(409).json({ success: false, message: "Cannot find user" });` |
| **Impact** | 1. **HTTP Semantics**: `409 Conflict` is meant for resource conflict state. It is incorrect for failed authentication.<br>2. **Security Vulnerability**: Attackers can harvest valid usernames by observing whether the server returns 409 ("Cannot find user") vs 401 ("Invalid password"). |
| **Recommended Fix** | Change status code from `409` to `401` and unify message: `return res.status(401).json({ success: false, message: "Invalid credentials" });` |

---

### BUG-LOG-02: Missing `errors` Array in 401/409 Authentication Responses

| Field | Description |
| --- | --- |
| **Bug ID** | `BUG-LOG-02` |
| **Severity** | **Medium** |
| **Module / Endpoint** | `POST /api/auth/login` |
| **Status** | **FIXED** (Errors array is now populated) |
| **Summary** | The `401 Unauthorized` and `409 Conflict` responses are missing the required `errors` array defined in the API contract (`authErrorResponseSchema`). |
| **Steps to Reproduce** | 1. Send `POST /api/auth/login` with invalid password.<br>2. Observe response payload. |
| **Expected Behavior** | Response should adhere to `authErrorResponseSchema`: `{"success": false, "message": "...", "errors": [{ "code": "...", "message": "..." }]}` |
| **Actual Behavior** | Response is `{ "success": false, "message": "Invalid password" }`. |
| **Impact** | Frontend API clients depending on the `errors` array structure will encounter null reference errors. |
| **Recommended Fix** | Standardize error response in `auth.controller.ts` to include the `errors` array when returning 401 or 409 responses. |
