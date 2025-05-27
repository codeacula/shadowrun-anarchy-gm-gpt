import Campaign, { ICampaign } from '../models/campaign';
import mongoose from 'mongoose';

class CampaignService {
  async getAllCampaigns(): Promise<ICampaign[]> {
    return Campaign.find().sort({ createdAt: -1 });
  }

  async getCampaignById(id: string): Promise<ICampaign | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Campaign.findById(id);
  }

  async createCampaign(campaignData: Partial<ICampaign>): Promise<ICampaign> {
    const campaign = new Campaign(campaignData);
    return campaign.save();
  }

  async updateCampaign(id: string, campaignData: Partial<ICampaign>): Promise<ICampaign | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Campaign.findByIdAndUpdate(
      id,
      campaignData,
      { new: true }
    );
  }

  async deleteCampaign(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Campaign.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default new CampaignService();