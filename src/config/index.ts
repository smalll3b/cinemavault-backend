import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  // Database
  database: {
    type: process.env.DATABASE_TYPE || 'sqlite',
    url: process.env.DATABASE_URL || './data/cinemavault.db',
  },

  // OMDB API
  omdb: {
    apiKey: process.env.OMDB_API_KEY,
    apiUrl: process.env.OMDB_API_URL || 'https://www.omdbapi.com',
  },

  // CORS
  cors: {
    allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(','),
  },

  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
  },
};

