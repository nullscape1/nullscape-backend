import { Router } from 'express';
import { PortfolioController } from '../../controllers/portfolioController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const clearPortfolioCache = (req, res, next) => {
  cacheClear('GET:/api/v1/portfolio');
  next();
};

router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), PortfolioController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(15 * 60 * 1000), PortfolioController.get);

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.post('/', ...admin, clearPortfolioCache, PortfolioController.create);
router.put('/:id', ...admin, clearPortfolioCache, PortfolioController.update);
router.delete('/:id', ...adminStrict, clearPortfolioCache, PortfolioController.remove);

export default router;
