import { Router } from 'express';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { ActivityLog } from '../../models/ActivityLog.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.get('/', ...admin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      ActivityLog.find({}).sort('-createdAt').skip(skip).limit(Number(limit)),
      ActivityLog.countDocuments({}),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) {
    next(e);
  }
});

export default router;



