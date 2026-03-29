import { Router } from 'express';
import { auth, requireRoles, optionalAuth } from '../../middlewares/auth.js';
import { cacheMiddleware, cacheClear } from '../../utils/cache.js';

const FIVE_MIN = 5 * 60 * 1000;
const TEN_MIN = 10 * 60 * 1000;

function runCacheClear(patterns) {
  if (!patterns) return;
  const list = Array.isArray(patterns) ? patterns : [patterns];
  list.forEach((p) => {
    if (p) cacheClear(p);
  });
}

/**
 * Factory for standard CRUD routes: GET list (cached), GET :id (cached), POST, PUT :id, DELETE :id.
 * Use for resources that don't need custom logic (blog, portfolio, testimonials, etc.).
 *
 * @param {Object} Controller - { list, get, create, update, remove }
 * @param {Object} options
 * @param {number} [options.cacheListTtl]
 * @param {number} [options.cacheGetTtl]
 * @param {string|string[]} [options.invalidateOnWrite] - substring(s) matching in-memory cache keys (e.g. 'GET:/api/v1/team') cleared on POST/PUT/DELETE
 * @returns {Router}
 */
export function createCrudRoutes(Controller, options = {}) {
  const {
    cacheListTtl = FIVE_MIN,
    cacheGetTtl = TEN_MIN,
    invalidateOnWrite = null,
  } = options;

  const admin = [auth(), requireRoles('Admin', 'SuperAdmin', 'Editor')];
  const adminStrict = [auth(), requireRoles('Admin', 'SuperAdmin')];

  const invalidate = (req, res, next) => {
    runCacheClear(invalidateOnWrite);
    next();
  };

  const writeHooks = invalidateOnWrite ? [invalidate] : [];

  const router = Router();

  router.get('/', optionalAuth(), cacheMiddleware(cacheListTtl), Controller.list);
  router.get('/:id', optionalAuth(), cacheMiddleware(cacheGetTtl), Controller.get);
  router.post('/', ...admin, ...writeHooks, Controller.create);
  router.put('/:id', ...admin, ...writeHooks, Controller.update);
  router.delete('/:id', ...adminStrict, ...writeHooks, Controller.remove);

  return router;
}
