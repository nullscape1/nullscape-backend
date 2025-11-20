import { Router } from 'express';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { PageContentController, SEOSettingsController } from '../../controllers/genericControllers.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Page contents
router.get('/pages', PageContentController.list);
router.get('/pages/:id', PageContentController.get);
router.post('/pages', ...admin, PageContentController.create);
router.put('/pages/:id', ...admin, PageContentController.update);
router.delete('/pages/:id', ...adminStrict, PageContentController.remove);

// SEO
router.get('/seo', SEOSettingsController.list);
router.get('/seo/:id', SEOSettingsController.get);
router.post('/seo', ...admin, SEOSettingsController.create);
router.put('/seo/:id', ...admin, SEOSettingsController.update);
router.delete('/seo/:id', ...adminStrict, SEOSettingsController.remove);

export default router;



