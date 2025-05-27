# Refactor How Memory Endpoints Work

## Task Information

**Issue:** [#4](https://github.com/codeacula/shadowrun-anarchy-gm-gpt/issues/4)

**Description:**
Currently the amount of endpoints in the system means that ChatGPT can't take full advantage of all the endpoints. Instead of having a unique controller for each type, we should instead have a Memory api, and then allow ChatGPT to specify the memory category, and optionally the memory id. The URLs would then be:

- POST /memory/:category - Posts a new memory, returns the posted memory and ID
- GET /memory/:category/:id - Gets a memory by ID
- PATCH /memory/:category/:id - Updates a memory by ID
- DELETE /memory/:category/:id - Deletes a memory

Also, instead of having models for each noun, we should instead have a single model to wrap whatever ChatGPT would like to save - This will allow us to be flexible with what ChatGPT uses while also keeping the amount of parameters down. Finally, we should get rid of the old endpoints, and make sure the openapi stuff is updated.

**Assignee:** codeacula  
**Status:** Open

## Execution Plan

### 1. Create a Unified Memory Model

```typescript
import { Schema, model, Document } from 'mongoose';

export interface IMemory extends Document {
  category: string;
  data: any;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const memorySchema = new Schema<IMemory>(
  {
    category: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true
    },
    data: {
      type: Schema.Types.Mixed,
      required: true
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Compound index for efficient category + id lookups
memorySchema.index({ category: 1, _id: 1 });

// Index for listing memories by category and creation date
memorySchema.index({ category: 1, createdAt: -1 });

export const Memory = model<IMemory>('Memory', memorySchema);
```

### 2. Implement the Memory Service

```typescript
import { Memory, IMemory } from '../models/memory';
import { logger } from '../utils/logger';

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
        metadata: dto.metadata || {}
      });
      
      const saved = await memory.save();
      logger.info(`Created memory in category '${category}' with id: ${saved._id}`);
      
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
        _id: id 
      });
      
      if (!memory) {
        logger.debug(`Memory not found: category='${category}', id='${id}'`);
      }
      
      return memory;
    } catch (error) {
      logger.error(`Failed to get memory: category='${category}', id='${id}'`, error);
      throw error;
    }
  }

  async update(category: string, id: string, dto: UpdateMemoryDto): Promise<IMemory | null> {
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
        logger.debug(`Memory not found for update: category='${category}', id='${id}'`);
      }
      
      return memory;
    } catch (error) {
      logger.error(`Failed to update memory: category='${category}', id='${id}'`, error);
      throw error;
    }
  }

  async delete(category: string, id: string): Promise<boolean> {
    try {
      const result = await Memory.deleteOne({ 
        category: category.toLowerCase(), 
        _id: id 
      });
      
      const deleted = result.deletedCount > 0;
      
      if (deleted) {
        logger.info(`Deleted memory: category='${category}', id='${id}'`);
      } else {
        logger.debug(`Memory not found for deletion: category='${category}', id='${id}'`);
      }
      
      return deleted;
    } catch (error) {
      logger.error(`Failed to delete memory: category='${category}', id='${id}'`, error);
      throw error;
    }
  }

  async listByCategory(category: string, limit: number = 100, offset: number = 0): Promise<IMemory[]> {
    try {
      const memories = await Memory.find({ category: category.toLowerCase() })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(offset);
      
      logger.debug(`Listed ${memories.length} memories for category '${category}'`);
      
      return memories;
    } catch (error) {
      logger.error(`Failed to list memories for category '${category}'`, error);
      throw error;
    }
  }
}

export const memoryService = new MemoryService();
```

### 3. Build the Memory Controller

```typescript
import { Request, Response } from 'express';
import { memoryService } from '../../services/memoryService';

export class MemoryController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const memory = await memoryService.create(category, req.body);
      res.status(201).json(memory);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { category, id } = req.params;
      const memory = await memoryService.getById(category, id);
      if (memory) {
        res.json(memory);
      } else {
        res.status(404).send('Memory not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { category, id } = req.params;
      const memory = await memoryService.update(category, id, req.body);
      if (memory) {
        res.json(memory);
      } else {
        res.status(404).send('Memory not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { category, id } = req.params;
      const deleted = await memoryService.delete(category, id);
      if (deleted) {
        res.status(204).send();
      } else {
        res.status(404).send('Memory not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  }

  async listByCategory(req: Request, res: Response): Promise<void> {
    try {
      const { category } = req.params;
      const memories = await memoryService.listByCategory(category);
      res.json(memories);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
}

export const memoryController = new MemoryController();
```

### 4. Define Memory Routes

```typescript
import { Router } from 'express';
import { memoryController } from '../controllers/memoryController';

const router = Router();

router.post('/:category', memoryController.create.bind(memoryController));
router.get('/:category/:id', memoryController.getById.bind(memoryController));
router.patch('/:category/:id', memoryController.update.bind(memoryController));
router.delete('/:category/:id', memoryController.delete.bind(memoryController));
router.get('/:category', memoryController.listByCategory.bind(memoryController));

export default router;
```

### 5. Wire Up the App

```typescript
import express from 'express';
import memoryRoutes from './api/routes/memoryRoutes';

const app = express();

app.use(express.json());
app.use('/memory', memoryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

export default app;
```

### 6. Files to Delete

- Controllers: campaignController.ts, sessionController.ts, characterController.ts, dataController.ts, npcController.ts, locationController.ts, itemController.ts
- Models: campaign.ts, session.ts, character.ts, data.ts, npc.ts, location.ts, item.ts
- Routes: campaignRoutes.ts, sessionRoutes.ts, characterRoutes.ts, dataRoutes.ts, npcRoutes.ts, locationRoutes.ts, itemRoutes.ts
- Tests: All related to old endpoints
- Services: campaignService.ts, sessionService.ts, characterService.ts, dataService.ts (if they exist)

### 7. Update Documentation

- [ ] Update `memory-api/README.md`:
  - Document new endpoints, request/response formats, and examples.
- [ ] Update OpenAPI spec (`memory-endpoints.yml` or similar):
  - Ensure all new endpoints are described.
  - Remove old endpoints.

### 8. Write Tests

- [ ] In `memory-api/src/api/controllers/__tests__/`:
  - Write tests for all new endpoints:
    - Success cases
    - Missing/invalid category or id
    - Not found
    - Invalid data
  - Remove tests for old endpoints.

### 9. (Optional) Data Migration Script

```typescript
import mongoose from 'mongoose';
import { Memory } from '../models/memory';

async function migrateData() {
  // Connect to the old database
  await mongoose.connect('mongodb://localhost:27017/old-database', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Fetch data from the old collection
  const oldData = await OldModel.find({});

  // Transform and save data to the new collection
  for (const item of oldData) {
    const newItem = new Memory({
      category: item.category,
      data: item.data,
      metadata: item.metadata
    });
    await newItem.save();
  }

  console.log('Data migration completed!');
  mongoose.disconnect();
}

migrateData().catch(err => console.error(err));
```

### 10. Update OpenAPI Specification

```yaml
openapi: 3.0.0
info:
  title: Memory API
  version: 1.0.0
paths:
  /memory/{category}:
    post:
      summary: Posts a new memory
      parameters:
        - in: path
          name: category
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                metadata:
                  type: object
      responses:
        '201':
          description: Memory created
        '500':
          description: Server error
    get:
      summary: Lists memories by category
      parameters:
        - in: path
          name: category
          required: true
          schema:
            type: string
      responses:
        '200':
          description: A list of memories
        '500':
          description: Server error
  /memory/{category}/{id}:
    get:
      summary: Gets a memory by ID
      parameters:
        - in: path
          name: category
          required: true
          schema:
            type: string
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '200':
          description: A memory object
        '404':
          description: Memory not found
        '500':
          description: Server error
    patch:
      summary: Updates a memory by ID
      parameters:
        - in: path
          name: category
          required: true
          schema:
            type: string
        - in: path
          name: id
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                data:
                  type: object
                metadata:
                  type: object
      responses:
        '200':
          description: Updated memory object
        '404':
          description: Memory not found
        '500':
          description: Server error
    delete:
      summary: Deletes a memory
      parameters:
        - in: path
          name: category
          required: true
          schema:
            type: string
        - in: path
          name: id
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Memory deleted
        '404':
          description: Memory not found
        '500':
          description: Server error
```
