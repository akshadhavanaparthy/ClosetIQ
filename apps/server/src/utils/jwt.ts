import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { JwtAccessPayload, Role } from '@closetiq/shared-types';
import { UnauthorizedError } from './errors.js';
import { config } from '../config/index.js';

export function signAccessToken(payload: { userId: string; email: string; role: Role }): string {
  return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: '15m' });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({ userId, jti: randomUUID() }, config.jwtRefreshSecret, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  try {
    return jwt.verify(token, config.jwtAccessSecret) as JwtAccessPayload;
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired access token', err);
  }
}

export function verifyRefreshToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, config.jwtRefreshSecret) as { userId: string };
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired refresh token', err);
  }
}
