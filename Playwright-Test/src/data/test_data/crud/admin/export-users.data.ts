import { TestCaseRecord } from '../../types';

export function tcEXP01(): TestCaseRecord {
  return {
    tcId: 'TC-EXP-01',
    description: 'Admin exports user list',
    payload: {},
    expectedStatus: 200,
  };
}
