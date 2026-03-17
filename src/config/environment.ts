import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({
  path: path.join(process.cwd(), '.env'),
});

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  database: {
    useDatabase: process.env.USE_DATABASE === 'true',
    connectionString: process.env.DB_CONNECTION_STRING || '',
  },
  
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret-key-min-32-characters-long',
  },
  
  api: {
    version: process.env.API_VERSION || '1.0.0',
    baseUrl: `/api/v1`,
  },
  
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};

// Validate required configuration
if (!config.database.useDatabase && config.isProduction) {
  console.warn('Warning: Database is disabled in production mode');
}
