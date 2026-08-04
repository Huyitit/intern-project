import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { tcEXP02, tcEXP03 } from '../../../../src/data/test_data/crud/user/export-users.data';

test.describe('User - Export CSV Authorization (GET /users/export)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-02: Standard user forbidden from exporting users
  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', { tag: '@regression' }, async ({ isolatedUser }) => {
    const record = tcEXP02();
    const userService = isolatedUser.service;
    const response = await userService.exportUsers();

    await expectations.expectStatus(response, record.expectedStatus);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousUser }) => {
    const record = tcEXP03();
    const userService = anonymousUser.service;
    const response = await userService.exportUsers();

    await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
  });
});
