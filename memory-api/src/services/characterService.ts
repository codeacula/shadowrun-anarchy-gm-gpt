import Character, { ICharacter } from '../models/character';
import mongoose from 'mongoose';

class CharacterService {
  async getAllCharacters(): Promise<ICharacter[]> {
    return Character.find().sort({ name: 1 });
  }

  async getCharacterById(id: string): Promise<ICharacter | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Character.findById(id);
  }

  async getCharactersByCampaignId(campaignId: string): Promise<ICharacter[]> {
    if (!mongoose.Types.ObjectId.isValid(campaignId)) {
      return [];
    }
    return Character.find({ campaignId }).sort({ name: 1 });
  }

  async createCharacter(characterData: Partial<ICharacter>): Promise<ICharacter> {
    const character = new Character(characterData);
    return character.save();
  }

  async updateCharacter(id: string, characterData: Partial<ICharacter>): Promise<ICharacter | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }
    return Character.findByIdAndUpdate(
      id,
      characterData,
      { new: true }
    );
  }

  async deleteCharacter(id: string): Promise<boolean> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return false;
    }
    const result = await Character.deleteOne({ _id: id });
    return result.deletedCount > 0;
  }
}

export default new CharacterService();