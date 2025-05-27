import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import {
  getAllData,
  getDataById,
  getDataByKey,
  getDataByCampaignId,
  createOrUpdateData,
  deleteData,
  deleteDataByKey
} from '../controllers/dataController';
import { dataSchema, dataResponseSchema, dataListResponseSchema } from '../schemas/data';

async function dataRoutes(fastify: FastifyInstance) {
  // Apply API key authentication to all routes
  fastify.addHook('preHandler', apiKeyAuth);

  // GET all data
  fastify.get('/', {
    schema: {
      description: 'Get all data',
      tags: ['data'],
      response: {
        200: dataListResponseSchema
      }
    },
    handler: getAllData
  });

  // GET data by ID
  fastify.get('/:id', {
    schema: {
      description: 'Get data by ID',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: dataResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getDataById
  });

  // GET data by campaign ID
  fastify.get('/campaign/:campaignId', {
    schema: {
      description: 'Get all data for a campaign',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      response: {
        200: dataListResponseSchema
      }
    },
    handler: getDataByCampaignId
  });

  // GET data by key
  fastify.get('/campaign/:campaignId/key', {
    schema: {
      description: 'Get data by campaign ID and key',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        required: ['key'],
        properties: {
          key: { type: 'string' }
        }
      },
      response: {
        200: dataResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getDataByKey
  });

  // POST/PUT data (create or update)
  fastify.post('/campaign/:campaignId', {
    schema: {
      description: 'Create or update data for a campaign',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['key', 'value'],
        properties: {
          key: { type: 'string' },
          value: { type: 'object' }
        }
      },
      response: {
        200: dataResponseSchema
      }
    },
    handler: createOrUpdateData
  });

  // DELETE data by ID
  fastify.delete('/:id', {
    schema: {
      description: 'Delete data by ID',
      tags: ['data'],
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
    handler: deleteData
  });

  // DELETE data by key
  fastify.delete('/campaign/:campaignId/key', {
    schema: {
      description: 'Delete data by campaign ID and key',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      querystring: {
        type: 'object',
        required: ['key'],
        properties: {
          key: { type: 'string' }
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
    handler: deleteDataByKey
  });
}

export default dataRoutes;