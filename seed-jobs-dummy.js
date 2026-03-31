/**
 * Seeds open job postings for Admin → Jobs and marketing careers section.
 * Re-run safe: deletes jobs whose description contains [demo-seed].
 *
 * Usage: node seed-jobs-dummy.js
 * Requires: MONGODB_URI
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { Job } from './src/models/Job.js';

const MARKER = '[demo-seed]';

const jobsSeed = [
  {
    title: 'Senior Full-Stack Engineer',
    description: `Own features across React/Next and Node APIs; mentor juniors; improve CI/CD. ${MARKER}`,
    requiredSkills: ['TypeScript', 'React', 'Node.js', 'MongoDB'],
    responsibilities: ['Design and ship end-to-end features', 'Review code and improve reliability', 'Collaborate with design and product'],
    location: 'Remote / India',
    experience: '5+ years',
    status: 'open',
  },
  {
    title: 'Product Designer',
    description: `Craft flows for B2B SaaS; work in Figma; partner with engineering on accessibility. ${MARKER}`,
    requiredSkills: ['Figma', 'UX research', 'Design systems'],
    responsibilities: ['User journeys and prototypes', 'Usability validation', 'Design system contributions'],
    location: 'Remote',
    experience: '3+ years',
    status: 'open',
  },
  {
    title: 'DevOps Engineer',
    description: `Kubernetes, observability, and secure cloud baselines for client platforms. ${MARKER}`,
    requiredSkills: ['AWS or GCP', 'Docker', 'Terraform', 'CI/CD'],
    responsibilities: ['Pipeline hardening', 'Cost and uptime reviews', 'Incident readiness'],
    location: 'Remote / Hybrid',
    experience: '4+ years',
    status: 'open',
  },
];

async function run() {
  await connectMongo();
  const re = new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  await Job.deleteMany({ description: re });
  await Job.insertMany(jobsSeed);
  console.log(`✅ Jobs seeded (${jobsSeed.length} open roles, ${MARKER})`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await mongoose.connection.close();
});
