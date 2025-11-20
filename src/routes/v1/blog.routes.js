import { Router } from 'express';
import { BlogController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';
import { formRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching (5 minutes for list, 15 minutes for published posts)
router.get('/', cacheMiddleware(5 * 60 * 1000), BlogController.list);
router.get('/:id', cacheMiddleware(15 * 60 * 1000), BlogController.get);
router.post('/', ...admin, BlogController.create);
router.put('/:id', ...admin, BlogController.update);
router.delete('/:id', ...adminStrict, BlogController.remove);

export default router;



