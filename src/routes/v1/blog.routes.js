import { Router } from 'express';
import { BlogController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';
import { formRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
// (5 minutes for list, 15 minutes for published posts)
router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), BlogController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(15 * 60 * 1000), BlogController.get);
router.post('/', ...admin, BlogController.create);
router.put('/:id', ...admin, BlogController.update);
router.delete('/:id', ...adminStrict, BlogController.remove);

export default router;



