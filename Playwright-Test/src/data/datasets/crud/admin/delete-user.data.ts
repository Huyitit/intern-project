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

export function tcDU01(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Valid Deletion (Admin)',
    user: newUser,
    payload: {},

  };
}

export function tcDU02(): TestCaseRecord {
  return {

    description: 'Delete Non-Existent User',
    payload: { targetId: '999999' },

  };
}

export function tcDU03(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Idempotency Check',
    user: newUser,
    payload: {},

  };
}
