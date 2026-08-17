import { Page, expect } from '@playwright/test';

export abstract class BasePage {
  constructor(public readonly page: Page, protected path: string) { }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
  }

  async expectPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(new RegExp(this.path));
  }
}
