/**
 * Seeds pricing plans for the homepage pricing section.
 * Re-run safe: removes plans whose description contains "[demo-seed]".
 *
 * Usage: npm run seed:pricing
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { PricingPlan } from './src/models/PricingPlan.js';

const MARKER = '[demo-seed]';

const items = [
  {
    name: 'Starter',
    description: `For small teams getting started. ${MARKER}`,
    price: 49,
    currency: 'USD',
    period: 'monthly',
    features: ['Up to 5 projects', 'Email support', 'CI basics', 'Monthly reports'],
    popular: false,
    buttonText: 'Start trial',
    buttonLink: '#contact',
    order: 1,
    status: 'active',
    featured: false,
  },
  {
    name: 'Growth',
    description: `For scaling product teams. ${MARKER}`,
    price: 149,
    currency: 'USD',
    period: 'monthly',
    features: ['Unlimited projects', 'Priority support', 'Advanced CI/CD', 'Dedicated PM touchpoint'],
    popular: true,
    buttonText: 'Talk to sales',
    buttonLink: '#contact',
    order: 2,
    status: 'active',
    featured: true,
  },
  {
    name: 'Enterprise',
    description: `Security, SLAs, and custom integrations. ${MARKER}`,
    price: 0,
    currency: 'USD',
    period: 'one-time',
    features: ['Custom SOW', 'SSO & audit', '24/7 support option', 'On-prem or VPC'],
    popular: false,
    buttonText: 'Contact us',
    buttonLink: '#contact',
    order: 3,
    status: 'active',
    featured: false,
  },
];

async function run() {
  await connectMongo();
  await PricingPlan.deleteMany({ description: new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  await PricingPlan.insertMany(items);
  console.log(`✅ Pricing plans seeded (${items.length} plans, ${MARKER} in description for cleanup)`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
