import crypto from 'crypto';
import dayjs from 'dayjs';
import httpStatus from 'http-status';
import { User } from '../models/User.js';
import { Role } from '../models/Role.js';
import { RefreshToken } from '../models/RefreshToken.js';
import { ApiError } from '../middlewares/error.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken, tokenExpiryFromNow } from '../utils/tokens.js';

export async function ensureBaseRoles() {
  const base = ['SuperAdmin', 'Admin', 'Editor'];
  for (const name of base) {
    // eslint-disable-next-line no-await-in-loop
    await Role.updateOne({ name }, { $setOnInsert: { name } }, { upsert: true });
  }
}

export async function registerAdmin({ name, email, password, role = 'Admin' }) {
  await ensureBaseRoles();
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(httpStatus.CONFLICT, 'Email already registered');
  const roleDoc = await Role.findOne({ name: role });
  const user = await User.create({ name, email, password, roles: [roleDoc._id] });
  return user;
}

export async function login({ email, password }) {
  const user = await User.findOne({ email }).populate('roles');
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  const ok = await user.comparePassword(password);
  if (!ok) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  if (!user.isActive) throw new ApiError(httpStatus.FORBIDDEN, 'User is inactive');
  const roles = user.roles.map((r) => r.name);
  const accessToken = generateAccessToken(user.id, roles);
  const refreshToken = generateRefreshToken(user.id);
  const expiresAt = tokenExpiryFromNow(process.env.JWT_REFRESH_EXPIRES || '30d');
  await RefreshToken.create({ user: user.id, token: refreshToken, expiresAt });
  return { user, tokens: { accessToken, refreshToken } };
}

export async function refresh({ refreshToken }) {
  const payload = verifyRefreshToken(refreshToken);
  const tokenDoc = await RefreshToken.findOne({ token: refreshToken, user: payload.sub, revokedAt: null });
  if (!tokenDoc) throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  const user = await User.findById(payload.sub).populate('roles');
  if (!user) throw new ApiError(httpStatus.UNAUTHORIZED, 'User not found');
  const roles = user.roles.map((r) => r.name);
  const accessToken = generateAccessToken(user.id, roles);
  return { accessToken };
}

export async function forgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) return; // do not reveal
  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = dayjs().add(1, 'hour').toDate();
  await user.save();
  return { token, user };
}

export async function resetPassword({ token, password }) {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: new Date() },
  });
  if (!user) throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid or expired token');
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
}

export async function logout({ refreshToken }) {
  if (!refreshToken) return;
  await RefreshToken.updateOne({ token: refreshToken }, { $set: { revokedAt: new Date() } });
}


