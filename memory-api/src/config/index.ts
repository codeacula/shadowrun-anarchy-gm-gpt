import dotenv from 'dotenv';

dotenv.config();

const config = {
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000,
    host: process.env.HOST || '0.0.0.0',
  },
  security: {
    apiKey: process.env.API_KEY || 'default_insecure_api_key',
  },
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shadowrun',
  },
  discord: {
    token: process.env.DISCORD_TOKEN || '',
  },
};

export default config;