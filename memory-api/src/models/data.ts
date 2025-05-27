import mongoose, { Schema, Document } from 'mongoose';

export interface IData extends Document {
  campaignId: mongoose.Types.ObjectId;
  key: string;
  value: any;
  createdAt: Date;
  updatedAt: Date;
}

const DataSchema: Schema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    key: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true }
  },
  { timestamps: true }
);

// Create a compound index on campaignId and key for fast lookups
DataSchema.index({ campaignId: 1, key: 1 }, { unique: true });

export default mongoose.model<IData>('Data', DataSchema);