import { Router } from 'express';
import { PartnerController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PartnerController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PartnerController.get);
router.post('/', ...admin, PartnerController.create);
router.put('/:id', ...admin, PartnerController.update);
router.delete('/:id', ...adminStrict, PartnerController.remove);

export default router;

