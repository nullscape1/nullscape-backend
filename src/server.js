import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import morgan from 'morgan';
import httpStatus from 'http-status';
import { connectMongo } from './config/mongo.js';
import { rateLimiter } from './middlewares/rateLimiter.js';
import { errorConverter, errorHandler, notFoundHandler } from './middlewares/error.js';
import routesV1 from './routes/v1/index.js';
import logger from './utils/logger.js';

const app = express();

// Security and utility middlewares
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false,
}));

// CORS configuration - strict in production
const corsOptions = {
  origin: process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : process.env.NODE_ENV === 'production'
      ? [] // No default origins in production
      : ['http://localhost:8000', 'http://localhost:3000', 'http://127.0.0.1:8000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 86400, // 24 hours
};
app.use(cors(corsOptions));

// Rate limiting
app.use(rateLimiter);

// Body parsers with limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));
app.use(cookieParser());

// Security middlewares
app.use(mongoSanitize());
app.use(xss());

// Compression (only for text responses)
app.use(compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  level: 6,
}));

// HTTP request logging
if (process.env.NODE_ENV === 'production') {
  // In production, use combined format for better log parsing
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
} else {
  app.use(morgan('dev', {
    stream: {
      write: (message) => logger.debug(message.trim()),
    },
  }));
}

// Static uploads
app.use('/uploads', express.static('src/uploads'));

// API routes
app.use('/api/v1', routesV1);

// 404
app.use(notFoundHandler);

// Convert any error to standardized error, then handle
app.use(errorConverter);
app.use(errorHandler);

const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectMongo();
    app.listen(port, () => {
      logger.info(`API server started`, {
        port,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', { reason, promise });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

start();


