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

export function tcCU01(): TestCaseRecord {
  const newUser = createValidUser();
  return {
    tcId: 'TC-CU-01',
    description: 'Valid User Creation (Admin)',
    payload: { user: newUser },
    expectedStatus: 201,
  };
}

export function tcCU02(): TestCaseRecord {
  const newUser = createValidUser();
  return {
    tcId: 'TC-CU-02',
    description: 'Duplicate Username Creation',
    user: newUser,
    payload: { user: { ...newUser } },
    expectedStatus: 409,
  };
}

export function tcCU03(): TestCaseRecord {
  return {
    tcId: 'TC-CU-03',
    description: 'Missing Required Fields',
    payload: { user: { full_name: 'Incomplete User' } },
    expectedStatus: 400,
  };
}

export function tcCU04(): TestCaseRecord {
  return {
    tcId: 'TC-CU-04',
    description: 'Empty Payload',
    payload: {},
    expectedStatus: 400,
  };
}

export function tcCU05(): TestCaseRecord {
  const newUser = createValidUser();
  (newUser as any).phone = 123456789;
  return {
    tcId: 'TC-CU-05',
    description: 'Invalid Data Types',
    payload: { user: newUser },
    expectedStatus: 400,
  };
}

export function tcCU06(): TestCaseRecord {
  const newUser = createValidUser();
  newUser.email = 'not-an-email';
  return {
    tcId: 'TC-CU-06',
    description: 'Invalid Email Format',
    payload: { user: newUser },
    expectedStatus: 400,
  };
}
