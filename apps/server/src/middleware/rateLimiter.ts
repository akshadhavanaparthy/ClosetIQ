import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors.js';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Simple in-memory rate limiter for development and local testing
export function createRateLimiter(windowMs = 60 * 1000, maxRequests = 100) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const ip = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = rateLimitStore.get(ip);
    if (!record || now > record.resetTime) {
      rateLimitStore.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfter = Math.ceil((record.resetTime - now) / 1000);
      throw new AppError(
        `Too many requests. Please retry in ${retryAfter} seconds.`,
        429,
        'RATE_LIMIT_EXCEEDED',
        { retryAfterSeconds: retryAfter }
      );
    }

    record.count += 1;
    next();
  };
}
