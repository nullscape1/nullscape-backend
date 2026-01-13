import { Router } from 'express';
import { ServiceCategoryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(10 * 60 * 1000), ServiceCategoryController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), ServiceCategoryController.get);
router.post('/', ...admin, ServiceCategoryController.create);
router.put('/:id', ...admin, ServiceCategoryController.update);
router.delete('/:id', ...adminStrict, ServiceCategoryController.remove);

export default router;



