import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcREG01,
  tcREG02,
  tcREG03,
  tcREG04,
  tcREG05,
  tcREG06,
  tcREG07,
  tcREG08,
  tcREG09,
  tcREG10,
  tcREG11,
  tcREG12,
  tcREG13,
  tcREG14,
  tcREG15,
  tcREG16,
  tcREG17,
  tcREG18,
  tcREG19,
  tcREG20,
  tcREG21,
  tcREG22,
} from '../../../src/data/e2e-dataset/auth/register.data';

test.describe('E2E: Register Feature Test Suite', { tag: ['@e2e', '@auth'] }, () => {
  // TC_REG_01: Valid user registration with all fields
  test('TC_REG_01: User Register - Successful (Valid User)', { tag: ['@smoke', '@regression'] }, async ({ registerPage, page }) => {
    const data = tcREG01();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Registration successful! Please login.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_REG_02: Valid admin registration with role admin
  test('TC_REG_02: User Register - Successful (Valid Admin)', { tag: ['@smoke', '@regression'] }, async ({ registerPage, page }) => {
    const data = tcREG02();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Registration successful! Please login.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_REG_03: Valid user registration with required fields only
  test('TC_REG_03: User Register - Successful (Required Fields Only)', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG03();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Registration successful! Please login.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_REG_04: User registration with existing username
  test('TC_REG_04: User Register - Existing Username', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG04();
    if (data.user) {
      await registerPage.navigate();
      await registerPage.register(data.user);
      await expect(page).toHaveURL(/\/login/);
    }

    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('User existed')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_05: User registration with existing email
  test('TC_REG_05: User Register - Existing Email', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG05();
    if (data.user) {
      await registerPage.navigate();
      await registerPage.register(data.user);
      await expect(page).toHaveURL(/\/login/);
    }

    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('User existed')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_06: User registration with all required fields empty
  test('TC_REG_06: User Register - All Required Fields Empty', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG06();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('full name must be at least 6 characters long')).toBeVisible();
    await expect(registerPage.getToast('username must be at least 6 characters long')).toBeVisible();
    await expect(registerPage.getToast('password must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_07: User registration with missing full name
  test('TC_REG_07: User Register - Missing Full Name', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG07();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('full name must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_08: User registration with missing username
  test('TC_REG_08: User Register - Missing Username', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG08();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('username must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_09: User registration with missing password
  test('TC_REG_09: User Register - Missing Password', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG09();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('password must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_10: User registration with Full Name below min length
  test('TC_REG_10: User Register - Full Name Below Min Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG10();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('full name must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_11: User registration with Full Name above max length
  test('TC_REG_11: User Register - Full Name Above Max Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG11();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('full name must be at most 20 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_12: User registration with Username below min length
  test('TC_REG_12: User Register - Username Below Min Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG12();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('username must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_13: User registration with Username above max length
  test('TC_REG_13: User Register - Username Above Max Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG13();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('username must be at most 20 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_14: User registration with Password below min length
  test('TC_REG_14: User Register - Password Below Min Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG14();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('password must be at least 6 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_15: User registration with Password above max length
  test('TC_REG_15: User Register - Password Above Max Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG15();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('password must be at most 20 characters long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_16: User registration with Phone below min length
  test('TC_REG_16: User Register - Phone Below Min Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG16();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('phone must be at least 10 digits long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_17: User registration with Phone above max length
  test('TC_REG_17: User Register - Phone Above Max Length', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG17();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('phone must be at most 15 digits long')).toBeVisible();
    await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_18: User registration with invalid email format
  test('TC_REG_18: User Register - Invalid Email Format', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG18();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Invalid email').or(registerPage.getToast('Invalid email format'))).toBeVisible();
      await expect(page).toHaveURL(/\/register/);
  });

  // TC_REG_19: Register page initial render
  test('TC_REG_19: User Register - Form Initial Render', { tag: '@regression' }, async ({ registerPage }) => {
    await registerPage.navigate();

    await expect(registerPage.fullNameInput).toBeVisible();
    await expect(registerPage.usernameInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible();
    await expect(registerPage.phoneInput).toBeVisible();
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.submitButton).toBeVisible();
    await expect(registerPage.loginLink).toBeVisible();
  });

  // TC_REG_20: Navigation to Login page
  test('TC_REG_20: User Register - Navigation to Login Page', { tag: '@regression' }, async ({ registerPage, page }) => {
    await registerPage.navigate();
    await registerPage.loginLink.click();

    await expect(page).toHaveURL(/\/login/);
  });

  // TC_REG_21: User Register - Choose Role User
  test('TC_REG_21: User Register - Choose Role User', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG21();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Registration successful! Please login.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  // TC_REG_22: User Register - Choose Role Admin
  test('TC_REG_22: User Register - Choose Role Admin', { tag: '@regression' }, async ({ registerPage, page }) => {
    const data = tcREG22();
    await registerPage.navigate();
    await registerPage.register(data.payload.user);

    await expect(registerPage.getToast('Registration successful! Please login.')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });
});
