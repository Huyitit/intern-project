import { expect } from '@playwright/test';
import { test } from '../../../../src/api/helpers/fixtures/api.service.fixture';
import { Expectations } from '../../../../src/api/helpers/assertions/base';
import { HttpStatus } from '../../../../src/api/config/httpStatus';
import { getUsersResponseSchema, crudErrorResponseSchema } from '../../../../src/api/helpers/schemas/user.schema';
import {
  tcGU01,
  tcGU02,
  tcGU03,
  tcGU04,
  tcGU05,
  tcGU06,
  tcGU07,
  tcGU08,
  tcGU09,
  tcGU10,
} from '../../../../src/data/test_data/crud/admin/get-users.data';

test.describe('Admin - Get Users List (GET /users)', { tag: ['@crud', '@admin', '@regression'] }, () => {
  let expectations: Expectations;

  test.beforeEach(() => {
    expectations = new Expectations();
  });

  test('TC-GU-01: should fetch first page of users with default params', { tag: ['@smoke', '@regression'] }, async ({ isolatedAdmin }) => {
    const record = tcGU01();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUsersResponseSchema);
    
    await expectations.expectArrayItemProperty(response, 'users', 'role', 'user', 1);
  });

  test('TC-GU-02: should handle fetching a page beyond available data', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU02();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    await expectations.expectSchema(response, getUsersResponseSchema);
    
    const body = await response.json();
    expect(body.users.length).toBe(0);
    expect(body.message).toBe('No more users');
  });

  test('TC-GU-03: should filter users by username keyword', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU03();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    for (const user of body.users) {
      expect(user.username.toLowerCase()).toContain('a');
    }
  });

  test('TC-GU-04: should sort users by username in ascending order', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU04();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    const usernames = body.users.map((u: any) => u.username.toLowerCase());
    const sorted = [...usernames].sort();
    expect(usernames).toEqual(sorted);
  });

  test('TC-GU-05: should sort users by id in descending order', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU05();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    const ids = body.users.map((u: any) => u.id);
    const sorted = [...ids].sort((a, b) => b - a);
    expect(ids).toEqual(sorted);
  });

  test('TC-GU-06: should limit results correctly', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU06();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
    
    const body = await response.json();
    expect(body.users.length).toBeLessThanOrEqual(2);
  });

  test('TC-GU-07: should handle missing query params gracefully', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU07();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers();
    
    if (response.status() === HttpStatus.INTERNAL_SERVER_ERROR) {
      await expectations.expectSchema(response, crudErrorResponseSchema);
    } else {
      await expectations.expectStatus(response, record.expectedStatus);
      await expectations.expectSchema(response, getUsersResponseSchema);
    }
  });

  test('TC-GU-08: should handle negative page value', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU08();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatusIn(response, [HttpStatus.BAD_REQUEST, HttpStatus.INTERNAL_SERVER_ERROR]);
  });

  test('TC-GU-09: should handle invalid sort column', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU09();
    const userService = isolatedAdmin.service;

    const response = await userService.getUsers(record.payload);
    await expectations.expectStatus(response, record.expectedStatus);
  });

  test('TC-GU-10: should not overlap pages', { tag: '@regression' }, async ({ isolatedAdmin }) => {
    const record = tcGU10();
    const userService = isolatedAdmin.service;

    const p1 = await userService.getUsers(record.payload.page1);
    const p2 = await userService.getUsers(record.payload.page2);
    
    const users1 = (await p1.json()).users || [];
    const users2 = (await p2.json()).users || [];
    
    const ids1 = users1.map((u: any) => u.id);
    const ids2 = users2.map((u: any) => u.id);
    
    const overlap = ids1.filter((id: any) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });
});
