import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '/login');
  }

  async fillUsername(username: string): Promise<void> {
    await this.loginUsernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.loginPasswordInput.fill(password);
  }

  async clickSubmit(): Promise<void> {
    await this.loginSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
