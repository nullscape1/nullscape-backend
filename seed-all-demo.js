/**
 * Runs all demo seed scripts in dependency order so you can verify website + admin + API.
 *
 * Usage: npm run seed:all
 * Requires: MONGODB_URI in .env
 */
import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
];

console.log('\n🌱 Running full demo seed (' + SCRIPTS.length + ' steps)...\n');

for (const file of SCRIPTS) {
  const full = path.join(__dirname, file);
  console.log('\n' + '='.repeat(64));
  console.log(' ▶ ' + file);
  console.log('='.repeat(64) + '\n');
  execSync(`node "${full}"`, { stdio: 'inherit', env: process.env });
}

console.log('\n' + '='.repeat(64));
console.log('✅ All demo seeds finished. Restart the API if it was running (cache).');
console.log('   Website: index.html — partners, services, portfolio, testimonials,');
console.log('   team, tech stack, pricing, blog; Growth CMS zone for slug `home`.');
console.log('='.repeat(64) + '\n');
