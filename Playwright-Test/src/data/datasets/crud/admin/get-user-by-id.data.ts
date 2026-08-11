import { UserBuilder } from '../../../builders/user.builder';
import { UserDataGenerator } from '../../../generators/user-data.generator';
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

    description: 'Admin fetches any user by ID',
    user: newUser,
    payload: {user: newUser},

  };
}

export function tcGI03(): TestCaseRecord {
  return {

    description: 'Fetch a non-existent user ID',
    payload: { targetId: '999999' },

  };
}

export function tcGI04(): TestCaseRecord {
  return {

    description: 'Invalid ID Format',
    payload: { targetId: 'abc' },

  };
}
