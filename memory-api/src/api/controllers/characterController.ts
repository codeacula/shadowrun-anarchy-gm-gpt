import { FastifyRequest, FastifyReply } from 'fastify';
import characterService from '../../services/characterService';

export async function getAllCharacters(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const characters = await characterService.getAllCharacters();
    return reply.code(200).send(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getCharacterById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const character = await characterService.getCharacterById(id);
    
    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }
    
    return reply.code(200).send(character);
  } catch (error) {
    console.error('Error fetching character by ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getCharactersByCampaignId(request: FastifyRequest<{ Params: { campaignId: string } }>, reply: FastifyReply) {
  try {
    const { campaignId } = request.params;
    const characters = await characterService.getCharactersByCampaignId(campaignId);
    return reply.code(200).send(characters);
  } catch (error) {
    console.error('Error fetching characters by campaign ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function createCharacter(request: FastifyRequest, reply: FastifyReply) {
  try {
    const characterData = request.body as any;
    const character = await characterService.createCharacter(characterData);
    return reply.code(201).send(character);
  } catch (error) {
    console.error('Error creating character:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateCharacter(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const characterData = request.body as any;
    const character = await characterService.updateCharacter(id, characterData);
    
    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }
    
    return reply.code(200).send(character);
  } catch (error) {
    console.error('Error updating character:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteCharacter(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const success = await characterService.deleteCharacter(id);
    
    if (!success) {
      return reply.code(404).send({ error: 'Character not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting character:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}