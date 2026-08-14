import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly welcomeText: Locator;
  readonly container: Locator;
  constructor(page: Page) {
    super(page, '/dashboard');
    this.heading = page.getByRole('heading', { level: 2 });
    this.welcomeText = page.getByTestId('dashboard-welcome-text');
    this.container = page.getByTestId('dashboard-page');
  }
}