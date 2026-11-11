"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'closetiq_super_secret_access_key_2026_dev_mode',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'closetiq_super_secret_refresh_key_2026_dev_mode',
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    mlServiceApiKey: process.env.ML_SERVICE_API_KEY || 'closetiq_internal_ml_key_2026',
    storageProvider: (process.env.STORAGE_PROVIDER || 'MOCK'),
    aiProvider: (process.env.AI_PROVIDER || 'MOCK'),
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
};
