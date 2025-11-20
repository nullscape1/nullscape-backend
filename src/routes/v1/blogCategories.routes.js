import { Router } from 'express';
import { BlogCategoryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(10 * 60 * 1000), BlogCategoryController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), BlogCategoryController.get);
router.post('/', ...admin, BlogCategoryController.create);
router.put('/:id', ...admin, BlogCategoryController.update);
router.delete('/:id', ...adminStrict, BlogCategoryController.remove);

export default router;


