import { PartnerController } from '../../controllers/genericControllers.js';
import { createCrudRoutes } from './createCrudRoutes.js';

const router = createCrudRoutes(PartnerController, {
  invalidateOnWrite: 'GET:/api/v1/partners',
});

export default router;



