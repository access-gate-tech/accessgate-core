import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

export const healthcheckRoutes = fp(async (app: FastifyInstance) => {
  app.get("/healthz", async (request, reply) => {
    return { status: "ok" };
  });
});
