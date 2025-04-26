import fp from "fastify-plugin";
import fastifyEnv from "@fastify/env";
import { FastifyInstance } from "fastify";

const schema = {
  type: "object",
  required: ["PORT", "NODE_ENV"],
  properties: {
    PORT: { type: "string", default: "3000" },
    NODE_ENV: {
      type: "string",
      enum: ["development", "production", "test"],
      default: "development",
    },
  },
};

export const registerEnvPlugin = fp(async (app: FastifyInstance) => {
  try {
    // Register the environment plugin
    await app.register(fastifyEnv, {
      schema,
      dotenv: true,
      confKey: "config",
      data: process.env,
    });

    // Verify config is loaded
    if (!app.config) {
      throw new Error("Environment configuration failed to load");
    }

    // Set default values if not present
    if (!app.config.PORT) {
      app.config.PORT = "3000";
    }
    if (!app.config.NODE_ENV) {
      app.config.NODE_ENV = "development";
    }

    console.log("Environment loaded:", app.config);
  } catch (error) {
    console.error("Error loading environment:", error);
    throw error;
  }
});
