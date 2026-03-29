import dayjs from 'dayjs';
import { Service } from '../models/Service.js';
import { PortfolioProject } from '../models/PortfolioProject.js';
import { Inquiry } from '../models/Inquiry.js';
import { User } from '../models/User.js';
import { BlogPost } from '../models/BlogPost.js';

/**
 * Build dashboard summary for admin.
 * Business logic lives here; route handler only calls this and sets HTTP response.
 */
export async function getSummary() {
  const startOfDay = dayjs().startOf('day').toDate();

  const [totalProjects, totalServices, enquiriesToday, newUsers, totalBlogPosts, latestInquiries] = await Promise.all([
    PortfolioProject.countDocuments({ status: 'active' }),
    Service.countDocuments({ status: 'active' }),
    Inquiry.countDocuments({ createdAt: { $gte: startOfDay } }),
    User.countDocuments({ createdAt: { $gte: startOfDay } }),
    BlogPost.countDocuments({}),
    Inquiry.find({}).sort('-createdAt').limit(5).lean(),
  ]);

  return {
    totalProjects,
    totalServices,
    enquiriesToday,
    newUsers,
    totalBlogPosts,
    latestInquiries,
  };
}
