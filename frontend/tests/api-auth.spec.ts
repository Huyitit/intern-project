import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://localhost:3000/api';

test.describe('API Authentication Feature: Register & Login', () => {

  // Helper function to generate unique user data for idempotent tests
  const generateUniqueUser = (prefix = 'user') => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 6);
    return {
      full_name: `Test ${prefix} ${randomStr}`,
      username: `${prefix}_${timestamp}_${randomStr}`,
      password: 'Password123',
      phone: '1234567890',
      email: `${prefix}_${timestamp}@test.com`,
      role: 'user'
    };
  };

  test('API-REG-001: Register with all valid fields', async ({ request }) => {
    const validUser = generateUniqueUser('allfields');
    const response = await request.post(`${API_BASE_URL}/auth/register`, {
      data: { user: validUser }
    });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toHaveProperty('id');
    expect(body.user.full_name).toBe(validUser.full_name);
    expect(body.user.username).toBe(validUser.username);
  });

  test('API-REG-002: Register with only required fields', async ({ request }) => {
    const uniqueUser = generateUniqueUser('reqfields');
    const requiredUser = {
      full_name: uniqueUser.full_name,
      username: uniqueUser.username,
      password: uniqueUser.password,
      role: 'user'
    };
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, {
      data: { user: requiredUser }
    });
    
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user).toHaveProperty('id');
    expect(body.user.username).toBe(requiredUser.username);
  });

  test('API-REG-003: Register with duplicate username', async ({ request }) => {
    const uniqueUser = generateUniqueUser('duplicate');
    
    // First, register the user to ensure it exists
    await request.post(`${API_BASE_URL}/auth/register`, { data: { user: uniqueUser } });
    
    // Attempt to register again with the same username
    const response = await request.post(`${API_BASE_URL}/auth/register`, {
      data: { user: uniqueUser }
    });
    
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.message).toBe('User existed');
  });

  test('API-REG-004: Register with missing required fields', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/register`, {
      data: { 
        user: { 
          full_name: 'No Username', 
          password: 'Password123', 
          role: 'user' 
        } 
      }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('errors');
    expect(body.errors[0].code).toBeDefined();
  });

  test('API-REG-005: Register with Full Name < 6 chars', async ({ request }) => {
    const user = generateUniqueUser('shortname');
    user.full_name = 'abc';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('full name must be at least 6 characters long'))).toBeTruthy();
  });

  test('API-REG-006: Register with Full Name > 20 chars', async ({ request }) => {
    const user = generateUniqueUser('longname');
    user.full_name = 'abcdefghijklmnopqrstuvwxyz';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('at most 20 characters long'))).toBeTruthy();
  });

  test('API-REG-007: Register with Username < 6 chars', async ({ request }) => {
    const user = generateUniqueUser('usr');
    user.username = 'usr';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('username must be at least 6 characters long'))).toBeTruthy();
  });

  test('API-REG-008: Register with Username > 20 chars', async ({ request }) => {
    const user = generateUniqueUser('longuser');
    user.username = 'thisusernameiswaytoolongtobevalid';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('at most 20 characters long'))).toBeTruthy();
  });

  test('API-REG-009: Register with Password < 6 chars', async ({ request }) => {
    const user = generateUniqueUser('shortpass');
    user.password = '123';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('password must be at least 6 characters long'))).toBeTruthy();
  });

  test('API-REG-010: Register with Password > 20 chars', async ({ request }) => {
    const user = generateUniqueUser('longpass');
    user.password = 'ThisPasswordIsWayTooLong12345';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('at most 20 characters long'))).toBeTruthy();
  });

  test('API-REG-011: Register with Phone < 10 digits', async ({ request }) => {
    const user = generateUniqueUser('shortphone');
    user.phone = '12345';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('phone must be at least 10 digits long'))).toBeTruthy();
  });

  test('API-REG-012: Register with Phone > 15 digits', async ({ request }) => {
    const user = generateUniqueUser('longphone');
    user.phone = '12345678901234567890';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('at most 15 digits long'))).toBeTruthy();
  });

  test('API-REG-013: Register with invalid email', async ({ request }) => {
    const user = generateUniqueUser('bademail');
    user.email = 'notanemail';
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('Invalid email format'))).toBeTruthy();
  });

  test('API-REG-014: Register with SQL injection in username', async ({ request }) => {
    const user = generateUniqueUser('sqlinj');
    user.username = "admin' OR 1=1--";
    
    const response = await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    // Zod validation should catch this as invalid string format if there's a regex, or at least it won't crash DB
    // Zod validation on username does not explicitly forbid SQL injection characters in Validations.MD, but it should not 500.
    expect([201, 400]).toContain(response.status());
  });

  // ==========================================
  // LOGIN TESTS
  // ==========================================

  test('API-LOG-001: Login with valid credentials', async ({ request }) => {
    const user = generateUniqueUser('validlogin');
    
    // Setup: create user
    await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: { username: user.username, password: user.password } }
    });
    
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.token).toBeDefined();
    expect(body.token.length).toBeGreaterThan(0);
    expect(body.user).toHaveProperty('id');
  });

  test('API-LOG-002: Login with unregistered username', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: { username: 'nobody_here_123', password: 'Password123' } }
    });
    
    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Cannot find user');
  });

  test('API-LOG-003: Login with incorrect password', async ({ request }) => {
    const user = generateUniqueUser('wrongpass');
    await request.post(`${API_BASE_URL}/auth/register`, { data: { user } });
    
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: { username: user.username, password: 'WrongPassword!123' } }
    });
    
    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toBe('Invalid password');
  });

  test('API-LOG-004: Login with empty fields', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: {} }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('errors');
  });

  test('API-LOG-005: Login with username < 6 chars', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: { username: 'usr', password: 'Password123' } }
    });
    
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.errors.some((e: any) => e.error_message.includes('username must be at least 6 characters long'))).toBeTruthy();
  });

  test('API-LOG-006: Login with SQL injection', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/auth/login`, {
      data: { user: { username: "admin' OR 1=1--", password: "Password123" } }
    });
    
    // Either caught by Zod (400) or simply not found (409) since Prisma prevents SQLi
    expect([400, 409]).toContain(response.status());
  });
});
