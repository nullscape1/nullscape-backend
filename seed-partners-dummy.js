/**
 * Seeds trusted partners for the homepage partners section.
 * Re-run safe: removes partners whose subtitle contains "[demo-seed]".
 *
 * Usage: npm run seed:partners
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { Partner } from './src/models/Partner.js';

const MARKER = '[demo-seed]';

const items = [
  { name: 'Acme Cloud', subtitle: `Enterprise cloud partner. ${MARKER}`, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/googlecloud/googlecloud-original.svg', logoColor: '#4285F4', order: 1, status: 'active', website: 'https://cloud.google.com' },
  { name: 'Northwind Labs', subtitle: `Data & analytics. ${MARKER}`, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azure/azure-original.svg', logoColor: '#0078D4', order: 2, status: 'active', website: 'https://azure.microsoft.com' },
  { name: 'Contoso Digital', subtitle: `Experience design studio. ${MARKER}`, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg', logoColor: '#61DAFB', order: 3, status: 'active', website: 'https://react.dev' },
  { name: 'Fabrikam AI', subtitle: `Applied ML partner. ${MARKER}`, logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg', logoColor: '#3776AB', order: 4, status: 'active', website: 'https://python.org' },
  { name: 'Tailspin IoT', subtitle: `Edge & devices. ${MARKER}`, logo: '', logoColor: '#6C38FF', order: 5, status: 'active', website: '' },
];

async function run() {
  await connectMongo();
  await Partner.deleteMany({ subtitle: new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  await Partner.insertMany(items);
  console.log(`✅ Partners seeded (${items.length} rows, ${MARKER} in subtitle for cleanup)`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
