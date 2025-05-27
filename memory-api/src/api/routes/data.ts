import { FastifyInstance } from 'fastify';
import { apiKeyAuth } from '../middlewares/auth';
import {
  getAllData,
  getDataById,
  getDataByKey,
  getDataByCampaignId,
  createOrUpdateData,
  deleteData,
  deleteDataByKey,
  createDocument,
  updateDocument,
  getDocument,
  deleteDocument
} from '../controllers/dataController';
import { dataSchema, dataResponseSchema, dataListResponseSchema, documentSchema, documentResponseSchema } from '../schemas/data';

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

  // POST/PUT document (create or update)
  fastify.post('/document', {
    schema: {
      description: 'Create or update a document',
      tags: ['document'],
      body: documentSchema,
      response: {
        200: documentResponseSchema
      }
    },
    handler: createDocument
  });

  // GET document by ID
  fastify.get('/document/:id', {
    schema: {
      description: 'Get document by ID',
      tags: ['document'],
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      response: {
        200: documentResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getDocument
  });

  // DELETE document by ID
  fastify.delete('/document/:id', {
    schema: {
      description: 'Delete document by ID',
      tags: ['document'],
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
    handler: deleteDocument
  });

  // New document endpoints for arbitrary JSON

  // POST a document (create with auto-generated key)
  fastify.post('/campaign/:campaignId/documents', {
    schema: {
      description: 'Store an arbitrary JSON document in a campaign',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId'],
        properties: {
          campaignId: { type: 'string' }
        }
      },
      body: documentSchema,
      response: {
        201: documentResponseSchema
      }
    },
    handler: createDocument
  });

  // PUT a document (update with specific key)
  fastify.put('/campaign/:campaignId/documents/:documentId', {
    schema: {
      description: 'Update an arbitrary JSON document by document ID',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId', 'documentId'],
        properties: {
          campaignId: { type: 'string' },
          documentId: { type: 'string' }
        }
      },
      body: documentSchema,
      response: {
        200: documentResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: updateDocument
  });

  // GET a document by document ID
  fastify.get('/campaign/:campaignId/documents/:documentId', {
    schema: {
      description: 'Get an arbitrary JSON document by document ID',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId', 'documentId'],
        properties: {
          campaignId: { type: 'string' },
          documentId: { type: 'string' }
        }
      },
      response: {
        200: documentResponseSchema,
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    handler: getDocument
  });

  // DELETE a document by document ID
  fastify.delete('/campaign/:campaignId/documents/:documentId', {
    schema: {
      description: 'Delete an arbitrary JSON document by document ID',
      tags: ['data'],
      params: {
        type: 'object',
        required: ['campaignId', 'documentId'],
        properties: {
          campaignId: { type: 'string' },
          documentId: { type: 'string' }
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
    handler: deleteDocument
  });
}

export default dataRoutes;