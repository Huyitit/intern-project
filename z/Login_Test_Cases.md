# Login Test Cases

This document contains functional E2E test cases for the User Management Application's **Login** feature, covering successful login, failed authentication, input validation, and UI state verification.

## Backend Constraint Analysis

Source: [loginUserSchema](file:///home/huycao/Desktop/intern-project/backend/src/utils/zod.schemas.ts#L18-L25), [auth.controller.ts](file:///home/huycao/Desktop/intern-project/backend/src/controllers/auth.controller.ts#L68-L133)

| Field | Type | Required | Min | Max | Format | Unique |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `username` | String | Yes | 6 | - | lowercase | Yes |
| `password` | String | Yes | 6 | - | - | No |

## Test Data Matrix

Source: [seed.ts](file:///home/huycao/Desktop/intern-project/backend/prisma/seed.ts), [EP_BVA.md](file:///home/huycao/Desktop/intern-project/.user/Document/Context/EP_BVA.md)

**Seeded accounts available for testing:**

| Account | Username | Password | Role |
| :--- | :--- | :--- | :--- |
| Admin | `admin123` | `admin123` | admin |
| User 01 | `username01` | `userpassword1` | user |

**Boundary values for login fields:**

| Field | Valid | Empty | Below Min (5 chars) | At Min (6 chars) | Above Min (7 chars) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `username` | `username01` | (empty) | `user1` | `user01` | `user001` |
| `password` | `userpassword1` | (empty) | `pass1` | `pass01` | `pass001` |

## Login Test Cases

| Test Case ID | Preconditions | Scenario | Test Data | Steps | Expected Output | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| TC_LOG_01 | System has seeded user data | A. User Login - Successful (User role) | Username: `username01`<br>Password: `userpassword1` | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Enter password `userpassword1`<br>4. Click Login button | Loading spinner displayed. Toast notification: `"Login successful!"`. Navigated to Dashboard page. | High |
| TC_LOG_02 | System has seeded admin data | A. User Login - Successful (Admin role) | Username: `admin123`<br>Password: `admin123` | 1. Navigate to login page<br>2. Enter username `admin123`<br>3. Enter password `admin123`<br>4. Click Login button | Loading spinner displayed. Toast notification: `"Login successful!"`. Navigated to Dashboard page. Admin sidebar features visible (Manage Users, Create User). | High |
| TC_LOG_03 | None | A. User Login - Unregistered username | Username: `nonexistent`<br>Password: `password123` | 1. Navigate to login page<br>2. Enter username `nonexistent`<br>3. Enter password `password123`<br>4. Click Login button | Loading spinner displayed. Toast notification: `"Cannot find user"`. System remains on login page. | High |
| TC_LOG_04 | System has seeded user data | A. User Login - Incorrect password | Username: `username01`<br>Password: `wrongpassword` | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Enter password `wrongpassword`<br>4. Click Login button | Loading spinner displayed. Toast notification: `"Invalid password"`. System remains on login page. | High |
| TC_LOG_05 | None | A. User Login - Empty username and password | Username: (empty)<br>Password: (empty) | 1. Navigate to login page<br>2. Leave username field empty<br>3. Leave password field empty<br>4. Click Login button | Toast notification with validation errors: `"username must be at least 6 characters long"`, `"password must be at least 6 characters long"`. System remains on login page. | Medium |
| TC_LOG_06 | None | A. User Login - Empty username only | Username: (empty)<br>Password: `userpassword1` | 1. Navigate to login page<br>2. Leave username field empty<br>3. Enter password `userpassword1`<br>4. Click Login button | Toast notification with validation error: `"username must be at least 6 characters long"`. System remains on login page. | Medium |
| TC_LOG_07 | None | A. User Login - Empty password only | Username: `username01`<br>Password: (empty) | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Leave password field empty<br>4. Click Login button | Toast notification with validation error: `"password must be at least 6 characters long"`. System remains on login page. | Medium |
| TC_LOG_08 | None | A. User Login - Username below minimum (BVA) | Username: `user1` (5 chars)<br>Password: `userpassword1` | 1. Navigate to login page<br>2. Enter username `user1`<br>3. Enter password `userpassword1`<br>4. Click Login button | Toast notification with validation error: `"username must be at least 6 characters long"`. System remains on login page. | Medium |
| TC_LOG_09 | None | A. User Login - Password below minimum (BVA) | Username: `username01`<br>Password: `pass1` (5 chars) | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Enter password `pass1`<br>4. Click Login button | Toast notification with validation error: `"password must be at least 6 characters long"`. System remains on login page. | Medium |
| TC_LOG_10 | None | A. User Login - Username at minimum boundary (BVA) | Username: `user01` (6 chars)<br>Password: `userpassword1` | 1. Navigate to login page<br>2. Enter username `user01`<br>3. Enter password `userpassword1`<br>4. Click Login button | No validation error for username. System attempts authentication (result depends on whether `user01` exists in database). | Low |
| TC_LOG_11 | None | A. User Login - Password at minimum boundary (BVA) | Username: `username01`<br>Password: `pass01` (6 chars) | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Enter password `pass01`<br>4. Click Login button | No validation error for password. System attempts authentication. Toast notification: `"Invalid password"` (incorrect password). System remains on login page. | Low |
| TC_LOG_12 | None | A. User Login - Page initial render | None | 1. Navigate to login page | Login page displayed with: heading `"Login"`, username field with label `"Username:"`, password field with label `"Password:"`, Login button, and link `"Register here"`. | Low |
| TC_LOG_13 | None | A. User Login - Register link navigation | None | 1. Navigate to login page<br>2. Click `"Register here"` link | System navigates to Register page. Register form is displayed. | Low |
| TC_LOG_14 | None | A. User Login - Login button disabled during loading | Username: `username01`<br>Password: `userpassword1` | 1. Navigate to login page<br>2. Enter username `username01`<br>3. Enter password `userpassword1`<br>4. Click Login button<br>5. Observe button state during request | Login button text changes to `"Loading..."` and button is disabled while request is in progress. | Low |

## Decision Table Reference

Source: [EP_BVA.md - Decision Table](file:///home/huycao/Desktop/intern-project/.user/Document/Context/EP_BVA.md#L60-L78)

| Rule | Username Valid Format | Password Valid Format | Credentials Match DB | Expected Action | Covered By |
| :--- | :--- | :--- | :--- | :--- | :--- |
| R1 | True | True | True | Login Successful | TC_LOG_01, TC_LOG_02 |
| R2 | True | True | False | Invalid Credentials Error | TC_LOG_03, TC_LOG_04 |
| R3 | False | True | - | Validation Error (Username) | TC_LOG_06, TC_LOG_08 |
| R4 | True | False | - | Validation Error (Password) | TC_LOG_07, TC_LOG_09 |
| R5 | False | False | - | Validation Error (Both) | TC_LOG_05 |
