export const characterSchema = {
  type: 'object',
  required: ['campaignId', 'name', 'playerName', 'concept'],
  properties: {
    campaignId: { type: 'string' },
    name: { type: 'string' },
    playerName: { type: 'string' },
    concept: { type: 'string' },
    attributes: { 
      type: 'object',
      additionalProperties: { type: 'number' }
    },
    qualities: {
      type: 'array',
      items: { type: 'string' }
    },
    skills: {
      type: 'object',
      additionalProperties: { type: 'number' }
    },
    gear: {
      type: 'array',
      items: { type: 'string' }
    },
    description: { type: 'string' },
    history: { type: 'string' }
  }
};

export const characterResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    campaignId: { type: 'string' },
    name: { type: 'string' },
    playerName: { type: 'string' },
    concept: { type: 'string' },
    attributes: { type: 'object' },
    qualities: { 
      type: 'array',
      items: { type: 'string' }
    },
    skills: { type: 'object' },
    gear: {
      type: 'array',
      items: { type: 'string' }
    },
    description: { type: 'string' },
    history: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const charactersResponseSchema = {
  type: 'array',
  items: characterResponseSchema
};