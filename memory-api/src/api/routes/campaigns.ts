import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import {
  getAllCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign
} from '../controllers/campaignController';
import { campaignSchema, campaignResponseSchema, campaignsResponseSchema } from '../schemas/campaign';

async function campaignRoutes(fastify: FastifyInstance) {
  // Apply API key authentication to all routes
  fastify.addHook('preHandler', apiKeyAuth);

  // GET all campaigns
  fastify.get('/', {
    schema: {
      description: 'Get all campaigns',
      tags: ['campaigns'],
      response: {
        200: campaignsResponseSchema
      }
    },
    handler: getAllCampaigns
  });

  // GET a campaign by ID
  fastify.get('/:id', {
    schema: {
      description: 'Get a campaign by ID',
      tags: ['campaigns'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: campaignResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getCampaignById
  });

  // POST create a new campaign
  fastify.post('/', {
    schema: {
      description: 'Create a new campaign',
      tags: ['campaigns'],
      body: campaignSchema,
      response: {
        201: campaignResponseSchema
      }
    },
    handler: createCampaign
  });

  // PUT update a campaign
  fastify.put('/:id', {
    schema: {
      description: 'Update a campaign',
      tags: ['campaigns'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: campaignSchema,
      response: {
        200: campaignResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: updateCampaign
  });

  // DELETE a campaign
  fastify.delete('/:id', {
    schema: {
      description: 'Delete a campaign',
      tags: ['campaigns'],
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
    handler: deleteCampaign
  });
}

export default campaignRoutes;