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

export function tcGI02(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'User fetches their own profile',
    user: newUser,
    payload: {
      user: {
        username: newUser.username,
        password: newUser.password,
      },
    },

  };
}

export function tcGI05(): TestCaseRecord {
  return {

    description: 'User accessing another user profile',
    payload: {},

  };
}

export function tcGI06(): TestCaseRecord {
  return {

    description: 'No Token',
    payload: {},

  };
}

export function tcGU11(): TestCaseRecord {
  return {

    description: 'No token provided',
    payload: { page: 1, limit: 10 },

  };
}

export function tcGU12(): TestCaseRecord {
  return {

    description: 'Invalid token provided',
    payload: { page: 1, limit: 10 },

  };
}

export function tcGU13(): TestCaseRecord {
  return {

    description: 'Standard user request',
    payload: { page: 1, limit: 10 },

  };
}
