import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { registerAdmin } from './src/services/authService.js';
import { Role } from './src/models/Role.js';
import { User } from './src/models/User.js';

async function createSuperAdmin() {
  try {
    console.log('\n🔧 Admin User Creation Script\n');
    console.log('─'.repeat(50));
    
    await connectMongo();
    console.log('✅ Connected to MongoDB\n');
    
    const email = process.argv[2] || process.env.ADMIN_EMAIL || 'admin@nullscape.com';
    const password = process.argv[3] || process.env.ADMIN_PASSWORD || null;
    const name = process.argv[4] || process.env.ADMIN_NAME || 'Super Admin';

    if (!password) {
      console.error('❌ Error: Password is required');
      console.error('\nUsage:');
      console.error('  node create-superadmin.js <email> <password> [name]');
      console.error('\nExample:');
      console.error('  node create-superadmin.js admin@nullscape.com MySecurePass123 "Super Admin"');
      console.error('\nOr set environment variables:');
      console.error('  ADMIN_EMAIL=admin@nullscape.com');
      console.error('  ADMIN_PASSWORD=MySecurePass123');
      console.error('  ADMIN_NAME="Super Admin"');
      process.exit(1);
    }

    console.log('Creating SuperAdmin user...');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    console.log(`Password: ${'*'.repeat(password.length)}`);
    console.log('─'.repeat(50));
    
    // Check if admin already exists
    const superAdminRole = await Role.findOne({ name: 'SuperAdmin' });
    if (superAdminRole) {
      const existingAdmin = await User.findOne({ 
        email,
        roles: superAdminRole._id 
      });
      
      if (existingAdmin) {
        console.error('\n⚠️  Admin user with this email already exists');
        console.error('Email:', email);
        console.error('Please use a different email or login with existing credentials');
        process.exit(1);
      }
    }
    
    const user = await registerAdmin({
      name,
      email,
      password,
      role: 'SuperAdmin'
    });

    console.log('\n✅ SuperAdmin created successfully!');
    console.log('─'.repeat(50));
    console.log('\n📋 Login Credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Name: ${name}`);
    console.log(`   Role: SuperAdmin`);
    
    const adminUrl = process.env.ADMIN_URL || process.env.CORS_ORIGIN?.split(',')[0] || 'http://localhost:3000';
    console.log(`\n🌐 Admin Panel URL: ${adminUrl}/login`);
    console.log(`\n⚠️  IMPORTANT: Save these credentials securely!`);
    console.log('─'.repeat(50));
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error creating SuperAdmin');
    console.error('─'.repeat(50));
    
    if (error.statusCode === 409) {
      console.error('User with this email already exists');
      console.error('Please use a different email or login with existing credentials');
    } else {
      console.error('Error:', error.message);
      if (error.stack && process.env.NODE_ENV === 'development') {
        console.error('\nStack:', error.stack);
      }
    }
    
    console.error('─'.repeat(50));
    process.exit(1);
  }
}

createSuperAdmin();


