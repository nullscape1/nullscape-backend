import { PricingPlanController } from '../../controllers/genericControllers.js';
import { createCrudRoutes } from './createCrudRoutes.js';

const router = createCrudRoutes(PricingPlanController, {
  invalidateOnWrite: 'GET:/api/v1/pricing',
});

export default router;


