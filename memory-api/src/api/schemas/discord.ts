export const discordMessagesQuerySchema = {
  type: 'object',
  required: ['channelId'],
  properties: {
    channelId: { type: 'string' },
    limit: { type: 'integer', minimum: 1, maximum: 100, default: 50 }
  }
};

export const discordMessageSchema = {
  type: 'object',
  required: ['channelId', 'content'],
  properties: {
    channelId: { type: 'string' },
    content: { type: 'string' }
  }
};

export const discordMessageResponseSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    channelId: { type: 'string' },
    author: { 
      type: 'object',
      properties: {
        id: { type: 'string' },
        username: { type: 'string' }
      }
    },
    content: { type: 'string' },
    timestamp: { type: 'string', format: 'date-time' }
  }
};

export const discordMessagesResponseSchema = {
  type: 'array',
  items: discordMessageResponseSchema
};