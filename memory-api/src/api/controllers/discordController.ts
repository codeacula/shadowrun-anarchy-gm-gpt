import { FastifyRequest, FastifyReply } from 'fastify';
import discordService from '../../services/discordService';

export async function getMessages(
  request: FastifyRequest<{ Querystring: { channelId: string; limit?: string } }>,
  reply: FastifyReply
) {
  try {
    const { channelId, limit } = request.query;
    const limitNum = limit ? parseInt(limit, 10) : 50;
    
    if (!channelId) {
      return reply.code(400).send({ error: 'Channel ID is required' });
    }
    
    const messages = await discordService.getMessages(channelId, limitNum);
    return reply.code(200).send(messages);
  } catch (error) {
    console.error('Error fetching Discord messages:', error);
    if ((error as Error).message.includes('not found') || (error as Error).message.includes('not a text channel')) {
      return reply.code(404).send({ error: (error as Error).message });
    }
    if ((error as Error).message.includes('not ready')) {
      return reply.code(503).send({ error: (error as Error).message });
    }
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function sendMessage(request: FastifyRequest, reply: FastifyReply) {
  try {
    const { channelId, content } = request.body as { channelId: string; content: string };
    
    if (!channelId) {
      return reply.code(400).send({ error: 'Channel ID is required' });
    }
    
    if (!content || typeof content !== 'string' || content.trim() === '') {
      return reply.code(400).send({ error: 'Valid content is required' });
    }
    
    const message = await discordService.sendMessage(channelId, content);
    return reply.code(201).send(message);
  } catch (error) {
    console.error('Error sending Discord message:', error);
    if ((error as Error).message.includes('not found') || (error as Error).message.includes('not a text channel')) {
      return reply.code(404).send({ error: (error as Error).message });
    }
    if ((error as Error).message.includes('not ready')) {
      return reply.code(503).send({ error: (error as Error).message });
    }
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}