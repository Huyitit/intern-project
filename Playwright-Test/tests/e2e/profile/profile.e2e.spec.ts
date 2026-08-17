import { test, expect } from '../../../src/e2e/fixtures';
import {
  tcPROF01,
  tcPROF02,
  tcPROF03,
  tcPROF04,
  tcPROF05,
  tcPROF06,
  tcPROF07,
  tcPROF08,
} from '../../../src/data/e2e-dataset/profile/profile.data';

test.describe('E2E: User Profile Feature Suite (Live Server)', { tag: ['@e2e', '@profile'] }, () => {
  // ── Access Control & Unauthenticated Session ────────────────────
  test.describe('Access Control', () => {
    test.use({ userRole: 'none' });

    test('TC_PROF_01: Unauthenticated Guest Access Restricted', { tag: ['@smoke', '@regression', '@rbac'] }, async ({ page }) => {
      const data = tcPROF01();
      await page.goto('/profile');
      await expect(page).toHaveURL(/\/login/);
    });
  });

  // ── Authenticated User Profile Operations ───────────────────────
  test.describe('Authenticated Profile Operations', () => {
    test.use({ userRole: 'user' });

    test.beforeEach(async ({ profilePage }) => {
      await profilePage.navigate();
      await profilePage.expectPageLoaded();
    });

    test('TC_PROF_02: Initial Profile Data Loading and Field Display', { tag: ['@smoke', '@regression'] }, async ({ profilePage, authInfo }) => {
      const data = tcPROF02();
      await expect(profilePage.heading).toBeVisible();
      await expect(profilePage.usernameInput).toHaveValue(authInfo?.username || '');
      await expect(profilePage.updateProfileButton).toBeEnabled();
    });

    test('TC_PROF_03: Read-Only Username Field Enforcement', { tag: ['@regression', '@validation'] }, async ({ profilePage }) => {
      const data = tcPROF03();
      await expect(profilePage.usernameInput).toBeDisabled();
    });

    test('TC_PROF_04: Successful Profile Information Update and Success Toast', { tag: ['@smoke', '@regression', '@toast'] }, async ({ profilePage }) => {
      const data = tcPROF04();
      await profilePage.fillFullName(data.payload.fullName);
      await profilePage.fillPhone(data.payload.phone);
      await profilePage.fillEmail(data.payload.email);
      await profilePage.clickUpdate();

      await expect(profilePage.getToast('Profile updated successfully')).toBeVisible({ timeout: 15000 });
      await expect(profilePage.fullNameInput).toHaveValue(data.payload.fullName);
    });

    test('TC_PROF_05: Profile Update Persistence Across Navigation and Reload', { tag: ['@regression'] }, async ({ profilePage, page }) => {
      const data = tcPROF05();
      await profilePage.fillFullName(data.payload.fullName);
      await profilePage.clickUpdate();
      await expect(profilePage.getToast('Profile updated successfully')).toBeVisible({ timeout: 15000 });

      await page.reload();
      await profilePage.expectPageLoaded();
      await expect(profilePage.fullNameInput).toHaveValue(data.payload.fullName);
    });

    test('TC_PROF_06: Partial Profile Field Update and Success Toast', { tag: ['@regression', '@toast'] }, async ({ profilePage }) => {
      const data = tcPROF06();
      await profilePage.fillPhone(data.payload.phone);
      await profilePage.clickUpdate();

      await expect(profilePage.getToast('Profile updated successfully')).toBeVisible({ timeout: 15000 });
      await expect(profilePage.phoneInput).toHaveValue(data.payload.phone);
    });

    test('TC_PROF_07: Empty Required Full Name Form Validation', { tag: ['@regression', '@negative'] }, async ({ profilePage }) => {
      const data = tcPROF07();
      await profilePage.fillFullName(data.payload.fullName);
      await profilePage.clickUpdate();

      await expect(profilePage.getToast(/Failed to update profile|invalid input/i)).toBeVisible();
    });

    test('TC_PROF_08: Failed Profile Update and Error Toast Notification (Live Server)', { tag: ['@regression', '@negative', '@toast'] }, async ({ profilePage }) => {
      const data = tcPROF08();

      // Submit invalid payload directly to live backend server (zero route mocking)
      await profilePage.fillPhone(data.payload.invalidFieldInput);
      await profilePage.clickUpdate();

      // Verify that real server rejection triggers error toast alert
      await expect(profilePage.getToast(/invalid input|Internal Server Error|Failed to update profile/i)).toBeVisible();
    });
  });
});
