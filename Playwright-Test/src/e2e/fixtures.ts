import { test as base, expect, type Page } from '@playwright/test';
import { LoginPage } from './pages/login.page';
import { RegisterPage } from './pages/register.page';
import { DashboardPage } from './pages/dashboad.page';
import { UsersPage } from './pages/users.page';
import { ProfilePage } from './pages/profile.page';
import { AvatarUploadPage } from './pages/avatar-upload.page';
import {
  createAuthSession,
  destroyAuthSession,
  type AuthenticatedUserSession,
} from './helpers/auth.helper';

type E2EFixtures = {
  // Option fixture — select user role per describe/test block ('admin' | 'user' | 'none')
  userRole: 'admin' | 'user' | 'none';

  // Internal authenticated session fixture
  authUser: AuthenticatedUserSession | null;

  // Session metadata exposed to tests ({ id, username, role })
  authInfo: { id: number; username: string; role: 'admin' | 'user' } | null;

  // POM fixtures
  loginPage: LoginPage;
  registerPage: RegisterPage;
  dashboardPage: DashboardPage;
  usersPage: UsersPage;
  profilePage: ProfilePage;
  avatarUploadPage: AvatarUploadPage;

  // Helper fixture for multi-user/multi-role tests
  loginAs: (role: 'admin' | 'user') => Promise<{ page: Page; session: AuthenticatedUserSession }>;
};

export const test = base.extend<E2EFixtures>({
  // ── 1. Option fixture (default: unauthenticated 'none') ────────
  userRole: ['none', { option: true }],

  // ── 2. Authenticated user fixture ──────────────────────────────
  authUser: async ({ browser, userRole }, use) => {
    if (userRole === 'none') {
      await use(null);
      return;
    }

    const session = await createAuthSession(browser, userRole);
    await use(session);
    await destroyAuthSession(session);
  },

  // ── 3. Session info fixture ────────────────────────────────────
  authInfo: async ({ authUser }, use) => {
    if (!authUser) {
      await use(null);
      return;
    }
    await use({ id: authUser.id, username: authUser.username, role: authUser.role });
  },

  // ── 4. Override default page fixture ───────────────────────────
    page: async ({ context, authUser }, use) => {
      if (!authUser) {
        const defaultPage = await context.newPage();
        await use(defaultPage);
        return;
      }

      const authPage = await authUser.context.newPage();
      await use(authPage);
    },


  // ── 5. Standard POM fixtures (automatically inherit auth) ──────
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  usersPage: async ({ page }, use) => {
    await use(new UsersPage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  avatarUploadPage: async ({ page }, use) => {
    await use(new AvatarUploadPage(page));
  },

  // ── 6. Multi-role dynamic helper ───────────────────────────────
  loginAs: async ({ browser }, use) => {
    const sessions: AuthenticatedUserSession[] = [];

    await use(async (role) => {
      const session = await createAuthSession(browser, role);
      sessions.push(session);
      const page = await session.context.newPage();
      return { page, session };
    });

    for (const session of sessions) {
      await destroyAuthSession(session);
    }
  },
});

export { expect };