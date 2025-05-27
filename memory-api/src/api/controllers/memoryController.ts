import { FastifyReply, FastifyRequest } from "fastify";
import { memoryService } from "../../services/memoryService";

export const memoryController = {
  async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category } = request.params as { category: string };
      const { data, metadata } = request.body as any;
      if (!data) {
        return reply.code(400).send({ error: "Missing required field: data" });
      }
      const memory = await memoryService.create(category, { data, metadata });
      return reply.code(201).send(memory);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to create memory" });
    }
  },

  async getById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category, id } = request.params as {
        category: string;
        id: string;
      };
      const memory = await memoryService.getById(category, id);
      if (!memory) {
        return reply.code(404).send({ error: "Memory not found" });
      }
      return reply.code(200).send(memory);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to retrieve memory" });
    }
  },

  async update(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category, id } = request.params as {
        category: string;
        id: string;
      };
      const { data, metadata } = request.body as any;
      if (data === undefined && metadata === undefined) {
        return reply
          .code(400)
          .send({
            error: "At least one field (data or metadata) must be provided",
          });
      }
      const memory = await memoryService.update(category, id, {
        data,
        metadata,
      });
      if (!memory) {
        return reply.code(404).send({ error: "Memory not found" });
      }
      return reply.send(memory);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to update memory" });
    }
  },

  async delete(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category, id } = request.params as {
        category: string;
        id: string;
      };
      const deleted = await memoryService.delete(category, id);
      if (!deleted) {
        return reply.code(404).send({ error: "Memory not found" });
      }
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to delete memory" });
    }
  },

  async listByCategory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category } = request.params as { category: string };
      const { limit = 100, offset = 0 } = request.query as any;
      const memories = await memoryService.listByCategory(
        category,
        limit,
        offset
      );
      return reply.send(memories);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: "Failed to list memories" });
    }
  },
};
