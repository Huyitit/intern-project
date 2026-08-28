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

  async fillFullName(fullName: string): Promise<void> {
    await this.userCreateFullNameInput.fill(fullName);
  }

  async fillUsername(username: string): Promise<void> {
    await this.userCreateUsernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.userCreatePasswordInput.fill(password);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.userCreatePhoneInput.fill(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.userCreateEmailInput.fill(email);
  }

  async clickSubmit(): Promise<void> {
    await this.userCreateSubmitButton.click();
  }

  getToast(message: string): Locator {
    return this.page.getByText(message);
  }
}
