import { Router } from 'express';
import { SEOSettings } from '../../models/SEOSettings.js';
import { Service } from '../../models/Service.js';
import { BlogPost } from '../../models/BlogPost.js';
import { PortfolioProject } from '../../models/PortfolioProject.js';
import { cacheMiddleware } from '../../utils/cache.js';

const router = Router();

// SEO routes with longer cache (30 minutes for sitemap, 1 hour for robots.txt)
router.get('/robots.txt', cacheMiddleware(60 * 60 * 1000), async (req, res, next) => {
  try {
    const settings = await SEOSettings.findOne({}).sort('-updatedAt').lean();
    const robots = settings?.robotsTxt || `User-agent: *\nAllow: /\nSitemap: ${process.env.SITE_URL || 'https://nullscape.in'}/sitemap.xml`;
    res.setHeader('Content-Type', 'text/plain');
    res.send(robots);
  } catch (e) {
    next(e);
  }
});

router.get('/sitemap.xml', cacheMiddleware(30 * 60 * 1000), async (req, res, next) => {
  try {
    const base = process.env.SITE_URL || 'https://nullscape.in';
    const [services, blogs, projects] = await Promise.all([
      Service.find({ status: 'active' }).select('slug updatedAt').lean().limit(1000),
      BlogPost.find({ status: 'published' }).select('slug updatedAt').sort('-publishedAt').lean().limit(1000),
      PortfolioProject.find({ status: 'active' }).select('slug updatedAt').lean().limit(1000),
    ]);
    const urls = [
      { loc: `${base}/`, lastmod: new Date() },
      ...services.map((s) => ({ loc: `${base}/services/${s.slug}`, lastmod: s.updatedAt })),
      ...blogs.map((b) => ({ loc: `${base}/blog/${b.slug}`, lastmod: b.updatedAt })),
      ...projects.map((p) => ({ loc: `${base}/portfolio/${p.slug}`, lastmod: p.updatedAt })),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
      `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
      urls.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${new Date(u.lastmod).toISOString()}</lastmod></url>`).join('\n') +
      `\n</urlset>`;
    res.setHeader('Content-Type', 'application/xml');
    res.send(xml);
  } catch (e) {
    next(e);
  }
});

export default router;



