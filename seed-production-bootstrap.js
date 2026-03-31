/**
 * Full dummy data + admin bootstrap for a MongoDB instance (use for production only when you intend to).
 *
 * Safety:
 *   Requires NULLSCAPE_ALLOW_PRODUCTION_SEED=1
 *   Requires MONGODB_URI
 *   Requires ADMIN_EMAIL + ADMIN_PASSWORD (min 8 chars) for the admin step
 *
 * Run on Render shell (or locally with prod URI):
 *   NULLSCAPE_ALLOW_PRODUCTION_SEED=1 \
 *   ADMIN_EMAIL=admin@yourdomain.com \
 *   ADMIN_PASSWORD='YourSecurePass123' \
 *   MONGODB_URI='mongodb+srv://...' \
 *   node seed-production-bootstrap.js
 *
 * Optional: SITE_URL=https://your-site.com (for SEO seed)
 * Optional: DOTENV_CONFIG_PATH=.env.production node ...  (load vars from file)
 */
import 'dotenv/config';
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function requireEnv(name) {
  const v = process.env[name];
  if (!v || !String(v).trim()) {
    console.error(`Missing required env: ${name}`);
    process.exit(1);
  }
  return v;
}

if (process.env.NULLSCAPE_ALLOW_PRODUCTION_SEED !== '1') {
  console.error(
    'Refusing to run: set NULLSCAPE_ALLOW_PRODUCTION_SEED=1 to confirm you are targeting the correct database.'
  );
  process.exit(1);
}

requireEnv('MONGODB_URI');
requireEnv('ADMIN_EMAIL');
const pwd = requireEnv('ADMIN_PASSWORD');
if (pwd.length < 8) {
  console.error('ADMIN_PASSWORD must be at least 8 characters.');
  process.exit(1);
}

const SCRIPTS = [
  'seed-cms-dummy.js',
  'seed-services-dummy.js',
  'seed-blog-dummy.js',
  'seed-portfolio-dummy.js',
  'seed-testimonials-dummy.js',
  'seed-partners-dummy.js',
  'seed-team-dummy.js',
  'seed-tech-stack-dummy.js',
  'seed-pricing-dummy.js',
  'seed-industries-case-studies-dummy.js',
  'seed-jobs-dummy.js',
  'seed-seo-dummy.js',
  'seed-inquiries-dummy.js',
  'seed-activity-dummy.js',
];

console.log('\n🚀 Production bootstrap: seeding demo content + admin\n');
console.log('   (Remove NULLSCAPE_ALLOW_PRODUCTION_SEED after you are done.)\n');

for (const file of SCRIPTS) {
  const full = path.join(__dirname, file);
  console.log('\n' + '='.repeat(64));
  console.log(' ▶ ' + file);
  console.log('='.repeat(64) + '\n');
  execSync(`node "${full}"`, { stdio: 'inherit', env: process.env });
}

console.log('\n' + '='.repeat(64));
console.log(' ▶ ensure-production-admin.js');
console.log('='.repeat(64) + '\n');
execSync(`node "${path.join(__dirname, 'ensure-production-admin.js')}"`, {
  stdio: 'inherit',
  env: process.env,
});

console.log('\n' + '='.repeat(64));
console.log('✅ Production bootstrap finished.');
console.log('   Log in to the admin app with ADMIN_EMAIL / ADMIN_PASSWORD.');
console.log('   Restart the API service if responses look cached.');
console.log('='.repeat(64) + '\n');
