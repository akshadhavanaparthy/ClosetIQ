"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const index_js_1 = require("./config/index.js");
const logger_js_1 = require("./utils/logger.js");
const database_1 = require("@closetiq/database");
async function bootstrap() {
    await database_1.prisma.$connect();
    const app = (0, app_js_1.createApp)();
    const server = app.listen(index_js_1.config.port, '0.0.0.0', () => {
        logger_js_1.logger.info(`ClosetIQ Core API Service listening on port ${index_js_1.config.port} [env=${index_js_1.config.nodeEnv}]`);
    });
    const gracefulShutdown = async (signal) => {
        logger_js_1.logger.info(`Received ${signal}. Gracefully shutting down...`);
        server.close(async () => {
            logger_js_1.logger.info('HTTP server closed.');
            await database_1.prisma.$disconnect();
            logger_js_1.logger.info('Database disconnected.');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}
bootstrap().catch((err) => {
    logger_js_1.logger.error('Failed to start server:', err);
    process.exit(1);
});
