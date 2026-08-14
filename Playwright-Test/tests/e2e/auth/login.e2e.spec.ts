import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcLOG01,
  tcLOG02,
  tcLOG03,
  tcLOG04,
  tcLOG05,
  tcLOG06,
  tcLOG07,
  tcLOG08,
  tcLOG09,
  tcLOG10,
  tcLOG11,
} from '../../../src/data/e2e-dataset/auth/login.data';

test.describe('E2E: Login Feature Test Suite', { tag: ['@e2e', '@auth'] }, () => {
  // TC_LOG_01: User Login - Successful
  test('TC_LOG_01: User Login - Successful', { tag: ['@smoke', '@regression'] }, async ({ loginPage, page }) => {
    const data = tcLOG01();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('Login successful!')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // TC_LOG_02: Admin Login - Successful
  test('TC_LOG_02: Admin Login - Successful', { tag: ['@smoke', '@regression'] }, async ({ loginPage, page }) => {
    const data = tcLOG02();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('Login successful!')).toBeVisible();
    await expect(page).toHaveURL(/\/dashboard/);
  });

  // TC_LOG_03: User Login - Incorrect Password
  test('TC_LOG_03: User Login - Incorrect Password', { tag: '@regression' }, async ({ loginPage, page }) => {
    const data = tcLOG03();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('Invalid password')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_LOG_04: User Login - Unregistered Username
  test('TC_LOG_04: User Login - Unregistered Username', { tag: '@regression' }, async ({ loginPage, page }) => {
    const data = tcLOG04();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('Cannot find user')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_LOG_05: User Login - Empty Fields
  test('TC_LOG_05: User Login - Empty Fields', { tag: '@regression' }, async ({ loginPage }) => {
    const data = tcLOG05();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('username must be at least 6 characters long')).toBeVisible();
  });

  // TC_LOG_06: User Login - Empty Username
  test('TC_LOG_06: User Login - Empty Username', { tag: '@regression' }, async ({ loginPage }) => {
    const data = tcLOG06();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('username must be at least 6 characters long')).toBeVisible();
  });

  // TC_LOG_07: User Login - Empty Password
  test('TC_LOG_07: User Login - Empty Password', { tag: '@regression' }, async ({ loginPage }) => {
    const data = tcLOG07();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('password must be at least 6 characters long')).toBeVisible();
  });

  // TC_LOG_08: User Login - Short Username (Below 6 Chars)
  test('TC_LOG_08: User Login - Short Username', { tag: '@regression' }, async ({ loginPage }) => {
    const data = tcLOG08();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('username must be at least 6 characters long')).toBeVisible();
  });

  // TC_LOG_09: User Login - Short Password (Below 6 Chars)
  test('TC_LOG_09: User Login - Short Password', { tag: '@regression' }, async ({ loginPage }) => {
    const data = tcLOG09();
    await loginPage.navigate();
    await loginPage.login(data.payload.user.username, data.payload.user.password);

    await expect(loginPage.getToast('password must be at least 6 characters long')).toBeVisible();
  });

  // TC_LOG_10: User Login - Form Initial Render
  test('TC_LOG_10: User Login - Form Initial Render', { tag: '@regression' }, async ({ loginPage }) => {
    await loginPage.navigate();

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
  });

  // TC_LOG_11: User Login - Navigation to Register Page
  test('TC_LOG_11: User Login - Navigation to Register Page', { tag: '@regression' }, async ({ loginPage, page }) => {
    await loginPage.navigate();
    await loginPage.registerLink.click();

    await expect(page).toHaveURL(/\/register/);
  });
});
