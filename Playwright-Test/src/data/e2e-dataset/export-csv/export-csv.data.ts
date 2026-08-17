import { TestCaseRecord } from '../types';

export function tcCSV01(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_01',
    description: 'Successful CSV export trigger and download initiation',
    payload: {
      userRole: 'admin',
      expectedFileName: 'users_export.csv',
    },
  };
}

export function tcCSV02(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_02',
    description: 'Downloaded CSV file structure and header verification',
    payload: {
      userRole: 'admin',
      expectedHeaders: ['id', 'full_name', 'username', 'phone', 'email', 'role', 'create_at'],
    },
  };
}

export function tcCSV03(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_03',
    description: 'Downloaded CSV data integrity against backend API response',
    payload: {
      userRole: 'admin',
      apiEndpoint: '/users/export',
    },
  };
}

export function tcCSV04(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_04',
    description: 'Downloaded CSV data consistency against MySQL database',
    payload: {
      userRole: 'admin',
      targetRole: 'user',
    },
  };
}

export function tcCSV05(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_05',
    description: 'UI loading state and toast notification lifecycle',
    payload: {
      userRole: 'admin',
      infoToast: 'Preparing CSV export... this may take a moment.',
      successToast: 'Export successful!',
    },
  };
}

export function tcCSV06(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_06',
    description: 'Access restriction for normal user role',
    payload: {
      userRole: 'user',
      expectedRedirect: /\/(dashboard|profile|login)/,
    },
  };
}

export function tcCSV07(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_07',
    description: 'Access restriction for unauthenticated guest',
    payload: {
      userRole: 'none',
      expectedRedirect: /\/login/,
    },
  };
}

export function tcCSV08(): TestCaseRecord {
  return {
    tcId: 'TC_CSV_08',
    description: 'UI error handling for backend export endpoint failure',
    payload: {
      userRole: 'admin',
      errorToast: /Export failed\.|Error during export\./i,
    },
  };
}

export function tcConsistency01(): TestCaseRecord {
  return {
    tcId: 'TC_CONSISTENCY_01',
    description: 'UI-API-DB 3-tier consistency verification after avatar upload and CSV export',
    payload: {
      userRole: 'admin',
      avatarFilePath: './tests/fixtures/sample-avatar.png',
      avatarSuccessToast: 'Avatar uploaded successfully!',
      expectedFileName: 'users_export.csv',
    },
  };
}
