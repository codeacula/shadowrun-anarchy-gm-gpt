export const sessionSchema = {
  type: 'object',
  required: ['campaignId', 'title'],
  properties: {
    campaignId: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string' },
    date: { type: 'string', format: 'date-time' }
  }
};

export const sessionResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    campaignId: { type: 'string' },
    title: { type: 'string' },
    summary: { type: 'string' },
    date: { type: 'string', format: 'date-time' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const sessionsResponseSchema = {
  type: 'array',
  items: sessionResponseSchema
};