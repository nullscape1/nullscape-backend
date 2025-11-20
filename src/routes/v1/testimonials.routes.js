import { Router } from 'express';
import { TestimonialController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(5 * 60 * 1000), TestimonialController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), TestimonialController.get);
router.post('/', ...admin, TestimonialController.create);
router.put('/:id', ...admin, TestimonialController.update);
router.delete('/:id', ...adminStrict, TestimonialController.remove);

export default router;



