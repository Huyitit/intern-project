import dotenv from 'dotenv';
dotenv.config();

export const config = {
  //server
  port: process.env.PORT || 3000,
  
  //jwt
  secretKey: process.env.SECRET_KEY || "default value",
  expiredTime: Number(process.env.KEY_EXPIRED_TIME) || 60,
  // database 
  dbUrl: process.env.dbUrl || "",
  dbUser: process.env.DATABASE_USER || "",
  dbPass: process.env.DATABASE_PASSWORD || "",
  dbName: process.env.DATABASE_NAME || "",
  dbHost: process.env.DATABASE_HOST || "",
  dbPost: process.env.DATABASE_PORT || "",
};

