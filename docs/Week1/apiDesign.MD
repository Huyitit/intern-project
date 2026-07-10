# REST API design

## Summarise

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | /users?page={number}&limit={number} | Get users (pagination) |
| GET | /users/{id} | Get user by id |
| POST | /auth/register | Register |
| POST | /auth/login | Login |
| POST | /users | Create a new user |
| PUT | /users/{id} | Update a user |
| DELETE | /users/{id} | Delete a user |

## Base URL

localhost:3000/api

<http://localhost:3000/api>

## Authentication

JWT

## Header

Authorization: Bearer token

Content-Type: application/json  

## Use cases of User Management App

| Actors | Use cases | Description |
| --- | --- | --- |
| **Admin** | | |
| | Login | Admin logs in with username and password |
| | Logout | Admin logs out |
| | Create user | Admin creates a new user |
| | View users | Admin views all users |
| | View user's detail | Admin views user's detail |
| **User** | | |
| | Register | User registers for an account |
| | Login | User logs in with username and password |
| | Logout | User logs out |
| | View profile | User views their profile |
| | Update information | User update their phone, email |

## API Design sorting by methods

## GET

### 1. Get users (pagination)

Endpoint: GET /users?page={number}&limit={number}

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

+ status: 403

```typescript
{
    success: false,
    message: "No more users"
}
```

+ status: 501

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 2. Get user by id

Endpoint: /users/{id}

Response's body:

+ status: 201

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

+ status: 404

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 501

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

## POST

### 1. Register

Endpoint: POST /api/auth/register

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

+ status: 201

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

+ status: 403

```typescript
{
    success: false,
    message: "Cannot create user"
}
```

+ status: 501

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
    data: {
        username: string,
        password: string
    }
}
```

Response's body:

+ status: 200

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

+ status: 404

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 403

```typescript
{
    success: false,
    message: "Invalid password"
}
```

+ status: 501

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

### 3. Post a user

Endpoint: POST /users

Request's body:

```typescript
    {
        user:{
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

+ status: 200

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

+ status: 400

```typescript
{
    success: false,
    message: "Username already exists"
}
```

+ status: 501

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```

## PUT

### 1. Put a user

Endpoint: PUT /users/{id}

Request's body:

```typescript
{
    user:{
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

+ status: 200

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

+ status: 404

```typescript
{
    success: false,
    message: "Cannot find user"
}
```

+ status: 501

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

+ status: 200

```typescript
{
    success: true,
    message: "User deleted successfully"
}
```

+ status: 501

```typescript
{
    success: false,
    message: "Internal Server Error"
}
```
