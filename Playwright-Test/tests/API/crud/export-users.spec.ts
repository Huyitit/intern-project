import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';

test.describe('GET /api/users/export Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-01: Admin exports user list
  test('TC-EXP-01: Admin should successfully export user list (200 OK)', async ({ adminService }) => {
    const response = await adminService.exportUsers();

    await expectations.expectStatus(response, 200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(Array.isArray(body.users)).toBe(true);
  });

  // TC-EXP-02: Standard user forbidden from exporting users
  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', async ({ normalService }) => {
    const response = await normalService.exportUsers();

    await expectations.expectStatus(response, 403);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', async ({ anonymousService }) => {
    const response = await anonymousService.exportUsers();

    await expectations.expectStatusIn(response, [401, 403, 406]);
  });
});
