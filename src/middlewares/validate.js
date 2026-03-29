import httpStatus from 'http-status';
import { ApiError } from './error.js';

export const validateBody = (schema) => async (req, _res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    let msg = 'Validation error';
    if (err?.issues?.length) {
      msg = err.issues
        .map((i) => (i.path?.length ? `${i.path.join('.')}: ${i.message}` : i.message))
        .join('; ');
    } else if (err?.message) {
      msg = err.message;
    }
    next(new ApiError(httpStatus.BAD_REQUEST, msg));
  }
};



