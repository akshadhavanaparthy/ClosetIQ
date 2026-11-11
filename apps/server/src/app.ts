import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { createRateLimiter } from './middleware/rateLimiter.js';

export function createApp(): express.Application {
  const app = express();

  // 1. Security Headers
  app.use(
    helmet({
      contentSecurityPolicy: config.nodeEnv === 'production',
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. CORS
  app.use(
    cors({
      origin: [config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // 3. Parsers & Rate Limiters
  app.use(cookieParser());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(createRateLimiter(60 * 1000, 200));

  // 4. Liveness & Readiness Probes
  app.get('/healthz', (_req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'closetiq-core-api',
      version: '1.0.0',
    });
  });

  // 5. Mount API Routes
  app.use('/api/v1', apiRouter);

  // 6. Centralized Error Handler
  app.use(errorHandler);

  return app;
}
