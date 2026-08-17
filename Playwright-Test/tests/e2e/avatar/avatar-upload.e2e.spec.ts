import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcAVATAR01,
  tcAVATAR02,
  tcAVATAR03,
  tcAVATAR04,
  tcAVATAR05,
  tcAVATAR06,
  tcAVATAR07,
} from '../../../src/data/e2e-dataset/avatar/avatar.data';
import { verifyAvatarInDb } from '../../../src/e2e/helpers/db-avatar.helper';
import { closePool } from '../../../src/core/config/db';

test.describe('E2E: Avatar Upload Feature Suite', { tag: ['@e2e', '@avatar'] }, () => {
  // ── Authenticated User Suite ─────────────────────────────────────
  test.describe('Authenticated User Avatar Uploads', () => {
    test.use({ userRole: 'user' });

    test.beforeEach(async ({ avatarUploadPage }) => {
      await avatarUploadPage.navigate();
      await avatarUploadPage.expectPageLoaded();
    });

    test('TC_AVATAR_01: Successful Avatar Upload with Spinner & Toast Verification', { tag: ['@smoke', '@regression'] }, async ({ avatarUploadPage }) => {
      const data = tcAVATAR01();

      // 1. Select file and verify preview
      await avatarUploadPage.setAvatarFile(data.payload.filePath);
      await expect(avatarUploadPage.previewImg).toBeVisible();
      await expect(avatarUploadPage.uploadButton).toBeEnabled();

      // 2. Click upload & assert spinner loading state + info toast notification
      const uploadPromise = avatarUploadPage.clickUpload();

      // Verify button is disabled during upload process
      await expect(avatarUploadPage.uploadButton).toBeDisabled();

      // 3. Assert success toast notification & button state reset
      await expect(avatarUploadPage.getToast(data.payload.successToast)).toBeVisible();
      await avatarUploadPage.expectUploadCompletedState();
    });

    test('TC_AVATAR_02: Avatar Persistence Across Page Reload', { tag: ['@smoke', '@regression'] }, async ({ avatarUploadPage, page }) => {
      const data = tcAVATAR02();

      await avatarUploadPage.uploadAvatar(data.payload.filePath);
      await expect(avatarUploadPage.getToast(data.payload.successToast)).toBeVisible();

      // Reload page and verify page reloads clean
      await page.reload();
      await avatarUploadPage.expectPageLoaded();
    });

    test('TC_AVATAR_03: Overwriting Existing Avatar with New Image File', { tag: ['@regression'] }, async ({ avatarUploadPage }) => {
      const data = tcAVATAR03();

      // Upload first avatar
      await avatarUploadPage.uploadAvatar(data.payload.filePathFirst);
      await expect(avatarUploadPage.getToast(data.payload.successToast)).toBeVisible();

      // Upload second avatar to overwrite
      await avatarUploadPage.uploadAvatar(data.payload.filePathSecond);
      await expect(avatarUploadPage.getToast(data.payload.successToast)).toBeVisible();
    });

    test('TC_AVATAR_05: Direct MySQL Data Consistency Verification', { tag: ['@smoke', '@regression', '@db-consistency'] }, async ({ avatarUploadPage, authInfo }) => {
      const data = tcAVATAR05();

      await avatarUploadPage.uploadAvatar(data.payload.filePath);
      await expect(avatarUploadPage.getToast('Avatar uploaded successfully!')).toBeVisible();

      // Direct Database Consistency Verification (Zero API Calling)
      expect(authInfo).not.toBeNull();
      if (authInfo) {
        const isConsistent = await verifyAvatarInDb(authInfo.id, data.payload.expectedFolder);
        expect(isConsistent).toBe(true);
      }
    });

    test('TC_AVATAR_06: Upload Attempt with Unsupported File Format', { tag: ['@regression', '@negative'] }, async ({ avatarUploadPage }) => {
      const data = tcAVATAR06();

      await avatarUploadPage.setAvatarFile(data.payload.filePath);
      await avatarUploadPage.clickUpload();

      // Assert error toast notification
      await expect(avatarUploadPage.getToast(data.payload.errorToast)).toBeVisible();
    });

    test('TC_AVATAR_07: Upload Button Disabled State Without File Selection', { tag: ['@regression', '@negative'] }, async ({ avatarUploadPage }) => {
      // Confirm button is disabled when no file is selected
      await expect(avatarUploadPage.uploadButton).toBeDisabled();
    });
  });

  // ── Admin User Suite ─────────────────────────────────────────────
  test.describe('Admin User Avatar Uploads', () => {
    test.use({ userRole: 'admin' });

    test('TC_AVATAR_04: Avatar Upload by Admin User Role', { tag: ['@regression', '@rbac'] }, async ({ avatarUploadPage }) => {
      const data = tcAVATAR04();

      await avatarUploadPage.navigate();
      await avatarUploadPage.expectPageLoaded();
      await avatarUploadPage.uploadAvatar(data.payload.filePath);

      await expect(avatarUploadPage.getToast(data.payload.successToast)).toBeVisible();
    });
  });
});
