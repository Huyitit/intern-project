import { TestCaseRecord } from '../types';

export function tcUL01(): TestCaseRecord {
  return {
    tcId: 'TC_UL_01',
    description: 'Admin access allowed to user list',
    payload: { role: 'admin' },
  };
}

export function tcUL02(): TestCaseRecord {
  return {
    tcId: 'TC_UL_02',
    description: 'Normal user access restricted',
    payload: { role: 'user' },
  };
}

export function tcUL03(): TestCaseRecord {
  return {
    tcId: 'TC_UL_03',
    description: 'Unauthenticated guest access restricted',
    payload: { role: 'none' },
  };
}

export function tcUL04(): TestCaseRecord {
  return {
    tcId: 'TC_UL_04',
    description: 'Initial page layout and table structure verification',
    payload: {},
  };
}

export function tcUL05(): TestCaseRecord {
  return {
    tcId: 'TC_UL_05',
    description: 'Loading indicator display on data fetch delay',
    payload: { delayMs: 1000 },
  };
}

export function tcUL06(): TestCaseRecord {
  return {
    tcId: 'TC_UL_06',
    description: 'Error state handling on network failure',
    payload: { status: 500 },
  };
}

export function tcUL07(): TestCaseRecord {
  return {
    tcId: 'TC_UL_07',
    description: 'Empty table fallback state',
    payload: { searchKeyword: 'nonexistent_user_xyz_99999' },
  };
}

export function tcUL08(): TestCaseRecord {
  return {
    tcId: 'TC_UL_08',
    description: 'Exact match search by username',
    payload: { searchKeyword: 'username01' },
  };
}

export function tcUL09(): TestCaseRecord {
  return {
    tcId: 'TC_UL_09',
    description: 'Partial keyword search by username',
    payload: { searchKeyword: 'alpha' },
  };
}

export function tcUL10(): TestCaseRecord {
  return {
    tcId: 'TC_UL_10',
    description: 'Case-insensitive search handling',
    payload: { seedUsername: 'MixedCaseUser', searchKeyword: 'mixedcaseuser' },
  };
}

export function tcUL11(): TestCaseRecord {
  return {
    tcId: 'TC_UL_11',
    description: 'Non-matching search keyword handling',
    payload: { searchKeyword: 'nonexistent_user_99999' },
  };
}

export function tcUL12(): TestCaseRecord {
  return {
    tcId: 'TC_UL_12',
    description: 'Reset search filter',
    payload: { initialKeyword: 'admin', emptyKeyword: '' },
  };
}

export function tcUL13(): TestCaseRecord {
  return {
    tcId: 'TC_UL_13',
    description: 'Toggle sort by ID column',
    payload: { column: 'id' },
  };
}

export function tcUL14(): TestCaseRecord {
  return {
    tcId: 'TC_UL_14',
    description: 'Toggle sort by Username column',
    payload: { column: 'username' },
  };
}

export function tcUL15(): TestCaseRecord {
  return {
    tcId: 'TC_UL_15',
    description: 'Sort parameter persistence across pagination',
    payload: { column: 'username', order: 'desc' },
  };
}

export function tcUL16(): TestCaseRecord {
  return {
    tcId: 'TC_UL_16',
    description: 'Navigate to Next Page',
    payload: { targetPage: 2 },
  };
}

export function tcUL17(): TestCaseRecord {
  return {
    tcId: 'TC_UL_17',
    description: 'Navigate back to Previous Page',
    payload: { targetPage: 1 },
  };
}

export function tcUL18(): TestCaseRecord {
  return {
    tcId: 'TC_UL_18',
    description: 'Pagination boundary button states',
    payload: {},
  };
}

export function tcUL19(): TestCaseRecord {
  return {
    tcId: 'TC_UL_19',
    description: 'Reset page number on new search submission',
    payload: { searchKeyword: 'test' },
  };
}

export function tcUL20(): TestCaseRecord {
  return {
    tcId: 'TC_UL_20',
    description: 'Navigate to user detail profile page',
    payload: {},
  };
}
