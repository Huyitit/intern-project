import { UserBuilder } from '../../../builders/user.builder';
import { UserDataGenerator } from '../../../generators/user-data.generator';
import { TestCaseRecord } from '../../types';

export function tcUU02(targetUserId?: number): TestCaseRecord {
  const user = new UserBuilder().setValidNewUser().build();
  const updatedUser = new UserBuilder()
    .setFull_name('Owner Updated Name')
    .setUserName(user.username)
    .setPassword(user.password)
    .setRole('user')
    .build();

  if (targetUserId) {
    (updatedUser as any).id = targetUserId;
  }

  return {
    tcId: 'TC-UU-02',
    description: 'Valid Update (Owner)',
    user,
    payload: {
      userId: targetUserId ?? user.id,
      user: updatedUser,
    },
    expectedStatus: 200,
  };
}

export function tcUU06(): TestCaseRecord {
  return {

    description: 'User Updating Another User',
    payload: { targetId: 7, user: { full_name: 'Hacked' } },

  };
}

export function tcUU07(targetUserId?: number): TestCaseRecord {
  return {
    tcId: 'TC-UU-07',
    description: 'No Token',
    payload: {
      user: {
        ...(targetUserId ? { id: targetUserId } : {}),
        full_name: 'Unauth Update',
      },
    },
    expectedStatus: 406,
  };
}

export function tcUU08(targetUserId?: number): TestCaseRecord {
  return {
    tcId: 'TC-UU-08',
    description: 'Expired/Invalid Token',
    payload: {
      user: {
        ...(targetUserId ? { id: targetUserId } : {}),
        full_name: 'Invalid Update',
      },
    },
    expectedStatus: 403,
  };
}
