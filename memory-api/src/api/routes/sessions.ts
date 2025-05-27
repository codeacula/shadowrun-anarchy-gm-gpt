import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import {
  getAllSessions,
  getSessionById,
  getSessionsByCampaignId,
  createSession,
  updateSession,
  deleteSession
} from '../controllers/sessionController';
import { sessionSchema, sessionResponseSchema, sessionsResponseSchema } from '../schemas/session';

async function sessionRoutes(fastify: FastifyInstance) {
  // Apply API key authentication to all routes
  fastify.addHook('preHandler', apiKeyAuth);

  // GET all sessions
  fastify.get('/', {
    schema: {
      description: 'Get all sessions',
      tags: ['sessions'],
      response: {
        200: sessionsResponseSchema
      }
    },
    handler: getAllSessions
  });

  // GET a session by ID
  fastify.get('/:id', {
    schema: {
      description: 'Get a session by ID',
      tags: ['sessions'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: sessionResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getSessionById
  });

  // GET sessions by campaign ID
  fastify.get('/campaign/:campaignId', {
    schema: {
      description: 'Get all sessions for a campaign',
      tags: ['sessions'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      response: {
        200: sessionsResponseSchema
      }
    },
    handler: getSessionsByCampaignId
  });

  // POST create a new session
  fastify.post('/', {
    schema: {
      description: 'Create a new session',
      tags: ['sessions'],
      body: sessionSchema,
      response: {
        201: sessionResponseSchema
      }
    },
    handler: createSession
  });

  // PUT update a session
  fastify.put('/:id', {
    schema: {
      description: 'Update a session',
      tags: ['sessions'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: sessionSchema,
      response: {
        200: sessionResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: updateSession
  });

  // DELETE a session
  fastify.delete('/:id', {
    schema: {
      description: 'Delete a session',
      tags: ['sessions'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        204: {
          type: 'null',
          description: 'Successfully deleted'
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: deleteSession
  });
}

export default sessionRoutes;