import { Router } from 'express';
import { TechStackController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(10 * 60 * 1000), TechStackController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), TechStackController.get);
router.post('/', ...admin, TechStackController.create);
router.put('/:id', ...admin, TechStackController.update);
router.delete('/:id', ...adminStrict, TechStackController.remove);

export default router;


