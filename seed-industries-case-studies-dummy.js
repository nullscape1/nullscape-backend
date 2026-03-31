/**
 * Seeds published industries + case studies for homepage (GET /industries, GET /case-studies).
 * Re-run safe: removes rows by fixed demo titles / names before insert.
 *
 * Usage: node seed-industries-case-studies-dummy.js
 * Requires: MONGODB_URI
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import slugify from 'slugify';
import { connectMongo } from './src/config/mongo.js';
import { Industry } from './src/models/Industry.js';
import { CaseStudy } from './src/models/CaseStudy.js';

const MARKER = '[demo-seed]';

const industryNames = [
  'Healthcare & Life Sciences',
  'FinTech & Banking',
  'Retail & E-commerce',
  'EdTech & Media',
  'Logistics & Supply Chain',
  'Manufacturing & IoT',
];

const industriesSeed = industryNames.map((name) => ({
  name,
  slug: slugify(name, { lower: true, strict: true }),
  category: 'Enterprise',
  content: {
    summary: `Deep delivery experience in ${name.toLowerCase()} — product, compliance, and scale. ${MARKER}`,
  },
  status: 'published',
  seoTitle: `${name} | Nullscape`,
  seoDescription: `How we help teams in ${name.toLowerCase()}.`,
}));

const caseStudyTitles = [
  'AI-powered learning platform for global students',
  'Student banking app with rewards and credit tools',
  'Premium e-commerce rebuild with fraud prevention',
];

const caseStudiesSeed = [
  {
    title: caseStudyTitles[0],
    slug: slugify(caseStudyTitles[0], { lower: true, strict: true }),
    industry: 'EdTech',
    summary: `Gamified curriculum, teacher tooling, and personalized paths — shipped on a tight roadmap. ${MARKER}`,
    featuredImage: '',
    status: 'published',
    content: {
      clientDomain: 'Ed-Tech (AI-powered language learning)',
      opportunity: 'The client needed engaging digital learning with assessments and progress visibility.',
      solution:
        'We built structured curriculum flows, quizzes, gamification, and dashboards for teachers and learners.',
      result: 'Higher engagement and clearer progress signals for instructors and students.',
    },
    seoTitle: 'EdTech case study | Nullscape',
    seoDescription: 'Learning platform delivery case study.',
  },
  {
    title: caseStudyTitles[1],
    slug: slugify(caseStudyTitles[1], { lower: true, strict: true }),
    industry: 'FinTech',
    summary: `Inclusive money tools for students — subscriptions, support, and credit visibility. ${MARKER}`,
    featuredImage: '',
    status: 'published',
    content: {
      clientDomain: 'FinTech (student financial platform)',
      opportunity: 'Deliver a trustworthy app for budgeting, rewards, and credit education.',
      solution: 'Custom app with integrations, plans, credit reporting views, and in-app support.',
      result: 'Students gained clearer financial control and transparent product experiences.',
    },
    seoTitle: 'FinTech case study | Nullscape',
    seoDescription: 'Student finance app case study.',
  },
  {
    title: caseStudyTitles[2],
    slug: slugify(caseStudyTitles[2], { lower: true, strict: true }),
    industry: 'E-commerce',
    summary: `Custom storefront features, bundles, and CRM-aligned automation. ${MARKER}`,
    featuredImage: '',
    status: 'published',
    content: {
      clientDomain: 'E-commerce (premium consumer goods)',
      opportunity: 'Modernize the platform, reduce fraud, and lift conversion without diluting brand.',
      solution: 'Affiliate flows, fraud checks, bundle offers, automated messaging, and CRM sync.',
      result: 'Stronger operations and a smoother path to purchase for customers.',
    },
    seoTitle: 'E-commerce case study | Nullscape',
    seoDescription: 'Commerce platform case study.',
  },
];

async function run() {
  await connectMongo();

  await Industry.deleteMany({ name: { $in: industryNames } });
  await Industry.insertMany(industriesSeed);

  await CaseStudy.deleteMany({ title: { $in: caseStudyTitles } });
  await CaseStudy.insertMany(caseStudiesSeed);

  console.log(`✅ Industries + case studies seeded (${industriesSeed.length} industries, ${caseStudiesSeed.length} cases, ${MARKER})`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await mongoose.connection.close();
});
