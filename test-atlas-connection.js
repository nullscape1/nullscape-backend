import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

console.log('\n🔍 Testing MongoDB Connection...');
console.log('URI format:', uri?.includes('mongodb+srv') ? 'Atlas (mongodb+srv)' : uri?.includes('mongodb://') ? 'Local/Standard' : 'Unknown');
console.log('URI (masked):', uri?.replace(/\/\/.*@/, '//***@'));

try {
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
  });
  
  const host = mongoose.connection.host;
  const db = mongoose.connection.db.databaseName;
  const isAtlas = host.includes('mongodb.net');
  
  console.log('\n✅ Connection Successful!');
  console.log('Host:', host);
  console.log('Database:', db);
  console.log('Is MongoDB Atlas?', isAtlas ? 'YES ✅' : 'NO ❌');
  
  if (isAtlas) {
    console.log('\n🎉 Successfully connected to MongoDB Atlas!');
  } else {
    console.log('\n⚠️  Connected to local MongoDB, not Atlas');
  }
  
  // Test a simple query
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log(`\n📊 Found ${collections.length} collections in database`);
  
  await mongoose.disconnect();
  console.log('\n✅ Disconnected\n');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Connection Failed!');
  console.error('Error:', error.message);
  console.error('Error name:', error.name);
  
  if (error.message.includes('ECONNREFUSED')) {
    console.error('\n💡 Possible issues:');
    console.error('   - DNS resolution problem');
    console.error('   - Network/firewall blocking connection');
    console.error('   - IP address not whitelisted in MongoDB Atlas');
    console.error('   - Atlas cluster might be paused');
  }
  
  if (error.message.includes('authentication')) {
    console.error('\n💡 Authentication failed - check username/password');
  }
  
  process.exit(1);
}
