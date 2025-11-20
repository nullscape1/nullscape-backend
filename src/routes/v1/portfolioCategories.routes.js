import { Router } from 'express';
import { PortfolioCategoryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(10 * 60 * 1000), PortfolioCategoryController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), PortfolioCategoryController.get);
router.post('/', ...admin, PortfolioCategoryController.create);
router.put('/:id', ...admin, PortfolioCategoryController.update);
router.delete('/:id', ...adminStrict, PortfolioCategoryController.remove);

export default router;


