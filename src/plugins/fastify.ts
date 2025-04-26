import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      NODE_ENV: string;
    };
  }
}

export const fastify = Fastify({
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

export async function registerBasePlugins() {
  try {
    await fastify.register(cors, {
      origin: "*",
    });

    await fastify.register(helmet, {
      contentSecurityPolicy: false,
    });
  } catch (error) {
    console.error("Error registering base plugins:", error);
    throw error;
  }
}
