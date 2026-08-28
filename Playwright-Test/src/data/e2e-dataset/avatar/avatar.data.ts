import { TestCaseRecord } from '../types';

export function tcAVATAR01(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_01',
    description: 'Successful single avatar image upload with preview & toast',
    payload: {
      userRole: 'user',
      filePath: './tests/fixtures/new-avatar.jpg',
      fileName: 'new-avatar.jpg',
      infoToast: 'Uploading avatar...',
      successToast: 'Avatar uploaded successfully!',
    },
  };
}

export function tcAVATAR02(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_02',
    description: 'Avatar persistence across page reload',
    payload: {
      userRole: 'user',
      filePath: './tests/fixtures/new-avatar.jpg',
      successToast: 'Avatar uploaded successfully!',
    },
  };
}

export function tcAVATAR03(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_03',
    description: 'Overwriting existing avatar with a new image file',
    payload: {
      userRole: 'user',
      filePathFirst: './tests/fixtures/new-avatar.jpg',
      filePathSecond: './tests/fixtures/sample-avatar.png',
      successToast: 'Avatar uploaded successfully!',
    },
  };
}

export function tcAVATAR04(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_04',
    description: 'Avatar upload by admin user role',
    payload: {
      userRole: 'admin',
      filePath: './tests/fixtures/new-avatar.jpg',
      successToast: 'Avatar uploaded successfully!',
    },
  };
}

export function tcAVATAR05(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_05',
    description: 'Data consistency verification via direct MySQL connection',
    payload: {
      userRole: 'user',
      filePath: './tests/fixtures/new-avatar.jpg',
      expectedFolder: 'uploads/',
    },
  };
}

export function tcAVATAR06(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_06',
    description: 'Upload attempt with unsupported file format',
    payload: {
      userRole: 'user',
      filePath: './tests/fixtures/invalid-document.pdf',
      errorToast: /Failed to upload avatar|Error uploading avatar/i,
    },
  };
}

export function tcAVATAR07(): TestCaseRecord {
  return {
    tcId: 'TC_AVATAR_07',
    description: 'Upload button disabled state without file selection',
    payload: {
      userRole: 'user',
    },
  };
}
