import httpStatus from 'http-status';
import { catchAsync } from '../utils/catchAsync.js';
import * as AuthService from '../services/authService.js';
import { ApiError } from '../middlewares/error.js';
import { User } from '../models/User.js';

export const register = catchAsync(async (req, res) => {
  const user = await AuthService.registerAdmin(req.body);
  res.status(httpStatus.CREATED).json({ user: { id: user.id, name: user.name, email: user.email } });
});

export const login = catchAsync(async (req, res) => {
  const { user, tokens } = await AuthService.login(req.body);
  res.json({
    user: { id: user.id, name: user.name, email: user.email, roles: user.roles.map((r) => r.name) },
    tokens,
  });
});

export const refresh = catchAsync(async (req, res) => {
  const data = await AuthService.refresh({ refreshToken: req.body.refreshToken });
  res.json(data);
});

export const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body.email);
  res.json({ success: true, ...(result ? { message: 'Reset email sent' } : { message: 'If the email exists, a link was sent' }) });
});

export const resetPassword = catchAsync(async (req, res) => {
  await AuthService.resetPassword({ token: req.body.token, password: req.body.password });
  res.json({ success: true });
});

export const me = catchAsync(async (req, res) => {
  const user = await User.findById(req.user.id).populate('roles');
  if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  res.json({ id: user.id, name: user.name, email: user.email, roles: user.roles.map((r) => r.name) });
});

export const logout = catchAsync(async (req, res) => {
  await AuthService.logout({ refreshToken: req.body.refreshToken });
  res.json({ success: true });
});


