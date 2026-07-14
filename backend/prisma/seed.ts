import prisma from '../config/prisma';
import { hash } from 'bcrypt';

async function main() {
  console.log('Starting seed...');
  // delete current data before seeding
  // await prisma.$executeRawUnsafe(`
  // TRUNCATE TABLE users;
  // `);
  // await prisma.users.deleteMany();
  // Hash passwords (using 4 salt rounds to match user.controller.ts)
  const adminPassword = await hash('admin123', 4);
  // const userPassword = await hash('user123', 4);

  // Create admin user idempotently
  await prisma.users.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      full_name: 'Admin User',
      username: 'admin123',
      password: 'admin123',
      hashed_password: adminPassword,
      role: 'admin',
      phone: '0000000000',
      email: 'admin@example.com',
    },
  });

  console.log('Admin user created/verified.');

  // Create 50 users idempotently
  console.log('Seeding 50 users...');
  for (let i = 1; i <= 50; i++) {
    const formattedId = i.toString().padStart(2, '0');
    const userpassword = "userpassword" + String(i);
    const hashedPassword = await hash(userpassword, 4);
    await prisma.users.upsert({
      where: { username: `user${formattedId}` },
      update: {},
      create: {
        full_name: `FullnameOfUser${formattedId}`,
        username: `username${formattedId}`,
        password: userpassword,
        hashed_password: hashedPassword,
        role: 'user',
        phone: `01234567${formattedId}`,
        email: `emailOfUser${formattedId}@example.com`,
      },
    });
  }

  console.log('50 users seeded/verified successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    process.exit(0);
  });
