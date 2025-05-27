import mongoose, { Schema, Document } from 'mongoose';

export interface ICampaign extends Document {
  title: string;
  setting: string;
  theme: string;
  houseRules: string;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    setting: { type: String, required: true },
    theme: { type: String, required: true },
    houseRules: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<ICampaign>('Campaign', CampaignSchema);