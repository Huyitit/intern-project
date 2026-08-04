import { TestCaseRecord } from '../../types';

export function tcEXP02(): TestCaseRecord {
  return {
    tcId: 'TC-EXP-02',
    description: 'Standard user forbidden from exporting user list',
    payload: {},
    expectedStatus: 403,
  };
}

export function tcEXP03(): TestCaseRecord {
  return {
    tcId: 'TC-EXP-03',
    description: 'Anonymous request without token rejected',
    payload: {},
    expectedStatus: 401,
  };
}
