import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../../config/env.js';
import { prisma } from '../../config/db.pg.js';
import { authenticate, AuthRequest } from '../../middleware/auth.js';

export const authRouter = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(4) });
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullname: z.string().min(2),
  matricNo: z.string().optional(),
  level: z.string().optional(),
  hostel: z.string().optional(),
  mealBreakfast: z.boolean().optional(),
  mealLunch: z.boolean().optional(),
  mealDinner: z.boolean().optional(),
});

function signToken(user: { id: string; email: string; role: string }) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as any);
}

/** POST /api/v1/auth/login */
authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, role: user.role, fullname: user.fullname } } });
});

/** POST /api/v1/auth/signup */
authRouter.post('/signup', async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.issues[0].message });
  const { email, password, fullname, matricNo, level, hostel, mealBreakfast, mealLunch, mealDinner } = parsed.data;
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
  const hash = await bcrypt.hash(password, 10);
  const isSubscriber = mealBreakfast || mealLunch || mealDinner;
  const user = await prisma.user.create({
    data: {
      email,
      password: hash,
      fullname,
      matricNo: matricNo || null,
      level: level || 'Visitor',
      role: isSubscriber ? 'subscriber' : 'user',
      mealBreakfast: mealBreakfast || false,
      mealLunch: mealLunch || false,
      mealDinner: mealDinner || false,
      hostel: hostel || null,
      verified: true,
    },
  });
  await prisma.wallet.create({ data: { userId: user.id, balance: 0 } });
  const token = signToken(user);
  res.status(201).json({ success: true, data: { token, user: { id: user.id, email: user.email, role: user.role, fullname: user.fullname } } });
});

/** GET /api/v1/auth/me */
authRouter.get('/me', authenticate, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.sub },
    select: { id: true, email: true, fullname: true, role: true, matricNo: true, level: true, hostel: true, mealBreakfast: true, mealLunch: true, mealDinner: true, biometricEnabled: true, createdAt: true },
  });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const wallet = await prisma.wallet.findUnique({ where: { userId: user.id } });
  res.json({ success: true, data: { ...user, balance: wallet?.balance ?? 0 } });
});

/** POST /api/v1/auth/forgot-password — sends OTP */
authRouter.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(200).json({ success: true, message: 'If the email exists, an OTP has been sent' });
  const code = String(Math.floor(100000 + Math.random() * 900000));
  await prisma.otpCode.create({ data: { email, code, purpose: 'password_reset', expiresAt: new Date(Date.now() + 15 * 60 * 1000) } });
  console.log(`[OTP] ${email} -> ${code}`);
  res.json({ success: true, message: 'OTP sent to email', data: { code } });
});

/** POST /api/v1/auth/verify-otp */
authRouter.post('/verify-otp', async (req, res) => {
  const { email, code, purpose } = req.body;
  if (!email || !code) return res.status(400).json({ success: false, message: 'Email and code required' });
  const otp = await prisma.otpCode.findFirst({
    where: { email, code, purpose: purpose || 'password_reset', used: false, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: 'desc' },
  });
  if (!otp) return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  await prisma.otpCode.update({ where: { id: otp.id }, data: { used: true } });
  const resetToken = jwt.sign({ email, purpose: 'reset' }, env.jwtSecret, { expiresIn: '15m' });
  res.json({ success: true, data: { resetToken } });
});

/** POST /api/v1/auth/reset-password */
authRouter.post('/reset-password', async (req, res) => {
  const { resetToken, newPassword } = req.body;
  if (!resetToken || !newPassword) return res.status(400).json({ success: false, message: 'Token and new password required' });
  try {
    const payload = jwt.verify(resetToken, env.jwtSecret) as any;
    if (payload.purpose !== 'reset') throw new Error();
    const hash = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { email: payload.email }, data: { password: hash } });
    res.json({ success: true, message: 'Password reset successful' });
  } catch {
    res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
  }
});

/** POST /api/v1/auth/change-password */
authRouter.post('/change-password', authenticate, async (req: AuthRequest, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ success: false, message: 'Current and new password required' });
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  const hash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
  res.json({ success: true, message: 'Password changed successfully' });
});

/** POST /api/v1/auth/set-pin */
authRouter.post('/set-pin', authenticate, async (req: AuthRequest, res) => {
  const { pin, currentPassword } = req.body;
  if (!pin || !currentPassword) return res.status(400).json({ success: false, message: 'PIN and current password required' });
  if (!/^\d{4,6}$/.test(pin)) return res.status(400).json({ success: false, message: 'PIN must be 4-6 digits' });
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const valid = await bcrypt.compare(currentPassword, user.password);
  if (!valid) return res.status(400).json({ success: false, message: 'Current password is incorrect' });
  const pinHash = await bcrypt.hash(pin, 10);
  await prisma.user.update({ where: { id: user.id }, data: { pin: pinHash } });
  res.json({ success: true, message: 'Transaction PIN set' });
});

/** POST /api/v1/auth/verify-pin */
authRouter.post('/verify-pin', authenticate, async (req: AuthRequest, res) => {
  const { pin } = req.body;
  if (!pin) return res.status(400).json({ success: false, message: 'PIN required' });
  const user = await prisma.user.findUnique({ where: { id: req.user!.sub } });
  if (!user || !user.pin) return res.status(400).json({ success: false, message: 'No PIN set' });
  const valid = await bcrypt.compare(pin, user.pin);
  if (!valid) return res.status(400).json({ success: false, message: 'Invalid PIN' });
  res.json({ success: true, message: 'PIN verified' });
});

/** POST /api/v1/auth/login-pin — login with PIN */
authRouter.post('/login-pin', async (req, res) => {
  const { email, pin } = req.body;
  if (!email || !pin) return res.status(400).json({ success: false, message: 'Email and PIN required' });
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.pin) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const valid = await bcrypt.compare(pin, user.pin);
  if (!valid) return res.status(401).json({ success: false, message: 'Invalid PIN' });
  const token = signToken(user);
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, role: user.role, fullname: user.fullname } } });
});

/** PUT /api/v1/auth/biometric */
authRouter.put('/biometric', authenticate, async (req: AuthRequest, res) => {
  const { enabled } = req.body;
  await prisma.user.update({ where: { id: req.user!.sub }, data: { biometricEnabled: !!enabled } });
  res.json({ success: true, message: `Biometric ${enabled ? 'enabled' : 'disabled'}` });
});
