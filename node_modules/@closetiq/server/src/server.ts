import { createApp } from './app.js';
import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { prisma } from '@closetiq/database';

async function bootstrap() {
  const app = createApp();

  const server = app.listen(config.port, '0.0.0.0', () => {
    logger.info(`ClosetIQ Core API Service listening on port ${config.port} [env=${config.nodeEnv}]`);
  });

  const gracefulShutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Gracefully shutting down...`);
    server.close(async () => {
      logger.info('HTTP server closed.');
      await prisma.$disconnect();
      logger.info('Database disconnected.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

bootstrap().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});
