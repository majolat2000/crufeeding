import { Router } from 'express';
import { authenticate, AuthRequest } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';
import { prisma } from '../../config/db.pg.js';
import { logActivity } from '../activityLog/activityLog.service.js';

export const vendorRouter = Router();

/** GET /api/v1/vendor/food — list vendor's food items */
vendorRouter.get('/food', authenticate, authorize('vendor'), async (req: AuthRequest, res, next) => {
  try {
    const items = await prisma.foodItem.findMany({
      where: { vendorId: req.user!.sub },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: items });
  } catch (e) { next(e); }
});

/** POST /api/v1/vendor/food — create food item */
vendorRouter.post('/food', authenticate, authorize('vendor'), async (req: AuthRequest, res, next) => {
  try {
    const { name, cost, category, pictureUrl } = req.body;
    if (!name || !cost || !category) return res.status(400).json({ success: false, message: 'name, cost, and category required' });
    const validCategories = ['Carbohydrate', 'Protein', 'Drink', 'Others'];
    if (!validCategories.includes(category)) return res.status(400).json({ success: false, message: `category must be one of: ${validCategories.join(', ')}` });
    const item = await prisma.foodItem.create({
      data: {
        vendorId: req.user!.sub,
        name,
        cost: Number(cost),
        category,
        pictureUrl: pictureUrl || null,
      },
    });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'CREATE_FOOD_ITEM', target: name, metadata: { cost, category }, ip: req.ip });
    res.status(201).json({ success: true, data: item });
  } catch (e) { next(e); }
});

/** PUT /api/v1/vendor/food/:id — update food item */
vendorRouter.put('/food/:id', authenticate, authorize('vendor'), async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.foodItem.findFirst({ where: { id: req.params.id, vendorId: req.user!.sub } });
    if (!existing) return res.status(404).json({ success: false, message: 'Food item not found' });
    const { name, cost, category, pictureUrl, available } = req.body;
    const data: any = {};
    if (name !== undefined) data.name = name;
    if (cost !== undefined) data.cost = Number(cost);
    if (category !== undefined) data.category = category;
    if (pictureUrl !== undefined) data.pictureUrl = pictureUrl;
    if (available !== undefined) data.available = available;
    const item = await prisma.foodItem.update({ where: { id: req.params.id }, data });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'UPDATE_FOOD_ITEM', target: item.name, metadata: data, ip: req.ip });
    res.json({ success: true, data: item });
  } catch (e) { next(e); }
});

/** DELETE /api/v1/vendor/food/:id — delete food item */
vendorRouter.delete('/food/:id', authenticate, authorize('vendor'), async (req: AuthRequest, res, next) => {
  try {
    const existing = await prisma.foodItem.findFirst({ where: { id: req.params.id, vendorId: req.user!.sub } });
    if (!existing) return res.status(404).json({ success: false, message: 'Food item not found' });
    await prisma.foodItem.delete({ where: { id: req.params.id } });
    await logActivity({ actorId: req.user!.sub, actorEmail: req.user!.email, action: 'DELETE_FOOD_ITEM', target: existing.name, ip: req.ip });
    res.json({ success: true, message: 'Food item deleted' });
  } catch (e) { next(e); }
});
