import { Router } from 'express';
import { PortfolioController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(5 * 60 * 1000), PortfolioController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), PortfolioController.get);
router.post('/', ...admin, PortfolioController.create);
router.put('/:id', ...admin, PortfolioController.update);
router.delete('/:id', ...adminStrict, PortfolioController.remove);

export default router;



