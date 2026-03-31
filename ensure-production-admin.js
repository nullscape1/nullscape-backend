/**
 * Create or update a SuperAdmin user (idempotent — safe to re-run).
 * - If email exists: sets password, ensures SuperAdmin role, activates account.
 * - Else: creates new SuperAdmin.
 *
 * Usage (production):
 *   ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='min8chars!' node ensure-production-admin.js
 *
 * Optional: ADMIN_NAME="Ops Admin"
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectMongo } from './src/config/mongo.js';
import { User } from './src/models/User.js';
import { Role } from './src/models/Role.js';
import { ensureBaseRoles, registerAdmin } from './src/services/authService.js';

async function main() {
  const email = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || '';
  const name = (process.env.ADMIN_NAME || 'Super Admin').trim();

  if (!email || !password) {
    console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD (min 8 characters).');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  await connectMongo();
  await ensureBaseRoles();
  const superRole = await Role.findOne({ name: 'SuperAdmin' });
  if (!superRole) {
    console.error('SuperAdmin role missing after ensureBaseRoles.');
    process.exit(1);
  }

  let user = await User.findOne({ email });
  if (user) {
    user.password = password;
    user.isActive = true;
    user.name = name || user.name;
    const roleIds = user.roles || [];
    const hasSuper = roleIds.some((id) => String(id) === String(superRole._id));
    if (!hasSuper) {
      user.roles = [...roleIds, superRole._id];
    }
    await user.save();
    console.log('✅ Updated existing user: SuperAdmin role, password, active.');
  } else {
    await registerAdmin({ name, email, password, role: 'SuperAdmin' });
    console.log('✅ Created new SuperAdmin user.');
  }

  console.log(`   Email: ${email}`);
  console.log('   Password: (hidden — use the value you passed in ADMIN_PASSWORD)');
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await mongoose.connection.close();
});
