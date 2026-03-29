import { Router } from 'express';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { getSummary } from '../../services/analytics.service.js';
import { cacheMiddleware } from '../../utils/cache.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];

router.get('/summary', ...admin, cacheMiddleware(30000), catchAsync(async (req, res) => {
  const summary = await getSummary();
  res.json(summary);
}));

export default router;


