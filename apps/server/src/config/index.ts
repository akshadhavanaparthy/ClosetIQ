import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'closetiq_super_secret_access_key_2026_dev_mode',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'closetiq_super_secret_refresh_key_2026_dev_mode',
  cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:8000',
  mlServiceApiKey: process.env.ML_SERVICE_API_KEY || 'closetiq_internal_ml_key_2026',
  storageProvider: (process.env.STORAGE_PROVIDER || 'MOCK') as 'S3' | 'CLOUDINARY' | 'MOCK',
  aiProvider: (process.env.AI_PROVIDER || 'MOCK') as 'ANTHROPIC' | 'OPENAI' | 'GEMINI' | 'MOCK',
  anthropicApiKey: process.env.ANTHROPIC_API_KEY || '',
  openaiApiKey: process.env.OPENAI_API_KEY || '',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  cdnBaseUrl: process.env.VITE_IMAGE_CDN_URL || 'https://images.unsplash.com',
};
