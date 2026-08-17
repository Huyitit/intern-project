import { TestCaseRecord } from '../types';
import { UserDataGenerator } from '../../generators/user-data.generator';
export function tcPROF01(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_01',
    description: 'Unauthenticated guest access restricted',
    payload: { userRole: 'none' },
  };
}

export function tcPROF02(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_02',
    description: 'Initial profile data loading and field display',
    payload: { userRole: 'user' },
  };
}

export function tcPROF03(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_03',
    description: 'Read-only username field enforcement',
    payload: {},
  };
}

export function tcPROF04(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_04',
    description: 'Successful profile information update',
    payload: {
      fullName: UserDataGenerator.validFullname(),
      phone: UserDataGenerator.validPhone(),
      email: UserDataGenerator.validEmail(),
    },
  };
}

export function tcPROF05(): TestCaseRecord {
  const timestamp = Date.now();
  return {
    tcId: 'TC_PROF_05',
    description: 'Profile update persistence across navigation and reload',
    payload: {
      fullName: `Persisted User ${Math.floor(Math.random() * 100)}`,
      phone: UserDataGenerator.validPhone(),
      email: UserDataGenerator.validEmail(),
    },
  };
}

export function tcPROF06(): TestCaseRecord {
  const timestamp = Date.now();
  return {
    tcId: 'TC_PROF_06',
    description: 'Partial profile field update',
    payload: {
      phone: UserDataGenerator.validPhone(),
    },
  };
}

export function tcPROF07(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_07',
    description: 'Empty required full name form validation',
    payload: {
      fullName: '',
    },
  };
}

export function tcPROF08(): TestCaseRecord {
  return {
    tcId: 'TC_PROF_08',
    description: 'Failed profile update and error toast notification (Live Server)',
    payload: {
      // 5000-character string exceeds database field capacity, triggering real backend 500 error & error toast
      invalidFieldInput: 'X'.repeat(5000),
    },
  };
}
