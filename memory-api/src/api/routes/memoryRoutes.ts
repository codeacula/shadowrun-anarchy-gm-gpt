import { FastifyInstance } from "fastify";
import { memoryController } from "../controllers/memoryController";

export default async function memoryRoutes(fastify: FastifyInstance) {
  fastify.post("/memory/:category", async (request, reply) => {
    // @ts-ignore
    return memoryController.create(request, reply);
  });

  fastify.get("/memory/:category/:id", async (request, reply) => {
    // @ts-ignore
    return memoryController.getById(request, reply);
  });

  fastify.patch("/memory/:category/:id", async (request, reply) => {
    // @ts-ignore
    return memoryController.update(request, reply);
  });

  fastify.delete("/memory/:category/:id", async (request, reply) => {
    // @ts-ignore
    return memoryController.delete(request, reply);
  });

  fastify.get("/memory/:category", async (request, reply) => {
    // @ts-ignore
    return memoryController.listByCategory(request, reply);
  });
}
