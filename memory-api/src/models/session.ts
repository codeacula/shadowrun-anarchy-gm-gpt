import mongoose, { Schema, Document } from 'mongoose';

export interface ISession extends Document {
  campaignId: mongoose.Types.ObjectId;
  title: string;
  summary: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema: Schema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model<ISession>('Session', SessionSchema);