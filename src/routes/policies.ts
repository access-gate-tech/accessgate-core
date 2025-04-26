import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { OPALikeEngine } from "../engines/opaLikeEngine";

const engine = new OPALikeEngine();

export const policiesRoutes = fp(async (fastify: FastifyInstance) => {
  fastify.get("/policies", async (_, reply) => {
    reply.send(engine["policies"]);
  });

  fastify.post("/policies", async (request, reply) => {
    const policies = request.body as any[];
    engine.loadPolicies(policies);
    reply.code(201).send({ message: "Policies updated" });
  });
});
