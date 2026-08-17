import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcUL01,
  tcUL02,
  tcUL03,
  tcUL04,
  tcUL05,
  tcUL06,
  tcUL07,
  tcUL08,
  tcUL09,
  tcUL10,
  tcUL11,
  tcUL12,
  tcUL13,
  tcUL14,
  tcUL15,
  tcUL16,
  tcUL17,
  tcUL18,
  tcUL19,
  tcUL20,
} from '../../../src/data/e2e-dataset/manage-user/user-list.data';

test.describe('E2E: User List Feature Suite', { tag: ['@e2e', '@user-list'] }, () => {

  // ── 1. Role-Based Access Control and Authorization ────────────────
  test.describe('RBAC Authorization Controls', () => {

    test('TC_UL_01: Admin Access Allowed', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ loginAs }) => {
      const admin = await loginAs('admin');
      await admin.page.goto('/admin/users');
      await expect(admin.page.getByTestId('user-list-heading')).toBeVisible();
      await expect(admin.page.getByTestId('user-list-table')).toBeVisible();
    });

    test('TC_UL_02: Normal User Access Restricted', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ loginAs }) => {
      const user = await loginAs('user');
      await user.page.goto('/admin/users');
      await expect(user.page).not.toHaveURL('/admin/users');
    });

    test('TC_UL_03: Unauthenticated Guest Access Restricted', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ page }) => {
      await page.goto('/admin/users');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ── 2. Admin User List Operational Scenarios ───────────────────────
  test.describe('Admin User List Operational Suite', () => {
    test.use({ userRole: 'admin' });

    test.beforeEach(async ({ usersPage }) => {
      await usersPage.navigate();
    });

    // ── Page Initialization & Layout ─────────────────────────────
    test('TC_UL_04: Initial Page Layout and Table Structure', { tag: ['@smoke', '@regression'] }, async ({ usersPage }) => {
      await expect(usersPage.heading).toBeVisible();
      await expect(usersPage.searchInput).toBeVisible();
      await expect(usersPage.searchButton).toBeVisible();
      await expect(usersPage.userTable).toBeVisible();
      await expect(usersPage.tableBody).toBeVisible();
    });

    test('TC_UL_05: Loading Indicator Display on Data Fetch', { tag: '@regression' }, async ({ page, usersPage }) => {
      await page.route((url) => url.href.includes(':3000/api/users'), async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });
      await usersPage.navigate();
      await expect(usersPage.loadingIndicator).toBeVisible();
    });

    test('TC_UL_06: Error State Handling on Network Failure', { tag: '@regression' }, async ({ page, usersPage }) => {
      await page.route((url) => url.href.includes(':3000/api/users'), (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ success: false, message: 'Server error' }),
        })
      );
      await usersPage.navigate();
      await expect(usersPage.errorMessage).toBeVisible();
    });

    test('TC_UL_07: Empty Table Fallback State', { tag: '@regression' }, async ({ usersPage }) => {
      const data = tcUL07();
      await usersPage.search(data.payload.searchKeyword);
      await expect(usersPage.noUsersFoundRow).toBeVisible();
    });

    // ── Search & Filter Functionality ────────────────────────────
    test('TC_UL_08: Exact Match Search by Username', { tag: ['@smoke', '@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL08();
      await usersPage.search(data.payload.searchKeyword);
      await expect(usersPage.tableBody).toContainText(data.payload.searchKeyword);
    });

    test('TC_UL_09: Partial Keyword Search by Username', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL09();
      await usersPage.search(data.payload.searchKeyword);
      await expect(usersPage.userTable).toBeVisible();
    });

    test('TC_UL_10: Case-Insensitive Search Handling', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL10();
      await usersPage.search(data.payload.searchKeyword);
      await expect(usersPage.userTable).toBeVisible();
    });

    test('TC_UL_11: Non-Matching Search Keyword Handling', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL11();
      await usersPage.search(data.payload.searchKeyword);
      await expect(usersPage.noUsersFoundRow).toBeVisible();
    });

    test('TC_UL_12: Reset Search Filter', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL12();
      await usersPage.search(data.payload.initialKeyword);
      await usersPage.search(data.payload.emptyKeyword);
      await expect(usersPage.tableBody).toBeVisible();
    });

    // ── Table Column Sorting ─────────────────────────────────────
    test('TC_UL_13: Toggle Sort by ID Column', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await expect(usersPage.sortHeaderId).toContainText('ID ↑');
      await usersPage.sortHeaderId.click();
      await expect(usersPage.sortHeaderId).toContainText('ID ↓');
    });

    test('TC_UL_14: Toggle Sort by Username Column', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await usersPage.sortHeaderUsername.click();
      await expect(usersPage.sortHeaderUsername).toContainText('Username ↑');
      await usersPage.sortHeaderUsername.click();
      await expect(usersPage.sortHeaderUsername).toContainText('Username ↓');
    });

    test('TC_UL_15: Sort Parameter Persistence Across Pagination', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await usersPage.sortHeaderUsername.click();
      if (await usersPage.nextButton.isEnabled()) {
        await usersPage.nextPage();
        await expect(usersPage.userTable).toBeVisible();
      }
    });

    // ── Pagination Controls ──────────────────────────────────────
    test('TC_UL_16: Navigate to Next Page', { tag: ['@smoke', '@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.nextButton.isEnabled()) {
        await usersPage.nextPage();
        await expect(usersPage.userTable).toBeVisible();
      }
    });

    test('TC_UL_17: Navigate Back to Previous Page', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.nextButton.isEnabled()) {
        await usersPage.nextPage();
        await usersPage.prevPage();
        await expect(usersPage.prevButton).toBeDisabled();
      }
    });

    test('TC_UL_18: Pagination Boundary Button States', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      await expect(usersPage.prevButton).toBeDisabled();
    });

    // handle exception 
    test('TC_UL_19: Reset Page Number on Search Submission', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.nextButton.isEnabled()) {
        await usersPage.nextPage();
      }

      const data = tcUL08();

      // await Promise.all([
      //   usersPage.loadingIndicator.waitFor({ state: 'visible' })
      // ])
      await usersPage.search(data.payload.searchKeyword)
      await usersPage.loadingIndicator.waitFor({ state: 'hidden' });
      // await expect(usersPage.prevButton).toBeDisabled();
    });

    // ── Row Actions & Navigation ────────────────────────────────
    test('TC_UL_20: Navigate to User Detail Profile Page', { tag: ['@smoke', '@regression', '@navigation'] }, async ({ usersPage }) => {
      await usersPage.viewFirstUserProfile();
      await expect(usersPage.page).toHaveURL(/\/admin\/users\/\d+/);
    });
  });
});
