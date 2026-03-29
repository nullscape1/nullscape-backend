/**
 * Seeds dummy blog categories and posts (tagged with demo-seed for idempotent re-runs).
 *
 * Usage:  npm run seed:blog
 * Requires: MONGODB_URI in .env
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { BlogCategory } from './src/models/BlogCategory.js';
import { BlogPost } from './src/models/BlogPost.js';

const DEMO_TAG = 'demo-seed';

const categoriesSeed = [
  { name: 'Engineering', order: 1, description: 'Build, ship, and scale software the right way.', status: 'active' },
  { name: 'Company News', order: 2, description: 'Updates from the Nullscape team.', status: 'active' },
  { name: 'Tutorials', order: 3, description: 'Step-by-step guides and how-tos.', status: 'active' },
];

const postsSeed = [
  {
    title: 'Why we invest in platform thinking before features',
    description: 'A short take on reducing rework by getting foundations right early.',
    category: 'Engineering',
    tags: [DEMO_TAG, 'architecture', 'platform'],
    status: 'published',
    seoTitle: 'Platform thinking before features | Nullscape',
    seoDescription: 'Why solid foundations beat a backlog of one-off features.',
    contentHtml:
      '<p>Teams often rush to ship features while technical debt quietly compounds. Platform thinking means investing in shared APIs, observability, and deployment pipelines <em>before</em> the roadmap gets crowded.</p>' +
      '<h2>What changes</h2><p>When the platform is boring and reliable, product teams move faster with fewer outages and less firefighting.</p>' +
      '<p>This post is sample content from the blog seed script.</p>',
  },
  {
    title: 'Nullscape expands partner ecosystem',
    description: 'We are growing our network of technology and cloud partners.',
    category: 'Company News',
    tags: [DEMO_TAG, 'partners', 'news'],
    status: 'published',
    seoTitle: 'Partner ecosystem | Nullscape',
    seoDescription: 'News about our growing partner network.',
    contentHtml:
      '<p>Strong partnerships help us deliver end-to-end solutions for clients across regions and industries.</p>' +
      '<p>This announcement is placeholder copy for local development and demos.</p>',
  },
  {
    title: 'Getting started with API-first design',
    description: 'Sketch contracts, mock servers, and iterate with frontend teams in parallel.',
    category: 'Tutorials',
    tags: [DEMO_TAG, 'api', 'design'],
    status: 'published',
    seoTitle: 'API-first design tutorial | Nullscape',
    seoDescription: 'Practical steps to design APIs before implementation.',
    contentHtml:
      '<ol><li>Define resources and error shapes in OpenAPI.</li><li>Generate mocks and share with stakeholders.</li><li>Ship the server against the same contract.</li></ol>' +
      '<p>Sample tutorial body for the website blog listing and detail pages.</p>',
  },
  {
    title: 'Draft: Upcoming webinar on AI in production',
    description: 'This post is intentionally a draft — it should not appear on the public blog.',
    category: 'Company News',
    tags: [DEMO_TAG, 'draft', 'events'],
    status: 'draft',
    seoTitle: '',
    seoDescription: '',
    contentHtml: '<p>Draft content. Publish from the admin panel when ready.</p>',
  },
  {
    title: 'Five signals your mobile app needs a performance pass',
    description: 'Battery drain, jank, and cold start times are worth watching early.',
    category: 'Engineering',
    tags: [DEMO_TAG, 'mobile', 'performance'],
    status: 'published',
    seoTitle: 'Mobile app performance signals | Nullscape',
    seoDescription: 'When to schedule a focused performance improvement sprint.',
    contentHtml:
      '<ul><li>Cold start exceeds team targets</li><li>Scroll jank on mid-range devices</li><li>ANR or crash spikes in production</li></ul>' +
      '<p>Use this checklist as a conversation starter with your team.</p>',
  },
  {
    title: 'How we run incident reviews without blame',
    description: 'Focus on systems, timelines, and follow-up actions.',
    category: 'Engineering',
    tags: [DEMO_TAG, 'culture', 'reliability'],
    status: 'published',
    seoTitle: 'Blameless incident reviews | Nullscape',
    seoDescription: 'A lightweight process for learning from outages.',
    contentHtml:
      '<p>Blameless postmortems emphasize facts and remediation. Everyone leaves with clearer ownership and fewer repeat incidents.</p>',
  },
];

async function seed() {
  await connectMongo();

  for (const c of categoriesSeed) {
    let doc = await BlogCategory.findOne({ name: c.name });
    if (!doc) {
      doc = await BlogCategory.create({
        name: c.name,
        description: c.description,
        order: c.order,
        status: c.status,
      });
    } else {
      doc.description = c.description;
      doc.order = c.order;
      doc.status = c.status;
      await doc.save();
    }
  }

  await BlogPost.deleteMany({ tags: DEMO_TAG });

  let created = 0;
  for (const p of postsSeed) {
    await BlogPost.create({
      title: p.title,
      description: p.description,
      contentHtml: p.contentHtml,
      thumbnail: '',
      tags: p.tags,
      category: p.category,
      seoTitle: p.seoTitle || undefined,
      seoDescription: p.seoDescription || undefined,
      status: p.status,
    });
    created += 1;
  }

  const published = await BlogPost.countDocuments({ tags: DEMO_TAG, status: 'published' });

  console.log('\n✅ Blog dummy data seeded');
  console.log(`   Categories (upserted): ${categoriesSeed.length}`);
  console.log(`   Posts created: ${created} (${published} published, ${created - published} draft)`);
  console.log(`   Public list: GET /api/v1/blog?status=published&sort=-publishedAt`);
  console.log(`   Re-run safe: removes posts tagged "${DEMO_TAG}" then recreates them.\n`);
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
