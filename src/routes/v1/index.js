import { Router } from 'express';
import authRoutes from './auth.routes.js';
import serviceRoutes from './services.routes.js';
import cmsRoutes from './cms.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import blogRoutes from './blog.routes.js';
import testimonialsRoutes from './testimonials.routes.js';
import teamRoutes from './team.routes.js';
import jobsRoutes from './jobs.routes.js';
import inquiriesRoutes from './inquiries.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import uploadsRoutes from './uploads.routes.js';
import analyticsRoutes from './analytics.routes.js';
import seoPublicRoutes from './seoPublic.routes.js';
import activityRoutes from './activity.routes.js';
import portfolioCategoriesRoutes from './portfolioCategories.routes.js';
import techStackRoutes from './techStack.routes.js';
import pricingRoutes from './pricing.routes.js';
import blogCategoriesRoutes from './blogCategories.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/cms', cmsRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/portfolio-categories', portfolioCategoriesRoutes);
router.use('/blog', blogRoutes);
router.use('/blog-categories', blogCategoriesRoutes);
router.use('/testimonials', testimonialsRoutes);
router.use('/team', teamRoutes);
router.use('/jobs', jobsRoutes);
router.use('/inquiries', inquiriesRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/uploads', uploadsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/tech-stack', techStackRoutes);
router.use('/pricing', pricingRoutes);
router.use('/', seoPublicRoutes);
router.use('/activity', activityRoutes);

export default router;


