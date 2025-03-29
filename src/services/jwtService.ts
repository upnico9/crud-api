import jwt from 'jsonwebtoken';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret';

export function signAccessToken(payload: object) {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: object) {
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, JWT_ACCESS_SECRET);
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, JWT_REFRESH_SECRET);
}

