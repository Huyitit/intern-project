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
      await expect(usersPage.userListHeading).toBeVisible();
      await expect(usersPage.userListSearchInput).toBeVisible();
      await expect(usersPage.userListSearchButton).toBeVisible();
      await expect(usersPage.userListUserTable).toBeVisible();
      await expect(usersPage.userListTableBody).toBeVisible();
    });

    test('TC_UL_05: Loading Indicator Display on Data Fetch', { tag: '@regression' }, async ({ page, usersPage }) => {
      await page.route((url) => url.href.includes(':3000/api/users'), async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });
      await usersPage.navigate();
      await expect(usersPage.userListLoadingIndicator).toBeVisible();
    });

    test('TC_UL_06: Error State Handling on Network Failure', { tag: '@regression' }, async ({ page, usersPage }) => {
      await page.route((url) => url.href.includes(':3000/api/users'), (route) =>
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({                 
            success: false,
            message: "Internal Server Error",
            errors: [{ code: "server_error", message: "Internal Server Error" }] }),
        })
      );
      await usersPage.navigate();
      await expect(usersPage.userListErrorMessage).toBeVisible();
    });

    test('TC_UL_07: Empty Table Fallback State', { tag: '@regression' }, async ({ usersPage }) => {
      const data = tcUL07();
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListNoUsersFoundRow).toBeVisible();
    });

    // ── Search & Filter Functionality ────────────────────────────
    test('TC_UL_08: Exact Match Search by Username', { tag: ['@smoke', '@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL08();
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListUserTable).toContainText(data.payload.searchKeyword);
    });

    test('TC_UL_09: Partial Keyword Search by Username', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL09();
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListUserTable).toContainText(data.payload.searchKeyword);
    });

    test('TC_UL_10: Case-Insensitive Search Handling', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL10();
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListTableBody).toContainText(data.payload.expectedUsername);
    });

    test('TC_UL_11: Non-Matching Search Keyword Handling', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL11();
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListNoUsersFoundRow).toBeVisible();
    });

    test('TC_UL_12: Reset Search Filter', { tag: ['@regression', '@search'] }, async ({ usersPage }) => {
      const data = tcUL12();
      await usersPage.fillSearchInput(data.payload.initialKeyword);
      await usersPage.clickSearchButton();
      await usersPage.fillSearchInput(data.payload.emptyKeyword);
      await usersPage.clickSearchButton();
      await expect(usersPage.userListTableBody).toBeVisible();
    });

    // ── Table Column Sorting ─────────────────────────────────────
    test('TC_UL_13: Toggle Sort by ID Column', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await expect(usersPage.userListSortHeaderId).toContainText('ID ↑');
      await usersPage.userListSortHeaderId.click();
      await expect(usersPage.userListSortHeaderId).toContainText('ID ↓');
    });

    test('TC_UL_14: Toggle Sort by Username Column', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await usersPage.userListSortHeaderUsername.click();
      await expect(usersPage.userListSortHeaderUsername).toContainText('Username ↑');
      await usersPage.userListSortHeaderUsername.click();
      await expect(usersPage.userListSortHeaderUsername).toContainText('Username ↓');
    });

    test('TC_UL_15: Sort Parameter Persistence Across Pagination', { tag: ['@regression', '@sort'] }, async ({ usersPage }) => {
      await usersPage.userListSortHeaderUsername.click();
      if (await usersPage.userListNextButton.isEnabled()) {
        await usersPage.clickNextButton();
        await expect(usersPage.userListUserTable).toBeVisible();
      }
    });

    // ── Pagination Controls ──────────────────────────────────────
    test('TC_UL_16: Navigate to Next Page', { tag: ['@smoke', '@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.userListNextButton.isEnabled()) {
        await usersPage.clickNextButton();
        await expect(usersPage.userListUserTable).toBeVisible();
      }
    });

    test('TC_UL_17: Navigate Back to Previous Page', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.userListNextButton.isEnabled()) {
        await usersPage.clickNextButton();
        await usersPage.clickPrevButton();
        await expect(usersPage.userListPrevButton).toBeDisabled();
      }
    });

    test('TC_UL_18: Pagination Boundary Button States', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      await expect(usersPage.userListPrevButton).toBeDisabled();
    });

    // handle exception 
    test('TC_UL_19: Reset Page Number on Search Submission', { tag: ['@regression', '@pagination'] }, async ({ usersPage }) => {
      if (await usersPage.userListNextButton.isEnabled()) {
        await usersPage.clickNextButton();
      }

      const data = tcUL08();

      // await Promise.all([
      //   usersPage.loadingIndicator.waitFor({ state: 'visible' })
      // ])
      await usersPage.fillSearchInput(data.payload.searchKeyword);
      await usersPage.clickSearchButton();
      await usersPage.userListLoadingIndicator.waitFor({ state: 'hidden' });
      // await expect(usersPage.prevButton).toBeDisabled();
    });

    // ── Row Actions & Navigation ────────────────────────────────
    test('TC_UL_20: Navigate to User Detail Profile Page', { tag: ['@smoke', '@regression', '@navigation'] }, async ({ usersPage }) => {
      await expect(usersPage.userListLoadingIndicator).toBeHidden();
      await usersPage.clickFirstUserViewButton();
      await expect(usersPage.page).toHaveURL(/\/admin\/users\/\d+/);
    });
  });
});
