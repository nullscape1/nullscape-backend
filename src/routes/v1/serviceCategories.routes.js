import { Router } from 'express';
import { ServiceCategoryController } from '../../controllers/serviceCategoryController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const clearServiceCategoryCache = (req, res, next) => {
  cacheClear('GET:/api/v1/service-categories');
  cacheClear('GET:/api/v1/services');
  next();
};

router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), ServiceCategoryController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), ServiceCategoryController.get);

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.post('/', ...admin, clearServiceCategoryCache, ServiceCategoryController.create);
router.put('/:id', ...admin, clearServiceCategoryCache, ServiceCategoryController.update);
router.delete('/:id', ...adminStrict, clearServiceCategoryCache, ServiceCategoryController.remove);

export default router;
