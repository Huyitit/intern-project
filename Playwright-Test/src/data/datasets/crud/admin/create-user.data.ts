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

export function tcCU01(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Valid User Creation (Admin)',
    payload: { user: newUser },

  };
}

export function tcCU02(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Duplicate Username Creation',
    user: newUser,
    payload: { user: { ...newUser } },

  };
}

export function tcCU03(): TestCaseRecord {
  return {

    description: 'Missing Required Fields',
    payload: { user: { full_name: 'Incomplete User' } },

  };
}

export function tcCU04(): TestCaseRecord {
  return {

    description: 'Empty Payload',
    payload: {},

  };
}

export function tcCU05(): TestCaseRecord {
  const newUser = createValidUser();
  (newUser as any).phone = 123456789;
  return {

    description: 'Invalid Data Types',
    payload: { user: newUser },

  };
}

export function tcCU06(): TestCaseRecord {
  const newUser = createValidUser();
  newUser.email = 'not-an-email';
  return {

    description: 'Invalid Email Format',
    payload: { user: newUser },

  };
}
