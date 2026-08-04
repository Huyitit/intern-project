import { test as base } from './auth.fixture';
import { UserService } from '../../services/user.service';
import { AuthService, TargetUserInfo } from '../../services/auth.service';
import { pool } from '../../config/db';

export interface IsolatedUserSession extends TargetUserInfo {
  service: UserService;
}

export const test = base.extend<{ 
  anonymousUser: IsolatedUserSession;
  authService: AuthService;
  isolatedUser: IsolatedUserSession;
  isolatedAdmin: IsolatedUserSession;
}>({
  anonymousUser: async ({ request }, use) => {
    const service = new UserService(request);

    const session: IsolatedUserSession = {
      token: '',
      userId: 0,
      username: "",
      service,
    };

    await use(session);
  },

  authService: async ({ request }, use) => {
    const service = new AuthService(request);
    await use(service);
  },

  isolatedUser: async ({ authService, request }, use) => {
    const userInfo = await authService.createTargetUser();
    const service = new UserService(request, userInfo.token);

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
    const userInfo = await authService.createTargetAdmin();
    const service = new UserService(request, userInfo.token);

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