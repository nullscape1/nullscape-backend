import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { User } from './src/models/User.js';

/**
 * Reset password for an existing admin user (by email).
 * Usage: node reset-admin-password.js <email> <newPassword>
 */
async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();
  const password = process.argv[3];

  if (!email || !password) {
    console.error('Usage: node reset-admin-password.js <email> <newPassword>');
    console.error('Password must be at least 8 characters (same as login validation).');
    process.exit(1);
  }
  if (password.length < 8) {
    console.error('Password must be at least 8 characters.');
    process.exit(1);
  }

  await connectMongo();
  const user = await User.findOne({ email });
  if (!user) {
    console.error(`No user found with email: ${email}`);
    process.exit(1);
  }

  user.password = password;
  user.isActive = true;
  await user.save();

  console.log('Password updated successfully.');
  console.log(`Email: ${user.email}`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
