import Session, { ISession } from '../models/session';
import mongoose from 'mongoose';

class SessionService {
  async getAllSessions(): Promise<ISession[]> {
    return Session.find().sort({ date: -1 });
  }

  async getSessionById(id: string): Promise<ISession | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Session.findById(id);
  }

  async getSessionsByCampaignId(campaignId: string): Promise<ISession[]> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return [];
    }
    return Session.find({ campaignId }).sort({ date: -1 });
  }

  async createSession(sessionData: Partial<ISession>): Promise<ISession> {
    const session = new Session(sessionData);
    return session.save();
  }

  async updateSession(id: string, sessionData: Partial<ISession>): Promise<ISession | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Session.findByIdAndUpdate(
      id,
      sessionData,
      { new: true }
    );
  }

  async deleteSession(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Session.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default new SessionService();