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

export function tcUU01(targetUserId?: number): TestCaseRecord {
  const user = createValidUser();
  const updatedUser = new UserBuilder()
    .setFull_name('Admin Updated Name')
    .setUserName(user.username)
    .setPassword(user.password)
    .setRole('user')
    .build();

  if (targetUserId) {
    (updatedUser as any).id = targetUserId;
  }

  return {
    tcId: 'TC-UU-01',
    description: 'Valid Update (Admin)',
    user,
    payload: { user: updatedUser },
    expectedStatus: 200,
  };
}

export function tcUU03(): TestCaseRecord {
  const user = createValidUser();
  user.full_name = 'Non Existent';
  return {

    description: 'User Not Found',
    payload: { id: 99999, user },

  };
}

export function tcUU04(id: number): TestCaseRecord {
  return {
    tcId: 'TC-UU-04',
    description: 'Missing Body',
    payload: id ? { user: { id: id } } : {},
    expectedStatus: 400,
  };
}

export function tcUU05(targetUserId?: number): TestCaseRecord {
  return {
    tcId: 'TC-UU-05',
    description: 'Validation Failure',
    payload: {
      user: {
        ...(targetUserId ? { id: targetUserId } : {}),
        full_name: 'A',
      },
    },
    expectedStatus: 400,
  };
}
