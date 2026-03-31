/**
 * Seeds a default SEO document (robots + meta) for public /robots.txt and admin SEO page.
 * Re-run safe: replaces documents where metaDescription contains [demo-seed].
 *
 * Usage: node seed-seo-dummy.js
 * Requires: MONGODB_URI
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { SEOSettings } from './src/models/SEOSettings.js';

const MARKER = '[demo-seed]';

async function run() {
  await connectMongo();
  const re = new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  await SEOSettings.deleteMany({ metaDescription: re });

  const base = process.env.SITE_URL || 'https://nullscape.in';
  await SEOSettings.create({
    metaTitle: 'Nullscape — Software, mobile, AI & cloud',
    metaDescription: `Digital products and platforms that scale. Software development, mobile, AI, and cloud. ${MARKER}`,
    keywords: ['software development', 'mobile apps', 'AI', 'cloud', 'consulting'],
    ogImage: '',
    robotsTxt: `User-agent: *\nAllow: /\nSitemap: ${base}/api/v1/sitemap.xml\n# ${MARKER}`,
  });

  console.log(`✅ SEO settings seeded (${MARKER})`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await mongoose.connection.close();
});
