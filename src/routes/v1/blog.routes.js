import { Router } from 'express';
import { BlogController } from '../../controllers/blogController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const clearBlogCache = (req, res, next) => {
  cacheClear('GET:/api/v1/blog');
  next();
};

router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), BlogController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(15 * 60 * 1000), BlogController.get);

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.post('/', ...admin, clearBlogCache, BlogController.create);
router.put('/:id', ...admin, clearBlogCache, BlogController.update);
router.delete('/:id', ...adminStrict, clearBlogCache, BlogController.remove);

export default router;
