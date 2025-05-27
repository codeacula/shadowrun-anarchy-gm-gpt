import { FastifyInstance } from "fastify";
import { memoryController } from "../controllers/memoryController";

export default async function memoryRoutes(fastify: FastifyInstance) {
  fastify.post("/memory/:category", async (request: FastifyRequest<{ Params: { category: string }; Body: any }>, reply: FastifyReply) => {
    return memoryController.create(request, reply);
  });

  fastify.get("/memory/:category/:id", async (request: FastifyRequest<{ Params: { category: string; id: string } }>, reply: FastifyReply) => {
    return memoryController.getById(request, reply);
  });

  fastify.patch("/memory/:category/:id", async (request: FastifyRequest<{ Params: { category: string; id: string }; Body: any }>, reply: FastifyReply) => {
    return memoryController.update(request, reply);
  });

  fastify.delete("/memory/:category/:id", async (request: FastifyRequest<{ Params: { category: string; id: string } }>, reply: FastifyReply) => {
    return memoryController.delete(request, reply);
  });

  fastify.get("/memory/:category", async (request: FastifyRequest<{ Params: { category: string } }>, reply: FastifyReply) => {
    return memoryController.listByCategory(request, reply);
  });
}
