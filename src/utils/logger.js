import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDevelopment = process.env.NODE_ENV === 'development';
const isProduction = process.env.NODE_ENV === 'production';

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

// Create transports
const transports = [];

// Console transport (only in development)
if (isDevelopment) {
  transports.push(
    new winston.transports.Console({
      format: consoleFormat,
      level: 'debug',
    })
  );
} else {
  // In production, use console but with json format
  transports.push(
    new winston.transports.Console({
      format: logFormat,
      level: 'info',
    })
  );
}

// File transports (production)
if (isProduction) {
  // Error logs
  transports.push(
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/error-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
      handleExceptions: true,
    })
  );

  // Combined logs
  transports.push(
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/combined-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      format: logFormat,
      maxSize: '20m',
      maxFiles: '30d',
    })
  );
}

// Create logger instance
const logger = winston.createLogger({
  level: isDevelopment ? 'debug' : 'info',
  format: logFormat,
  transports,
  exitOnError: false,
  exceptionHandlers: isProduction ? [
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    })
  ] : [],
  rejectionHandlers: isProduction ? [
    new DailyRotateFile({
      filename: path.join(__dirname, '../../logs/rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    })
  ] : [],
});

// Create logs directory if it doesn't exist (production)
const createLogsDir = async () => {
  if (isProduction) {
    try {
      const fs = await import('fs');
      const logsDir = path.join(__dirname, '../../logs');
      await fs.promises.mkdir(logsDir, { recursive: true });
    } catch (err) {
      // Directory might already exist, ignore
    }
  }
};
createLogsDir().catch(() => {});

export default logger;

