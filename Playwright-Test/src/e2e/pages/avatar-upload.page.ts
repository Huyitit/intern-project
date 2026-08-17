import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AvatarUploadPage extends BasePage {
  // Container & Headings
  readonly pageContainer: Locator;
  readonly heading: Locator;

  // File Upload Elements
  readonly fileInputGroup: Locator;
  readonly fileInput: Locator;

  // Preview Elements
  readonly previewGroup: Locator;
  readonly previewImg: Locator;

  // Action Buttons
  readonly uploadButton: Locator;

  constructor(page: Page) {
    super(page, '/avatar');

    // Locators based on data-testid attributes from AvatarUpload.tsx
    this.pageContainer = page.getByTestId('avatar-upload-page');
    this.heading = page.getByTestId('avatar-heading');
    this.fileInputGroup = page.getByTestId('avatar-input-group');
    this.fileInput = page.getByTestId('avatar-file-input');
    this.previewGroup = page.getByTestId('avatar-preview-group');
    this.previewImg = page.getByTestId('avatar-preview-img');
    this.uploadButton = page.getByTestId('avatar-upload-btn');
  }

  // --- Actions ---

  async setAvatarFile(
    filePath: string | string[] | { name: string; mimeType: string; buffer: Buffer }
  ): Promise<void> {
    await this.fileInput.setInputFiles(filePath);
  }

  async clickUpload(): Promise<void> {
    await this.uploadButton.click();
  }

  async uploadAvatar(
    filePath: string | string[] | { name: string; mimeType: string; buffer: Buffer }
  ): Promise<void> {
    await this.setAvatarFile(filePath);
    await this.clickUpload();
  }

  // --- Helpers & Loading Spinner Checks ---

  getToast(message: string | RegExp): Locator {
    return this.page.getByText(message).last();
  }

  async expectUploadingLoadingState(): Promise<void> {
    // 1. Verify button text changes to "Uploading..."
    await expect(this.uploadButton).toHaveText('Uploading...');
    // 2. Verify button is disabled during upload process
    await expect(this.uploadButton).toBeDisabled();
    // 3. Verify info toast notification appears
    await expect(this.getToast('Uploading avatar...')).toBeVisible();
  }

  async expectUploadCompletedState(): Promise<void> {
    // Verify button text reverts to "Upload" when complete
    await expect(this.uploadButton).toHaveText('Upload');
  }
}
