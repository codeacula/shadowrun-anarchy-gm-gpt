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

// New functions for handling arbitrary JSON documents
export async function createDocument(
  request: FastifyRequest<{ Params: { campaignId: string } }>,
  reply: FastifyReply
) {
  try {
    const { campaignId } = request.params;
    const document = request.body;

    // Generate a unique key based on timestamp and random number
    const key = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const data = await dataService.createOrUpdateData(campaignId, key, document);
    return reply.code(201).send(data);
  } catch (error) {
    console.error('Error creating document:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateDocument(
  request: FastifyRequest<{
    Params: { campaignId: string, documentId: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { campaignId, documentId } = request.params;
    const document = request.body;

    // Check if document exists first
    const existing = await dataService.getDataByKey(campaignId, documentId);
    if (!existing) {
      return reply.code(404).send({ error: 'Document not found' });
    }

    const data = await dataService.createOrUpdateData(campaignId, documentId, document);
    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error updating document:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getDocument(
  request: FastifyRequest<{
    Params: { campaignId: string, documentId: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { campaignId, documentId } = request.params;
    const data = await dataService.getDataByKey(campaignId, documentId);

    if (!data) {
      return reply.code(404).send({ error: 'Document not found' });
    }

    return reply.code(200).send(data);
  } catch (error) {
    console.error('Error fetching document:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteDocument(
  request: FastifyRequest<{
    Params: { campaignId: string, documentId: string }
  }>,
  reply: FastifyReply
) {
  try {
    const { campaignId, documentId } = request.params;
    const success = await dataService.deleteDataByKey(campaignId, documentId);

    if (!success) {
      return reply.code(404).send({ error: 'Document not found' });
    }

    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting document:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}