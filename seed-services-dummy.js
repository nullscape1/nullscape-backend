/**
 * Seeds dummy service categories and services for the website custom-services section.
 * Re-run safe: removes demo categories by name and services tagged with "demo-seed" in features.
 *
 * Usage:  npm run seed:services
 * Requires: MONGODB_URI in .env
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { ServiceCategory } from './src/models/ServiceCategory.js';
import { Service } from './src/models/Service.js';

const DEMO_FEATURE = 'demo-seed';

/** Must match category names used below (deleted on each run before re-insert) */
const DEMO_CATEGORY_NAMES = ['Cloud & DevOps', 'AI & Machine Learning', 'Digital Experience'];

const categoriesSeed = [
  {
    name: 'Cloud & DevOps',
    order: 1,
    status: 'active',
    description: 'Infrastructure, reliability, and delivery pipelines. [demo-seed]',
  },
  {
    name: 'AI & Machine Learning',
    order: 2,
    status: 'active',
    description: 'Applied ML, LLM integrations, and data pipelines. [demo-seed]',
  },
  {
    name: 'Digital Experience',
    order: 3,
    status: 'active',
    description: 'Web, mobile, and design systems users love. [demo-seed]',
  },
];

const servicesSeed = [
  {
    name: 'Kubernetes & Platform Engineering',
    category: 'Cloud & DevOps',
    order: 1,
    status: 'active',
    description: 'Design and operate clusters, GitOps workflows, and cost-aware scaling for your workloads.',
    features: ['Multi-cloud strategy', 'GitOps & IaC', 'Observability', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'Kubernetes & platform engineering | Nullscape',
    seoMetaDescription: 'Cluster design, GitOps, and observability for production platforms.',
  },
  {
    name: 'Cloud Migration & Modernization',
    category: 'Cloud & DevOps',
    order: 2,
    status: 'active',
    description: 'Lift-and-shift or refactor paths with clear milestones, risk controls, and rollback plans.',
    features: ['Assessment & roadmap', 'Zero-downtime cutovers', 'FinOps basics', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'Cloud migration | Nullscape',
    seoMetaDescription: 'Plan and execute cloud migrations with confidence.',
  },
  {
    name: 'Generative AI & LLM Integration',
    category: 'AI & Machine Learning',
    order: 1,
    status: 'active',
    description: 'Grounded assistants, retrieval pipelines, and guardrails aligned to your policies.',
    features: ['RAG & vector stores', 'Prompt & eval harnesses', 'Safety & PII controls', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'Generative AI integration | Nullscape',
    seoMetaDescription: 'Production-ready LLM features with governance in mind.',
  },
  {
    name: 'MLOps & Model Lifecycle',
    category: 'AI & Machine Learning',
    order: 2,
    status: 'active',
    description: 'From training to deployment: versioning, monitoring drift, and reliable retraining loops.',
    features: ['Model registry', 'Batch & online inference', 'Drift alerts', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'MLOps services | Nullscape',
    seoMetaDescription: 'End-to-end ML lifecycle for teams shipping models.',
  },
  {
    name: 'Progressive Web & SPA Development',
    category: 'Digital Experience',
    order: 1,
    status: 'active',
    description: 'Fast, accessible interfaces with performance budgets and SEO-friendly rendering strategies.',
    features: ['React / Next landscapes', 'Core Web Vitals', 'A11y reviews', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'Web & SPA development | Nullscape',
    seoMetaDescription: 'High-performance web apps with measurable UX.',
  },
  {
    name: 'Mobile Apps (iOS & Android)',
    category: 'Digital Experience',
    order: 2,
    status: 'active',
    description: 'Native and cross-platform builds with store readiness, analytics, and release trains.',
    features: ['Flutter & React Native', 'CI for mobile', 'Beta & rollout', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'Mobile app development | Nullscape',
    seoMetaDescription: 'Ship mobile products with a disciplined release process.',
  },
  {
    name: 'API Design & Integration',
    category: 'Digital Experience',
    order: 3,
    status: 'active',
    description: 'Stable contracts, backwards compatibility, and partner-ready integration layers.',
    features: ['OpenAPI-first', 'Versioning strategy', 'Rate limits & auth', DEMO_FEATURE],
    icon: '',
    seoMetaTitle: 'API design | Nullscape',
    seoMetaDescription: 'APIs your partners and frontend teams can rely on.',
  },
];

async function seed() {
  await connectMongo();

  await Service.deleteMany({ features: DEMO_FEATURE });
  await ServiceCategory.deleteMany({ name: { $in: DEMO_CATEGORY_NAMES } });

  for (const c of categoriesSeed) {
    await ServiceCategory.create({
      name: c.name,
      description: c.description,
      order: c.order,
      status: c.status,
    });
  }

  let created = 0;
  for (const s of servicesSeed) {
    await Service.create({
      name: s.name,
      category: s.category,
      order: s.order,
      status: s.status,
      description: s.description,
      features: s.features,
      icon: s.icon || undefined,
      seoMetaTitle: s.seoMetaTitle || undefined,
      seoMetaDescription: s.seoMetaDescription || undefined,
    });
    created += 1;
  }

  console.log('\n✅ Services dummy data seeded');
  console.log(`   Categories: ${categoriesSeed.length} (${DEMO_CATEGORY_NAMES.join(', ')})`);
  console.log(`   Services: ${created} (tagged with "${DEMO_FEATURE}" in features for cleanup)`);
  console.log('   Website: homepage custom-services + GET /api/v1/services?status=active');
  console.log('   Re-run: removes demo services (features demo-seed) and demo categories by name.\n');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
