import { TestCaseRecord } from '../types';
import { UserBuilder } from '../../builders/user.builder';
import { UserDataGenerator } from '../../generators/user-data.generator';

export function tcCREATE01(): TestCaseRecord {
  const user = new UserBuilder().setValidNewUser().build();
  return {
    tcId: 'TC_CREATE_01',
    description: 'Successful user creation by Admin with complete optional fields',
    payload: {
      user,
    },
  };
}

export function tcCREATE02(): TestCaseRecord {
  const duplicateUser = new UserBuilder()
    .setValidNewUser()
    .setUserName('username01')
    .build();
  return {
    tcId: 'TC_CREATE_02',
    description: 'Create user fails due to duplicate username conflict',
    payload: {
      user: duplicateUser,
    },
  };
}

export function tcCREATE03(): TestCaseRecord {
  const shortUser = new UserBuilder()
    .setFull_name(UserDataGenerator.underBoundFullname())
    .setUserName(UserDataGenerator.underBoundUsername())
    .setPassword(UserDataGenerator.underBoundPassword())
    .setRole('user')
    .build();
  return {
    tcId: 'TC_CREATE_03',
    description: 'Create user validation fails with below-minimum lengths',
    payload: {
      user: shortUser,
    },
  };
}

export function tcCREATE04(): TestCaseRecord {
  const longUser = new UserBuilder()
    .setFull_name(UserDataGenerator.upperBoundFullname())
    .setUserName(UserDataGenerator.upperBoundUsername())
    .setPassword(UserDataGenerator.upperBoundPassword())
    .setRole('user')
    .build();
  return {
    tcId: 'TC_CREATE_04',
    description: 'Create user validation fails with above-maximum lengths',
    payload: {
      user: longUser,
    },
  };
}

export function tcCREATE05(): TestCaseRecord {
  const invalidUser = new UserBuilder()
    .setValidNewUser()
    .setPhone(UserDataGenerator.invalidPhone('underBound'))
    .setEmail(UserDataGenerator.invalidEmail())
    .build();
  return {
    tcId: 'TC_CREATE_05',
    description: 'Create user validation fails with invalid formats',
    payload: {
      user: invalidUser,
    },
  };
}
