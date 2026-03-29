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
import { getCorsOptions } from './config/cors.js';
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

app.use(cors(getCorsOptions()));

// Health check and root routes (before rate limiting)
app.get('/', (req, res) => {
  res.json({
    message: 'Nullscape API Server',
    version: '1.0.0',
    status: 'online',
    documentation: '/api/v1/health',
    endpoints: {
      health: '/api/v1/health',
      services: '/api/v1/services',
      blog: '/api/v1/blog',
      portfolio: '/api/v1/portfolio',
    },
  });
});

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

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
    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      logger.error('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set in environment');
      process.exit(1);
    }
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


