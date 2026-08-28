import { TestCaseRecord } from '../types';
import { UserBuilder } from '../../builders/user.builder';
import { UserDataGenerator } from '../../generators/user-data.generator';

export function tcREG01(): TestCaseRecord {
  const newUser = new UserBuilder().setValidNewUser().build();
  return {
    tcId: 'TC_REG_01',
    description: 'Valid user registration with all fields',
    payload: {
      user: newUser,
    },
  };
}

export function tcREG02(): TestCaseRecord {
  const adminUser = new UserBuilder().setValidNewAdmin().build();
  return {
    tcId: 'TC_REG_02',
    description: 'Valid admin registration with role admin',
    payload: {
      user: adminUser,
    },
  };
}

export function tcREG03(): TestCaseRecord {
  const reqOnlyUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_03',
    description: 'Valid user registration with required fields only',
    payload: {
      user: reqOnlyUser,
    },
  };
}

export function tcREG04(): TestCaseRecord {
  const existingUser = new UserBuilder().setValidNewUser().build();
  const duplicateUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(existingUser.username)
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.validPhone())
    .setEmail(UserDataGenerator.validEmail())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_04',
    description: 'User registration with existing username',
    user: existingUser,
    payload: {
      user: duplicateUser,
    },
  };
}

export function tcREG05(): TestCaseRecord {
  const existingUser = new UserBuilder().setValidNewUser().build();
  const duplicateEmailUser = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.validPhone())
    .setEmail(existingUser.email!)
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_05',
    description: 'User registration with existing email',
    user: existingUser,
    payload: {
      user: duplicateEmailUser,
    },
  };
}

export function tcREG06(): TestCaseRecord {
  return {
    tcId: 'TC_REG_06',
    description: 'User registration with all required fields empty',
    payload: {
      user: {
        full_name: '',
        username: '',
        password: '',
        role: 'user',
      },
    },
  };
}

export function tcREG07(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name('')
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_07',
    description: 'User registration with missing full name',
    payload: {
      user,
    },
  };
}

export function tcREG08(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName('')
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_08',
    description: 'User registration with missing username',
    payload: {
      user,
    },
  };
}

export function tcREG09(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword('')
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_09',
    description: 'User registration with missing password',
    payload: {
      user,
    },
  };
}

export function tcREG10(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.underBoundFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_10',
    description: 'User registration with Full Name below min length (5 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG11(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.upperBoundFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_11',
    description: 'User registration with Full Name above max length (26 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG12(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.underBoundUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_12',
    description: 'User registration with Username below min length (5 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG13(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.upperBoundUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_13',
    description: 'User registration with Username above max length (23 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG14(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.underBoundPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_14',
    description: 'User registration with Password below min length (5 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG15(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.upperBoundPassword())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_15',
    description: 'User registration with Password above max length (23 chars)',
    payload: {
      user,
    },
  };
}

export function tcREG16(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.invalidPhone('underBound'))
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_16',
    description: 'User registration with Phone below min length (5 digits)',
    payload: {
      user,
    },
  };
}

export function tcREG17(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setPhone(UserDataGenerator.invalidPhone('upperBound'))
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_17',
    description: 'User registration with Phone above max length (16 digits)',
    payload: {
      user,
    },
  };
}

export function tcREG18(): TestCaseRecord {
  const user = new UserBuilder()
    .setFull_name(UserDataGenerator.validFullname())
    .setUserName(UserDataGenerator.validUsername())
    .setPassword(UserDataGenerator.validPassword())
    .setEmail(UserDataGenerator.invalidEmail())
    .setRole('user')
    .build();

  return {
    tcId: 'TC_REG_18',
    description: 'User registration with invalid email format',
    payload: {
      user,
    },
  };
}

export function tcREG19(): TestCaseRecord {
  return {
    tcId: 'TC_REG_19',
    description: 'Register page initial render verification',
    payload: {
      user: {
        full_name: '',
        username: '',
        password: '',
        role: 'user',
      },
    },
  };
}

export function tcREG20(): TestCaseRecord {
  return {
    tcId: 'TC_REG_20',
    description: 'Navigation from register page to login page',
    payload: {
      user: {
        full_name: '',
        username: '',
        password: '',
        role: 'user',
      },
    },
  };
}

export function tcREG21(): TestCaseRecord {
  const user = new UserBuilder().setValidNewUser().setRole('user').build();
  return {
    tcId: 'TC_REG_21',
    description: 'User registration with role User selected',
    payload: {
      user,
    },
  };
}

export function tcREG22(): TestCaseRecord {
  const user = new UserBuilder().setValidNewUser().setRole('admin').build();
  return {
    tcId: 'TC_REG_22',
    description: 'User registration with role Admin selected',
    payload: {
      user,
    },
  };
}
