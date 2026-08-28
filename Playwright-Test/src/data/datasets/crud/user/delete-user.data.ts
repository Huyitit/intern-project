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

export function tcDU04(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'User Role Forbidden',
    user: newUser,
    payload: {},

  };
}

export function tcDU05(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'No Token',
    user: newUser,
    payload: {},

  };
}
