import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcCREATE01,
  tcCREATE02,
  tcCREATE03,
  tcCREATE04,
  tcCREATE05,
} from '../../../src/data/e2e-dataset/create-user/create-user.data';

test.describe('E2E: Create User Feature Test Suite', { tag: '@e2e' }, () => {
  // ── Access Control / RBAC Scenarios ──────────────────────────────────

  test.describe('Admin Access Rights', () => {
    test.use({ userRole: 'admin' });

    test('TC_CREATE_06: Access Allowed for Admin Role', { tag: ['@smoke', '@regression'] }, async ({ userCreatePage }) => {
      await userCreatePage.navigate();
      await userCreatePage.expectPageLoaded();
    });
  });

  test.describe('User Access Rights', () => {
    test.use({ userRole: 'user' });

    test('TC_CREATE_07: Access Restricted for Normal User Role', { tag: '@regression' }, async ({ userCreatePage, page }) => {
      await userCreatePage.navigate();
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Guest Access Rights', () => {
    test.use({ userRole: 'none' });

    test('TC_CREATE_08: Access Restricted for Guest Sessions', { tag: '@regression' }, async ({ userCreatePage, page }) => {
      await userCreatePage.navigate();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ── Admin Operational Scenarios ──────────────────────────────────────

  test.describe('Admin User Management Operations', () => {
    test.use({ userRole: 'admin' });

    test.beforeEach(async ({ userCreatePage }) => {
      await userCreatePage.navigate();
      await userCreatePage.expectPageLoaded();
    });

    test('TC_CREATE_01: Successful User Creation and DB Consistency Verification', { tag: ['@smoke', '@regression'] }, async ({ userCreatePage, page }) => {
      const data = tcCREATE01();

      await userCreatePage.createUser(data.payload.user);
      await userCreatePage.clickSubmit();

      // Assert Toast and empty form state (remains on same page, inputs cleared)
      await expect(userCreatePage.getToast('User created successfully!')).toBeVisible();
      await expect(page).toHaveURL(/\/admin\/users\/create/);
      await expect(userCreatePage.fullNameInput).toHaveValue('');
      await expect(userCreatePage.usernameInput).toHaveValue('');
      await expect(userCreatePage.passwordInput).toHaveValue('');
      await expect(userCreatePage.phoneInput).toHaveValue('');
      await expect(userCreatePage.emailInput).toHaveValue('');

      // Direct Database Consistency Verification (Zero API Calling)
      await expect(data.payload.user.username).toBeCreatedUser({
        full_name: data.payload.user.full_name,
        role: data.payload.user.role,
        phone: data.payload.user.phone,
        email: data.payload.user.email,
      });
    });

    test('TC_CREATE_02: Error Response on Duplicate Username Collision', { tag: '@regression' }, async ({ userCreatePage }) => {
      const data = tcCREATE02();

      await userCreatePage.createUser(data.payload.user);
      await userCreatePage.clickSubmit();

      // Assert validation error toast and preservation of current route
      await expect(userCreatePage.getToast('Username already exists')).toBeVisible();
      await expect(userCreatePage.page).toHaveURL(/\/admin\/users\/create/);
    });

    test('TC_CREATE_03: Field Length Below Boundary Verification', { tag: '@regression' }, async ({ userCreatePage }) => {
      const data = tcCREATE03();

      await userCreatePage.createUser(data.payload.user);
      await userCreatePage.clickSubmit();

      // Assert validation boundary errors triggered by Zod schema constraints
      await expect(userCreatePage.getToast('full name must be at least 6 characters long')).toBeVisible();
      await expect(userCreatePage.getToast('username must be at least 6 characters long')).toBeVisible();
      await expect(userCreatePage.getToast('password must be at least 6 characters long')).toBeVisible();
    });

    test('TC_CREATE_04: Field Length Above Boundary Verification', { tag: '@regression' }, async ({ userCreatePage }) => {
      const data = tcCREATE04();

      await userCreatePage.createUser(data.payload.user);
      await userCreatePage.clickSubmit();

      // Assert validation boundary errors triggered by Zod schema constraints
      await expect(userCreatePage.getToast('full name must be at most 20 characters long')).toBeVisible();
      await expect(userCreatePage.getToast('username must be at most 20 characters long')).toBeVisible();
      await expect(userCreatePage.getToast('password must be at most 20 characters long')).toBeVisible();
    });

    test('TC_CREATE_05: Input Validation Format Mismatch Handling', { tag: '@regression' }, async ({ userCreatePage }) => {
      const data = tcCREATE05();

      await userCreatePage.createUser(data.payload.user);
      await userCreatePage.clickSubmit();

      // Assert format mismatch error messages
      await expect(userCreatePage.getToast('Invalid email').or(userCreatePage.getToast('Invalid email format'))).toBeVisible();
      await expect(userCreatePage.getToast('phone must be at least 10 digits long').or(userCreatePage.getToast('phone must be at most 15 digits long'))).toBeVisible();
    });
  });
});
