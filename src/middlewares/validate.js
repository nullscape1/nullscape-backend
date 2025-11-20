import httpStatus from 'http-status';
import { ApiError } from './error.js';

export const validateBody = (schema) => async (req, _res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    next(new ApiError(httpStatus.BAD_REQUEST, err.errors?.[0]?.message || 'Validation error'));
  }
};



