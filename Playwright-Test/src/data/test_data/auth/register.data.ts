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
    tcId: 'TC-REG-01',
    description: 'Valid dynamic user registration',
    payload: { user: newUser },
    expectedStatus: 201,
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
    tcId: 'TC-REG-02',
    description: 'Duplicate Username Registration',
    user: existingUser,
    payload: { user: duplicateUser },
    expectedStatus: 409,
  };
}

export function tcREG03(): TestCaseRecord {
  const incompleteUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setEmail(UserDataGenerator.validEmail())
    .setRole('user')
    .build();
  return {
    tcId: 'TC-REG-03',
    description: 'Register with Missing Required Fields',
    payload: { user: incompleteUser },
    expectedStatus: 400,
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
    tcId: 'TC-REG-04',
    description: 'Register with Field Length Violations (<6 chars)',
    payload: { user: shortFieldsUser },
    expectedStatus: 400,
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
    tcId: 'TC-REG-05',
    description: 'Register with Invalid Email Format',
    payload: { user: invalidEmailUser },
    expectedStatus: 400,
  };
}

export function tcREG06(): TestCaseRecord {
  return {
    tcId: 'TC-REG-06',
    description: 'Register with Flat JSON Body (Unwrapped)',
    payload: {
      full_name: UserDataGenerator.validFullname(),
      username: UserDataGenerator.validUsername(),
      password: UserDataGenerator.validPassword(),
      role: 'user',
    },
    expectedStatus: 400,
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
    tcId: 'TC-REG-07',
    description: 'Register with Role Escalation Attempt',
    payload: { user: adminEscalationUser },
    expectedStatus: 201,
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
    tcId: 'TC-REG-08',
    description: 'Register with SQL Injection Input String',
    payload: { user: sqlInjectionUser },
    expectedStatus: 201,
  };
}
