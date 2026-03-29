import httpStatus from 'http-status';
import logger from '../utils/logger.js';

class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export const notFoundHandler = (req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
};

export const errorConverter = (err, req, res, next) => {
  if (err instanceof ApiError) {
    next(err);
    return;
  }

  let error = err;

  if (error.name === 'ValidationError' && error.errors) {
    const messages = Object.values(error.errors).map((e) => e.message).join(', ');
    error = new ApiError(httpStatus.BAD_REQUEST, messages || 'Validation error', true, err.stack);
    return next(error);
  }
  if (error.name === 'CastError') {
    error = new ApiError(httpStatus.BAD_REQUEST, 'Invalid id or field value', true, err.stack);
    return next(error);
  }
  if (error.code === 11000) {
    const field = Object.keys(error.keyPattern || {})[0] || 'field';
    error = new ApiError(httpStatus.CONFLICT, `${field} already exists`, true, err.stack);
    return next(error);
  }
  if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    error = new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token', true, err.stack);
    return next(error);
  }

  const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = error.message || httpStatus[statusCode];
  error = new ApiError(statusCode, message, statusCode < 500, err.stack);
  next(error);
};

export const errorHandler = (err, req, res, _next) => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || httpStatus[statusCode] || 'Internal Server Error';
  
  // Log error
  if (statusCode >= 500) {
    logger.error('Internal server error', {
      statusCode,
      message,
      stack: err.stack,
      path: req.path,
      method: req.method,
      ip: req.ip,
      user: req.user?.id || 'anonymous',
    });
  } else {
    logger.warn('Client error', {
      statusCode,
      message,
      path: req.path,
      method: req.method,
      ip: req.ip,
    });
  }
  
  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };
  
  res.status(statusCode).json(response);
};

export { ApiError };



