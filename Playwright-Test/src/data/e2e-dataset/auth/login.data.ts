import { TestCaseRecord } from '../types';

export function tcLOG01(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_01',
    description: 'Valid login with correct user credentials',
    user: {
      full_name: 'Seeded User',
      username: 'username01',
      password: 'userpassword1',
      role: 'user',
    },
    payload: {
      user: {
        username: 'username01',
        password: 'userpassword1',
      },
    },
  };
}

export function tcLOG02(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_02',
    description: 'Valid login with correct admin credentials',
    user: {
      full_name: 'Seeded Admin',
      username: 'admin123',
      password: 'admin123',
      role: 'admin',
    },
    payload: {
      user: {
        username: 'admin123',
        password: 'admin123',
      },
    },
  };
}

export function tcLOG03(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_03',
    description: 'Auth failure with incorrect password',
    user: {
      full_name: 'Seeded User',
      username: 'username01',
      password: 'userpassword1',
      role: 'user',
    },
    payload: {
      user: {
        username: 'username01',
        password: 'wrongpass123',
      },
    },
  };
}

export function tcLOG04(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_04',
    description: 'Auth failure for unregistered username',
    payload: {
      user: {
        username: 'nonexistentuser',
        password: 'userpassword1',
      },
    },
  };
}

export function tcLOG05(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_05',
    description: 'Login attempt with empty username and empty password',
    payload: {
      user: {
        username: '',
        password: '',
      },
    },
  };
}

export function tcLOG06(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_06',
    description: 'Login attempt with empty username',
    payload: {
      user: {
        username: '',
        password: 'userpassword1',
      },
    },
  };
}

export function tcLOG07(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_07',
    description: 'Login attempt with empty password',
    payload: {
      user: {
        username: 'username01',
        password: '',
      },
    },
  };
}

export function tcLOG08(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_08',
    description: 'Login attempt with short username (under 6 chars)',
    payload: {
      user: {
        username: 'user1',
        password: 'userpassword1',
      },
    },
  };
}

export function tcLOG09(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_09',
    description: 'Login attempt with short password (under 6 chars)',
    payload: {
      user: {
        username: 'username01',
        password: 'pass1',
      },
    },
  };
}

export function tcLOG10(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_10',
    description: 'Login page initial render verification',
    payload: {
      user: {
        username: '',
        password: '',
      },
    },
  };
}

export function tcLOG11(): TestCaseRecord {
  return {
    tcId: 'TC_LOG_11',
    description: 'Navigation from login page to register page',
    payload: {
      user: {
        username: '',
        password: '',
      },
    },
  };
}
