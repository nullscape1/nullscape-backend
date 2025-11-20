import 'dotenv/config';
import { connectMongo } from './src/config/mongo.js';
import { registerAdmin } from './src/services/authService.js';

async function createSuperAdmin() {
  try {
    await connectMongo();
    
    const email = process.argv[2] || 'admin@nullscape.com';
    const password = process.argv[3] || 'admin123456';
    const name = process.argv[4] || 'Super Admin';

    console.log('Creating SuperAdmin user...');
    console.log(`Email: ${email}`);
    console.log(`Name: ${name}`);
    
    const user = await registerAdmin({
      name,
      email,
      password,
      role: 'SuperAdmin'
    });

    console.log('\n✅ SuperAdmin created successfully!');
    console.log(`\nLogin credentials:`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`\nYou can now login at: http://localhost:3000/login`);
    
    process.exit(0);
  } catch (error) {
    if (error.statusCode === 409) {
      console.error('❌ Error: User with this email already exists');
      console.error('Please use a different email or login with existing credentials');
    } else {
      console.error('❌ Error creating SuperAdmin:', error.message);
    }
    process.exit(1);
  }
}

createSuperAdmin();


