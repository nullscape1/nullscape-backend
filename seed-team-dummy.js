/**
 * Seeds team members for the About section on the homepage.
 * Re-run safe: removes members whose description contains "[demo-seed]".
 *
 * Usage: npm run seed:team
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { TeamMember } from './src/models/TeamMember.js';

const MARKER = '[demo-seed]';

const items = [
  {
    name: 'Sarah Mitchell',
    role: 'CEO & Co-founder',
    image: 'https://i.pravatar.cc/200?img=5',
    description: `Product strategy and partnerships. ${MARKER}`,
    order: 1,
    status: 'active',
    social: { linkedin: 'https://linkedin.com', twitter: '', github: '', website: '' },
  },
  {
    name: 'David Okonkwo',
    role: 'CTO',
    image: 'https://i.pravatar.cc/200?img=13',
    description: `Platform architecture and engineering culture. ${MARKER}`,
    order: 2,
    status: 'active',
    social: { linkedin: 'https://linkedin.com', github: 'https://github.com' },
  },
  {
    name: 'Mei Chen',
    role: 'Head of Design',
    image: 'https://i.pravatar.cc/200?img=9',
    description: `Design systems and UX research. ${MARKER}`,
    order: 3,
    status: 'active',
    social: { website: 'https://example.com' },
  },
  {
    name: 'James O’Brien',
    role: 'Lead Engineer',
    image: 'https://i.pravatar.cc/200?img=14',
    description: `Full-stack delivery and mentoring. ${MARKER}`,
    order: 4,
    status: 'active',
    social: { github: 'https://github.com' },
  },
];

async function run() {
  await connectMongo();
  await TeamMember.deleteMany({ description: new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  await TeamMember.insertMany(items);
  console.log(`✅ Team seeded (${items.length} members, ${MARKER} in description for cleanup)`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
