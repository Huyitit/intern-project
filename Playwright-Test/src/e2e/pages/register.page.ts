import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page, '/register');
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

    await this.registerFullNameInput.fill(fullNameVal);
    await this.registerUsernameInput.fill(usernameVal);
    await this.registerPasswordInput.fill(passwordVal);
    await this.registerPhoneInput.fill(phoneVal);
    await this.registerEmailInput.fill(emailVal);
    await this.registerRoleSelect.selectOption(roleVal);
    await this.registerSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
