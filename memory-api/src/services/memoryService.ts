import { logger } from "@/utils/logger";
import { IMemory, Memory } from "../models/memory";

export interface CreateMemoryDto {
  data: any;
  metadata?: Record<string, any>;
}

export interface UpdateMemoryDto {
  data?: any;
  metadata?: Record<string, any>;
}

export class MemoryService {
  async create(category: string, dto: CreateMemoryDto): Promise<IMemory> {
    try {
      const memory = new Memory({
        category: category.toLowerCase(),
        data: dto.data,
        metadata: dto.metadata || {},
      });
      const saved = await memory.save();
      logger.info(
        `Created memory in category '${category}' with id: ${saved._id}`
      );
      return saved;
    } catch (error) {
      logger.error(`Failed to create memory in category '${category}':`, error);
      throw error;
    }
  }

  async getById(category: string, id: string): Promise<IMemory | null> {
    try {
      const memory = await Memory.findOne({
        category: category.toLowerCase(),
        _id: id,
      });
      if (!memory) {
        logger.debug(`Memory not found: category='${category}', id='${id}'`);
      }
      return memory;
    } catch (error) {
      logger.error(
        `Failed to get memory: category='${category}', id='${id}'`,
        error
      );
      throw error;
    }
  }

  async update(
    category: string,
    id: string,
    dto: UpdateMemoryDto
  ): Promise<IMemory | null> {
    try {
      const updateData: any = {};
      if (dto.data !== undefined) {
        updateData.data = dto.data;
      }
      if (dto.metadata !== undefined) {
        updateData.metadata = dto.metadata;
      }
      const memory = await Memory.findOneAndUpdate(
        { category: category.toLowerCase(), _id: id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      if (memory) {
        logger.info(`Updated memory: category='${category}', id='${id}'`);
      } else {
        logger.debug(
          `Memory not found for update: category='${category}', id='${id}'`
        );
      }
      return memory;
    } catch (error) {
      logger.error(
        `Failed to update memory: category='${category}', id='${id}'`,
        error
      );
      throw error;
    }
  }

  async delete(category: string, id: string): Promise<boolean> {
    try {
      const result = await Memory.deleteOne({
        category: category.toLowerCase(),
        _id: id,
      });
      const deleted = result.deletedCount > 0;
      if (deleted) {
        logger.info(`Deleted memory: category='${category}', id='${id}'`);
      } else {
        logger.debug(
          `Memory not found for deletion: category='${category}', id='${id}'`
        );
      }
      return deleted;
    } catch (error) {
      logger.error(
        `Failed to delete memory: category='${category}', id='${id}'`,
        error
      );
      throw error;
    }
  }

  async listByCategory(
    category: string,
    limit: number = 100,
    offset: number = 0
  ): Promise<IMemory[]> {
    try {
      const memories = await Memory.find({ category: category.toLowerCase() })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
      logger.debug(
        `Listed ${memories.length} memories for category '${category}'`
      );
      return memories;
    } catch (error) {
      logger.error(`Failed to list memories for category '${category}'`, error);
      throw error;
    }
  }
}

export const memoryService = new MemoryService();
