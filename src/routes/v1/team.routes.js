import { Router } from 'express';
import { TeamController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public routes with caching
router.get('/', cacheMiddleware(5 * 60 * 1000), TeamController.list);
router.get('/:id', cacheMiddleware(10 * 60 * 1000), TeamController.get);
router.post('/', ...admin, TeamController.create);
router.put('/:id', ...admin, TeamController.update);
router.delete('/:id', ...adminStrict, TeamController.remove);

export default router;



