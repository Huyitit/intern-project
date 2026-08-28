import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
export class UsersPage extends BasePage {
  constructor(page: Page) {
    super(page, '/admin/users');
  }
  userRow(id: number | string): Locator {
    return this.page.getByTestId(`user-list-tr-${id}`);
  }
  userUsernameCell(id: number | string): Locator {
    return this.page.getByTestId(`user-list-td-username-${id}`);
  }
  userFullNameCell(id: number | string): Locator {
    return this.page.getByTestId(`user-list-td-fullname-${id}`);
  }
  userViewButton(id: number | string): Locator {
    return this.page.getByTestId(`user-list-view-btn-${id}`);
  }
  async search(keyword: string): Promise<void> {
    await this.userListSearchInput.fill(keyword);
    await this.userListSearchButton.click();
  }
  async sortBy(column: 'id' | 'username'): Promise<void> {
    if (column === 'id') {
      await this.userListSortHeaderId.click();
    } else {
      await this.userListSortHeaderUsername.click();
    }
  }
  async exportCSV(): Promise<void> {
    await this.userListExportButton.click();
  }
  async triggerExportCSV(): Promise<import('@playwright/test').Download> {
    const downloadPromise = this.page.waitForEvent('download');
    await this.userListExportButton.click();
    return await downloadPromise;
  }
  async downloadCSV(): Promise<string> {
    const download = await this.triggerExportCSV();
    const filePath = await download.path();
    if (!filePath) {
      throw new Error('CSV download failed to retrieve file path.');
    }
    return filePath;
  }
  async nextPage(): Promise<void> {
    await this.userListNextButton.click();
  }
  async prevPage(): Promise<void> {
    await this.userListPrevButton.click();
  }
  async viewUserProfile(id: number | string): Promise<void> {
    await this.userViewButton(id).click();
  }
  async viewFirstUserProfile(): Promise<void> {
    if (await this.userListFirstUserViewButton.isVisible()) {
      await this.userListFirstUserViewButton.click();
    }
  }
  getToast(message: string | RegExp): Locator {
    return this.page.getByText(message);
  }
}