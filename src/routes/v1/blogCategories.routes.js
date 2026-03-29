import { Router } from 'express';
import { BlogCategoryController } from '../../controllers/blogCategoryController.js';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const router = Router();

const clearBlogCategoryCache = (req, res, next) => {
  cacheClear('GET:/api/v1/blog-categories');
  cacheClear('GET:/api/v1/blog');
  next();
};

router.get('/', optionalAuth(), cacheMiddleware(5 * 60 * 1000), BlogCategoryController.list);
router.get('/:id', optionalAuth(), cacheMiddleware(10 * 60 * 1000), BlogCategoryController.get);

const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

router.post('/', ...admin, clearBlogCategoryCache, BlogCategoryController.create);
router.put('/:id', ...admin, clearBlogCategoryCache, BlogCategoryController.update);
router.delete('/:id', ...adminStrict, clearBlogCategoryCache, BlogCategoryController.remove);

export default router;
