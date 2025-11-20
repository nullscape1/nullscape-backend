import { Router } from 'express';
import { SubscriberController } from '../../controllers/genericControllers.js';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { Subscriber } from '../../models/Subscriber.js';
import { formRateLimiter } from '../../middlewares/rateLimiter.js';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];

// Public subscription endpoint with rate limiting
router.post('/subscribe', formRateLimiter, SubscriberController.create);
router.get('/', ...admin, SubscriberController.list);
router.put('/:id', ...admin, SubscriberController.update);
router.delete('/:id', ...admin, SubscriberController.remove);

router.get('/export/csv', ...admin, async (req, res, next) => {
  try {
    const items = await Subscriber.find({}).sort('-createdAt').lean();
    const header = ['email', 'status', 'createdAt'];
    const rows = items.map((s) => [s.email, s.status, s.createdAt.toISOString()]);
    const csv = [header.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=\"subscribers.csv\"');
    res.send(csv);
  } catch (e) {
    next(e);
  }
});

export default router;


