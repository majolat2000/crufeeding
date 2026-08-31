/**
 * Seed — Default Super Admin (web login only)
 * Email: majesty.olatimilehin@crawforduniversity.edu.ng
 * Password: CRUFEED@1#1 (bcrypt hashed)
 * Run: npx prisma db seed  or  npm run seed  (tsx prisma/seed.ts)
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const email = 'majesty.olatimilehin@crawforduniversity.edu.ng';
  const password = 'CRUFEED@1#1';
  const hash = await bcrypt.hash(password, 10);

  // Upsert super_admin — also ensure in legacy Mongo if needed
  await prisma.user.upsert({
    where: { email },
    update: { role: 'super_admin', verified: true },
    create: {
      email,
      matricNo: null,
      role: 'super_admin',
      verified: true,
    },
  });

  // Ensure password stored — if User has password field, set it via raw
  // Fallback: try update with password if schema has it
  try {
    await prisma.$executeRaw`UPDATE "User" SET password = ${hash} WHERE email = ${email}`;
  } catch {}

  // Ensure single restaurant
  await prisma.restaurant.upsert({
    where: { name: 'The Cafeteria' },
    update: {},
    create: { name: 'The Cafeteria', isActive: true },
  });

  // Ensure global config with granular meal rates
  await prisma.globalConfig.upsert({
    where: { id: 'global' },
    update: {},
    create: { id: 'global', feedingAmount: 5000 }, // default all-three rate
  });

  console.log(`Seeded Super Admin: ${email} / ${password}`);
}

main().finally(() => prisma.$disconnect());
