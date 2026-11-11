import dotenv from 'dotenv';
import { randomBytes } from 'crypto';
dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

function getJwtSecret(name: 'JWT_ACCESS_SECRET' | 'JWT_REFRESH_SECRET'): string {
  const value = process.env[name];
  if (isProduction && (!value || value.length < 32)) {
    throw new Error(`${name} must be configured with at least 32 characters in production.`);
  }
  return value || randomBytes(32).toString('hex');
}

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtAccessSecret: getJwtSecret('JWT_ACCESS_SECRET'),
  jwtRefreshSecret: getJwtSecret('JWT_REFRESH_SECRET'),
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  mlServiceApiKey: process.env.ML_SERVICE_API_KEY || '',
  storageProvider: (process.env.STORAGE_PROVIDER || 'MOCK') as 'S3' | 'CLOUDINARY' | 'MOCK',
  aiProvider: (process.env.AI_PROVIDER || 'MOCK') as 'ANTHROPIC' | 'OPENAI' | 'GEMINI' | 'MOCK',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
};
