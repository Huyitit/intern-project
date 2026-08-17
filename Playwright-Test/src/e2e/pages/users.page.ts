import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
export class UsersPage extends BasePage {
  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly exportButton: Locator;
  readonly prevButton: Locator;
  readonly nextButton: Locator;
  readonly userTable: Locator;
  readonly tableBody: Locator;
  readonly loadingIndicator: Locator;
  readonly errorMessage: Locator;
  readonly noUsersFoundRow: Locator;
  readonly sortHeaderId: Locator;
  readonly sortHeaderUsername: Locator;
  readonly firstUserViewButton: Locator;
  constructor(page: Page) {
    super(page, '/admin/users');
    this.heading = page.getByTestId('user-list-heading');
    this.searchInput = page.getByPlaceholder('Search Username...');
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.exportButton = page.getByRole('button', { name: /Export/i });
    this.prevButton = page.getByRole('button', { name: 'Previous' });
    this.nextButton = page.getByRole('button', { name: 'Next' });
    this.userTable = page.getByTestId('user-list-table');
    this.tableBody = page.getByTestId('user-list-tbody');
    this.loadingIndicator = page.getByTestId('user-list-loading');
    this.errorMessage = page.getByTestId('user-list-error');
    this.noUsersFoundRow = page.getByTestId('user-list-tr-no-users');
    this.sortHeaderId = page.getByTestId('user-list-th-id');
    this.sortHeaderUsername = page.getByTestId('user-list-th-username');
    this.firstUserViewButton = page.locator('[data-testid^="user-list-view-btn-"]').first();
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
    await this.searchInput.fill(keyword);
    await this.searchButton.click();
  }
  async sortBy(column: 'id' | 'username'): Promise<void> {
    if (column === 'id') {
      await this.sortHeaderId.click();
    } else {
      await this.sortHeaderUsername.click();
    }
  }
  async exportCSV(): Promise<void> {
    await this.exportButton.click();
  }
  async nextPage(): Promise<void> {
    await this.nextButton.click();
  }
  async prevPage(): Promise<void> {
    await this.prevButton.click();
  }
  async viewUserProfile(id: number | string): Promise<void> {
    await this.userViewButton(id).click();
  }
  async viewFirstUserProfile(): Promise<void> {
    if (await this.firstUserViewButton.isVisible()) {
      await this.firstUserViewButton.click();
    }
  }
}