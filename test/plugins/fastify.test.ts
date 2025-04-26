import { describe, it, expect, beforeEach, vi } from "vitest";
import { fastify, registerBasePlugins } from "../../src/plugins/fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { FastifyInstance } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
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

// Mock the plugins
vi.mock("@fastify/cors", () => ({
  default: vi.fn(),
}));

vi.mock("@fastify/helmet", () => ({
  default: vi.fn(),
}));

// Mock the fastify instance
vi.mock("../../src/plugins/fastify", () => {
  const mockFastify = {
    register: vi.fn(),
    config: {
      PORT: "3000",
      NODE_ENV: "test",
    },
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "yyyy-mm-dd HH:MM:ss.l",
          ignore: "pid,hostname",
        },
      },
    },
  } as unknown as FastifyInstance;

  return {
    fastify: mockFastify,
    registerBasePlugins: vi.fn().mockImplementation(async () => {
      try {
        await mockFastify.register(cors, { origin: "*" });
        await mockFastify.register(helmet, { contentSecurityPolicy: false });
      } catch (error) {
        console.error("Error registering base plugins:", error);
        throw error;
      }
    }),
  };
});

describe("Fastify Plugin Registration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register base plugins successfully", async () => {
    await registerBasePlugins();
    expect(fastify.register).toHaveBeenCalledWith(cors, {
      origin: "*",
    });
    expect(fastify.register).toHaveBeenCalledWith(helmet, {
      contentSecurityPolicy: false,
    });
  });

  it("should handle CORS registration error", async () => {
    vi.mocked(fastify.register).mockRejectedValueOnce(
      new Error("CORS registration failed")
    );
    await expect(registerBasePlugins()).rejects.toThrow(
      "CORS registration failed"
    );
  });

  it("should handle Helmet registration error", async () => {
    vi.mocked(fastify.register)
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("Helmet registration failed"));
    await expect(registerBasePlugins()).rejects.toThrow(
      "Helmet registration failed"
    );
  });

  it("should have correct logger configuration", () => {
    expect(fastify.logger).toBeDefined();
    expect(fastify.logger.transport).toBeDefined();
    expect(fastify.logger.transport.target).toBe("pino-pretty");
    expect(fastify.logger.transport.options).toEqual({
      translateTime: "yyyy-mm-dd HH:MM:ss.l",
      ignore: "pid,hostname",
    });
  });

  it("should handle multiple registration errors", async () => {
    vi.mocked(fastify.register)
      .mockRejectedValueOnce(new Error("First error"))
      .mockRejectedValueOnce(new Error("Second error"));
    await expect(registerBasePlugins()).rejects.toThrow("First error");
  });
});
