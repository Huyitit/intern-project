import dotenv from 'dotenv';
dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL ?? '',
  apiTimeout: Number(process.env.API_TIMEOUT ?? 30000),
  testUser: {
    email: process.env.TEST_USER_EMAIL ?? '',
    password: process.env.TEST_USER_PASSWORD ?? '',
  },
  User:
  {
    admin: {
      username: process.env.AdminUsername ?? 'admin123',
      password: process.env.AdminPassword ?? 'admin123'
    },
    normal: {
      username: process.env.UserUsername ?? 'username01',
      password: process.env.UserPassword ?? 'userpassword1'
    }
  }
};

if (!env.baseUrl) {
  throw new Error('BASE_URL is not set. Did you create a .env file?');
}