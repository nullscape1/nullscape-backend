import mongoose from 'mongoose';
import logger from '../utils/logger.js';

// Connection event listeners
mongoose.connection.on('connected', () => {
  logger.info('MongoDB connected successfully', {
    database: mongoose.connection.db.databaseName,
    host: mongoose.connection.host,
  });
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB connection error', { error: err.message, stack: err.stack });
});

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected');
});

// Handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  logger.info('MongoDB connection closed due to app termination');
  process.exit(0);
});

export async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    logger.error('MONGODB_URI is not set in environment variables');
    process.exit(1);
  }

  try {
    mongoose.set('strictQuery', true);
    
    await mongoose.connect(uri, {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    logger.info('MongoDB connection initiated');
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      name: error.name,
      stack: error.stack,
    });
    
    if (error.name === 'MongoServerSelectionError') {
      logger.error('MongoDB connection troubleshooting', {
        suggestions: [
          'Check if MongoDB is running (for local)',
          'Verify your IP is whitelisted in MongoDB Atlas',
          'Check your connection string is correct',
          'Verify network/firewall settings',
        ],
      });
    }
    
    process.exit(1);
  }
}


