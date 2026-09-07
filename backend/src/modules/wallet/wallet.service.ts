import { prisma } from '../../config/db.pg.js';

export async function getWallet(userId: string) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  return wallet;
}

export async function getWalletByStudentId(studentId: string) {
  const user = await prisma.user.findFirst({ where: { OR: [{ id: studentId }, { matricNo: studentId }] } });
  if (!user) throw Object.assign(new Error('Student not found'), { statusCode: 404 });
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  return { ...wallet, user: { id: user.id, email: user.email, fullname: user.fullname, matricNo: user.matricNo, level: user.level } };
}

export async function topUp(userId: string, amount: number) {
  if (amount <= 0) throw Object.assign(new Error('Amount must be positive'), { statusCode: 400 });
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  const newBalance = Number(wallet.balance) + amount;
  return prisma.wallet.update({ where: { userId }, data: { balance: newBalance } });
}

export async function debit(userId: string, amount: number) {
  const wallet = await prisma.wallet.findUnique({ where: { userId } });
  if (!wallet) throw Object.assign(new Error('Wallet not found'), { statusCode: 404 });
  if (Number(wallet.balance) < amount) throw Object.assign(new Error('Insufficient balance'), { statusCode: 400 });
  const newBalance = Number(wallet.balance) - amount;
  return prisma.wallet.update({ where: { userId }, data: { balance: newBalance } });
}
