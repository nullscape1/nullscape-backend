import { Router } from 'express';
import { JobController, ApplicationController } from '../../controllers/genericControllers.js';
import { Application } from '../../models/Application.js';
import { auth, requireRoles } from '../../middlewares/auth.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

// Jobs
router.get('/', JobController.list);
router.get('/:id', JobController.get);
router.post('/', ...admin, JobController.create);
router.put('/:id', ...admin, JobController.update);
router.delete('/:id', ...adminStrict, JobController.remove);

// Applications
router.get('/:jobId/applications', ...admin, async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Application.find({ job: req.params.jobId }).sort(sort).skip(skip).limit(Number(limit)),
      Application.countDocuments({ job: req.params.jobId }),
    ]);
    res.json({ items, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
  } catch (e) {
    next(e);
  }
});
router.post('/:jobId/applications', async (req, res, next) => {
  try {
    req.body.job = req.params.jobId;
    return ApplicationController.create(req, res, next);
  } catch (e) {
    next(e);
  }
});

export default router;


