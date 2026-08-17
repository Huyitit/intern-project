import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class ProfilePage extends BasePage {
  // Headings
  readonly heading: Locator;
  readonly csvSectionHeading: Locator;
  readonly manualSectionHeading: Locator;

  // CSV Upload Elements
  readonly csvFileInput: Locator;
  readonly uploadCsvButton: Locator;

  // Form Field Elements
  readonly fullNameInput: Locator;
  readonly usernameInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly updateProfileButton: Locator;

  // Status & Feedback Elements
  readonly loadingIndicator: Locator;
  readonly errorState: Locator;

  constructor(page: Page) {
    super(page, '/profile');

    // Headings
    this.heading = page.getByRole('heading', { name: 'My Profile', level: 2 });
    this.csvSectionHeading = page.getByRole('heading', { name: 'Update by CSV', level: 3 });
    this.manualSectionHeading = page.getByRole('heading', { name: 'Manual Update', level: 3 });

    // CSV Upload
    this.csvFileInput = page.locator('input[type="file"]');
    this.uploadCsvButton = page.getByRole('button', { name: /Upload CSV|Uploading\.\.\./i });

    // Form Inputs
    this.fullNameInput = page.locator('input[name="full_name"]');
    this.usernameInput = page.locator('input[name="username"]');
    this.phoneInput = page.locator('input[name="phone"]');
    this.emailInput = page.locator('input[name="email"]');
    this.updateProfileButton = page.getByRole('button', { name: /Update Profile|Saving\.\.\./i });

    // Status Indicators
    this.loadingIndicator = page.getByText('Loading profile...');
    this.errorState = page.getByText('Could not load profile');
  }

  // --- Actions (Minimal Method Set) ---

  async fillFullName(fullName: string): Promise<void> {
    await this.fullNameInput.fill(fullName);
  }

  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  async clickUpdate(): Promise<void> {
    await this.updateProfileButton.click();
  }

  async clickUploadCSV(): Promise<void> {
    await this.uploadCsvButton.click();
  }

  // --- Helper Utilities ---

  async setCsvFile(filePath: string | string[]): Promise<void> {
    await this.csvFileInput.setInputFiles(filePath);
  }

  getToast(message: string | RegExp): Locator {
    return this.page.getByText(message);
  }
}
