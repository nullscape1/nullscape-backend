import { Router } from 'express';
import { InquiryController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { Inquiry } from '../../models/Inquiry.js';
import { sendMail } from '../../utils/mailer.js';
import { formRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];

// Public submission endpoint with rate limiting
router.post('/', formRateLimiter, async (req, res, next) => {
  try {
    const inquiry = await Inquiry.create(req.body);
    // Notify admin (if SMTP configured)
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      await sendMail({
        to: adminEmail,
        subject: `New inquiry: ${inquiry.type} from ${inquiry.name || inquiry.email}`,
        text: `Type: ${inquiry.type}\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone}\nMessage: ${inquiry.message}`,
      });
    }
    // Auto-reply (optional)
    if (inquiry.email && process.env.INQUIRY_AUTOREPLY_SUBJECT) {
      await sendMail({
        to: inquiry.email,
        subject: process.env.INQUIRY_AUTOREPLY_SUBJECT,
        text: process.env.INQUIRY_AUTOREPLY_TEXT || 'Thank you for contacting us. We will get back to you soon.',
      });
    }
    res.status(201).json(inquiry);
  } catch (e) {
    next(e);
  }
});

// Admin list/manage
router.get('/', ...admin, InquiryController.list);
router.put('/:id', ...admin, InquiryController.update);
router.delete('/:id', ...admin, InquiryController.remove);

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

export default router;


