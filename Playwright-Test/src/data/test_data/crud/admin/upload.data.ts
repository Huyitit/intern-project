import { UserBuilder } from '../../../helpers/builders/user.builder';
import { UserDataGenerator } from '../../../helpers/generators/user-data.generator';
import { TestCaseRecord } from '../../types';
import { User } from '../../../../api/models/user.model';

const dummyPngBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

function createValidUser(): User {
  return new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.validPhone())
    .setEmail(UserDataGenerator.validEmail())
    .setRole('user')
    .build();
}

export function tcAVT02(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Admin should successfully upload avatar for any user (200 OK)',
    user,
    payload: {
      avatar: {
        name: 'admin_upload.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    },

  };
}

export function tcAVT03(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Upload attempt with missing image payload should return client error (400/406)',
    user,
    payload: {},

  };
}

export function tcAVT04(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Non-image file upload should be rejected safely (400/415/500)',
    user,
    payload: {
      avatar: {
        name: 'test_doc.txt',
        mimeType: 'text/plain',
        buffer: Buffer.from('This is a text file not an image'),
      },
    },

  };
}

export function tcCSV02(): TestCaseRecord {
  const user = createValidUser();
  const csvData = `full_name,username,phone,email\nAdmin CSV Update,${user.username},0987654321,${user.email}`;
  return {

    description: 'Admin should successfully update any user profile via CSV (200 OK)',
    user,
    payload: {
      csv: {
        name: 'admin_csv.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvData, 'utf-8'),
      },
    },

  };
}

export function tcCSV03(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Upload attempt with missing CSV payload should return client error (400/406)',
    user,
    payload: {},

  };
}

export function tcCSV04(): TestCaseRecord {
  const user = createValidUser();
  const invalidCsvData = `bad_header1,bad_header2\nValue1,Value2`;
  return {

    description: 'Upload attempt with invalid CSV headers should be rejected (400/406)',
    user,
    payload: {
      csv: {
        name: 'invalid_headers.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(invalidCsvData, 'utf-8'),
      },
    },

  };
}
