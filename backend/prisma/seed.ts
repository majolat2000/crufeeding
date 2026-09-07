/**
 * Seed — wipes all demo data, creates exactly 2 users:
 * 1. Super Admin: majesty.olatimilehin@crawforduniversity.edu.ng / CRUFEED@1#1
 * 2. Bursary: bursary@crawforduniversity.edu.ng / 12345678
 * Also seeds: The Cafeteria, GlobalConfig (2025/2026), default levels.
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('[seed] wiping all demo data...');
  await prisma.activityLog.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  await prisma.restaurant.deleteMany();
  await prisma.hostel.deleteMany();
  await prisma.level.deleteMany();
  await prisma.globalConfig.deleteMany();
  console.log('[seed] database wiped clean');

  const hash = await bcrypt.hash('CRUFEED@1#1', 10);
  const bursaryHash = await bcrypt.hash('12345678', 10);

  const superAdmin = await prisma.user.create({
    data: {
      email: 'majesty.olatimilehin@crawforduniversity.edu.ng',
      password: hash,
      fullname: 'Majesty Olatimilehin',
      role: 'super_admin',
      verified: true,
    },
  });

  await prisma.wallet.create({
    data: { userId: superAdmin.id, balance: 0 },
  });

  const bursary = await prisma.user.create({
    data: {
      email: 'bursary@crawforduniversity.edu.ng',
      password: bursaryHash,
      fullname: 'Bursary Department',
      role: 'bursar',
      verified: true,
    },
  });

  await prisma.wallet.create({
    data: { userId: bursary.id, balance: 0 },
  });

  await prisma.restaurant.create({
    data: { name: 'The Cafeteria', isActive: true },
  });

  await prisma.globalConfig.create({
    data: {
      id: 'global',
      breakfastRate: 1500,
      lunchRate: 2000,
      dinnerRate: 1500,
      allThreeRate: 5000,
      feedingAmount: 5000,
      session: '2025/2026',
    },
  });

  const levels = ['JUPEB', '100 LEVEL', '200 LEVEL', '300 LEVEL', '500 LEVEL', 'Visitor'];
  for (const name of levels) {
    await prisma.level.create({
      data: { name, cap: 2000, plan: name === 'Visitor' ? 'Basic' : 'Standard' },
    });
  }

  console.log('[seed] created 2 users: Super Admin + Bursary');
  console.log('[seed] majesty.olatimilehin@crawforduniversity.edu.ng / CRUFEED@1#1');
  console.log('[seed] bursary@crawforduniversity.edu.ng / 12345678');
  console.log('[seed] session: 2025/2026');
}

main()
  .catch((e) => { console.error('[seed] error', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
