import { Router } from 'express';
import { InquiryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { validateBody } from '../../middlewares/validate.js';
import { inquiryCreateSchema, inquiryUpdateSchema } from '../../validators/inquiry.js';
import { Inquiry } from '../../models/Inquiry.js';
import { createInquiry } from '../../services/inquiry.service.js';
import { formRateLimiter } from '../../middlewares/rateLimiter.js';
import { catchAsync } from '../../utils/catchAsync.js';
import httpStatus from 'http-status';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];

// Public submission endpoint with rate limiting and validation
router.post('/', formRateLimiter, validateBody(inquiryCreateSchema), catchAsync(async (req, res) => {
  const inquiry = await createInquiry(req.body);
  res.status(httpStatus.CREATED).json(inquiry);
}));

// Admin list/manage (specific path before :id to avoid "export" matching as id)
router.get('/', ...admin, InquiryController.list);
router.get('/export/csv', ...admin, async (req, res, next) => {
  try {
    const items = await Inquiry.find({}).sort('-createdAt').lean();
    const header = ['type', 'name', 'email', 'phone', 'message', 'resolved', 'createdAt'];
    const rows = items.map((i) => [i.type, i.name, i.email, i.phone, (i.message || '').replace(/\n/g, ' '), i.resolved, i.createdAt.toISOString()]);
    const csv = [header.join(','), ...rows.map((r) => r.map((v) => (typeof v === 'string' && v.includes(',') ? `"${v.replace(/"/g, '""')}"` : v)).join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"inquiries.csv\"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});
router.get('/:id', ...admin, InquiryController.get);
router.put('/:id', ...admin, validateBody(inquiryUpdateSchema), InquiryController.update);
router.delete('/:id', ...admin, InquiryController.remove);

export default router;


