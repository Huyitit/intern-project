import dotenv from 'dotenv';
dotenv.config();

export const env = {
  baseUrl: process.env.BASE_URL ?? '',
  logLevel: process.env.LOG_LEVEL ?? 'info',
  User:
  {
    admin: {
      username: process.env.ADMIN_USERNAME || 'admin123',
      password: process.env.ADMIN_PASSWORD || 'admin123'
    },
    normal: {
      username: process.env.USER_USERNAME || 'username01',
      password: process.env.USER_PASSWORD || 'userpassword1'
    }
  }
};

if (!env.baseUrl) {
  throw new Error('BASE_URL is not set. Did you create a .env file?');
}