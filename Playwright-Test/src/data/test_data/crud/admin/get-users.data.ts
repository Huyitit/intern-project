import { TestCaseRecord } from '../../types';

export function tcGU01(): TestCaseRecord {
  return {
    tcId: 'TC-GU-01',
    description: 'Default parameters',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },
    expectedStatus: 200,
  };
}

export function tcGU02(): TestCaseRecord {
  return {
    tcId: 'TC-GU-02',
    description: 'Page beyond available data',
    payload: { page: 9999, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },
    expectedStatus: 200,
  };
}

export function tcGU03(): TestCaseRecord {
  return {
    tcId: 'TC-GU-03',
    description: 'Filter by keyword',
    payload: { page: 1, limit: 10, keyword: 'a', sortBy: 'id', order: 'asc' },
    expectedStatus: 200,
  };
}

export function tcGU04(): TestCaseRecord {
  return {
    tcId: 'TC-GU-04',
    description: 'Sort by username ascending',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'username', order: 'asc' },
    expectedStatus: 200,
  };
}

export function tcGU05(): TestCaseRecord {
  return {
    tcId: 'TC-GU-05',
    description: 'Sort by id descending',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'desc' },
    expectedStatus: 200,
  };
}

export function tcGU06(): TestCaseRecord {
  return {
    tcId: 'TC-GU-06',
    description: 'Limit results',
    payload: { page: 1, limit: 2, keyword: '', sortBy: 'id', order: 'asc' },
    expectedStatus: 200,
  };
}

export function tcGU07(): TestCaseRecord {
  return {
    tcId: 'TC-GU-07',
    description: 'Missing query parameters',
    payload: undefined,
    expectedStatus: 200,
  };
}

export function tcGU08(): TestCaseRecord {
  return {
    tcId: 'TC-GU-08',
    description: 'Negative page value',
    payload: { page: -1, limit: 10 },
    expectedStatus: 500,
  };
}

export function tcGU09(): TestCaseRecord {
  return {
    tcId: 'TC-GU-09',
    description: 'Invalid sort column',
    payload: { page: 1, limit: 10, sortBy: 'nonexistent', order: 'asc' },
    expectedStatus: 500,
  };
}

export function tcGU10(): TestCaseRecord {
  return {
    tcId: 'TC-GU-10',
    description: 'Page overlap check',
    payload: { page1: { page: 1, limit: 5 }, page2: { page: 2, limit: 5 } },
    expectedStatus: 200,
  };
}
