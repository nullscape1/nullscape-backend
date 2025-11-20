import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { ApiError } from './error.js';
import { User } from '../models/User.js';

export const auth = () => async (req, _res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authorization token missing'));
    }
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(payload.sub).populate('roles');
    if (!user) return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
    req.user = {
      id: user.id,
      email: user.email,
      roles: user.roles?.map((r) => r.name) || [],
    };
    return next();
  } catch (e) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'));
  }
};

export const requireRoles = (...allowed) => (req, _res, next) => {
  const userRoles = req.user?.roles || [];
  const ok = allowed.some((role) => userRoles.includes(role));
  if (!ok) return next(new ApiError(httpStatus.FORBIDDEN, 'Insufficient permissions'));
  return next();
};



