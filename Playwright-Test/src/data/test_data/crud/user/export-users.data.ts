import { TestCaseRecord } from '../../types';

export function tcEXP02(): TestCaseRecord {
  return {

    description: 'Standard user forbidden from exporting user list',
    payload: {},

  };
}

export function tcEXP03(): TestCaseRecord {
  return {

    description: 'Anonymous request without token rejected',
    payload: {},

  };
}
