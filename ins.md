In an enterprise environment, the recommended way to split API test cases is to prioritize **user role (authorization)** first, then **API method (HTTP verb)**, and finally **business scenarios**. This structure improves maintainability, traceability, and security coverage.

A common hierarchy is:

```text
API
└── Endpoint
    ├── User Role
    │   ├── GET
    │   ├── POST
    │   ├── PUT/PATCH
    │   ├── DELETE
    │   └── Other Methods (OPTIONS, HEAD, etc.)
    │
    └── Business Scenarios
        ├── Positive cases
        ├── Negative cases
        ├── Boundary cases
        ├── Validation cases
        ├── Security cases
        └── Performance cases
```

### Example

API: `/users`

#### 1. Admin Role

| API Method         | Test Cases                                          |
| ------------------ | --------------------------------------------------- |
| GET /users         | View all users, pagination, filtering               |
| POST /users        | Create valid user, duplicate email, invalid payload |
| PUT /users/{id}    | Update user successfully, invalid data              |
| DELETE /users/{id} | Delete existing user, delete non-existing user      |

#### 2. Manager Role

| API Method         | Test Cases                     |
| ------------------ | ------------------------------ |
| GET /users         | Can view department users      |
| POST /users        | Can create employee            |
| PUT /users/{id}    | Can update department employee |
| DELETE /users/{id} | Forbidden (403)                |

#### 3. Regular User

| API Method    | Test Cases         |
| ------------- | ------------------ |
| GET /users/me | View own profile   |
| PUT /users/me | Update own profile |
| GET /users    | Forbidden (403)    |
| DELETE /users | Forbidden (403)    |

---

## Enterprise test execution order

Most enterprise QA teams execute tests in this order:

| Priority | Category                   | Purpose                               |
| -------- | -------------------------- | ------------------------------------- |
| 1        | Authentication             | Verify login/token/API key            |
| 2        | Authorization (User Roles) | Verify access permissions             |
| 3        | HTTP Method                | Verify CRUD operations                |
| 4        | Input Validation           | Required fields, formats, lengths     |
| 5        | Business Rules             | Business logic correctness            |
| 6        | Error Handling             | 400, 401, 403, 404, 409, 422, 500     |
| 7        | Security                   | Injection, IDOR, privilege escalation |
| 8        | Performance                | Response time, load, stress           |
| 9        | Audit & Logging            | Logs, trace IDs, audit trails         |

---

## Recommended folder structure

```text
User API
│
├── Admin
│   ├── GET
│   │   ├── TC001_Get_All_Users
│   │   ├── TC002_Filter_Users
│   │   └── TC003_Pagination
│   │
│   ├── POST
│   ├── PUT
│   └── DELETE
│
├── Manager
│   ├── GET
│   ├── POST
│   ├── PUT
│   └── DELETE
│
└── User
    ├── GET
    ├── PUT
    └── Negative
```

---

## Why split by **Role → Method** instead of **Method → Role**?

For enterprise systems, **Role → Method** is generally preferred because:

* **Security-first**: Authorization is one of the highest-risk areas and is easier to validate when grouped by role.
* **Clear ownership**: Business permissions are usually defined by role (Admin, Manager, User, Guest).
* **Easier maintenance**: When permissions change for a role, all related tests are in one place.
* **Better traceability**: Requirements and access-control matrices are typically organized by role, making it straightforward to map tests back to requirements.

### Recommended hierarchy

```text
Role
 ├── GET
 ├── POST
 ├── PUT/PATCH
 ├── DELETE
      ├── Positive
      ├── Negative
      ├── Boundary
      ├── Security
      └── Performance
```

This structure aligns well with enterprise testing practices and RBAC (Role-Based Access Control) systems, making it easier to manage comprehensive API test suites over time.
