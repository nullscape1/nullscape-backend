import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';

export function generateAccessToken(userId, roles) {
  const payload = { sub: userId, roles };
  return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m',
  });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
  });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
}

export function tokenExpiryFromNow(expiresInText) {
  const unit = expiresInText?.slice(-1);
  const num = parseInt(expiresInText, 10);
  switch (unit) {
    case 'm':
      return dayjs().add(num, 'minute').toDate();
    case 'h':
      return dayjs().add(num, 'hour').toDate();
    case 'd':
    default:
      return dayjs().add(num || 30, 'day').toDate();
  }
}



