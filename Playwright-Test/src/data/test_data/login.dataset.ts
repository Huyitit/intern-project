import { UserDataGenerator } from '../generators/user-data.generator';
import { loginResponseSchema, authErrorResponseSchema } from '../../api/helpers/schemas/auth.schema';
import { ZodTypeAny } from 'zod';

export interface LoginTestCaseRecord {
  tcId: string;
  description: string;
  username?: string;
  password?: string;
  registerPassword?: string;
  payloadType?: 'standard' | 'missingPassword' | 'emptyObject' | 'unwrapped';
  shouldRegisterFirst?: boolean;
  expectedStatus: number;
  expectedSchema: ZodTypeAny;
}

export function getLoginTestCases(): LoginTestCaseRecord[] {
  const validUser1 = {
    username: UserDataGenerator.validUsername(),
    password: UserDataGenerator.validPassword(),
  };

  const validUser2 = {
    username: UserDataGenerator.validUsername(),
    password: UserDataGenerator.validPassword(),
  };

  const validUser4 = {
    username: UserDataGenerator.validUsername(),
    password: UserDataGenerator.validPassword(),
  };

  const validUser6 = {
    username: UserDataGenerator.validUsername(),
    password: UserDataGenerator.validPassword(),
  };

  return [
    {
      tcId: 'TC-DDT-LOG-01',
      description: 'Valid login with correct credentials (DDT)',
      username: validUser1.username,
      password: validUser1.password,
      registerPassword: validUser1.password,
      shouldRegisterFirst: true,
      expectedStatus: 200,
      expectedSchema: loginResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-02',
      description: 'Auth failure with incorrect password (DDT)',
      username: validUser2.username,
      password: 'wrong_password_123!',
      registerPassword: validUser2.password,
      shouldRegisterFirst: true,
      expectedStatus: 401,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-03',
      description: 'Auth failure for non-existent user (DDT)',
      username: UserDataGenerator.nonExistentUsername(),
      password: UserDataGenerator.validPassword(),
      shouldRegisterFirst: false,
      expectedStatus: 401,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-04',
      description: 'Missing password field in payload (DDT)',
      username: validUser4.username,
      registerPassword: validUser4.password,
      payloadType: 'missingPassword',
      shouldRegisterFirst: true,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-05',
      description: 'Empty user payload object (DDT)',
      payloadType: 'emptyObject',
      shouldRegisterFirst: false,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-06',
      description: 'Missing root user wrapper in body (DDT)',
      username: validUser6.username,
      password: validUser6.password,
      registerPassword: validUser6.password,
      payloadType: 'unwrapped',
      shouldRegisterFirst: true,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-07',
      description: 'SQL Injection attempt in credentials (DDT)',
      username: "test' OR '1'='1",
      password: "' OR '1'='1",
      shouldRegisterFirst: false,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-08',
      description: 'Invalid username (short)',
      username: 'tests',
      password: "1234567",
      registerPassword: "",
      shouldRegisterFirst: false,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    },
    {
      tcId: 'TC-DDT-LOG-09',
      description: 'Invalid password (short)',
      username: validUser1.username,
      password: 't',
      registerPassword: '',
      shouldRegisterFirst: false,
      expectedStatus: 400,
      expectedSchema: authErrorResponseSchema,
    }
  ];
}
