/**
 * Seed demo activity logs for local admin testing.
 *
 * Safe to re-run: deletes previous demo activity logs (meta.demoSeed === true).
 */
import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { ActivityLog } from './src/models/ActivityLog.js';

async function run() {
  await connectMongo();

  await ActivityLog.deleteMany({ 'meta.demoSeed': true });

  const now = Date.now();
  const user = { id: 'demo-admin', email: 'admin@nullscape.com', roles: ['SuperAdmin'] };

  const items = [
    {
      action: 'create',
      entity: 'Service',
      entityId: 'demo-service-1',
      user,
      ip: '127.0.0.1',
      meta: { demoSeed: true, note: 'Seeded activity event' },
      createdAt: new Date(now - 1000 * 60 * 15),
      updatedAt: new Date(now - 1000 * 60 * 15),
    },
    {
      action: 'update',
      entity: 'BlogPost',
      entityId: 'demo-blog-1',
      user,
      ip: '127.0.0.1',
      meta: { demoSeed: true, field: 'title' },
      createdAt: new Date(now - 1000 * 60 * 60 * 3),
      updatedAt: new Date(now - 1000 * 60 * 60 * 3),
    },
    {
      action: 'delete',
      entity: 'Portfolio',
      entityId: 'demo-portfolio-1',
      user,
      ip: '127.0.0.1',
      meta: { demoSeed: true, reason: 'Testing audit trail UI' },
      createdAt: new Date(now - 1000 * 60 * 60 * 10),
      updatedAt: new Date(now - 1000 * 60 * 60 * 10),
    },
    {
      action: 'upload',
      entity: 'Upload',
      entityId: 'demo-upload-1',
      user,
      ip: '127.0.0.1',
      meta: { demoSeed: true, filename: 'demo-image.png' },
      createdAt: new Date(now - 1000 * 60 * 60 * 24),
      updatedAt: new Date(now - 1000 * 60 * 60 * 24),
    },
  ];

  await ActivityLog.insertMany(items);
  const count = await ActivityLog.countDocuments({ 'meta.demoSeed': true });
  console.log(`✅ Activity logs seeded (${count} items, meta.demoSeed=true)`);
  console.log('   Admin: GET /api/v1/activity  (requires login)');
  process.exit(0);
}

run().catch((e) => {
  console.error('❌ seed-activity-dummy failed:', e?.message || e);
  process.exit(1);
});

