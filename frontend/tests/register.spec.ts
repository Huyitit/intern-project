import { test, expect } from '@playwright/test';

test.describe('Feature: Register', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // Helper to generate short unique strings (6 chars) to fit the 20-character limit
  const getShortUnique = () => Math.random().toString(36).substring(2, 8);

  test('TC_REG_01: should register successfully with all fields', async ({ page }) => {
    test.setTimeout(60000); // Wait for cold start if needed
    const unique = getShortUnique();
    
    // Validations: Full Name (6-20), Username (6-20), Password (6-20), Phone (10-15)
    await page.getByTestId('register-full_name-input').fill(`User ${unique}`); // 11 chars
    await page.getByTestId('register-username-input').fill(`usr_${unique}`); // 10 chars
    await page.getByTestId('register-password-input').fill('newpassword'); // 11 chars
    await page.getByTestId('register-phone-input').fill('0123456789'); // 10 chars
    await page.getByTestId('register-email-input').fill(`u_${unique}@test.com`);
    
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Output: Success message displayed. Navigated back to login page.
    await expect(page.getByText('Registration successful! Please login.')).toBeVisible({ timeout: 45000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_REG_02: should register successfully with only required fields', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Req ${unique}`);
    await page.getByTestId('register-username-input').fill(`req_${unique}`);
    await page.getByTestId('register-password-input').fill('newpassword');
    
    await page.getByRole('button', { name: 'Register' }).click();

    // Expected Output: Success message displayed. Navigated back to login page.
    await expect(page.getByText('Registration successful! Please login.')).toBeVisible({ timeout: 45000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('TC_REG_03: should not register with existing username', async ({ page }) => {
    await page.getByTestId('register-full_name-input').fill('Test User');
    await page.getByTestId('register-username-input').fill('username01');
    await page.getByTestId('register-password-input').fill('testpassword');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
  });

  test('TC_REG_04: should block submission with empty required fields', async ({ page }) => {
    await page.getByRole('button', { name: 'Register' }).click();

    const fullNameInput = page.getByTestId('register-full_name-input');
    const isValid = await fullNameInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(isValid).toBeFalsy();
  });

  test('TC_REG_05: should not register with Full Name under 6 characters', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill('Abcde'); // 5 chars
    await page.getByTestId('register-username-input').fill(`val_${unique}`);
    await page.getByTestId('register-password-input').fill('validpass');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/full name must be at least 6 characters long/i);
  });

  test('TC_REG_06: should not register with Full Name over 20 characters', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill('ThisIsAVeryLongFullName'); // 23 chars
    await page.getByTestId('register-username-input').fill(`val_${unique}`);
    await page.getByTestId('register-password-input').fill('validpass');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/at most 20 characters long/i);
  });

  test('TC_REG_07: should not register with Username under 6 characters', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
    await page.getByTestId('register-username-input').fill('user1'); // 5 chars
    await page.getByTestId('register-password-input').fill('validpass');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/username must be at least 6 characters long/i);
  });

  test('TC_REG_08: should not register with Username over 20 characters', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
    await page.getByTestId('register-username-input').fill('ThisIsAVeryLongUsername'); // 23 chars
    await page.getByTestId('register-password-input').fill('validpass');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/at most 20 characters long/i);
  });

  test('TC_REG_09: should not register with Password under 6 characters', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
    await page.getByTestId('register-username-input').fill(`val_${unique}`);
    await page.getByTestId('register-password-input').fill('pass1'); // 5 chars
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/password must be at least 6 characters long/i);
  });

  test('TC_REG_10: should not register with Phone under 10 digits', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
    await page.getByTestId('register-username-input').fill(`val_${unique}`);
    await page.getByTestId('register-password-input').fill('validpass');
    await page.getByTestId('register-phone-input').fill('12345'); // 5 chars
    
    await page.getByRole('button', { name: 'Register' }).click();

    const alert = page.locator('.Toastify__toast--error').first();
    await expect(alert).toBeVisible({ timeout: 15000 });
    await expect(alert).toContainText(/phone must be at least 10 digits long/i);
  });

  test('TC_REG_11: should not register with invalid Email format', async ({ page }) => {
    const unique = getShortUnique();
    await page.getByTestId('register-full_name-input').fill(`Name ${unique}`);
    await page.getByTestId('register-username-input').fill(`val_${unique}`);
    await page.getByTestId('register-password-input').fill('validpass');
    await page.getByTestId('register-email-input').fill('invalidemail');
    
    await page.getByRole('button', { name: 'Register' }).click();

    const emailInput = page.getByTestId('register-email-input');
    const isValid = await emailInput.evaluate((el: HTMLInputElement) => el.validity.valid);
    
    if (!isValid) {
      expect(isValid).toBeFalsy();
    } else {
      const alert = page.locator('.Toastify__toast--error').first();
      await expect(alert).toBeVisible({ timeout: 15000 });
      await expect(alert).toContainText(/Invalid email format/i);
    }
  });
});
