# Authentication API Testing & Defect Log Report

**Project**: User Management Application (Backend Service)  
**Module**: Authentication (`/api/auth/register` & `/api/auth/login`)  
**Role**: Senior QA Engineer  
**Execution Date**: July 22, 2026  
**Environment**: Local Node.js runtime / MySQL Database (`http://localhost:3000/api`)  
**Total Test Cases Executed**: 15  
**Passed**: 14  
**Failed / Defect Discovered**: 1 (Critical HTTP Status & Username Enumeration Vulnerability)  

---

## 1. REST API Standard Documentation

Below is the proposed RESTful API Specification for the Authentication Module, adhering to standard HTTP semantics, JSON payloads, OWASP security best practices, and standard status code conventions.

### 1.1 `POST /api/auth/register`
Creates a new user account in the system.

- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body Format**:
  ```json
  {
    "user": {
      "full_name": "John Doe",
      "username": "johndoe",
      "password": "securepassword123",
      "phone": "0912345678",
      "email": "johndoe@example.com",
      "role": "user"
    }
  }
  ```
- **Validation Rules**:
  - `full_name`: String, 6–20 characters.
  - `username`: String, 6–20 characters, unique.
  - `password`: String, 6–20 characters.
  - `phone`: String, 10–15 digits (optional).
  - `email`: Valid RFC 5322 email string (optional).
  - `role`: Enum `["user"]` (Self-registration strictly restricted to `user`).

- **Expected Responses**:
  - **`201 Created`**: User successfully created.
    ```json
    {
      "success": true,
      "user": {
        "id": 52,
        "full_name": "John Doe",
        "username": "johndoe",
        "phone": "0912345678",
        "email": "johndoe@example.com",
        "role": "user"
      }
    }
    ```
  - **`400 Bad Request`**: Input validation error (missing required fields, string length violations, invalid email format).
    ```json
    {
      "success": false,
      "message": "invalid input",
      "errors": [
        {
          "error_message": "full name must be at least 6 characters long",
          "code": "too_small"
        }
      ]
    }
    ```
  - **`409 Conflict`**: Username already registered.
    ```json
    {
      "success": false,
      "message": "Username already exists"
    }
    ```

---

### 1.2 `POST /api/auth/login`
Authenticates user credentials and issues a JSON Web Token (JWT).

- **URL**: `/api/auth/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Request Body Format**:
  ```json
  {
    "user": {
      "username": "johndoe",
      "password": "securepassword123"
    }
  }
  ```

- **Expected Responses**:
  - **`200 OK`**: Authentication successful.
    ```json
    {
      "success": true,
      "user": {
        "id": 52,
        "full_name": "John Doe",
        "username": "johndoe",
        "phone": "0912345678",
        "email": "johndoe@example.com",
        "role": "user"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
    ```
  - **`400 Bad Request`**: Validation failure (missing username or password).
  - **`401 Unauthorized`**: Authentication failed (incorrect password or user not found). *Note: Generic message should be returned to prevent account enumeration.*
    ```json
    {
      "success": false,
      "message": "Invalid username or password"
    }
    ```

---

## 2. Test Execution Information & Environment

| Parameter | Details |
| --- | --- |
| **Target Host** | `http://localhost:3000` |
| **Base Path** | `/api/auth` |
| **Database Engine** | MySQL (Connection: `mysql://root:****@localhost:3306/user_management`) |
| **Test Runner** | Custom HTTP Script (`test_auth_suite.js`) |
| **JWT Algorithm** | HS256 (Secret: `helloworld`, Expiry: 900s) |
| **Password Hashing** | Bcrypt (Salt rounds: 4) |

---

## 3. Comprehensive Manual Test Cases & Execution Results

### 3.1 User Registration (`POST /api/auth/register`)

#### TC-REG-01: Valid User Registration
- **Test Information**: Verify that a new user with valid fields can be successfully registered.
- **Steps**:
  1. Send `POST /api/auth/register` with valid `full_name`, `username`, `password`, `phone`, `email`, `role: "user"`.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Senior Tester",
      "username": "sr_tester_01",
      "password": "password123",
      "phone": "0912345678",
      "email": "sr_tester01@example.com",
      "role": "user"
    }
  }
  ```
- **Expected Response**: `HTTP 201 Created` with created user metadata (`id`, `full_name`, `username`, `phone`, `email`, `role`), excluding password fields.
- **Actual Response**: `HTTP 201 Created` (Latency: 27ms)
  ```json
  {
    "success": true,
    "user": {
      "id": 52,
      "full_name": "Senior Tester",
      "username": "sr_tester_01",
      "phone": "0912345678",
      "email": "sr_tester01@example.com",
      "role": "user"
    }
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-02: Duplicate Username Registration
- **Test Information**: Verify system behavior when attempting to register an already existing username.
- **Steps**:
  1. Re-send `POST /api/auth/register` with username `sr_tester_01`.
- **Test Data**: Same payload as `TC-REG-01`.
- **Expected Response**: `HTTP 409 Conflict` indicating username is taken.
- **Actual Response**: `HTTP 409 Conflict` (Latency: 4ms)
  ```json
  {
    "message": "User existed"
  }
  ```
- **Status**: **PASS** (Note: Inconsistent error schema format, see Bug Log).

---

#### TC-REG-03: Register with Missing Required Fields
- **Test Information**: Validate request rejection when required fields (`username`, `password`) are absent.
- **Steps**:
  1. Send `POST /api/auth/register` omitting `username` and `password`.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Incomplete User",
      "email": "incomplete@example.com",
      "role": "user"
    }
  }
  ```
- **Expected Response**: `HTTP 400 Bad Request` with array of validation error messages.
- **Actual Response**: `HTTP 400 Bad Request` (Latency: 2ms)
  ```json
  {
    "success": false,
    "message": "invalid input",
    "errors": [
      {
        "error_message": "Invalid input: expected string, received undefined",
        "code": "invalid_type"
      },
      {
        "error_message": "Invalid input: expected string, received undefined",
        "code": "invalid_type"
      }
    ]
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-04: Register with Field Length Violations (< 6 characters)
- **Test Information**: Verify validation enforcement for string length boundaries (`full_name`, `username`, `password` must be >= 6 chars).
- **Steps**:
  1. Send `POST /api/auth/register` with 3-letter strings for string fields.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Short",
      "username": "usr",
      "password": "123",
      "role": "user"
    }
  }
  ```
- **Expected Response**: `HTTP 400 Bad Request` detailing `too_small` length constraints.
- **Actual Response**: `HTTP 400 Bad Request` (Latency: 2ms)
  ```json
  {
    "success": false,
    "message": "invalid input",
    "errors": [
      {
        "error_message": "full name must be at least 6 characters long",
        "code": "too_small"
      },
      {
        "error_message": "username must be at least 6 characters long",
        "code": "too_small"
      },
      {
        "error_message": "password must be at least 6 characters long",
        "code": "too_small"
      }
    ]
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-05: Register with Invalid Email Format
- **Test Information**: Verify validation rejection for malformed email strings.
- **Steps**:
  1. Send `POST /api/auth/register` with `email: "not-an-email-address"`.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Valid Full Name",
      "username": "valid_usr_05",
      "password": "password123",
      "email": "not-an-email-address",
      "role": "user"
    }
  }
  ```
- **Expected Response**: `HTTP 400 Bad Request` indicating invalid email format.
- **Actual Response**: `HTTP 400 Bad Request` (Latency: 1ms)
  ```json
  {
    "success": false,
    "message": "invalid input",
    "errors": [
      {
        "error_message": "Invalid email address",
        "code": "invalid_format"
      }
    ]
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-06: Register with Flat JSON Payload (Unwrapped)
- **Test Information**: Test API handling when client sends flat JSON body without `{ "user": { ... } }` wrapper.
- **Steps**:
  1. Send `POST /api/auth/register` with flat JSON parameters at root level.
- **Test Data**:
  ```json
  {
    "full_name": "Flat Payload User",
    "username": "flat_user_06",
    "password": "password123",
    "role": "user"
  }
  ```
- **Expected Response**: `HTTP 400 Bad Request` indicating missing wrapper object.
- **Actual Response**: `HTTP 400 Bad Request` (Latency: 1ms)
  ```json
  {
    "success": false,
    "message": "invalid input",
    "errors": [
      {
        "error_message": "Invalid input: expected object, received undefined",
        "code": "invalid_type"
      }
    ]
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-07: Register with Role Escalation Attempt (`admin`)
- **Test Information**: Security test to ensure users cannot self-register as `admin`.
- **Steps**:
  1. Send `POST /api/auth/register` with `role: "admin"`.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Hacker Admin",
      "username": "hacker_admin",
      "password": "password123",
      "role": "admin"
    }
  }
  ```
- **Expected Response**: `HTTP 400 Bad Request` rejecting invalid role assignment.
- **Actual Response**: `HTTP 400 Bad Request` (Latency: 1ms)
  ```json
  {
    "success": false,
    "message": "invalid input",
    "errors": [
      {
        "error_message": "Invalid input: expected \"user\"",
        "code": "invalid_value"
      }
    ]
  }
  ```
- **Status**: **PASS**

---

#### TC-REG-08: Register with SQL Injection Input String
- **Test Information**: Verify that special SQL characters in `full_name` are safely handled by Prisma ORM without query injection.
- **Steps**:
  1. Send `POST /api/auth/register` containing `Test' OR '1'='1`.
- **Test Data**:
  ```json
  {
    "user": {
      "full_name": "Test' OR '1'='1",
      "username": "sqlinject_08",
      "password": "password123",
      "role": "user"
    }
  }
  ```
- **Expected Response**: `HTTP 201 Created` with string safely escaped and persisted in DB.
- **Actual Response**: `HTTP 201 Created` (Latency: 13ms)
  ```json
  {
    "success": true,
    "user": {
      "id": 53,
      "full_name": "Test' OR '1'='1",
      "username": "sqlinject_08",
      "phone": null,
      "email": null,
      "role": "user"
    }
  }
  ```
- **Status**: **PASS**

---

