import { FastifyRequest, FastifyReply } from 'fastify';
import dataService from '../../services/dataService';

export async function getAllData(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const data = await dataService.getAllData();
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error fetching all data:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getDataById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const data = await dataService.getDataById(id);
    
    if (!data) {
      return reply.code(404).send({ error: 'Data not found' });
    }
    
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error fetching data by ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getDataByKey(
  request: FastifyRequest<{ 
    Params: { campaignId: string },
    Querystring: { key: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { campaignId } = request.params;
    const { key } = request.query;
    
    if (!key) {
      return reply.code(400).send({ error: 'Key is required' });
    }
    
    const data = await dataService.getDataByKey(campaignId, key);
    
    if (!data) {
      return reply.code(404).send({ error: 'Data not found' });
    }
    
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error fetching data by key:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getDataByCampaignId(
  request: FastifyRequest<{ Params: { campaignId: string } }>,
  reply: FastifyReply
) {
  try {
    const { campaignId } = request.params;
    const data = await dataService.getDataByCampaignId(campaignId);
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error fetching data by campaign ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function createOrUpdateData(
  request: FastifyRequest<{ Params: { campaignId: string } }>,
  reply: FastifyReply
) {
  try {
    const { campaignId } = request.params;
    const { key, value } = request.body as { key: string; value: any };
    
    if (!key) {
      return reply.code(400).send({ error: 'Key is required' });
    }
    
    const data = await dataService.createOrUpdateData(campaignId, key, value);
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error creating/updating data:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteData(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const success = await dataService.deleteData(id);
    
    if (!success) {
      return reply.code(404).send({ error: 'Data not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting data:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteDataByKey(
  request: FastifyRequest<{
    Params: { campaignId: string },
    Querystring: { key: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { campaignId } = request.params;
    const { key } = request.query;
    
    if (!key) {
      return reply.code(400).send({ error: 'Key is required' });
    }
    
    const success = await dataService.deleteDataByKey(campaignId, key);
    
    if (!success) {
      return reply.code(404).send({ error: 'Data not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting data by key:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}