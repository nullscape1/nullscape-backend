/**
 * Create an admin user for seeding data
 * This script creates a default admin user if one doesn't exist
 * 
 * Usage: node scripts/createAdminUser.js [email] [password]
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../src/models/User.js';
import { Role } from '../src/models/Role.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nullscape';
const ADMIN_EMAIL = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@nullscape.com';
const ADMIN_PASSWORD = process.argv[3] || process.env.ADMIN_PASSWORD || 'admin123';
const ADMIN_NAME = process.argv[4] || process.env.ADMIN_NAME || 'Admin User';

async function createAdminUser() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Check if admin user already exists
    const existingUser = await User.findOne({ email: ADMIN_EMAIL });
    if (existingUser) {
      console.log(`⚠️  User with email ${ADMIN_EMAIL} already exists`);
      console.log('   Skipping user creation...\n');
      await mongoose.disconnect();
      return;
    }

    // Get or create Admin role
    let adminRole = await Role.findOne({ name: 'Admin' });
    if (!adminRole) {
      console.log('📝 Creating Admin role...');
      adminRole = await Role.create({
        name: 'Admin',
        permissions: ['*'], // All permissions
      });
      console.log('✅ Admin role created\n');
    } else {
      console.log('✅ Admin role found\n');
    }

    // Create admin user (password will be hashed by pre-save hook)
    console.log('👤 Creating admin user...');
    const adminUser = await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD, // Will be hashed by pre-save hook
      roles: [adminRole._id],
      isActive: true,
    });

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 User Details:');
    console.log(`   Name: ${adminUser.name}`);
    console.log(`   Email: ${adminUser.email}`);
    console.log(`   Roles: ${adminUser.roles.map(r => r.name || 'Admin').join(', ')}`);
    console.log('\n🎉 You can now use these credentials to run the seed script!');
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Password: ${ADMIN_PASSWORD}\n`);

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('   User with this email already exists');
    }
    process.exit(1);
  }
}

createAdminUser();

