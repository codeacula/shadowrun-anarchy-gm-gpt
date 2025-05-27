export const campaignSchema = {
  type: 'object',
  required: ['title', 'setting', 'theme'],
  properties: {
    title: { type: 'string' },
    setting: { type: 'string' },
    theme: { type: 'string' },
    houseRules: { type: 'string' }
  }
};

export const campaignResponseSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    title: { type: 'string' },
    setting: { type: 'string' },
    theme: { type: 'string' },
    houseRules: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' }
  }
};

export const campaignsResponseSchema = {
  type: 'array',
  items: campaignResponseSchema
};