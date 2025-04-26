import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { OPALikeEngine } from "../engines/opaLikeEngine";

const engine = new OPALikeEngine();

engine.loadPolicies([
  {
    id: "policy-1",
    effect: "allow",
    actions: ["read"],
    resourceType: "document",
  },
]);

export const authorizeRoutes = fp(async (fastify: FastifyInstance) => {
  fastify.post("/authorize", async (request, reply) => {
    const input = request.body as any;
    const isAllowed = engine.evaluate(input);
    reply.send({ allowed: isAllowed });
  });
});
