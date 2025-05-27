import fastify, { FastifyInstance } from "fastify";
import { Memory } from "../../../models/memory";
import memoryRoutes from "../../routes/memoryRoutes";

describe("Memory API (Fastify)", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = fastify();
    app.register(memoryRoutes);
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await Memory.deleteMany({});
  });

  it("should create a new memory", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/memory/character",
      payload: {
        data: { name: "Test Character" },
        metadata: { campaign: "test" },
      },
    });
    expect(res.statusCode).toBe(201);
    const body = res.json ? res.json() : JSON.parse(res.body as string);
    expect(body.category).toBe("character");
    expect(body.data).toEqual({ name: "Test Character" });
    expect(body.metadata).toEqual({ campaign: "test" });
  });

  it("should get a memory by id", async () => {
    const memory = await Memory.create({
      category: "character",
      data: { name: "Test" },
    });
    const res = await app.inject({
      method: "GET",
      url: `/memory/character/${memory._id}`,
    });
    expect(res.statusCode).toBe(200);
    const body = res.json ? res.json() : JSON.parse(res.body as string);
    expect(body.data).toEqual({ name: "Test" });
  });

  it("should update a memory", async () => {
    const memory = await Memory.create({
      category: "character",
      data: { name: "Old" },
    });
    const res = await app.inject({
      method: "PATCH",
      url: `/memory/character/${memory._id}`,
      payload: { data: { name: "New" } },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json ? res.json() : JSON.parse(res.body as string);
    expect(body.data).toEqual({ name: "New" });
  });

  it("should delete a memory", async () => {
    const memory = await Memory.create({
      category: "character",
      data: { name: "Delete" },
    });
    const res = await app.inject({
      method: "DELETE",
      url: `/memory/character/${memory._id}`,
    });
    expect(res.statusCode).toBe(204);
    const found = await Memory.findById(memory._id);
    expect(found).toBeNull();
  });

  it("should list memories by category", async () => {
    await Memory.create({ category: "character", data: { name: "A" } });
    await Memory.create({ category: "character", data: { name: "B" } });
    const res = await app.inject({
      method: "GET",
      url: "/memory/character",
    });
    expect(res.statusCode).toBe(200);
    const body = res.json ? res.json() : JSON.parse(res.body as string);
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(2);
  });
});
