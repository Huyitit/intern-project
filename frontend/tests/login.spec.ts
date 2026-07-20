import { test, expect } from '@playwright/test';

test.describe('Feature: Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('TC_LOG_01: should login with valid user credentials', async ({ page }) => {
    // Inputs are static here because this is a read-only (authentication) operation and relies on seeded data.
    await page.getByTestId('login-username-input').fill('username01');
    await page.getByTestId('login-password-input').fill('userpassword1');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Login successful!')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('TC_LOG_02: should login with valid admin credentials', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('admin123');
    await page.getByTestId('login-password-input').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page.getByText('Login successful!')).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('TC_LOG_03: should not login with unregistered username', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('nonexistent');
    await page.getByTestId('login-password-input').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_LOG_04: should not login with incorrect password', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('username01');
    await page.getByTestId('login-password-input').fill('wrongpass');
    await page.getByRole('button', { name: 'Login' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_LOG_05: should block submission with empty fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Login' }).click();
    const usernameInput = page.getByTestId('login-username-input');
    const isValid = await usernameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('TC_LOG_06: should block submission with empty username only', async ({ page }) => {
    await page.getByTestId('login-password-input').fill('userpassword1');
    await page.getByRole('button', { name: 'Login' }).click();
    const usernameInput = page.getByTestId('login-username-input');
    const isValid = await usernameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('TC_LOG_07: should block submission with empty password only', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('username01');
    await page.getByRole('button', { name: 'Login' }).click();
    const passwordInput = page.getByTestId('login-password-input');
    const isValid = await passwordInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('TC_LOG_08: should not login with username less than 6 characters', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('user1');
    await page.getByTestId('login-password-input').fill('userpassword1');
    await page.getByRole('button', { name: 'Login' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
  });

  test('TC_LOG_09: should not login with password less than 6 characters', async ({ page }) => {
    await page.getByTestId('login-username-input').fill('username01');
    await page.getByTestId('login-password-input').fill('pass1');
    await page.getByRole('button', { name: 'Login' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
  });

  test('TC_LOG_10: should display login form correctly on initial load', async ({ page }) => {
    await expect(page.getByTestId('login-username-input')).toBeVisible();
    await expect(page.getByTestId('login-password-input')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Register here' })).toBeVisible();
  });

  test('TC_LOG_11: should navigate to Register page when clicking the link', async ({ page }) => {
    await page.getByRole('link', { name: 'Register here' }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: 'Register' })).toBeVisible();
  });
});
