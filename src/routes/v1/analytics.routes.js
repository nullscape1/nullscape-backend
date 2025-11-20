import { Router } from 'express';
import { auth, requireRoles } from '../../middlewares/auth.js';
import { Service } from '../../models/Service.js';
import { PortfolioProject } from '../../models/PortfolioProject.js';
import { Inquiry } from '../../models/Inquiry.js';
import { User } from '../../models/User.js';
import { BlogPost } from '../../models/BlogPost.js';
import { cacheMiddleware } from '../../utils/cache.js';
import dayjs from 'dayjs';

const router = Router();
const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];

router.get('/summary', ...admin, cacheMiddleware(30000), async (req, res, next) => {
  try {
    const startOfDay = dayjs().startOf('day').toDate();
    const [totalProjects, totalServices, enquiriesToday, newUsers, totalBlogPosts, latestInquiries] = await Promise.all([
      PortfolioProject.countDocuments({ status: 'active' }),
      Service.countDocuments({ status: 'active' }),
      Inquiry.countDocuments({ createdAt: { $gte: startOfDay } }),
      User.countDocuments({ createdAt: { $gte: startOfDay } }),
      BlogPost.countDocuments({}),
      Inquiry.find({}).sort('-createdAt').limit(5).lean(),
    ]);
    res.json({ totalProjects, totalServices, enquiriesToday, newUsers, totalBlogPosts, latestInquiries });
  } catch (e) {
    next(e);
  }
});

export default router;


