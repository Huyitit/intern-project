# REST API design

## Summarise

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /users?page=1&limit=10&keyword=a&sortBy=id&order=asc | Get users (pagination) |
| GET | /users/export | Export users (slow) |
| GET | /users/{id} | Get user by id |
| POST | /auth/register | Register |
| POST | /auth/login | Login |
| POST | /users | Create a new user |
| POST | /users/{id}/csv | Update a user via CSV |
| PUT | /users/{id} | Update a user |
| PUT | /users/{id}/avatar | Upload avatar |
| DELETE | /users/{id} | Delete a user |

## Base URL

localhost:3000/api

<http://localhost:3000/api>

## Authentication

JWT

## Header

Authorization: Bearer token

Content-Type: application/json  
*(Exception: `multipart/form-data` for file uploads)*

## Use cases of User Management App

| Actors | Use cases | Description |
| --- | --- | --- |
| **Admin** | | |
| | Login | Admin logs in with username and password |
| | Logout | Admin logs out |
| | Create user | Admin creates a new user |
| | View users | Admin views all users |
| | View user's detail | Admin views user's detail |
| | Export users | Admin exports all users as CSV |
| **User** | | |
| | Register | User registers for an account |
| | Login | User logs in with username and password |
| | Logout | User logs out |
| | View profile | User views their profile |
| | Update information | User update their phone, email |
| | Upload avatar | User uploads profile picture |
| | Update via CSV | User updates profile via CSV |

## API Design sorting by methods

## GET

### 1. Get users (pagination)

Endpoint: GET /users?page=1&limit=10&keyword=&sortBy=id&order=asc

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    users: [
        {
            id: number,
            full_name: string,
            username: string,
            phone: string,
            email: string,
            role: string,
            create_at: timestamp
        }
    ]
}
```

+ status: 200 OK (No users found)

```typescript
{
    success: true,
    users: [],
    message: "No more users"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 2. Export users (slow)

Endpoint: GET /users/export

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    users: [
        {
            id: number,
            full_name: string,
            username: string,
            phone: string,
            email: string,
            role: string,
            create_at: timestamp
        }
    ]
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 3. Get user by id

Endpoint: GET /users/{id}

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
    }
}
```

+ status: 409 Conflict

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

## POST

### 1. Register

Endpoint: POST /auth/register

Request's body:

```typescript
{
    user: {
        full_name: string,
        username: string,
        password: string,
        phone: string,
        email: string,
        role: string
    }
}
```

Response's body:

+ status: 201 Created

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
    }
}
```

+ status: 409 Conflict

```typescript
{
    message: "User existed"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 2. Login

Endpoint: POST /auth/login

Request's body:

```typescript
{
    user: {
        username: string,
        password: string
    }
}
```

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
    },
    token: string
}
```

+ status: 409 Conflict

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 401 Unauthorized

```typescript
{
    success: false,
    message: "Invalid password"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 3. Create a user

Endpoint: POST /users

Request's body:

```typescript
{
    user: {
        full_name: string,
        username: string,
        password: string,
        phone?: string,
        email?: string,
        role: string
    }
}
```

Response's body:

+ status: 201 Created

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string,
        create_at: timestamp
    }
}
```

+ status: 409 Conflict

```typescript
{
    success: false,
    message: "Username already exists"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 4. Update user via CSV

Endpoint: POST /users/{id}/csv

Content-Type: multipart/form-data

Request's body:

```typescript
// FormData with a single file field named 'csv'
```

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
    }
}
```

+ status: 406 Not Acceptable

```typescript
{
    message: "Please provide data to update"
}
```

+ status: 409 Conflict

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

## PUT

### 1. Update a user

Endpoint: PUT /users/{id}

Request's body:

```typescript
{
    user: {
        id: number,
        full_name: string,
        username: string,
        password?: string,
        phone?: string,
        email?: string,
        role: string
    }
}
```

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    user: {
        id: number,
        full_name: string,
        username: string,
        phone: string,
        email: string,
        role: string
    }
}
```

+ status: 406 Not Acceptable

```typescript
{
    message: "Please provide data to update"
}
```

+ status: 409 Conflict

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 2. Upload avatar

Endpoint: PUT /users/{id}/avatar

Content-Type: multipart/form-data

Request's body:

```typescript
// FormData with a single file field named 'avatar'
```

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    message: "Avatar uploaded successfully",
    avatar_url: string
}
```

+ status: 406 Not Acceptable

```typescript
{
    success: false,
    message: "No image provided"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

## DELETE

### 1. Delete a user

Endpoint: DELETE /users/{id}

Response's body:

+ status: 200 OK

```typescript
{
    success: true,
    message: "User deleted successfully"
}
```

+ status: 500

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```
