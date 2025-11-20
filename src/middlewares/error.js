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
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }
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



