import mongoose, { Document, Schema } from 'mongoose';

export interface ICampaign extends Document {
    title: string;
    description: string;
    users: mongoose.Types.ObjectId[];
    sessions: mongoose.Types.ObjectId[];
}

const CampaignSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    users: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    sessions: [{ type: mongoose.Types.ObjectId, ref: 'Session' }]
});

const Campaign = mongoose.model<ICampaign>('Campaign', CampaignSchema);

export default Campaign;