import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;
  readonly successToast: Locator;
  readonly roleSelect: Locator;

  constructor(page: Page) {
    super(page, '/register');
    this.fullNameInput = page.getByTestId('register-full_name-input');
    this.usernameInput = page.getByTestId('register-username-input');
    this.passwordInput = page.getByTestId('register-password-input');
    this.phoneInput = page.getByTestId('register-phone-input');
    this.emailInput = page.getByTestId('register-email-input');
    this.submitButton = page.getByTestId('register-submit-btn');
    this.loginLink = page.getByTestId('register-login-link');
    this.successToast = page.getByText('Registration successful! Please login.');
    this.roleSelect = page.getByTestId('register-role-select');
  }

  async register(data: {
    fullName?: string;
    full_name?: string;
    username?: string;
    password?: string;
    phone?: string;
    email?: string;
    role?: string;
  }): Promise<void> {
    const fullNameVal = data.full_name ?? data.fullName ?? '';
    const usernameVal = data.username ?? '';
    const passwordVal = data.password ?? '';
    const phoneVal = data.phone ?? '';
    const emailVal = data.email ?? '';
    const roleVal = data.role ?? 'user';

    await this.fullNameInput.fill(fullNameVal);
    await this.usernameInput.fill(usernameVal);
    await this.passwordInput.fill(passwordVal);
    await this.phoneInput.fill(phoneVal);
    await this.emailInput.fill(emailVal);
    await this.roleSelect.selectOption(roleVal);
    await this.submitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
