import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../src/api/config/httpStatus';

test.describe('GET /api/health Test Suite @system', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-HLT-01: Public Health Check
  test('TC-HLT-01: should return 200 OK for public health check', async ({ anonymousService }) => {
    const response = await anonymousService.getHealth();

    await expectations.expectStatus(response, HttpStatus.OK);

    const body = await response.json();
    expect(body).toEqual({ message: 'Health check OK!' });
  });
});
