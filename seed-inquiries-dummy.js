/**
 * Seed demo inquiries (contact/quote/hire/newsletter) for local admin testing.
 *
 * Safe to re-run: deletes previous demo inquiries (message contains [demo-seed]).
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { Inquiry } from './src/models/Inquiry.js';

function demoMsg(label) {
  return `[demo-seed] ${label} — Please ignore, generated for local testing.`;
}

async function run() {
  await connectMongo();

  await Inquiry.deleteMany({ message: /\[demo-seed\]/ });

  const now = Date.now();
  const items = [
    {
      type: 'contact',
      name: 'Aarav Patel',
      email: 'aarav.patel@example.com',
      phone: '+1 555-0101',
      message: demoMsg('Interested in building a web platform.'),
      resolved: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 2),
      updatedAt: new Date(now - 1000 * 60 * 60 * 2),
    },
    {
      type: 'quote',
      name: 'Sophia Nguyen',
      email: 'sophia.nguyen@example.com',
      phone: '+1 555-0102',
      message: demoMsg('Need an estimate for a mobile app + admin panel.'),
      resolved: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 8),
      updatedAt: new Date(now - 1000 * 60 * 60 * 8),
    },
    {
      type: 'hire',
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '+1 555-0103',
      message: demoMsg('Looking for a dedicated squad for 3 months.'),
      resolved: true,
      createdAt: new Date(now - 1000 * 60 * 60 * 24),
      updatedAt: new Date(now - 1000 * 60 * 60 * 3),
    },
    {
      type: 'newsletter',
      name: '',
      email: 'newsletter.subscriber@example.com',
      phone: '',
      message: demoMsg('Newsletter signup.'),
      resolved: true,
      createdAt: new Date(now - 1000 * 60 * 20),
      updatedAt: new Date(now - 1000 * 60 * 20),
    },
    {
      type: 'other',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+1 555-0104',
      message: demoMsg('General question about security/compliance.'),
      resolved: false,
      createdAt: new Date(now - 1000 * 60 * 60 * 48),
      updatedAt: new Date(now - 1000 * 60 * 60 * 48),
    },
  ];

  await Inquiry.insertMany(items);
  const count = await Inquiry.countDocuments({ message: /\[demo-seed\]/ });
  console.log(`✅ Inquiries seeded (${count} items, [demo-seed])`);
  console.log('   Admin: GET /api/v1/inquiries  (requires login)');
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ seed-inquiries-dummy failed:', e?.message || e);
  process.exit(1);
});

