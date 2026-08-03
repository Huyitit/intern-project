import mysql from 'mysql2/promise';
import {pool} from '../api/config/db'
import { hash } from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool (reuse this across your app instead of single connections)
// const pool = mysql.createPool({
//   host: process.env.DB_HOST ?? 'localhost',
//   port: Number(process.env.DB_PORT ?? 3306),
//   user: process.env.DB_USER ?? 'root',
//   password: process.env.DB_PASSWORD ?? '1812',
//   database: process.env.DB_NAME ?? 'user_management',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
// });

async function main() {
  // console.log(`Database connection state: ${pool.state}`)
  try {
    await pool.query('SELECT 1');
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Database connection failed:', error);
  }

  console.log('Starting seed...');

  // Delete current data before seeding
  await pool.query('TRUNCATE TABLE users');
  

  // Hash passwords (using 4 salt rounds to match user.controller.ts)
  const adminPassword = await hash('admin123', 4);

  // Create admin user idempotently (requires a UNIQUE constraint on `username`)
  await pool.query(
    `INSERT INTO users (full_name, username, password, hashed_password, role, phone, email)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE username = username`, // no-op update, mimics upsert's "update: {}"
    ['Admin User', 'admin123', 'admin123', adminPassword, 'admin', '0000000000', 'admin@example.com']
  );

  console.log('Admin user created/verified.');

  // Create 50 users idempotently
  console.log('Seeding 50 users...');
  for (let i = 1; i <= 50; i++) {
    const formattedId = i.toString().padStart(2, '0');
    const userPassword = 'userpassword' + String(i);
    const hashedPassword = await hash(userPassword, 4);

    await pool.query(
      `INSERT INTO users (full_name, username, password, hashed_password, role, phone, email)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE username = username`,
      [
        `FullnameOfUser${formattedId}`,
        `username${formattedId}`,
        userPassword,
        hashedPassword,
        'user',
        `01234567${formattedId}`,
        `emailOfUser${formattedId}@example.com`,
      ]
    );
  }

  console.log('50 users seeded/verified successfully.');
  return 1;
}

export default async function globalSetup() {
  await main();
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error('Error seeding database:', e);
      process.exit(1);
    });
}