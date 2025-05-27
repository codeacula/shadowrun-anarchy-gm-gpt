import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import cors from '@fastify/cors';
import connectToDatabase from './utils/db';
import config from './config';

// Import yaml library
const yaml = require('js-yaml');

// Import routes
import campaignRoutes from './api/routes/campaigns';
import sessionRoutes from './api/routes/sessions';
import characterRoutes from './api/routes/characters';
import dataRoutes from './api/routes/data';
import discordRoutes from './api/routes/discord';

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, {
  origin: '*', // In production, you may want to restrict this to specific origins
});

// Register OpenAPI/Swagger
fastify.register(swagger, {
  openapi: {
    info: {
      title: 'Shadowrun Anarchy GPT Memory API',
      description: 'API for storing and retrieving campaign data for Shadowrun Anarchy GPT',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        apiKey: {
          type: 'apiKey',
          name: 'x-api-key',
          in: 'header',
        },
      },
    },
    security: [{ apiKey: [] }],
    tags: [
      { name: 'campaigns', description: 'Campaign management endpoints' },
      { name: 'sessions', description: 'Session management endpoints' },
      { name: 'characters', description: 'Character management endpoints' },
      { name: 'data', description: 'Arbitrary data storage endpoints' },
      { name: 'discord', description: 'Discord integration endpoints' },
    ],
  },
});

fastify.register(swaggerUI, {
  routePrefix: '/docs',
  uiConfig: {
    docExpansion: 'list',
    deepLinking: true,
  },
});

// OpenAPI JSON endpoint
fastify.get('/openapi.json', async () => {
  return fastify.swagger();
});

// OpenAPI YAML endpoint
fastify.get('/openapi.yml', async (request, reply) => {
  const spec = fastify.swagger();
  const yamlSpec = yaml.dump(spec);
  reply.type('text/yaml');
  return yamlSpec;
});

// Register routes
fastify.register(campaignRoutes, { prefix: '/campaigns' });
fastify.register(sessionRoutes, { prefix: '/sessions' });
fastify.register(characterRoutes, { prefix: '/characters' });
fastify.register(dataRoutes, { prefix: '/data' });
fastify.register(discordRoutes, { prefix: '/discord' });

// Health check route
fastify.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Start server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Start the server
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Execute start function
start();