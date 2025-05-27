import mongoose, { Schema, Document } from 'mongoose';

export interface ICharacter extends Document {
  campaignId: mongoose.Types.ObjectId;
  name: string;
  playerName: string;
  concept: string;
  attributes: Record<string, number>;
  qualities: string[];
  skills: Record<string, number>;
  gear: string[];
  description: string;
  history: string;
  createdAt: Date;
  updatedAt: Date;
}

const CharacterSchema: Schema = new Schema(
  {
    campaignId: { type: Schema.Types.ObjectId, ref: 'Campaign', required: true },
    name: { type: String, required: true },
    playerName: { type: String, required: true },
    concept: { type: String, required: true },
    attributes: { type: Map, of: Number, default: {} },
    qualities: { type: [String], default: [] },
    skills: { type: Map, of: Number, default: {} },
    gear: { type: [String], default: [] },
    description: { type: String, default: '' },
    history: { type: String, default: '' }
  },
  { timestamps: true }
);

export default mongoose.model<ICharacter>('Character', CharacterSchema);