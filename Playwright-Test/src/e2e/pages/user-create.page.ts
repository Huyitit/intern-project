import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class UserCreatePage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin/users/create');
  }

  async expectPageLoaded(): Promise<void> {
    await this.userCreateContainer.waitFor({ state: 'visible' });
    await this.userCreateHeading.waitFor({ state: 'visible' });
  }

  async createUser(payload: {
    full_name?: string;
    username?: string;
    password?: string;
    phone?: string;
    email?: string;
  }): Promise<void> {
    if (payload.full_name !== undefined) {
      await this.userCreateFullNameInput.fill(payload.full_name);
    }
    if (payload.username !== undefined) {
      await this.userCreateUsernameInput.fill(payload.username);
    }
    if (payload.password !== undefined) {
      await this.userCreatePasswordInput.fill(payload.password);
    }
    if (payload.phone !== undefined) {
      await this.userCreatePhoneInput.fill(payload.phone);
    }
    if (payload.email !== undefined) {
      await this.userCreateEmailInput.fill(payload.email);
    }
  }

  async clickSubmit(): Promise<void> {
    await this.userCreateSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
