import { FastifyRequest, FastifyReply } from 'fastify';
import campaignService from '../../services/campaignService';

export async function getAllCampaigns(_request: FastifyRequest, reply: FastifyReply) {
  try {
    const campaigns = await campaignService.getAllCampaigns();
    return reply.code(200).send(campaigns);
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function getCampaignById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const campaign = await campaignService.getCampaignById(id);
    
    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }
    
    return reply.code(200).send(campaign);
  } catch (error) {
    console.error('Error fetching campaign by ID:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function createCampaign(request: FastifyRequest, reply: FastifyReply) {
  try {
    const campaignData = request.body as any;
    const campaign = await campaignService.createCampaign(campaignData);
    return reply.code(201).send(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function updateCampaign(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const campaignData = request.body as any;
    const campaign = await campaignService.updateCampaign(id, campaignData);
    
    if (!campaign) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }
    
    return reply.code(200).send(campaign);
  } catch (error) {
    console.error('Error updating campaign:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}

export async function deleteCampaign(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
  try {
    const { id } = request.params;
    const success = await campaignService.deleteCampaign(id);
    
    if (!success) {
      return reply.code(404).send({ error: 'Campaign not found' });
    }
    
    return reply.code(204).send();
  } catch (error) {
    console.error('Error deleting campaign:', error);
    return reply.code(500).send({ error: 'Internal Server Error' });
  }
}