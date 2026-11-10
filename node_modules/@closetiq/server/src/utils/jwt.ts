import jwt from 'jsonwebtoken';
import { JwtAccessPayload, Role } from '@closetiq/shared-types';
import { UnauthorizedError } from './errors.js';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'closetiq_super_secret_access_key_2026_dev_mode';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'closetiq_super_secret_refresh_key_2026_dev_mode';

export function signAccessToken(payload: { userId: string; email: string; role: Role }): string {
  return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  try {
    return jwt.verify(token, JWT_ACCESS_SECRET) as JwtAccessPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired access token', err);
  }
}

export function verifyRefreshToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as { userId: string };
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token', err);
  }
}
