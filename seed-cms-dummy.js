/**
 * Seeds dummy Growth CMS data (CmsPageV2, CmsSectionV2, GlobalSettingV2).
 * Safe to re-run: replaces sections for slug "home" and upserts global settings.
 *
 * Usage:  node seed-cms-dummy.js
 * Requires: MONGODB_URI in .env
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { CmsPageV2 } from './src/models/CmsPageV2.js';
import { CmsSectionV2 } from './src/models/CmsSectionV2.js';
import { GlobalSettingV2 } from './src/models/GlobalSettingV2.js';

const HOME_SLUG = 'home';

const homePagePayload = {
  title: 'Nullscape — Home (CMS demo)',
  seoTitle: 'Nullscape | Digital Solutions That Scale',
  seoDescription:
    'Demo content from Growth CMS: software development, mobile apps, cloud, and consulting — seeded for local development.',
  seoKeywords: ['software', 'mobile apps', 'cloud', 'consulting'],
  status: 'published',
};

const homeSections = [
  {
    type: 'hero',
    name: 'Hero',
    order: 0,
    status: 'published',
    content: {
      eyebrow: 'From the CMS',
      title: 'Engineering-led products that ship and scale',
      subtitle:
        'This block is loaded from Growth CMS (slug: home). Edit it in Admin → Website CMS (Growth).',
      primaryCtaText: 'Get Started',
      primaryCtaLink: '#contact',
      secondaryCtaText: 'View Services',
      secondaryCtaLink: '#custom-services',
    },
  },
  {
    type: 'services',
    name: 'Service highlights',
    order: 1,
    status: 'published',
    content: {
      title: 'What we focus on',
      items: [
        { title: 'Custom software', description: 'Web platforms, APIs, and internal tools tailored to your workflows.' },
        { title: 'Mobile apps', description: 'iOS and Android experiences with performance and UX in mind.' },
        { title: 'Cloud & DevOps', description: 'Reliable deployments, observability, and cost-aware infrastructure.' },
        { title: 'AI & automation', description: 'Practical ML integrations and process automation where they matter.' },
      ],
    },
  },
  {
    type: 'process',
    name: 'How we work',
    order: 2,
    status: 'published',
    content: {
      steps: [
        'Discovery — goals, constraints, and success metrics.',
        'Design & plan — architecture, milestones, and risks.',
        'Build — iterative delivery with visible progress.',
        'Launch & improve — monitoring, feedback, and iteration.',
      ],
    },
  },
  {
    type: 'cta',
    name: 'Primary CTA',
    order: 3,
    status: 'published',
    content: {
      title: 'Ready to talk about your next build?',
      description: 'Dummy CTA from CMS — replace copy in the admin panel.',
      text: 'Contact us',
      link: '#contact',
    },
  },
  {
    type: 'testimonials',
    name: 'Testimonials (sample)',
    order: 4,
    status: 'published',
    content: {
      items: [
        { quote: 'Clear communication and solid delivery across the whole stack.', name: 'Alex M., Product lead' },
        { quote: 'They turned a vague idea into a product we could sell in months.', name: 'Jordan K., Founder' },
      ],
    },
  },
  {
    type: 'industries',
    name: 'Industries',
    order: 5,
    status: 'published',
    content: {
      items: ['FinTech', 'Health & wellness', 'E‑commerce', 'Logistics', 'Education'],
    },
  },
  {
    type: 'blog',
    name: 'Blog teaser (static items)',
    order: 6,
    status: 'published',
    content: {
      items: [
        { title: 'Shipping faster without cutting quality', excerpt: 'Practices that keep velocity and maintainability aligned.' },
        { title: 'When to choose a monolith first', excerpt: 'A practical take for early-stage teams.' },
      ],
    },
  },
  {
    type: 'case_studies',
    name: 'Case studies (sample)',
    order: 7,
    status: 'published',
    content: {
      items: [
        { title: 'Commerce platform rebuild', result: '40% faster checkout, fewer support tickets.' },
        { title: 'Field operations app', result: 'Same-day rollout across 12 regions.' },
      ],
    },
  },
];

const globalSettingsSeed = [
  { key: 'brand_name', label: 'Brand name', value: 'Nullscape' },
  { key: 'support_email', label: 'Support email', value: 'hello@nullscape.com' },
  { key: 'footer_tagline', label: 'Footer tagline', value: 'Digital solutions that scale with your business.' },
  {
    key: 'social_links',
    label: 'Social links',
    value: { twitter: 'https://twitter.com', linkedin: 'https://linkedin.com' },
  },
  {
    key: 'site',
    label: 'Homepage stats, contact, offices',
    value: {
      stats: {
        clients: '250+',
        projects: '1850+',
        cmmi: 'Level 5',
        rating: '4.9/5',
        labels: {
          clients: 'Happy Clients',
          projects: 'Projects Delivered',
          cmmi: 'CMMI Maturity',
          rating: 'Average Review',
        },
        aboutProjects: '500+',
        aboutProjectsLabel: 'Projects Delivered',
        aboutClients: '200+',
        aboutClientsLabel: 'Happy Clients',
        aboutTeam: '50+',
        aboutTeamLabel: 'Team Members',
        aboutAwards: '15+',
        aboutAwardsLabel: 'Awards Won',
      },
      contact: {
        email: 'hello@nullscape.com',
        phone: '+1 (555) 123-4567',
        address: '123 Tech Avenue, San Francisco, CA 94102',
      },
      offices: [
        {
          title: 'India — HQ',
          lines: ['A-25 to 29, Demo Address', 'Gujarat, India — 396002'],
          phone: '+91 00000 00000',
          email: 'sales@nullscape.com',
        },
        {
          title: 'USA',
          lines: ['8 The Green, Suite A', 'Dover, DE 19901'],
          phone: '+1 000 000 0000',
          email: 'sales@nullscape.com',
        },
      ],
    },
  },
];

async function seed() {
  await connectMongo();

  const page = await CmsPageV2.findOneAndUpdate(
    { slug: HOME_SLUG },
    { $set: { slug: HOME_SLUG, ...homePagePayload } },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await CmsSectionV2.deleteMany({ pageId: page._id });
  await CmsSectionV2.insertMany(
    homeSections.map((s) => ({
      pageId: page._id,
      type: s.type,
      name: s.name,
      order: s.order,
      status: s.status,
      content: s.content,
    }))
  );

  for (const row of globalSettingsSeed) {
    await GlobalSettingV2.findOneAndUpdate(
      { key: row.key },
      { $set: { label: row.label, value: row.value } },
      { upsert: true, new: true }
    );
  }

  console.log('\n✅ CMS dummy data seeded');
  console.log(`   Page: "${page.title}" slug=${HOME_SLUG} status=${page.status}`);
  console.log(`   Sections: ${homeSections.length}`);
  console.log(`   Global settings: ${globalSettingsSeed.length}`);
  console.log('\n   Public API: GET /api/v1/page/home  |  GET /api/v1/global-settings\n');
}

seed()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
