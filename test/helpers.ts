import { FastifyInstance } from "fastify";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { registerEnvPlugin } from "../src/plugins/env";
import { healthcheckRoutes } from "../src/routes/healthz";
import { authorizeRoutes } from "../src/routes/authorize";
import { policiesRoutes } from "../src/routes/policies";

let server: FastifyInstance | null = null;

export async function getTestServer(): Promise<FastifyInstance> {
  // Always create a new instance for each test
  server = Fastify({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "yyyy-mm-dd HH:MM:ss.l",
          ignore: "pid,hostname",
        },
      },
    },
  });

  try {
    // Register base plugins
    await server.register(cors, {
      origin: "*",
    });

    await server.register(helmet, {
      contentSecurityPolicy: false,
    });

    // Register environment plugin
    await registerEnvPlugin(server);

    // Register route plugins
    await Promise.all([
      server.register(healthcheckRoutes),
      server.register(authorizeRoutes),
      server.register(policiesRoutes),
    ]);
  } catch (error) {
    console.error("Error setting up test server:", error);
    throw error;
  }

  return server;
}

export async function closeTestServer(): Promise<void> {
  if (server) {
    await server.close();
    server = null;
  }
}
