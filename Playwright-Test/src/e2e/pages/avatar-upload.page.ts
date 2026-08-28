import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class AvatarUploadPage extends BasePage {
  constructor(page: Page) {
    super(page, '/avatar');
  }

  // --- Actions ---

  async setAvatarFile(
    filePath: string | string[] | { name: string; mimeType: string; buffer: Buffer }
  ): Promise<void> {
    await this.avatarUploadFileInput.setInputFiles(filePath);
  }

  async clickUpload(): Promise<void> {
    await this.avatarUploadButton.click();
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
    await expect(this.avatarUploadButton).toHaveText('Uploading...');
    // 2. Verify button is disabled during upload process
    await expect(this.avatarUploadButton).toBeDisabled();
    // 3. Verify info toast notification appears
    await expect(this.getToast('Uploading avatar...')).toBeVisible();
  }

  async expectUploadCompletedState(): Promise<void> {
    // Verify button text reverts to "Upload" when complete
    await expect(this.avatarUploadButton).toHaveText('Upload');
  }
}
