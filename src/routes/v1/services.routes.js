import { Router } from 'express';
import { ServiceController } from '../../controllers/serviceController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';
import { serviceCreateSchema, serviceUpdateSchema } from '../../validators/service.js';
import { logActivity } from '../../utils/activity.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';
import { catchAsync } from '../../utils/catchAsync.js';

const router = Router();

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
// (5 minutes for list, 10 minutes for single item)
router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), ServiceController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), ServiceController.get);

// Clear cache on create/update/delete
const clearServiceCache = (req, res, next) => {
  cacheClear('GET:/api/v1/services');
  cacheClear('GET:/api/v1/services/');
  next();
};

router.post(
  '/',
  auth(),
  requireRoles('Admin', 'SuperAdmin', 'Editor'),
  validateBody(serviceCreateSchema),
  clearServiceCache,
  catchAsync(async (req, res, next) => {
    await ServiceController.create(req, res, next);
    await logActivity({ action: 'create', entity: 'Service', user: req.user, ip: req.ip, meta: { body: req.body } });
  })
);
router.put(
  '/:id',
  auth(),
  requireRoles('Admin', 'SuperAdmin', 'Editor'),
  validateBody(serviceUpdateSchema),
  clearServiceCache,
  catchAsync(async (req, res, next) => {
    await ServiceController.update(req, res, next);
    await logActivity({
      action: 'update',
      entity: 'Service',
      entityId: req.params.id,
      user: req.user,
      ip: req.ip,
      meta: { body: req.body },
    });
  })
);
router.delete(
  '/:id',
  auth(),
  requireRoles('Admin', 'SuperAdmin'),
  clearServiceCache,
  catchAsync(async (req, res, next) => {
    await ServiceController.remove(req, res, next);
    await logActivity({
      action: 'delete',
      entity: 'Service',
      entityId: req.params.id,
      user: req.user,
      ip: req.ip,
    });
  })
);

export default router;


