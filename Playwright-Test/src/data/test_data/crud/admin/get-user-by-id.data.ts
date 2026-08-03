import { UserBuilder } from '../../../helpers/builders/user.builder';
import { UserDataGenerator } from '../../../helpers/generators/user-data.generator';
import { TestCaseRecord } from '../../types';
import { User } from '../../../../api/models/user.model';

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

export function tcGI01(): TestCaseRecord {
  const newUser = createValidUser();
  return {
    tcId: 'TC-GI-01',
    description: 'Admin fetches any user by ID',
    user: newUser,
    payload: {user: newUser},
    expectedStatus: 200,
  };
}

export function tcGI03(): TestCaseRecord {
  return {
    tcId: 'TC-GI-03',
    description: 'Fetch a non-existent user ID',
    payload: { targetId: '999999' },
    expectedStatus: 409,
  };
}

export function tcGI04(): TestCaseRecord {
  return {
    tcId: 'TC-GI-04',
    description: 'Invalid ID Format',
    payload: { targetId: 'abc' },
    expectedStatus: 500,
  };
}
