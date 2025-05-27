import { FastifyRequest, FastifyReply } from 'fastify';
import sessionService from '../../services/sessionService';

export async function getAllSessions(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const sessions = await sessionService.getAllSessions();
    return reply.code(200).send(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getSessionById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const session = await sessionService.getSessionById(id);
    
    if (!session) {
      return reply.code(404).send({ error: 'Session not found' });
    }
    
    return reply.code(200).send(session);
  } catch (error) {
    console.error('Error fetching session by ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getSessionsByCampaignId(request: FastifyRequest<{ Params: { campaignId: string } }>, reply: FastifyReply) {
  try {
    const { campaignId } = request.params;
    const sessions = await sessionService.getSessionsByCampaignId(campaignId);
    return reply.code(200).send(sessions);
  } catch (error) {
    console.error('Error fetching sessions by campaign ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function createSession(request: FastifyRequest, reply: FastifyReply) {
  try {
    const sessionData = request.body as any;
    const session = await sessionService.createSession(sessionData);
    return reply.code(201).send(session);
  } catch (error) {
    console.error('Error creating session:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateSession(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const sessionData = request.body as any;
    const session = await sessionService.updateSession(id, sessionData);
    
    if (!session) {
      return reply.code(404).send({ error: 'Session not found' });
    }
    
    return reply.code(200).send(session);
  } catch (error) {
    console.error('Error updating session:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteSession(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const success = await sessionService.deleteSession(id);
    
    if (!success) {
      return reply.code(404).send({ error: 'Session not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting session:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}