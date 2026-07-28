import { test as base } from './auth.fixture';
import { ApiClient } from '../../clients/api.client';
import { UserService } from '../../services/user.service';
import { AuthClient } from '../../clients/auth.client';
import { AuthService } from '../../services/auth.service';

export const test = base.extend<{ 
  adminService: UserService; 
  normalService: UserService;
  anonymousService: UserService;
  authService: AuthService;
}>({
  adminService: async ({ adminToken, request }, use) => {
    const client = new ApiClient(request, adminToken);
    const service = new UserService(client);

    await use(service);
  },

  normalService: async ({ userToken, request }, use) => {
    const client = new ApiClient(request, userToken);
    const service = new UserService(client);

    await use(service);
  },

  anonymousService: async ({ request }, use) => {
    const client = new ApiClient(request, '');
    const service = new UserService(client);

    await use(service);
  },

  authService: async ({ request }, use) => {
    const client = new AuthClient(request);
    const service = new AuthService(client);

    await use(service);
  },
});