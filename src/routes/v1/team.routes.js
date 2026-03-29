import { TeamController } from '../../controllers/genericControllers.js';
import { createCrudRoutes } from './createCrudRoutes.js';

const router = createCrudRoutes(TeamController, {
  invalidateOnWrite: 'GET:/api/v1/team',
});

export default router;



