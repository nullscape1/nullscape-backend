import { Router } from 'express';
import authRoutes from './auth.routes.js';
import serviceRoutes from './services.routes.js';
import blogRoutes from './blog.routes.js';
import blogCategoryRoutes from './blogCategories.routes.js';
import portfolioRoutes from './portfolio.routes.js';
import portfolioCategoryRoutes from './portfolioCategories.routes.js';
import testimonialRoutes from './testimonials.routes.js';
import teamRoutes from './team.routes.js';
import techStackRoutes from './techStack.routes.js';
import pricingRoutes from './pricing.routes.js';
import inquiryRoutes from './inquiries.routes.js';
import newsletterRoutes from './newsletter.routes.js';
import uploadRoutes from './uploads.routes.js';
import cmsRoutes from './cms.routes.js';
import analyticsRoutes from './analytics.routes.js';
import seoPublicRoutes from './seoPublic.routes.js';
import activityRoutes from './activity.routes.js';
import jobsRoutes from './jobs.routes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/services', serviceRoutes);
router.use('/blog', blogRoutes);
router.use('/blog-categories', blogCategoryRoutes);
router.use('/portfolio', portfolioRoutes);
router.use('/portfolio-categories', portfolioCategoryRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/team', teamRoutes);
router.use('/tech-stack', techStackRoutes);
router.use('/pricing', pricingRoutes);
router.use('/inquiries', inquiryRoutes);
router.use('/newsletter', newsletterRoutes);
router.use('/uploads', uploadRoutes);
router.use('/cms', cmsRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/seo', seoPublicRoutes);
router.use('/activity', activityRoutes);
router.use('/jobs', jobsRoutes);

export default router;
