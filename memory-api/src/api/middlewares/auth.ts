import { FastifyRequest, FastifyReply } from 'fastify';
import config from '../../config';

export async function apiKeyAuth(request: FastifyRequest, reply: FastifyReply) {
  const apiKey = request.headers['x-api-key'];
  
  if (!apiKey || apiKey !== config.security.apiKey) {
    reply.code(401).send({ error: 'Unauthorized: Invalid API Key' });
    return;
  }
}