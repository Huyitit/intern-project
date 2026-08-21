import { test, expect } from '../../../src/e2e/fixtures';

test.describe('E2E: Dashboard - Admin Role', { tag: ['@e2e', '@dashboard'] }, () => {
  test.use({ userRole: 'admin' });

  test('admin user lands on dashboard already authenticated', async ({ dashboardPage, authInfo }) => {
    await dashboardPage.navigate();
    await expect(dashboardPage.container).toBeVisible();
    expect(authInfo).not.toBeNull();
    expect(authInfo?.role).toBe('admin');
  });

  test('admin navigate to users page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoManageUsers();

    await expect(page).toHaveURL('/admin/users')
  });

  test('admin navigate to create user page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoCreateUser();

    await expect(page).toHaveURL('/admin/users/create');

  });

  test('admin navigate to profile page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoProfile();

    await expect(page).toHaveURL('/profile')
  });

  test('admin navigate to upload avatar page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoUploadAvatar();

    await expect(page).toHaveURL('/avatar')
  });

  test('admin logout', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.logout();

    await expect(page).toHaveURL('/login');
  });
});

test.describe('E2E: Dashboard - Normal User Role', () => {
  test.use({ userRole: 'user' });

  test('normal user lands on dashboard already authenticated', async ({ dashboardPage, authInfo }) => {
    await dashboardPage.navigate();
    await expect(dashboardPage.container).toBeVisible();
    expect(authInfo).not.toBeNull();
    expect(authInfo?.role).toBe('user');
  });

  // User navigate to their page: Profile, upload avatar

  test('user navigate to profile page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoProfile();

    await expect(page).toHaveURL('/profile')
  });

  test('user navigate to upload avatar page', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.gotoUploadAvatar();

    await expect(page).toHaveURL('/avatar')
  });

  test('user logout', async ({ dashboardPage, page }) => {
    await dashboardPage.navigate();
    await dashboardPage.logout();

    await expect(page).toHaveURL('/login');
  });
});

test.describe('E2E: Multi-Role Session Test', () => {
  test('supports testing both admin and normal user in one test', async ({ loginAs }) => {
    const admin = await loginAs('admin');
    const user = await loginAs('user');

    await admin.page.goto('/dashboard');
    await user.page.goto('/dashboard');

    await expect(admin.page.getByTestId('dashboard-page')).toBeVisible();
    await expect(user.page.getByTestId('dashboard-page')).toBeVisible();
    expect(admin.session.role).toBe('admin');
    expect(user.session.role).toBe('user');
  });
});
