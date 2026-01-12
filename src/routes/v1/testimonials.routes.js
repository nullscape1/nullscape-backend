import { Router } from 'express';
import { TestimonialController } from '../../controllers/genericControllers.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching - use optionalAuth to set req.user for authenticated requests
router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), TestimonialController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), TestimonialController.get);
router.post('/', ...admin, TestimonialController.create);
router.put('/:id', ...admin, TestimonialController.update);
router.delete('/:id', ...adminStrict, TestimonialController.remove);

export default router;



