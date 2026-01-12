import { Router } from 'express';
import { PricingPlanController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PricingPlanController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PricingPlanController.get);
router.post('/', ...admin, PricingPlanController.create);
router.put('/:id', ...admin, PricingPlanController.update);
router.delete('/:id', ...adminStrict, PricingPlanController.remove);

export default router;


