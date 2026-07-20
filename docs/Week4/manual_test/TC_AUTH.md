# Authentication Test Cases (Register & Login)

This document contains test cases for the Registration and Login flows based on the defined Zod schemas.

## 1. Register (Sign Up) Flow

| ID | Precondition | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| `TC_AUTH_001` | None | 1. Go to Register page.<br>2. Enter valid `full_name` (10 chars), `username` (10 chars), `password` (10 chars), `phone` (10 digits), `email` (valid), `role` ('user').<br>3. Submit. | Account created successfully; user is redirected to login or dashboard. | High |
| `TC_AUTH_002` | None | 1. Go to Register page.<br>2. Enter valid required fields (`full_name`, `username`, `password`, `role`).<br>3. Leave optional fields `phone` and `email` blank.<br>4. Submit. | Account created successfully; missing optional fields are handled correctly. | High |
| `TC_AUTH_003` | None | 1. Enter `full_name` with 5 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "full name must be at least 6 characters long". | Medium |
| `TC_AUTH_004` | None | 1. Enter `full_name` with 21 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "full name must be at most 20 characters long". | Medium |
| `TC_AUTH_005` | None | 1. Enter `username` with 5 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "username must be at least 6 characters long". | High |
| `TC_AUTH_006` | None | 1. Enter `username` with 21 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "username must be at most 20 characters long". | Medium |
| `TC_AUTH_007` | None | 1. Enter `password` with 5 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "password must be at least 6 characters long". | High |
| `TC_AUTH_008` | None | 1. Enter `password` with 21 chars.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "password must be at most 20 characters long". | Medium |
| `TC_AUTH_009` | None | 1. Enter `phone` with 9 digits.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "phone must be at least 10 digits long". | Low |
| `TC_AUTH_010` | None | 1. Enter `phone` with 16 digits.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: "phone must be at most 15 digits long". | Low |
| `TC_AUTH_011` | None | 1. Enter invalid `email` format (e.g., `testexample.com`).<br>2. Fill other fields validly.<br>3. Submit. | Validation error for invalid email format. | Medium |
| `TC_AUTH_012` | None | 1. Enter `role` as 'admin'.<br>2. Fill other fields validly.<br>3. Submit. | Validation error: 'admin' role not allowed for public registration (only 'user'). | High |
| `TC_AUTH_013` | None | 1. Leave all fields empty.<br>2. Submit. | Validation errors displayed for all required fields (`full_name`, `username`, `password`, `role`). | High |
| `TC_AUTH_014` | User 'username01' exists | 1. Enter `username` as 'username01'.<br>2. Fill other fields validly.<br>3. Submit. | Registration fails; error indicates username already exists. | High |
| `TC_AUTH_015` | Email exists in DB | 1. Enter an `email` that is already registered.<br>2. Fill other fields validly.<br>3. Submit. | Registration fails; error indicates email already in use. | High |

## 2. Login (Sign In) Flow

| ID | Precondition | Steps | Expected Result | Priority |
| :--- | :--- | :--- | :--- | :--- |
| `TC_AUTH_016` | Registered user exists | 1. Go to Login page.<br>2. Enter valid `username` (lowercase) and `password`.<br>3. Submit. | Login successful; session/token generated, redirected to dashboard. | High |
| `TC_AUTH_017` | Registered user exists | 1. Enter valid `username` containing uppercase letters (e.g., `Username01`).<br>2. Enter valid `password` (`userpassword1`).<br>3. Submit. | System auto-converts username to lowercase (`username01`) and logs user in successfully. | Medium |
| `TC_AUTH_018` | None | 1. Enter `username` with 5 chars.<br>2. Enter valid `password`.<br>3. Submit. | Validation error: "username must be at least 6 characters long". | High |
| `TC_AUTH_019` | None | 1. Enter valid `username`.<br>2. Enter `password` with 5 chars.<br>3. Submit. | Validation error: "password must be at least 6 characters long". | High |
| `TC_AUTH_020` | Registered user exists | 1. Enter valid `username`.<br>2. Enter incorrect `password` (≥ 6 chars).<br>3. Submit. | Login fails; error indicates invalid credentials. | High |
| `TC_AUTH_021` | None | 1. Enter unregistered `username` (≥ 6 chars).<br>2. Enter any `password` (≥ 6 chars).<br>3. Submit. | Login fails; error indicates invalid credentials. | High |
| `TC_AUTH_022` | None | 1. Leave `username` empty.<br>2. Enter valid `password`.<br>3. Submit. | Validation error for missing/empty username. | High |
| `TC_AUTH_023` | None | 1. Enter valid `username`.<br>2. Leave `password` empty.<br>3. Submit. | Validation error for missing/empty password. | High |
| `TC_AUTH_024` | None | 1. Leave all fields empty.<br>2. Submit. | Validation errors displayed for both `username` and `password`. | High |
