import { expect } from '@playwright/test';
import { test } from '../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../src/api/helpers/assertions/base';
import { endpoints } from '../../../src/api/config/endpoints';

test.describe('GET /api/health Test Suite', () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  // TC-HLT-01: Public Health Check
  test('TC-HLT-01: should return 200 OK for public health check', async ({ anonymousService }) => {
    const response = await anonymousService.getHealth();

    await expectations.expectStatus(response, 200);

    const body = await response.json();
    expect(body).toEqual({ message: 'Health check OK!' });
  });
});
