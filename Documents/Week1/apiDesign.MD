# REST API design

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
| **Admin**
| | Login | Admin logs in with username and password |
| | Logout | Admin logs out |
| | Create user | Admin creates a new user |
| | View users | Admin views all users |
| | View user's detail | Admin views user's detail |
| **User** 
| | Register | User registers for an account |
| | Login | User logs in with username and password |
| | Logout | User logs out |
| | View profile | User views their profile |
| | Update information | User update their phone, email |

## API Design sorting by methods

## GET

### 1. Get users (pagination)

Endpoint: GET /users?page={number}&limit={number}

Request's body:
{
    page: number,
    limit: number
}
Response's body:

```typescript
{
    data: [
        {
            id: number,
            username: string,
            phone: string,
            email: string,
            role: string,
            created_at: timestamp,
            updated_at: timestamp
        }
    ]
}
```

### 2. Get user by id

Endpoint: /users/{id}

Response's body:

```typescript
{
    data: {
        id: number,
        username: string,
        phone: string,
        email: string,
        role: string,
        created_at: timestamp,
        updated_at: timestamp
    }
}
```

## POST

### 1. Register

Endpoint: POST /api/auth/register

Request's body:

```typescript
{
    username: string,
    password: string,
    phone: string,
    email: string,
    role: string
}
```

Response's body:

```typescript
{
    success: boolean,
    data: {
        id: number,
        username: string,
        phone: string,
        email: string,
        role: string
    }
}
```

### 2. Login

Endpoint: POST /auth/login

Request's body:

```typescript
{
    username: string,
    password: string
}
```

Response's body:

```typescript
{
    success: boolean,
    data: {
        id: number,
        username: string,
        phone: string,
        email: string,
        role: string
    },
    token: string
}
```

### 3. Post a user

Endpoint: POST /users

Request's body:

```typescript
{
    username: string,
    password: string,
    phone: string,
    email: string,
    role: string
}
```

Response's body:

```typescript
{
    success: boolean,
    data: {
        id: number,
        username: string,
        phone: string,
        email: string,
        role: string,
        created_at: timestamp
    }
}
```

## PUT

### 1. Put a user

Endpoint: PUT /users/{id}

Request's body:

```typescript
{
    username: string,
    phone: string,
    email: string,
    role: string
}
```

Response's body:

```typescript
{
    success: boolean,
    data: {
        id: number,
        username: string,
        phone: string,
        email: string,
        role: string,
        created_at: timestamp,
        updated_at: timestamp
    }
}
```
