import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { env } from '../../config/env.js';

export const authRouter = Router();

// Mock user store — replace with Mongoose User model in production
const USERS = [
  { id: 'u1', email: 'bursary@crawford.edu.ng', passwordHash: bcrypt.hashSync('admin123', 10), role: 'super_admin' as const },
  { id: 'u2', email: 'k.ojo@crawford.edu.ng', passwordHash: bcrypt.hashSync('bursar123', 10), role: 'bursar' as const },
];

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

/**
 * POST /api/v1/auth/login — returns JWT with role
 */
authRouter.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ success: false, message: parsed.error.message });
  const { email, password } = parsed.data;
  const user = USERS.find((u) => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn } as any);
  res.json({ success: true, data: { token, user: { id: user.id, email: user.email, role: user.role } } });
});

/**
 * GET /api/v1/auth/me — verify token (uses authenticate middleware in real wiring)
 */
authRouter.get('/me', async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ success: false, message: 'No token' });
  try {
    const payload = jwt.verify(header.replace('Bearer ', ''), env.jwtSecret);
    res.json({ success: true, data: payload });
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
});
