import { Request, Response, NextFunction } from 'express';
import { ApiErrorResponse } from '@closetiq/shared-types';
import { AppError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  if (err instanceof AppError) {
    logger.warn(`Handled application error [${err.code}]: ${err.message}`, {
      statusCode: err.statusCode,
      details: err.details,
    });

    const response: ApiErrorResponse = {
      success: false,
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
      timestamp,
    };

    res.status(err.statusCode).json(response);
    return;
  }

  logger.error('Unhandled Server Exception:', err);

  const response: ApiErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' ? 'An unexpected error occurred' : err.message,
    },
    timestamp,
  };

  res.status(500).json(response);
}
