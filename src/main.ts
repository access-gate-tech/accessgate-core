import { FastifyInstance } from "fastify";
import { fastify, registerBasePlugins } from "./plugins/fastify";
import { healthcheckRoutes } from "./routes/healthz";
import { authorizeRoutes } from "./routes/authorize";
import { policiesRoutes } from "./routes/policies";
import { registerEnvPlugin } from "./plugins/env";

export async function buildServer(server: FastifyInstance = fastify) {
  try {
    console.log("Starting server build...");

    // Register base plugins first
    console.log("Registering base plugins...");
    await registerBasePlugins();
    console.log("Base plugins registered successfully");

    // Register environment plugin
    console.log("Registering environment plugin...");
    await registerEnvPlugin(server);
    console.log("Environment plugin registered successfully");

    // Verify environment is loaded
    if (!server.config) {
      throw new Error("Environment configuration not loaded");
    }

    // Then register other plugins
    console.log("Registering other plugins...");
    await Promise.all([
      server.register(healthcheckRoutes),
      server.register(authorizeRoutes),
      server.register(policiesRoutes),
    ]);
    console.log("All plugins registered successfully");

    return server;
  } catch (error) {
    console.error("Error building server:", error);
    throw error;
  }
}

buildServer()
  .then(async (server) => {
    try {
      console.log("Server built successfully, checking config...");
      console.log("Server config:", server.config);

      if (!server.config || !server.config.PORT) {
        throw new Error("PORT configuration is missing");
      }

      const port = Number(server.config.PORT);
      console.log("Starting server on port:", port);

      await server.listen({ port, host: "0.0.0.0" });
      console.log(`Server running at http://localhost:${port}`);
    } catch (error) {
      console.error("Error starting server:", error);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
