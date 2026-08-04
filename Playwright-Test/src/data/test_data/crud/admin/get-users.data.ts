import { TestCaseRecord } from '../../types';

export function tcGU01(): TestCaseRecord {
  return {

    description: 'Default parameters',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },

  };
}

export function tcGU02(): TestCaseRecord {
  return {

    description: 'Page beyond available data',
    payload: { page: 9999, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },

  };
}

export function tcGU03(): TestCaseRecord {
  return {

    description: 'Filter by keyword',
    payload: { page: 1, limit: 10, keyword: 'a', sortBy: 'id', order: 'asc' },

  };
}

export function tcGU04(): TestCaseRecord {
  return {

    description: 'Sort by username ascending',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'username', order: 'asc' },

  };
}

export function tcGU05(): TestCaseRecord {
  return {

    description: 'Sort by id descending',
    payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'desc' },

  };
}

export function tcGU06(): TestCaseRecord {
  return {

    description: 'Limit results',
    payload: { page: 1, limit: 2, keyword: '', sortBy: 'id', order: 'asc' },

  };
}

export function tcGU07(): TestCaseRecord {
  return {

    description: 'Missing query parameters',
    payload: undefined,

  };
}

export function tcGU08(): TestCaseRecord {
  return {

    description: 'Negative page value',
    payload: { page: -1, limit: 10 },

  };
}

export function tcGU09(): TestCaseRecord {
  return {

    description: 'Invalid sort column',
    payload: { page: 1, limit: 10, sortBy: 'nonexistent', order: 'asc' },

  };
}

export function tcGU10(): TestCaseRecord {
  return {

    description: 'Page overlap check',
    payload: { page1: { page: 1, limit: 5 }, page2: { page: 2, limit: 5 } },

  };
}
