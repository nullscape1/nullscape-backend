/**
 * Seeds dummy portfolio categories and projects.
 * Re-run safe: removes projects with techStack "demo-seed" and demo categories by name.
 *
 * Usage:  npm run seed:portfolio
 * Requires: MONGODB_URI in .env
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { PortfolioCategory } from './src/models/PortfolioCategory.js';
import { PortfolioProject } from './src/models/PortfolioProject.js';

const DEMO_TECH = 'demo-seed';

const DEMO_CATEGORY_NAMES = ['Web & Mobile', 'Data & AI', 'Enterprise & Cloud'];

const categoriesSeed = [
  { name: 'Web & Mobile', order: 1, status: 'active', description: 'Web apps, PWAs, and mobile experiences. [demo-seed]' },
  { name: 'Data & AI', order: 2, status: 'active', description: 'Analytics, ML, and intelligent automation. [demo-seed]' },
  { name: 'Enterprise & Cloud', order: 3, status: 'active', description: 'SaaS, integrations, and cloud operations. [demo-seed]' },
];

const img = (n) => `https://picsum.photos/seed/nullscape-portfolio-${n}/800/450`;

const projectsSeed = [
  {
    name: 'Commerce Pulse Dashboard',
    category: 'Data & AI',
    clientName: 'RetailCo',
    timeline: '12 weeks',
    problem: 'Leaders lacked a single view of omnichannel performance.',
    solution: 'Built a real-time analytics workspace with role-based views and exports.',
    description: '<p>Unified sales, inventory, and campaign metrics with drill-down and scheduled reports.</p>',
    techStack: ['React', 'Node.js', 'PostgreSQL', DEMO_TECH],
    screenshots: [img(1)],
    status: 'active',
    featured: true,
    seoTitle: 'Commerce analytics case study | Nullscape',
    seoDescription: 'Omnichannel dashboard for retail leadership teams.',
  },
  {
    name: 'Field Service Mobile Suite',
    category: 'Web & Mobile',
    clientName: 'LogiWorks',
    timeline: '16 weeks',
    problem: 'Technicians relied on paper and disconnected tools.',
    solution: 'Delivered offline-first mobile apps with sync and dispatch integration.',
    description: '<p>Cross-platform apps with GPS, work orders, and signature capture.</p>',
    techStack: ['Flutter', 'Firebase', DEMO_TECH],
    screenshots: [img(2)],
    status: 'active',
    featured: true,
    seoTitle: 'Field service mobile apps | Nullscape',
    seoDescription: 'Offline-first tools for distributed teams.',
  },
  {
    name: 'HIPAA-Aligned Patient Portal',
    category: 'Enterprise & Cloud',
    clientName: 'CareBridge',
    timeline: '20 weeks',
    problem: 'Patients needed secure access to records and messaging.',
    solution: 'Web portal with SSO, audit trails, and encrypted messaging.',
    description: '<p>Accessibility-focused portal meeting HIPAA requirements.</p>',
    techStack: ['Next.js', 'AWS', DEMO_TECH],
    screenshots: [img(3)],
    status: 'active',
    featured: false,
    seoTitle: 'Healthcare patient portal | Nullscape',
    seoDescription: 'Secure patient access and messaging.',
  },
  {
    name: 'Subscription Billing Revamp',
    category: 'Enterprise & Cloud',
    clientName: 'SaaSify',
    timeline: '14 weeks',
    problem: 'Legacy billing could not support usage-based pricing.',
    solution: 'Migrated to a flexible billing engine with usage metering and dunning.',
    description: '<p>Stripe-based flows with internal plan catalog and revenue reporting.</p>',
    techStack: ['TypeScript', 'Stripe', DEMO_TECH],
    screenshots: [img(4)],
    status: 'active',
    featured: false,
    seoTitle: 'Subscription billing migration | Nullscape',
    seoDescription: 'Usage-based SaaS billing modernization.',
  },
  {
    name: 'Computer Vision QC Line',
    category: 'Data & AI',
    clientName: 'ManufactureOne',
    timeline: '10 weeks',
    problem: 'Manual inspection slowed throughput and was inconsistent.',
    solution: 'Deployed edge inference with human-in-the-loop review workflows.',
    description: '<p>On-prem models with retraining pipeline and operator dashboards.</p>',
    techStack: ['Python', 'ONNX', DEMO_TECH],
    screenshots: [img(5)],
    status: 'active',
    featured: true,
    seoTitle: 'Vision QC for manufacturing | Nullscape',
    seoDescription: 'Automated quality inspection with edge AI.',
  },
];

async function seed() {
  await connectMongo();

  await PortfolioProject.deleteMany({ techStack: DEMO_TECH });
  await PortfolioCategory.deleteMany({ name: { $in: DEMO_CATEGORY_NAMES } });

  for (const c of categoriesSeed) {
    await PortfolioCategory.create({
      name: c.name,
      description: c.description,
      order: c.order,
      status: c.status,
    });
  }

  let created = 0;
  for (const p of projectsSeed) {
    await PortfolioProject.create({
      name: p.name,
      category: p.category,
      clientName: p.clientName,
      timeline: p.timeline,
      problem: p.problem,
      solution: p.solution,
      description: p.description,
      techStack: p.techStack,
      screenshots: p.screenshots,
      status: p.status,
      featured: p.featured,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
    });
    created += 1;
  }

  console.log('\n✅ Portfolio dummy data seeded');
  console.log(`   Categories: ${categoriesSeed.length}`);
  console.log(`   Projects: ${created} (techStack includes "${DEMO_TECH}" for cleanup)`);
  console.log('   Website: portfolio.html + GET /api/v1/portfolio?status=active\n');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
