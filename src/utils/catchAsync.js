/**
 * Async route/controller wrapper. Returns the promise so callers can await completion (e.g. after-handler logging).
 */
export const catchAsync = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);



