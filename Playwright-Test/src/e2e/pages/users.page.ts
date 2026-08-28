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
  async fillSearchInput(keyword: string): Promise<void> {
    await this.userListSearchInput.fill(keyword);
  }
  async clickSearchButton(): Promise<void> {
    await this.userListSearchButton.click();
  }
  async clickSortHeaderId(): Promise<void> {
    await this.userListSortHeaderId.click();
  }
  async clickSortHeaderUsername(): Promise<void> {
    await this.userListSortHeaderUsername.click();
  }
  async clickExportButton(): Promise<void> {
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
  async clickNextButton(): Promise<void> {
    await this.userListNextButton.click();
  }
  async clickPrevButton(): Promise<void> {
    await this.userListPrevButton.click();
  }
  async clickUserViewButton(id: number | string): Promise<void> {
    await this.userViewButton(id).click();
  }
  async clickFirstUserViewButton(): Promise<void> {
    if (await this.userListFirstUserViewButton.isVisible()) {
      await this.userListFirstUserViewButton.click();
    }
  }
  getToast(message: string | RegExp): Locator {
    return this.page.getByText(message);
  }
}