"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_js_1 = require("./config/index.js");
const index_js_2 = __importDefault(require("./routes/index.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const rateLimiter_js_1 = require("./middleware/rateLimiter.js");
function createApp() {
    const app = (0, express_1.default)();
    // 1. Security Headers
    app.use((0, helmet_1.default)({
        contentSecurityPolicy: index_js_1.config.nodeEnv === 'production',
        crossOriginEmbedderPolicy: false,
    }));
    // 2. CORS
    app.use((0, cors_1.default)({
        origin: [index_js_1.config.corsOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // 3. Parsers & Rate Limiters
    app.use((0, cookie_parser_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    app.use((0, rateLimiter_js_1.createRateLimiter)(60 * 1000, 200));
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
    app.use('/api/v1', index_js_2.default);
    // 6. Centralized Error Handler
    app.use(errorHandler_js_1.errorHandler);
    return app;
}
