import { Page, expect } from '@playwright/test';
import { SelectorHelper } from '../helpers/selector.helper';

export abstract class BasePage extends SelectorHelper {
  constructor(page: Page, protected path: string) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.path));
  }
}
