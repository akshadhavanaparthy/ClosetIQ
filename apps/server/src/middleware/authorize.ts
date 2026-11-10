import { Response, NextFunction } from 'express';
import { Role } from '@closetiq/shared-types';
import { AuthenticatedRequest } from './authenticate.js';
import { ForbiddenError, UnauthorizedError } from '../utils/errors.js';

export function authorize(...allowedRoles: Role[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Role ${req.user.role} does not have required permissions.`);
    }

    next();
  };
}
