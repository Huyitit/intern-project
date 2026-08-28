import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, '/dashboard');
  }

  async gotoManageUsers(): Promise<void> {
    await this.dashboardManageUsersLink.click();
  }

  async gotoCreateUser(): Promise<void> {
    await this.dashboardCreateUserLink.click();
  }

  async gotoProfile(): Promise<void> {
    await this.dashboardProfileLink.click();
  }

  async gotoUploadAvatar(): Promise<void> {
    await this.dashboardUploadAvatarLink.click();
  }

  async logout(): Promise<void> {
    await this.dashboardLogoutButton.click();
  }
}