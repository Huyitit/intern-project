import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { cleanupTestData } from '../../../src/data/cleanup';
import { ApiClient } from '../../../src/api/clients/api.client';
import { UserService } from '../../../src/api/services/user.service';
import { createTargetUser } from '../../../src/api/helpers/actions/createTargetUser';

test.describe('POST /api/users/:id/csv Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test.afterAll(async () => {
    await cleanupTestData();
  });

  // TC-CSV-01: Owner uploads valid CSV file to update profile
  test('TC-CSV-01: Owner should successfully update profile via CSV upload (200 OK)', async ({ request, authService }) => {
    const { userId, token, username } = await createTargetUser(authService);
    const ownerService = new UserService(new ApiClient(request, token));

    const csvData = `full_name,username,phone,email\nTest CSV Updated,${username},0912345678,testcsv@example.com`;
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    const response = await ownerService.uploadCsv(userId, {
      csv: {
        name: 'profile_update.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
      },
    });

    await expectations.expectStatus(response, 200);

    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.user.full_name).toBe('Test CSV Updated');
  });

  // TC-CSV-02: Admin updates user profile via CSV upload
  test('TC-CSV-02: Admin should successfully update any user profile via CSV (200 OK)', async ({ adminService, authService }) => {
    const { userId, username } = await createTargetUser(authService);

    const csvData = `full_name,username,phone,email\nAdmin CSV Update,${username},0987654321,admincsv@example.com`;
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    const response = await adminService.uploadCsv(userId, {
      csv: {
        name: 'admin_csv.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
      },
    });

    await expectations.expectStatus(response, 200);
  });

  // TC-CSV-03: Missing CSV file in payload
  test('TC-CSV-03: Upload attempt with missing CSV payload should return client error (400/406)', async ({ adminService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const response = await adminService.uploadCsv(userId, {});

    await expectations.expectStatusIn(response, [400, 406]);
  });

  // TC-CSV-04: Invalid/missing required CSV headers
  test('TC-CSV-04: Upload attempt with invalid CSV headers should be rejected (400/406)', async ({ adminService, authService }) => {
    const { userId } = await createTargetUser(authService);

    const invalidCsvData = `bad_header1,bad_header2\nValue1,Value2`;
    const csvBuffer = Buffer.from(invalidCsvData, 'utf-8');

    const response = await adminService.uploadCsv(userId, {
      csv: {
        name: 'invalid_headers.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
      },
    });

    await expectations.expectStatusIn(response, [400, 406]);
  });

  // TC-CSV-05: Non-owner standard user updating another user via CSV
  test('TC-CSV-05: User should be forbidden from updating another user profile via CSV (403 Forbidden)', async ({ normalService, authService }) => {
    const { userId, username } = await createTargetUser(authService);

    const csvData = `full_name,username,phone,email\nForbidden Update,${username},0912345678,forbidden@example.com`;
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    const response = await normalService.uploadCsv(userId, {
      csv: {
        name: 'forbidden.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
      },
    });

    await expectations.expectStatus(response, 403);
  });

  // TC-CSV-06: Anonymous upload request without token
  test('TC-CSV-06: Anonymous upload request without token should be rejected (401/406)', async ({ anonymousService, authService }) => {
    const { userId, username } = await createTargetUser(authService);

    const csvData = `full_name,username,phone,email\nAnon Update,${username},0912345678,anon@example.com`;
    const csvBuffer = Buffer.from(csvData, 'utf-8');

    const response = await anonymousService.uploadCsv(userId, {
      csv: {
        name: 'anon.csv',
        mimeType: 'text/csv',
        buffer: csvBuffer,
      },
    });

    await expectations.expectStatusIn(response, [401, 403, 406]);
  });
});
