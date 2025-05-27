import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import { getMessages, sendMessage } from '../controllers/discordController';
import { 
  discordMessagesQuerySchema, 
  discordMessageSchema, 
  discordMessageResponseSchema, 
  discordMessagesResponseSchema 
} from '../schemas/discord';

async function discordRoutes(fastify: FastifyInstance) {
  // Apply API key authentication to all routes
  fastify.addHook('preHandler', apiKeyAuth);

  // GET Discord messages
  fastify.get('/messages', {
    schema: {
      description: 'Get messages from a Discord channel',
      tags: ['discord'],
      querystring: {
        type: 'object',
        required: ['channelId'],
        properties: {
          channelId: { type: 'string' },
          limit: { type: 'string', pattern: '^[0-9]+$' }
        }
      },
      response: {
        200: discordMessagesResponseSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        503: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getMessages
  });

  // POST Discord message
  fastify.post('/messages', {
    schema: {
      description: 'Send a message to a Discord channel',
      tags: ['discord'],
      body: discordMessageSchema,
      response: {
        201: discordMessageResponseSchema,
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        503: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: sendMessage
  });
}

export default discordRoutes;