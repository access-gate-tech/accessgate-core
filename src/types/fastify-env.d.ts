import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: string;
      NODE_ENV: string;
    };
    logger: {
      transport: {
        target: string;
        options: {
          translateTime: string;
          ignore: string;
        };
      };
    };
  }
}
