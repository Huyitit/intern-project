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

export function tcCU07(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Standard User forbidden to create',
    payload: { user: newUser },

  };
}

export function tcCU08(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'No Token',
    payload: { user: newUser },

  };
}
