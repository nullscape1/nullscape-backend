import { Router } from 'express';
import { auth, optionalAuth, requireRoles } from '../../middlewares/auth.js';
import { ServiceController } from '../../controllers/serviceController.js';
import {
  CaseStudyController,
  CmsPageV2Controller,
  CmsSectionV2Controller,
  GlobalSettingV2Controller,
  IndustryController,
  getBlogsPublic,
  getCaseStudiesPublic,
  getGlobalSettings,
  getPageBySlug,
  listSectionsByPage,
} from '../../controllers/cmsV2.controller.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Public CMS endpoints required for dynamic website.
router.get('/page/:slug', optionalAuth(), getPageBySlug);
router.get('/global-settings', optionalAuth(), getGlobalSettings);
router.get('/services', optionalAuth(), ServiceController.list);
router.get('/blogs', optionalAuth(), getBlogsPublic);
router.get('/case-studies', optionalAuth(), getCaseStudiesPublic);

// Admin CMS endpoints. Register more specific paths before `/cms-v2/pages/:id`.
router.get('/cms-v2/pages', ...admin, CmsPageV2Controller.list);
router.get('/cms-v2/pages/:id/sections', ...admin, listSectionsByPage);
router.get('/cms-v2/pages/:id', ...admin, CmsPageV2Controller.get);
router.post('/cms-v2/pages', ...admin, CmsPageV2Controller.create);
router.put('/cms-v2/pages/:id', ...admin, CmsPageV2Controller.update);
router.delete('/cms-v2/pages/:id', ...adminStrict, CmsPageV2Controller.remove);

router.get('/cms-v2/sections', ...admin, CmsSectionV2Controller.list);
router.get('/cms-v2/sections/:id', ...admin, CmsSectionV2Controller.get);
router.post('/cms-v2/sections', ...admin, CmsSectionV2Controller.create);
router.put('/cms-v2/sections/:id', ...admin, CmsSectionV2Controller.update);
router.delete('/cms-v2/sections/:id', ...adminStrict, CmsSectionV2Controller.remove);

router.get('/cms-v2/case-studies', ...admin, CaseStudyController.list);
router.get('/cms-v2/case-studies/:id', ...admin, CaseStudyController.get);
router.post('/cms-v2/case-studies', ...admin, CaseStudyController.create);
router.put('/cms-v2/case-studies/:id', ...admin, CaseStudyController.update);
router.delete('/cms-v2/case-studies/:id', ...adminStrict, CaseStudyController.remove);

router.get('/cms-v2/industries', ...admin, IndustryController.list);
router.get('/cms-v2/industries/:id', ...admin, IndustryController.get);
router.post('/cms-v2/industries', ...admin, IndustryController.create);
router.put('/cms-v2/industries/:id', ...admin, IndustryController.update);
router.delete('/cms-v2/industries/:id', ...adminStrict, IndustryController.remove);

router.get('/cms-v2/settings', ...admin, GlobalSettingV2Controller.list);
router.get('/cms-v2/settings/:id', ...admin, GlobalSettingV2Controller.get);
router.post('/cms-v2/settings', ...admin, GlobalSettingV2Controller.create);
router.put('/cms-v2/settings/:id', ...admin, GlobalSettingV2Controller.update);
router.delete('/cms-v2/settings/:id', ...adminStrict, GlobalSettingV2Controller.remove);

export default router;
