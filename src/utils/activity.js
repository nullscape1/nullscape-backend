import { ActivityLog } from '../models/ActivityLog.js';
import logger from './logger.js';

export async function logActivity({ action, entity, entityId, user, ip, meta }) {
  try {
    await ActivityLog.create({
      action,
      entity,
      entityId,
      user: user ? { id: user.id, email: user.email, roles: user.roles } : undefined,
      ip,
      meta,
    });
  } catch (e) {
    logger.error('Activity log error', {
      error: e.message,
      stack: e.stack,
      action,
      entity,
      entityId,
    });
  }
}
