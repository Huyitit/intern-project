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

export function tcAVT01(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Owner should successfully upload PNG avatar (200 OK)',
    user,
    payload: {
      avatar: {
        name: 'test_avatar.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    },

  };
}

export function tcAVT05(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'User should be forbidden from updating another user avatar (403 Forbidden)',
    user,
    payload: {
      avatar: {
        name: 'forbidden.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    },

  };
}

export function tcAVT06(): TestCaseRecord {
  const user = createValidUser();
  return {

    description: 'Anonymous upload request without token should be rejected (401/406)',
    user,
    payload: {
      avatar: {
        name: 'anon.png',
        mimeType: 'image/png',
        buffer: dummyPngBuffer,
      },
    },

  };
}

export function tcCSV01(): TestCaseRecord {
  const user = createValidUser();
  const csvData = `full_name,username,phone,email\nTest CSV Updated,${user.username},0912345678,${user.email}`;
  return {

    description: 'Owner should successfully update profile via CSV upload (200 OK)',
    user,
    payload: {
      csv: {
        name: 'profile_update.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvData, 'utf-8'),
      },
    },

  };
}

export function tcCSV05(): TestCaseRecord {
  const user = createValidUser();
  const csvData = `full_name,username,phone,email\nForbidden Update,${user.username},0912345678,forbidden@example.com`;
  return {

    description: 'User should be forbidden from updating another user profile via CSV (403 Forbidden)',
    user,
    payload: {
      csv: {
        name: 'forbidden.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvData, 'utf-8'),
      },
    },

  };
}

export function tcCSV06(): TestCaseRecord {
  const user = createValidUser();
  const csvData = `full_name,username,phone,email\nAnon Update,${user.username},0912345678,anon@example.com`;
  return {

    description: 'Anonymous upload request without token should be rejected (401/406)',
    user,
    payload: {
      csv: {
        name: 'anon.csv',
        mimeType: 'text/csv',
        buffer: Buffer.from(csvData, 'utf-8'),
      },
    },

  };
}
