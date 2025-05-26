import mongoose, { Document, Schema } from 'mongoose';

export interface ICharacter extends Document {
    name: string;
    player: string;
    campaign: string;
    attributes: {
        strength: number;
        agility: number;
        intelligence: number;
        charisma: number;
    };
    skills: string[];
    createdAt: Date;
    updatedAt: Date;
}

const CharacterSchema: Schema = new Schema({
    name: { type: String, required: true },
    player: { type: String, required: true },
    campaign: { type: String, required: true },
    attributes: {
        strength: { type: Number, required: true },
        agility: { type: Number, required: true },
        intelligence: { type: Number, required: true },
        charisma: { type: Number, required: true },
    },
    skills: { type: [String], default: [] },
}, {
    timestamps: true,
});

const Character = mongoose.model<ICharacter>('Character', CharacterSchema);

export default Character;