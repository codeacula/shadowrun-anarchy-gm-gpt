import Data, { IData } from '../models/data';
import mongoose from 'mongoose';

class DataService {
  async getAllData(): Promise<IData[]> {
    return Data.find().sort({ key: 1 });
  }

  async getDataById(id: string): Promise<IData | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Data.findById(id);
  }

  async getDataByKey(campaignId: string, key: string): Promise<IData | null> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return null;
    }
    return Data.findOne({ campaignId, key });
  }

  async getDataByCampaignId(campaignId: string): Promise<IData[]> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return [];
    }
    return Data.find({ campaignId }).sort({ key: 1 });
  }

  async createOrUpdateData(campaignId: string, key: string, value: any): Promise<IData> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      throw new Error('Invalid campaign ID');
    }
    
    return Data.findOneAndUpdate(
      { campaignId, key },
      { campaignId, key, value },
      { upsert: true, new: true }
    );
  }

  async deleteData(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Data.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }

  async deleteDataByKey(campaignId: string, key: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return false;
    }
    const result = await Data.deleteOne({ campaignId, key });
    return result.deletedCount > 0;
  }
}

export default new DataService();