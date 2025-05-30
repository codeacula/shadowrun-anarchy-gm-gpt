import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import Fastify from "fastify";
import config from "./config";
import connectToDatabase from "./utils/db";

// Import yaml library
const yaml = require("js-yaml");

// Import routes

import discordRoutes from "./api/routes/discord";
import memoryRoutes from "./api/routes/memoryRoutes";

// Create Fastify instance
const fastify = Fastify({ logger: true });

// Register plugins
fastify.register(cors, {
  origin: "*", // In production, you may want to restrict this to specific origins
});

// Register OpenAPI/Swagger
fastify.register(swagger, {
  openapi: {
    info: {
      title: "Shadowrun Anarchy GPT Memory API",
      description:
        "API for storing and retrieving campaign data for Shadowrun Anarchy GPT",
      version: "1.0.0",
    },
    servers: [
      {
        url:
          process.env.API_BASE_URL || `http://localhost:${config.server.port}`,
        description:
          process.env.NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          name: "x-api-key",
          in: "header",
        },
      },
    },
    security: [{ apiKey: [] }],
    tags: [
      { name: "campaigns", description: "Campaign management endpoints" },
      { name: "sessions", description: "Session management endpoints" },
      { name: "characters", description: "Character management endpoints" },
      { name: "data", description: "Arbitrary data storage endpoints" },
      { name: "discord", description: "Discord integration endpoints" },
    ],
  },
});

fastify.register(swaggerUI, {
  routePrefix: "/docs",
  uiConfig: {
    docExpansion: "list",
    deepLinking: true,
  },
});

// OpenAPI JSON endpoint
fastify.get("/openapi.json", async () => {
  return fastify.swagger();
});

// OpenAPI YAML endpoint
fastify.get("/openapi.yml", async (request, reply) => {
  const spec = fastify.swagger();
  const yamlSpec = yaml.dump(spec);
  reply.type("text/yaml");
  return yamlSpec;
});

// Register new memory routes
fastify.register(memoryRoutes);
fastify.register(discordRoutes, { prefix: "/discord" });

// Health check route
fastify.get("/health", async () => {
  return { status: "ok", timestamp: new Date().toISOString() };
});

// API info endpoint for custom GPTs
fastify.get("/api-info", async (request) => {
  const baseUrl =
    process.env.API_BASE_URL ||
    `http://${request.hostname}:${config.server.port}`;
  return {
    title: "Shadowrun Anarchy GPT Memory API",
    version: "1.0.0",
    description:
      "API for storing and retrieving campaign data for Shadowrun Anarchy GPT",
    baseUrl,
    endpoints: {
      openapi_json: `${baseUrl}/openapi.json`,
      openapi_yaml: `${baseUrl}/openapi.yml`,
      docs: `${baseUrl}/docs`,
      health: `${baseUrl}/health`,
    },
    authentication: {
      type: "apiKey",
      header: "x-api-key",
      description: "Include your API key in the x-api-key header",
    },
  };
});

// Start server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectToDatabase();

    // Start the server
    await fastify.listen({
      port: config.server.port,
      host: config.server.host,
    });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Execute start function
start();
