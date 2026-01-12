import rateLimit from 'express-rate-limit';
import logger from '../utils/logger.js';

// General API rate limiter
export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 200 : 1000, // More lenient in development
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks and localhost in development
  skip: (req) => {
    // Skip health check endpoint and root route
    if (req.path === '/api/v1/health' || req.path === '/health' || req.path === '/') {
      return true;
    }
    // Skip localhost in development
    if (process.env.NODE_ENV !== 'production') {
      const ip = req.ip || req.connection?.remoteAddress || req.socket?.remoteAddress;
      if (ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || 
          ip?.includes('127.0.0.1') || ip?.includes('localhost')) {
        return true;
      }
    }
    return false;
  },
  message: {
    error: 'Too many requests from this IP, please try again later.',
  },
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      method: req.method,
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
    });
  },
});

// Stricter rate limiter for auth routes
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // 10 login attempts per 15 minutes
  skipSuccessfulRequests: true,
  message: {
    error: 'Too many authentication attempts, please try again later.',
  },
  handler: (req, res) => {
    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
    });
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
    });
  },
});

// Stricter rate limiter for form submissions
export const formRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // 20 submissions per hour
  message: {
    error: 'Too many form submissions, please try again later.',
  },
});



