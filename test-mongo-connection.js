import 'dotenv/config';
import mongoose from 'mongoose';

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  console.log('Testing MongoDB connection...');
  console.log('MONGODB_URI:', uri ? `${uri.substring(0, 20)}...` : 'NOT SET');
  
  if (!uri) {
    console.error('❌ ERROR: MONGODB_URI is not set in environment variables');
    console.log('\nPlease create a .env file in the backend/ directory with:');
    console.log('MONGODB_URI=mongodb://localhost:27017/nullscape');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    
    console.log('\nAttempting to connect...');
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      autoIndex: false,
    });
    
    console.log('✅ Successfully connected to MongoDB!');
    console.log('Database:', mongoose.connection.db.databaseName);
    console.log('Host:', mongoose.connection.host);
    console.log('Port:', mongoose.connection.port || 'N/A (Atlas)');
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`\nCollections found: ${collections.length}`);
    if (collections.length > 0) {
      console.log('Collection names:', collections.map(c => c.name).join(', '));
    }
    
    await mongoose.disconnect();
    console.log('\n✅ Connection test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.name === 'MongoServerSelectionError') {
      console.error('\n💡 Possible issues:');
      console.error('1. MongoDB is not running (for local MongoDB)');
      console.error('2. Your IP address is not whitelisted in MongoDB Atlas');
      console.error('3. Incorrect connection URI');
      console.error('4. Network/firewall issues');
      console.error('\n📖 See MONGODB_CONNECTION_STATUS.md for detailed instructions');
    }
    
    process.exit(1);
  }
}

testConnection();


