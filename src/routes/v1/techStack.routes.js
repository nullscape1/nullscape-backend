import { Router } from 'express';
import { TechStackController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(10 * 60 * 1000), TechStackController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), TechStackController.get);
router.post('/', ...admin, TechStackController.create);
router.put('/:id', ...admin, TechStackController.update);
router.delete('/:id', ...adminStrict, TechStackController.remove);

export default router;


