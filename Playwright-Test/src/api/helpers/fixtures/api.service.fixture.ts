import { test as base } from './auth.fixture';
import { ApiClient } from '../../clients/api.client';
import { UserService } from '../../services/user.service';
import { AuthClient } from '../../clients/auth.client';
import { AuthService } from '../../services/auth.service';
import { createTargetUser, createTargetAdmin, TargetUserInfo } from '../actions/actions';
import { pool } from '../../config/db';

export interface IsolatedUserSession extends TargetUserInfo {
  service: UserService;
}

export const test = base.extend<{ 
  // adminService: UserService; 
  // normalService: UserService;
  anonymousUser: IsolatedUserSession;
  authService: AuthService;
  isolatedUser: IsolatedUserSession;
  isolatedAdmin: IsolatedUserSession;
}>({
  // adminService: async ({ adminToken, request }, use) => {
  //   const client = new ApiClient(request, adminToken);
  //   const service = new UserService(client);

  //   await use(service);
  // },

  // normalService: async ({ userToken, request }, use) => {
  //   const client = new ApiClient(request, userToken);
  //   const service = new UserService(client);

  //   await use(service);
  // },

  anonymousUser: async ({ request }, use) => {
    const client = new ApiClient(request, '');
    const service = new UserService(client);

    const session: IsolatedUserSession = {
      token: '',
      userId: 0,
      username: "",
      service,
    };

    await use(session);
  },

  authService: async ({ request }, use) => {
    const client = new AuthClient(request);
    const service = new AuthService(client);

    await use(service);
  },

  isolatedUser: async ({ authService, request }, use) => {
    const userInfo = await createTargetUser(authService);
    const service = new UserService(new ApiClient(request, userInfo.token));

    const session: IsolatedUserSession = {
      ...userInfo,
      service,
    };

    await use(session);

    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [userInfo.userId]);
    } catch (error) {
      console.error(`[Teardown Error] Failed to clean up isolated user ID ${userInfo.userId}:`, error);
    }
  },

  isolatedAdmin: async ({ authService, request }, use) => {
    const userInfo = await createTargetAdmin(authService);
    const service = new UserService(new ApiClient(request, userInfo.token));

    const session: IsolatedUserSession = {
      ...userInfo,
      service,
    };

    await use(session);

    try {
      await pool.execute('DELETE FROM users WHERE id = ?', [userInfo.userId]);
    } catch (error) {
      console.error(`[Teardown Error] Failed to clean up isolated admin ID ${userInfo.userId}:`, error);
    }
  },
});