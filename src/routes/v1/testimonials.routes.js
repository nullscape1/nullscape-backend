import { Router } from 'express';
import { TestimonialController } from '../../controllers/testimonialController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

const clearTestimonialsCache = (req, res, next) => {
  cacheClear('GET:/api/v1/testimonials');
  next();
};

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.get('/', optionalAuth(), cacheMiddleware(FIVE_MIN), TestimonialController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(TEN_MIN), TestimonialController.get);

router.post('/', ...admin, clearTestimonialsCache, TestimonialController.create);
router.put('/:id', ...admin, clearTestimonialsCache, TestimonialController.update);
router.delete('/:id', ...adminStrict, clearTestimonialsCache, TestimonialController.remove);

export default router;
