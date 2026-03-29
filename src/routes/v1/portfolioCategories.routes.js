import { Router } from 'express';
import { PortfolioCategoryController } from '../../controllers/portfolioCategoryController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const clearPortfolioCategoryCache = (req, res, next) => {
  cacheClear('GET:/api/v1/portfolio-categories');
  cacheClear('GET:/api/v1/portfolio');
  next();
};

router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), PortfolioCategoryController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), PortfolioCategoryController.get);

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.post('/', ...admin, clearPortfolioCategoryCache, PortfolioCategoryController.create);
router.put('/:id', ...admin, clearPortfolioCategoryCache, PortfolioCategoryController.update);
router.delete('/:id', ...adminStrict, clearPortfolioCategoryCache, PortfolioCategoryController.remove);

export default router;
