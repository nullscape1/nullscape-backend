/**
 * Seeds sample testimonials. Safe to re-run: removes rows whose review contains "[demo-seed]".
 *
 * Usage: npm run seed:testimonials
 * Requires: MONGODB_URI in .env
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { Testimonial } from './src/models/Testimonial.js';

const MARKER = '[demo-seed]';

const items = [
  {
    clientName: 'Alex Rivera',
    review: `Nullscape shipped our mobile launch on time and the quality showed in store ratings. ${MARKER}`,
    rating: 5,
    picture: 'https://i.pravatar.cc/120?img=12',
    category: 'App',
    status: 'active',
    featured: true,
  },
  {
    clientName: 'Jordan Kim',
    review: `Clear communication and solid architecture choices—we finally have a platform we can extend. ${MARKER}`,
    rating: 5,
    picture: 'https://i.pravatar.cc/120?img=47',
    category: 'Web',
    status: 'active',
    featured: true,
  },
  {
    clientName: 'Sam Patel',
    review: `The ML pipeline integration was smoother than our previous vendor. ${MARKER}`,
    rating: 4,
    picture: 'https://i.pravatar.cc/120?img=33',
    category: 'AI',
    status: 'active',
    featured: true,
  },
  {
    clientName: 'Morgan Chen',
    review: `Their team modernized our legacy stack without breaking production—weekly demos kept stakeholders aligned. ${MARKER}`,
    rating: 5,
    picture: 'https://i.pravatar.cc/120?img=51',
    category: 'Web',
    status: 'active',
    featured: false,
  },
  {
    clientName: 'Priya Nair',
    review: `We needed a HIPAA-aware patient portal; security reviews passed on the first pass. Highly recommend. ${MARKER}`,
    rating: 5,
    picture: 'https://i.pravatar.cc/120?img=45',
    category: 'Other',
    status: 'active',
    featured: false,
  },
  {
    clientName: 'Chris Okafor',
    review: `The offline-first field app reduced technician callbacks by a noticeable margin within a month. ${MARKER}`,
    rating: 4,
    picture: 'https://i.pravatar.cc/120?img=59',
    category: 'App',
    status: 'active',
    featured: false,
  },
  {
    clientName: 'Elena Volkov',
    review: `Forecasting dashboards finally match how our ops team thinks—clean UX and fast load times. ${MARKER}`,
    rating: 5,
    picture: 'https://i.pravatar.cc/120?img=32',
    category: 'AI',
    status: 'active',
    featured: false,
  },
];

async function run() {
  await connectMongo();
  await Testimonial.deleteMany({ review: new RegExp(MARKER.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') });
  await Testimonial.insertMany(items);
  console.log(`✅ Testimonials seeded (${items.length} items, marked with ${MARKER} for cleanup)`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
