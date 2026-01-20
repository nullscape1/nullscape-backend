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
  
  // Detailed logging for missing URI
  if (!uri) {
    logger.error('MONGODB_URI is not set in environment variables', {
      availableEnvVars: Object.keys(process.env).filter(k => 
        k.includes('MONGO') || k.includes('DB') || k.includes('NODE') || k.includes('PORT')
      ),
    });
    logger.error('CRITICAL: Set MONGODB_URI in Render Dashboard → Environment → Add Environment Variable');
    process.exit(1);
  }

  // Validate URI format
  if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
    logger.error('Invalid MONGODB_URI format', {
      receivedFormat: uri.substring(0, 20) + '...',
      requiredFormats: [
        'mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority',
        'mongodb://username:password@host:port/database',
      ],
    });
    process.exit(1);
  }

  // Extract cluster name for better error messages
  const clusterMatch = uri.match(/mongodb\+srv:\/\/.*@([^.]+)/);
  const clusterName = clusterMatch ? clusterMatch[1] : 'unknown';

  try {
    mongoose.set('strictQuery', true);
    
    // Enhanced connection options for better reliability
    const connectionOptions = {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 30000, // Increased to 30s for Atlas
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      minPoolSize: 1,
      retryWrites: true,
      retryReads: true,
    };

    logger.info('Attempting MongoDB connection...', {
      uriMasked: uri.replace(/\/\/.*@/, '//***@'),
      isAtlas: uri.includes('mongodb+srv://'),
      clusterName: clusterName,
    });
    
    await mongoose.connect(uri, connectionOptions);
    
    logger.info('MongoDB connection initiated successfully', {
      host: mongoose.connection.host,
      database: mongoose.connection.db?.databaseName,
    });
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error.message,
      name: error.name,
      code: error.code,
      stack: error.stack,
    });
    
    // Specific error handling for common issues
    if (error.message.includes('ENOTFOUND') || error.message.includes('querySrv')) {
      logger.error('MongoDB DNS/Connection String Error - Cluster May Be Paused', {
        errorDetails: {
          clusterName: clusterName,
          errorCode: error.code || 'ENOTFOUND',
          fullError: error.message,
        },
        immediateActions: [
          '1. Go to https://cloud.mongodb.com and check if your cluster is PAUSED',
          '2. If paused, click "Resume" button and wait 2-3 minutes',
          '3. Verify MONGODB_URI in Render Dashboard → Environment is correct',
          '4. Check MongoDB Atlas → Network Access allows 0.0.0.0/0 (all IPs)',
        ],
        connectionStringFormat: 'mongodb+srv://username:password@' + clusterName + '.mongodb.net/database?retryWrites=true&w=majority',
        troubleshootingUrl: 'https://www.mongodb.com/docs/atlas/troubleshoot-connection/',
      });
      
      console.error('\n🚨 CRITICAL: MongoDB Atlas cluster appears to be paused or unreachable');
      console.error(`   Cluster: ${clusterName}`);
      console.error('   → Check MongoDB Atlas Dashboard: https://cloud.mongodb.com');
      console.error('   → Resume cluster if it shows "Paused" status');
      console.error('   → Verify MONGODB_URI in Render Dashboard environment variables\n');
      
    } else if (error.name === 'MongoServerSelectionError') {
      logger.error('MongoDB Server Selection Error', {
        suggestions: [
          'Check if MongoDB Atlas cluster is running and not paused',
          'Verify your IP is whitelisted in MongoDB Atlas Network Access (use 0.0.0.0/0 for Render)',
          'Check your connection string is correct',
          'Verify network/firewall settings',
        ],
      });
    } else if (error.message.includes('authentication')) {
      logger.error('MongoDB Authentication Error', {
        suggestions: [
          'Verify username and password in MONGODB_URI are correct',
          'Check if database user exists in MongoDB Atlas',
          'Ensure database user has proper permissions',
          'URL-encode special characters in password (@ → %40, # → %23, etc.)',
        ],
      });
    }
    
    process.exit(1);
  }
}


