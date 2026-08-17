import { type Browser, type BrowserContext } from '@playwright/test';
import { UserBuilder } from '../../data/builders/user.builder';
import { pool } from '../../core/config/db';
import { env } from '../../core/config/env';

export interface AuthenticatedUserSession {
  context: BrowserContext;
  id: number;
  username: string;
  role: 'admin' | 'user';
}

/**
 * Creates a fresh user via API, logs in via context.request (instant cookie injection),
 * and returns an authenticated BrowserContext + user details.
 */
export async function createAuthSession(
  browser: Browser,
  role: 'admin' | 'user',
): Promise<AuthenticatedUserSession> {
  const apiBaseUrl = env.baseUrl || 'http://localhost:3000';

  // 1. Generate user payload via builder
  const userPayload = role === 'admin'
    ? new UserBuilder().setValidNewAdmin().build()
    : new UserBuilder().setValidNewUser().build();

  // 2. Create context & register user via API
  const context = await browser.newContext();
  const registerRes = await context.request.post(`${apiBaseUrl}/api/auth/register`, {
    data: { user: userPayload },
  });
  const registerJson = await registerRes.json();
  const createdUser = registerJson.user;

  // 3. Update DB role if admin
  if (role === 'admin') {
    await pool.execute('UPDATE users SET role = ? WHERE id = ?', ['admin', createdUser.id]);
  }

  // 4. Authenticate via API and inject JWT token + user into context localStorage
  const loginRes = await context.request.post(`${apiBaseUrl}/api/auth/login`, {
    data: {
      user: {
        username: userPayload.username,
        password: userPayload.password,
      },
    },
  });
  const loginJson = await loginRes.json();

  if (loginJson.token && loginJson.user) {
    const token = loginJson.token;
    const userObj = loginJson.user;

    await context.addInitScript(({ token, user }) => {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(user));
    }, { token, user: userObj });
  }

  return {
    context,
    id: createdUser.id,
    username: userPayload.username,
    role,
  };
}

/**
 * Clean up context and database record after test.
 */
export async function destroyAuthSession(session: AuthenticatedUserSession): Promise<void> {
  await session.context.close();
  try {
    await pool.execute('DELETE FROM users WHERE id = ?', [session.id]);
  } catch (error) {
    console.error(`[Teardown Error] Failed to clean up test user ID ${session.id}:`, error);
  }
}
