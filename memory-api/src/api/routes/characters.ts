import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import {
  getAllCharacters,
  getCharacterById,
  getCharactersByCampaignId,
  createCharacter,
  updateCharacter,
  deleteCharacter
} from '../controllers/characterController';
import { characterSchema, characterResponseSchema, charactersResponseSchema } from '../schemas/character';

async function characterRoutes(fastify: FastifyInstance) {
  // Apply API key authentication to all routes
  fastify.addHook('preHandler', apiKeyAuth);

  // GET all characters
  fastify.get('/', {
    schema: {
      description: 'Get all characters',
      tags: ['characters'],
      response: {
        200: charactersResponseSchema
      }
    },
    handler: getAllCharacters
  });

  // GET a character by ID
  fastify.get('/:id', {
    schema: {
      description: 'Get a character by ID',
      tags: ['characters'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: characterResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getCharacterById
  });

  // GET characters by campaign ID
  fastify.get('/campaign/:campaignId', {
    schema: {
      description: 'Get all characters for a campaign',
      tags: ['characters'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      response: {
        200: charactersResponseSchema
      }
    },
    handler: getCharactersByCampaignId
  });

  // POST create a new character
  fastify.post('/', {
    schema: {
      description: 'Create a new character',
      tags: ['characters'],
      body: characterSchema,
      response: {
        201: characterResponseSchema
      }
    },
    handler: createCharacter
  });

  // PUT update a character
  fastify.put('/:id', {
    schema: {
      description: 'Update a character',
      tags: ['characters'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: characterSchema,
      response: {
        200: characterResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: updateCharacter
  });

  // DELETE a character
  fastify.delete('/:id', {
    schema: {
      description: 'Delete a character',
      tags: ['characters'],
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
    handler: deleteCharacter
  });
}

export default characterRoutes;