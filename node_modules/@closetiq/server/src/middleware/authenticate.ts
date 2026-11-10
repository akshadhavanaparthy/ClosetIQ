import { Request, Response, NextFunction } from 'express';
import { JwtAccessPayload } from '@closetiq/shared-types';
import { verifyAccessToken } from '../utils/jwt.js';
import { UnauthorizedError } from '../utils/errors.js';

export interface AuthenticatedRequest extends Request {
  user?: JwtAccessPayload;
}

export function authenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authorization header missing or invalid format (Bearer token required)');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new UnauthorizedError('Token not provided');
  }

  const payload = verifyAccessToken(token);
  req.user = payload;
  next();
}

export function optionalAuthenticate(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        req.user = verifyAccessToken(token);
      } catch {
        // Ignore failure for optional auth
      }
    }
  }
  next();
}
