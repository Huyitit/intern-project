import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page, '/dashboard');
  }

  async clickManageUsersLink(): Promise<void> {
    await this.dashboardManageUsersLink.click();
  }

  async clickCreateUserLink(): Promise<void> {
    await this.dashboardCreateUserLink.click();
  }

  async clickProfileLink(): Promise<void> {
    await this.dashboardProfileLink.click();
  }

  async clickUploadAvatarLink(): Promise<void> {
    await this.dashboardUploadAvatarLink.click();
  }

  async clickLogoutButton(): Promise<void> {
    await this.dashboardLogoutButton.click();
  }
}