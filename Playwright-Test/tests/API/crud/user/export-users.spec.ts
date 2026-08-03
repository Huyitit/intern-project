import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';

test.describe('User - Export CSV Authorization (GET /users/export)', { tag: ['@crud', '@user', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-EXP-02: Standard user forbidden from exporting users
  test('TC-EXP-02: Standard user should be forbidden from exporting user list (403 Forbidden)', { tag: '@regression' }, async ({ normalService }) => {
    const response = await normalService.exportUsers();

    await expectations.expectStatus(response, HttpStatus.FORBIDDEN);
  });

  // TC-EXP-03: Anonymous request without token rejected
  test('TC-EXP-03: Anonymous request without token should be rejected (401/406)', { tag: '@regression' }, async ({ anonymousService }) => {
    const response = await anonymousService.exportUsers();

    await expectations.expectStatusIn(response, [HttpStatus.UNAUTHORIZED, HttpStatus.FORBIDDEN, HttpStatus.NOT_ACCEPTABLE]);
  });
});
