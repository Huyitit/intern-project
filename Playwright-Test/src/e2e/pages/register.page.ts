import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class RegisterPage extends BasePage {
  constructor(page: Page) {
    super(page, '/register');
  }

  async fillFullName(fullName: string): Promise<void> {
    await this.registerFullNameInput.fill(fullName);
  }

  async fillUsername(username: string): Promise<void> {
    await this.registerUsernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.registerPasswordInput.fill(password);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.registerPhoneInput.fill(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.registerEmailInput.fill(email);
  }

  async selectRole(role: string): Promise<void> {
    await this.registerRoleSelect.selectOption(role);
  }

  async clickSubmit(): Promise<void> {
    await this.registerSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
