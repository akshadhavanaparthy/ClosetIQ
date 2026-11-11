"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const crypto_1 = require("crypto");
dotenv_1.default.config();
const isProduction = process.env.NODE_ENV === 'production';
function getJwtSecret(name) {
    const value = process.env[name];
    if (isProduction && (!value || value.length < 32)) {
        throw new Error(`${name} must be configured with at least 32 characters in production.`);
    }
    return value || (0, crypto_1.randomBytes)(32).toString('hex');
}
exports.config = {
    port: parseInt(process.env.PORT || '4000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    jwtAccessSecret: getJwtSecret('JWT_ACCESS_SECRET'),
    jwtRefreshSecret: getJwtSecret('JWT_REFRESH_SECRET'),
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
    mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    mlServiceApiKey: process.env.ML_SERVICE_API_KEY || '',
    storageProvider: (process.env.STORAGE_PROVIDER || 'MOCK'),
    aiProvider: (process.env.AI_PROVIDER || 'MOCK'),
    anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    geminiApiKey: process.env.GEMINI_API_KEY || '',
};
