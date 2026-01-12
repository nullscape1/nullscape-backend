import { Router } from 'express';
import { PortfolioCategoryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PortfolioCategoryController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PortfolioCategoryController.get);
router.post('/', ...admin, PortfolioCategoryController.create);
router.put('/:id', ...admin, PortfolioCategoryController.update);
router.delete('/:id', ...adminStrict, PortfolioCategoryController.remove);

export default router;


