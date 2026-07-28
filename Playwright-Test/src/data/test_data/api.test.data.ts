import { UserBuilder } from "../builders/user.builder";
import { UserDataGenerator } from "../generators/user-data.generator";
import { User } from "../../api/models/user.model";

export interface TestCaseRecord<T = any> {
  tcId: string;
  description: string;
  user?: User;
  payload: T;
  expectedStatus: number;
}

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

export class ApiData {
  /**
   * Login API Test Datasets
   */
  static readonly login: Record<string, () => TestCaseRecord> = {
    'TC-LOG-01': () => {
      const user = createValidUser();
      return {
        tcId: 'TC-LOG-01',
        description: 'Valid login with correct credentials',
        user,
        payload: {
          user: {
            username: user.username,
            password: user.password,
          },
        },
        expectedStatus: 200,
      };
    },
    'TC-LOG-02': () => {
      const user = createValidUser();
      return {
        tcId: 'TC-LOG-02',
        description: 'Auth failure with incorrect password',
        user,
        payload: {
          user: {
            username: user.username,
            password: 'wrong_password_123!',
          },
        },
        expectedStatus: 401,
      };
    },
    'TC-LOG-03': () => ({
      tcId: 'TC-LOG-03',
      description: 'Auth failure for non-existent user',
      payload: {
        user: {
          username: UserDataGenerator.nonExistentUsername(),
          password: UserDataGenerator.validPassword(),
        },
      },
      expectedStatus: 401,
    }),
    'TC-LOG-04': () => {
      const user = createValidUser();
      return {
        tcId: 'TC-LOG-04',
        description: 'Missing password field in payload',
        user,
        payload: {
          user: {
            username: user.username,
          },
        },
        expectedStatus: 400,
      };
    },
    'TC-LOG-05': () => ({
      tcId: 'TC-LOG-05',
      description: 'Empty user payload object',
      payload: {
        user: {},
      },
      expectedStatus: 400,
    }),
    'TC-LOG-06': () => {
      const user = createValidUser();
      return {
        tcId: 'TC-LOG-06',
        description: 'Missing root user wrapper in body',
        user,
        payload: {
          username: user.username,
          password: user.password,
        },
        expectedStatus: 400,
      };
    },
    'TC-LOG-07': () => ({
      tcId: 'TC-LOG-07',
      description: 'SQL Injection attempt in credentials',
      payload: {
        user: {
          username: "test' OR '1'='1",
          password: "' OR '1'='1",
        },
      },
      expectedStatus: 401,
    }),
    'TC-LOG-08': () => {
      const user = createValidUser();
      return {
        tcId: 'TC-LOG-08',
        description: 'Multi-device login for same user',
        user,
        payload: {
          user: {
            username: user.username,
            password: user.password,
          },
        },
        expectedStatus: 200,
      };
    },
  };

  /**
   * Register API Test Datasets
   */
  static readonly register: Record<string, () => TestCaseRecord> = {
    'TC-REG-01': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-REG-01',
        description: 'Valid dynamic user registration',
        payload: { user: newUser },
        expectedStatus: 201,
      };
    },
    'TC-REG-02': () => {
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
    },
    'TC-REG-03': () => {
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
    },
    'TC-REG-04': () => {
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
    },
    'TC-REG-05': () => {
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
    },
    'TC-REG-06': () => ({
      tcId: 'TC-REG-06',
      description: 'Register with Flat JSON Body (Unwrapped)',
      payload: {
        full_name: UserDataGenerator.validFullname(),
        username: UserDataGenerator.validUsername(),
        password: UserDataGenerator.validPassword(),
        role: 'user',
      },
      expectedStatus: 400,
    }),
    'TC-REG-07': () => {
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
        expectedStatus: 400,
      };
    },
    'TC-REG-08': () => {
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
    },
  };

  /**
   * Create User API Test Datasets (POST /api/users)
   */
  static readonly createUser: Record<string, () => TestCaseRecord> = {
    'TC-CU-01': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-CU-01',
        description: 'Valid User Creation (Admin)',
        payload: { user: newUser },
        expectedStatus: 201,
      };
    },
    'TC-CU-02': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-CU-02',
        description: 'Duplicate Username Creation',
        user: newUser,
        payload: { user: { ...newUser } },
        expectedStatus: 409,
      };
    },
    'TC-CU-03': () => ({
      tcId: 'TC-CU-03',
      description: 'Missing Required Fields',
      payload: { user: { full_name: 'Incomplete User' } },
      expectedStatus: 400,
    }),
    'TC-CU-04': () => ({
      tcId: 'TC-CU-04',
      description: 'Empty Payload',
      payload: {},
      expectedStatus: 400,
    }),
    'TC-CU-05': () => {
      const newUser = createValidUser();
      (newUser as any).phone = 123456789;
      return {
        tcId: 'TC-CU-05',
        description: 'Invalid Data Types',
        payload: { user: newUser },
        expectedStatus: 400,
      };
    },
    'TC-CU-06': () => {
      const newUser = createValidUser();
      newUser.email = 'not-an-email';
      return {
        tcId: 'TC-CU-06',
        description: 'Invalid Email Format',
        payload: { user: newUser },
        expectedStatus: 400,
      };
    },
    'TC-CU-07': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-CU-07',
        description: 'Standard User forbidden to create',
        payload: { user: newUser },
        expectedStatus: 403,
      };
    },
    'TC-CU-08': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-CU-08',
        description: 'No Token',
        payload: { user: newUser },
        expectedStatus: 406,
      };
    },
  };

  /**
   * Delete User API Test Datasets (DELETE /api/users/:id)
   */
  static readonly deleteUser: Record<string, () => TestCaseRecord> = {
    
    'TC-DU-01': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-DU-01',
        description: 'Valid Deletion (Admin)',
        user: newUser,
        payload: {},
        expectedStatus: 200,
      };
    },
    'TC-DU-02': () => ({
      tcId: 'TC-DU-02',
      description: 'Delete Non-Existent User',
      payload: { targetId: '999999' },
      expectedStatus: 500,
    }),
    'TC-DU-03': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-DU-03',
        description: 'Idempotency Check',
        user: newUser,
        payload: {},
        expectedStatus: 200,
      };
    },
    'TC-DU-04': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-DU-04',
        description: 'User Role Forbidden',
        user: newUser,
        payload: {},
        expectedStatus: 403,
      };
    },
    'TC-DU-05': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-DU-05',
        description: 'No Token',
        user: newUser,
        payload: {},
        expectedStatus: 406,
      };
    },
  };

  /**
   * Get User By ID API Test Datasets (GET /api/users/:id)
   */
  static readonly getUserById: Record<string, () => TestCaseRecord> = {
    'TC-GI-01': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-GI-01',
        description: 'Admin fetches any user by ID',
        user: newUser,
        payload: {},
        expectedStatus: 200,
      }
    },
    'TC-GI-02': () => {
      const newUser = createValidUser();
      return {
        tcId: 'TC-GI-02',
        description: 'User fetches their own profile',
        user: newUser,
        payload: {
          user: {
            username: newUser.username,
            password: newUser.password,
          },
        },
        expectedStatus: 200,
      }
    },
    'TC-GI-03': () => ({
      tcId: 'TC-GI-03',
      description: 'Fetch a non-existent user ID',
      payload: { targetId: '999999' },
      expectedStatus: 409,
    }),
    'TC-GI-04': () => ({
      tcId: 'TC-GI-04',
      description: 'Invalid ID Format',
      payload: { targetId: 'abc' },
      expectedStatus: 500,
    }),
    'TC-GI-05': () => ({
      tcId: 'TC-GI-05',
      description: 'User accessing another user profile',
      payload: {},
      expectedStatus: 403,
    }),
    'TC-GI-06': () => ({
      tcId: 'TC-GI-06',
      description: 'No Token',
      payload: {},
      expectedStatus: 406,
    }),
  };

  /**
   * Get Users API Test Datasets (GET /api/users)
   */
  static readonly getUsers: Record<string, () => TestCaseRecord> = {
    'TC-GU-01': () => ({
      tcId: 'TC-GU-01',
      description: 'Default parameters',
      payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },
      expectedStatus: 200,
    }),
    'TC-GU-02': () => ({
      tcId: 'TC-GU-02',
      description: 'Page beyond available data',
      payload: { page: 9999, limit: 10, keyword: '', sortBy: 'id', order: 'asc' },
      expectedStatus: 200,
    }),
    'TC-GU-03': () => ({
      tcId: 'TC-GU-03',
      description: 'Filter by keyword',
      payload: { page: 1, limit: 10, keyword: 'a', sortBy: 'id', order: 'asc' },
      expectedStatus: 200,
    }),
    'TC-GU-04': () => ({
      tcId: 'TC-GU-04',
      description: 'Sort by username ascending',
      payload: { page: 1, limit: 10, keyword: '', sortBy: 'username', order: 'asc' },
      expectedStatus: 200,
    }),
    'TC-GU-05': () => ({
      tcId: 'TC-GU-05',
      description: 'Sort by id descending',
      payload: { page: 1, limit: 10, keyword: '', sortBy: 'id', order: 'desc' },
      expectedStatus: 200,
    }),
    'TC-GU-06': () => ({
      tcId: 'TC-GU-06',
      description: 'Limit results',
      payload: { page: 1, limit: 2, keyword: '', sortBy: 'id', order: 'asc' },
      expectedStatus: 200,
    }),
    'TC-GU-07': () => ({
      tcId: 'TC-GU-07',
      description: 'Missing query parameters',
      payload: undefined,
      expectedStatus: 200,
    }),
    'TC-GU-08': () => ({
      tcId: 'TC-GU-08',
      description: 'Negative page value',
      payload: { page: -1, limit: 10 },
      expectedStatus: 500,
    }),
    'TC-GU-09': () => ({
      tcId: 'TC-GU-09',
      description: 'Invalid sort column',
      payload: { page: 1, limit: 10, sortBy: 'nonexistent', order: 'asc' },
      expectedStatus: 500,
    }),
    'TC-GU-10': () => ({
      tcId: 'TC-GU-10',
      description: 'Page overlap check',
      payload: { page1: { page: 1, limit: 5 }, page2: { page: 2, limit: 5 } },
      expectedStatus: 200,
    }),
    'TC-GU-11': () => ({
      tcId: 'TC-GU-11',
      description: 'No token provided',
      payload: { page: 1, limit: 10 },
      expectedStatus: 406,
    }),
    'TC-GU-12': () => ({
      tcId: 'TC-GU-12',
      description: 'Invalid token provided',
      payload: { page: 1, limit: 10 },
      expectedStatus: 403,
    }),
    'TC-GU-13': () => ({
      tcId: 'TC-GU-13',
      description: 'Standard user request',
      payload: { page: 1, limit: 10 },
      expectedStatus: 403,
    }),
  };

  /**
   * Update User API Test Datasets (PUT /api/users/:id)
   */
  static readonly updateUser: Record<string, () => TestCaseRecord> = {
    'TC-UU-01': () => {
      const user = createValidUser();
      const updatedUser = new UserBuilder()
      .setFull_name('Admin Updated Name')
      .setUserName(user.username)
      .setPassword(user.password)
      .setRole("user")
      .build();

      return {
        tcId: 'TC-UU-01',
        description: 'Valid Update (Admin)',
        user: user,
        payload: { 
          user: updatedUser
         },
        expectedStatus: 200,
      };
    },
    'TC-UU-02': () => {
      const user = createValidUser();
      const updatedUser = new UserBuilder()
      .setFull_name('Admin Updated Name')
      .setUserName(user.username)
      .setPassword(user.password)
      .setRole("user")
      .build();
      return {
        tcId: 'TC-UU-02',
        description: 'Valid Update (Owner)',
        user: user,
        payload: { 
          userId: user.id,
          user: updatedUser
         },
        expectedStatus: 200,
      };
    },
    'TC-UU-03': () => {
      const user = createValidUser();
      user.full_name = 'Non Existent';
      return {
        tcId: 'TC-UU-03',
        description: 'User Not Found',
        payload: { targetId: 99999, user },
        expectedStatus: 409,
      };
    },
    'TC-UU-04': () => ({
      tcId: 'TC-UU-04',
      description: 'Missing Body',
      payload: {},
      expectedStatus: 400,
    }),
    'TC-UU-05': () => ({
      tcId: 'TC-UU-05',
      description: 'Validation Failure',
      payload: { user: { full_name: 'A' } },
      expectedStatus: 400,
    }),
    'TC-UU-06': () => (
      {
      tcId: 'TC-UU-06',
      description: 'User Updating Another User',
      payload: { targetId: 7, user: { full_name: 'Hacked' } },
      expectedStatus: 403,
    }),
    'TC-UU-07': () => ({
      tcId: 'TC-UU-07',
      description: 'No Token',
      payload: { user: { full_name: 'Unauth Update' } },
      expectedStatus: 406,
    }),
    'TC-UU-08': () => ({
      tcId: 'TC-UU-08',
      description: 'Expired/Invalid Token',
      payload: { user: { full_name: 'Invalid Update' } },
      expectedStatus: 403,
    }),
  };
}