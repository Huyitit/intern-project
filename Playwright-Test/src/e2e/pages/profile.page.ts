import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page, '/profile');
  }

  // --- Actions (Minimal Method Set) ---

  async fillFullName(fullName: string): Promise<void> {
    await this.profileFullNameInput.fill(fullName);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.profilePhoneInput.fill(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.profileEmailInput.fill(email);
  }

  async clickUpdate(): Promise<void> {
    await this.profileUpdateProfileButton.click();
  }

  async clickUploadCSV(): Promise<void> {
    await this.profileUploadCsvButton.click();
  }

  // --- Helper Utilities ---

  async setCsvFile(filePath: string | string[]): Promise<void> {
    await this.profileCsvFileInput.setInputFiles(filePath);
  }

  getToast(message: string | RegExp): Locator {
    return this.page.getByText(message);
  }
}
