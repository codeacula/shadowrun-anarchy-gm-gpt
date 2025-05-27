export const dataSchema = {
  type: 'object',
  required: ['campaignId', 'key', 'value'],
  properties: {
    campaignId: { type: 'string' },
    key: { type: 'string' },
    value: { type: 'object' }
  }
};

export const dataResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    campaignId: { type: 'string' },
    key: { type: 'string' },
    value: { type: 'object' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const dataListResponseSchema = {
  type: 'array',
  items: dataResponseSchema
};

// New schemas for arbitrary JSON documents
export const documentSchema = {
  description: 'Any valid JSON document'
  // No type validation - accepts any JSON
};

export const documentResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    campaignId: { type: 'string' },
    key: { type: 'string' },
    value: { description: 'The stored JSON document' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};