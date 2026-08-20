import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class UserCreatePage extends BasePage {
  readonly container: Locator;
  readonly heading: Locator;
  readonly form: Locator;
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page, '/admin/users/create');
    this.container = page.getByTestId('user-create-page');
    this.heading = page.getByTestId('user-create-heading');
    this.form = page.getByTestId('user-create-form');
    this.fullNameInput = page.getByTestId('user-create-full_name-input');
    this.usernameInput = page.getByTestId('user-create-username-input');
    this.passwordInput = page.getByTestId('user-create-password-input');
    this.phoneInput = page.getByTestId('user-create-phone-input');
    this.emailInput = page.getByTestId('user-create-email-input');
    this.submitButton = page.getByTestId('user-create-submit-btn');
  }

  async expectPageLoaded(): Promise<void> {
    await this.container.waitFor({ state: 'visible' });
    await this.heading.waitFor({ state: 'visible' });
  }

  async createUser(payload: {
    full_name?: string;
    username?: string;
    password?: string;
    phone?: string;
    email?: string;
  }): Promise<void> {
    if (payload.full_name !== undefined) {
      await this.fullNameInput.fill(payload.full_name);
    }
    if (payload.username !== undefined) {
      await this.usernameInput.fill(payload.username);
    }
    if (payload.password !== undefined) {
      await this.passwordInput.fill(payload.password);
    }
    if (payload.phone !== undefined) {
      await this.phoneInput.fill(payload.phone);
    }
    if (payload.email !== undefined) {
      await this.emailInput.fill(payload.email);
    }
  }

  async clickSubmit(): Promise<void> {
    await this.submitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
