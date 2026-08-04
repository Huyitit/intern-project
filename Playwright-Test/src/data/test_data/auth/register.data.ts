import { UserBuilder } from '../../helpers/builders/user.builder';
import { UserDataGenerator } from '../../helpers/generators/user-data.generator';
import { TestCaseRecord } from '../types';
import { User } from '../../../api/models/user.model';

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

export function tcREG01(): TestCaseRecord {
  const newUser = createValidUser();
  return {

    description: 'Valid dynamic user registration',
    payload: { user: newUser },

  };
}

export function tcREG02(): TestCaseRecord {
  const existingUser = createValidUser();
  const duplicateUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(existingUser.username)
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.validPhone())
    .setEmail(UserDataGenerator.validEmail())
    .setRole('user')
    .build();
  return {

    description: 'Duplicate Username Registration',
    user: existingUser,
    payload: { user: duplicateUser },

  };
}

export function tcREG03(): TestCaseRecord {
  const incompleteUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setEmail(UserDataGenerator.validEmail())
    .setRole('user')
    .build();
  return {

    description: 'Register with Missing Required Fields',
    payload: { user: incompleteUser },

  };
}

export function tcREG04(): TestCaseRecord {
  const shortFieldsUser = new UserBuilder()
    .setFull_name(UserDataGenerator.underBoundFullname())
    .setUserName(UserDataGenerator.underBoundUsername())
    .setPassword(UserDataGenerator.underBoundPassword())
    .setRole('user')
    .build();
  return {

    description: 'Register with Field Length Violations (<6 chars)',
    payload: { user: shortFieldsUser },

  };
}

export function tcREG05(): TestCaseRecord {
  const invalidEmailUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setEmail(UserDataGenerator.invalidEmail())
    .setRole('user')
    .build();
  return {

    description: 'Register with Invalid Email Format',
    payload: { user: invalidEmailUser },

  };
}

export function tcREG06(): TestCaseRecord {
  return {

    description: 'Register with Flat JSON Body (Unwrapped)',
    payload: {
      full_name: UserDataGenerator.validFullname(),
      username: UserDataGenerator.validUsername(),
      password: UserDataGenerator.validPassword(),
      role: 'user',
    },

  };
}

export function tcREG07(): TestCaseRecord {
  const adminEscalationUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('admin' as any)
    .build();
  return {

    description: 'Register with Role Escalation Attempt',
    payload: { user: adminEscalationUser },

  };
}

export function tcREG08(): TestCaseRecord {
  const sqlInjectionUser = new UserBuilder()
    .setFull_name(UserDataGenerator.sqlInjectionString())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();
  return {

    description: 'Register with SQL Injection Input String',
    payload: { user: sqlInjectionUser },

  };
}
