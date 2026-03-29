import { TechStackController } from '../../controllers/genericControllers.js';
import { createCrudRoutes } from './createCrudRoutes.js';

const router = createCrudRoutes(TechStackController, {
  invalidateOnWrite: 'GET:/api/v1/tech-stack',
});

export default router;


