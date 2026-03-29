/**
 * Seeds technologies for the tech-stack API (homepage technologies area / grids).
 * Re-run safe: removes rows whose description contains "[demo-seed]".
 *
 * Usage: npm run seed:tech-stack
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { TechStack } from './src/models/TechStack.js';

const MARKER = '[demo-seed]';

const items = [
  { name: 'React', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', category: 'Frontend', description: `UI library. ${MARKER}`, order: 1, status: 'active' },
  { name: 'Next.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg', category: 'Frontend', description: `Full-stack React framework. ${MARKER}`, order: 2, status: 'active' },
  { name: 'Node.js', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg', category: 'Backend', description: `JavaScript runtime. ${MARKER}`, order: 1, status: 'active' },
  { name: 'PostgreSQL', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg', category: 'Database', description: `Relational database. ${MARKER}`, order: 1, status: 'active' },
  { name: 'MongoDB', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg', category: 'Database', description: `Document store. ${MARKER}`, order: 2, status: 'active' },
  { name: 'AWS', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg', category: 'Cloud', description: `Cloud platform. ${MARKER}`, order: 1, status: 'active' },
  { name: 'Docker', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg', category: 'DevOps', description: `Containers. ${MARKER}`, order: 1, status: 'active' },
  { name: 'Flutter', icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg', category: 'Mobile', description: `Cross-platform mobile. ${MARKER}`, order: 1, status: 'active' },
];

async function run() {
  await connectMongo();
  const demoNames = items.map((r) => r.name);
  await TechStack.deleteMany({
    $or: [
      { description: new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') },
      { name: { $in: demoNames } },
    ],
  });
  await TechStack.insertMany(items);
  console.log(`✅ Tech stack seeded (${items.length} items, ${MARKER} in description; names replaced on re-run)`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
