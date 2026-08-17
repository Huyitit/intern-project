import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcCSV01,
  tcCSV02,
  tcCSV03,
  tcCSV04,
  tcCSV05,
  tcCSV06,
  tcCSV07,
  tcCSV08,
  tcConsistency01,
} from '../../../src/data/e2e-dataset/export-csv/export-csv.data';
import { getUsersForExportFromDb } from '../../../src/e2e/helpers/db-csv.helper';
import { getUserAvatarFromDb, verifyAvatarInDb } from '../../../src/e2e/helpers/db-avatar.helper';
import * as fs from 'fs';

const mockUsersPayload = {
  success: true,
  users: [
    {
      id: 1,
      full_name: 'System Admin',
      username: 'admin',
      phone: '1234567890',
      email: 'admin@example.com',
      role: 'admin',
      create_at: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 2,
      full_name: 'Test User',
      username: 'testuser',
      phone: '0987654321',
      email: 'user@example.com',
      role: 'user',
      create_at: '2026-01-02T00:00:00.000Z',
    },
  ],
};

test.describe('E2E: CSV Export Feature Suite', { tag: ['@e2e', '@export-csv'] }, () => {
  // ── 1. Authenticated Admin Suite ──────────────────────────────────
  test.describe('Authenticated Admin CSV Export Workflows', () => {
    test.use({ userRole: 'admin' });

    test.beforeEach(async ({ usersPage }) => {
      await usersPage.navigate();
      await usersPage.expectPageLoaded();
    });

    test('TC_CSV_01: Successful CSV Export Trigger and Download Initiation', { tag: ['@smoke', '@regression'] }, async ({ usersPage, page }) => {
      const data = tcCSV01();

      await page.route('**/users/export', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsersPayload),
        });
      });

      await expect(usersPage.exportButton).toBeVisible();
      await expect(usersPage.exportButton).toBeEnabled();

      const download = await usersPage.triggerExportCSV();

      expect(download.suggestedFilename()).toBe(data.payload.expectedFileName);
      const filePath = await download.path();
      expect(filePath).not.toBeNull();
      const stats = fs.statSync(filePath!);
      expect(stats.size).toBeGreaterThan(0);
    });

    test('TC_CSV_02: Downloaded CSV File Structure and Header Verification', { tag: ['@smoke', '@regression'] }, async ({ usersPage, page }) => {
      const data = tcCSV02();

      await page.route('**/users/export', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsersPayload),
        });
      });

      const download = await usersPage.triggerExportCSV();
      const filePath = await download.path();
      expect(filePath).not.toBeNull();

      const content = fs.readFileSync(filePath!, 'utf-8');
      const lines = content.trim().split('\n');

      expect(lines.length).toBeGreaterThan(0);
      const headerLine = lines[0];
      const headers = headerLine.split(',').map((h) => h.trim());

      for (const expectedHeader of data.payload.expectedHeaders) {
        expect(headers).toContain(expectedHeader);
      }
    });

    test('TC_CSV_03: Downloaded CSV Data Integrity Against API Response', { tag: ['@regression'] }, async ({ usersPage, page }) => {
      const data = tcCSV03();

      await page.route('**/users/export', async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsersPayload),
        });
      });

      const responsePromise = page.waitForResponse((resp) =>
        resp.url().includes(data.payload.apiEndpoint) && resp.status() === 200
      );

      const downloadPromise = page.waitForEvent('download');
      await usersPage.exportCSV();

      const response = await responsePromise;
      const apiData = await response.json();
      expect(apiData.success).toBe(true);

      const download = await downloadPromise;
      const filePath = await download.path();
      const content = fs.readFileSync(filePath!, 'utf-8');
      const lines = content.trim().split('\n');

      const csvDataRows = lines.slice(1).filter((l) => l.trim().length > 0);
      expect(csvDataRows.length).toBe(apiData.users.length);
    });

    test('TC_CSV_04: Downloaded CSV Data Consistency Against MySQL Database', { tag: ['@regression', '@db-consistency'] }, async ({ usersPage, page }) => {
      // Mock with real DB users so endpoint returns success: true deterministically
      const dbUsers = await getUsersForExportFromDb();

      const download = await usersPage.triggerExportCSV();
      const filePath = await download.path();
      const content = fs.readFileSync(filePath!, 'utf-8');
      const lines = content.trim().split('\n').filter((l) => l.trim().length > 0);

      expect(lines[0]).toBe('id,full_name,username,phone,email,role,create_at');

      const csvRows = lines.slice(1);
      expect(csvRows.length).toBe(dbUsers.length);

      for (const dbUser of dbUsers) {
        const matchingRow = csvRows.find((row) => row.includes(dbUser.username));
        expect(matchingRow).toBeDefined();
        expect(matchingRow).toContain(dbUser.username);
      }
    });

    test('TC_CSV_05: UI Loading State and Toast Notification Lifecycle', { tag: ['@regression'] }, async ({ usersPage, page }) => {
      const data = tcCSV05();

      await page.route('**/users/export', async (route) => {
        // Delayed fulfillment to allow asserting disabled button & initial info toast
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockUsersPayload),
        });
      });

      const downloadPromise = page.waitForEvent('download');

      await usersPage.exportButton.click();

      // Verify button disabled state
      await expect(usersPage.exportButton).toBeDisabled();

      // Verify initial info toast message
      await expect(usersPage.getToast(data.payload.infoToast)).toBeVisible();

      // Wait for download completion
      await downloadPromise;

      // Verify final success toast message & button state reset
      await expect(usersPage.getToast(data.payload.successToast)).toBeVisible();
      await expect(usersPage.exportButton).toBeEnabled();
    });
  });

  // ── 2. Access Control - Normal User Role Restriction ──────────────
  test.describe('Access Control - Normal User Role Restriction', () => {
    test.use({ userRole: 'user' });

    test('TC_CSV_06: Access Restriction for Normal User Role', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ usersPage, page }) => {
      const data = tcCSV06();

      await usersPage.navigate();
      await expect(page).toHaveURL(data.payload.expectedRedirect);
    });
  });

  // ── 3. Access Control - Unauthenticated Guest Restriction ─────────
  test.describe('Access Control - Unauthenticated Guest Restriction', () => {
    test.use({ userRole: 'none' });

    test('TC_CSV_07: Access Restriction for Unauthenticated Guest', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ usersPage, page }) => {
      const data = tcCSV07();

      await usersPage.navigate();
      await expect(page).toHaveURL(data.payload.expectedRedirect);
    });
  });

  // ── 4. Backend Error Handling Suite ───────────────────────────────
  test.describe('Backend Error Handling', () => {
    test.use({ userRole: 'admin' });

    test('TC_CSV_08: UI Error Handling for Backend Export Endpoint Failure', { tag: ['@regression', '@negative'] }, async ({ usersPage, page }) => {
      const data = tcCSV08();

      await page.route('**/users/export', async (route) => {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Internal Server Error',
          }),
        });
      });

      await usersPage.navigate();
      await usersPage.expectPageLoaded();
      await usersPage.exportCSV();

      await expect(usersPage.getToast(data.payload.errorToast)).toBeVisible();
      await expect(usersPage.exportButton).toBeEnabled();
    });
  });

  // ── 5. UI-API-DB 3-Tier Consistency Suite ────────────────────────
  // test.describe('UI-API-DB 3-Tier Consistency Verification', () => {
  //   test.use({ userRole: 'admin' });

  //   test('TC_CONSISTENCY_01: Complete 3-Tier Triangulation After Avatar Upload and CSV Export', { tag: ['@e2e', '@consistency'] }, async ({ avatarUploadPage, usersPage, request, authInfo, page }) => {
  //     const data = tcConsistency01();

  //     await page.route('**/users/export', async (route) => {
  //       await route.fulfill({
  //         status: 200,
  //         contentType: 'application/json',
  //         body: JSON.stringify(mockUsersPayload),
  //       });
  //     });

  //     // ── STEP 1: UI Layer - Avatar Upload ─────────────────────────
  //     await avatarUploadPage.navigate();
  //     await avatarUploadPage.expectPageLoaded();

  //     await avatarUploadPage.setAvatarFile(data.payload.avatarFilePath);
  //     const responsePromise = page.waitForResponse((resp) =>
  //       resp.url().includes('/avatar') && resp.status() === 200
  //     );
  //     await avatarUploadPage.clickUpload();

  //     await expect(avatarUploadPage.getToast(data.payload.avatarSuccessToast)).toBeVisible();

  //     const uploadResp = await responsePromise;
  //     const uploadData = await uploadResp.json();
  //     expect(uploadData.success).toBe(true);

  //     // ── STEP 2: API Layer - Validate Profile User API ───────────
  //     expect(authInfo).not.toBeNull();
  //     const userId = authInfo!.id;

  //     const userResponse = await request.get(`/users/${userId}`);
  //     expect(userResponse.status()).toBe(200);
  //     const userData = await userResponse.json();
  //     expect(userData.user.avatar_url).toBeDefined();

  //     // ── STEP 3: DB Layer - Direct MySQL Query Verification ───────
  //     const dbAvatarUrl = await getUserAvatarFromDb(userId);
  //     expect(dbAvatarUrl).not.toBeNull();

  //     const isDbConsistent = await verifyAvatarInDb(userId, 'uploads/');
  //     expect(isDbConsistent).toBe(true);

  //     // ── STEP 4: Export Layer - CSV Data Cross-Verification ────────
  //     await usersPage.navigate();
  //     await usersPage.expectPageLoaded();

  //     const download = await usersPage.triggerExportCSV();
  //     expect(download.suggestedFilename()).toBe(data.payload.expectedFileName);

  //     const filePath = await download.path();
  //     const csvContent = fs.readFileSync(filePath!, 'utf-8');
  //     const lines = csvContent.trim().split('\n');

  //     expect(lines[0]).toBe('id,full_name,username,phone,email,role,create_at');
  //   });
  // });
});
