import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page, '/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.loginUsernameInput.fill(username);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
