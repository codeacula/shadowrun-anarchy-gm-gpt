import mongoose, { Document, Schema } from 'mongoose';

export interface ISession extends Document {
    title: string;
    description: string;
    date: Date;
    campaignId: mongoose.Types.ObjectId;
    characters: mongoose.Types.ObjectId[];
}

const sessionSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    campaignId: { type: mongoose.Types.ObjectId, ref: 'Campaign', required: true },
    characters: [{ type: mongoose.Types.ObjectId, ref: 'Character' }]
});

const Session = mongoose.model<ISession>('Session', sessionSchema);

export default Session;