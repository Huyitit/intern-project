import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.dbUrl || "",
  secretKey: process.env.SECRET_KEY || "",
  dbUser: process.env.DATABASE_USER || "",
  dbPass: process.env.DATABASE_PASSWORD || "",
  dbName: process.env.DATABASE_NAME || "",
  dbHost: process.env.DATABASE_HOST || "",
  dbPost: process.env.DATABASE_PORT || "",
};

