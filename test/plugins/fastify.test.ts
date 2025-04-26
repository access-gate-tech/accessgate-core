// fastify.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import Fastify from "fastify";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";

// Mock the fastify and its plugins
const mockFastify = vi.hoisted(() =>
  vi.fn(() => ({
    register: vi.fn().mockResolvedValue(undefined),
    log: {
      info: vi.fn(),
      error: vi.fn(),
    },
  }))
);

vi.mock("fastify", () => {
  return { default: mockFastify };
});

vi.mock("@fastify/cors", () => {
  return { default: vi.fn() };
});

vi.mock("@fastify/helmet", () => {
  return { default: vi.fn() };
});

describe("Fastify Configuration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Clear module cache before each test
    vi.resetModules();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("fastify instance", () => {
    it("should create a fastify instance with correct logger configuration", async () => {
      // Import the module fresh to trigger instance creation
      const { fastify } = await import("../../src/plugins/fastify");

      expect(mockFastify).toHaveBeenCalledWith({
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
    });
  });

  describe("registerBasePlugins", () => {
    it("should register cors plugin with correct options", async () => {
      const { fastify, registerBasePlugins } = await import(
        "../../src/plugins/fastify"
      );
      await registerBasePlugins();

      expect(fastify.register).toHaveBeenCalledWith(cors, {
        origin: "*",
      });
    });

    it("should register helmet plugin with correct options", async () => {
      const { fastify, registerBasePlugins } = await import(
        "../../src/plugins/fastify"
      );
      await registerBasePlugins();

      expect(fastify.register).toHaveBeenCalledWith(helmet, {
        contentSecurityPolicy: false,
      });
    });

    it("should throw an error if plugin registration fails", async () => {
      const { fastify, registerBasePlugins } = await import(
        "../../src/plugins/fastify"
      );
      const mockError = new Error("Plugin registration failed");

      // Make the register method throw an error for this test
      vi.mocked(fastify.register).mockRejectedValueOnce(mockError);

      await expect(registerBasePlugins()).rejects.toThrow(
        "Plugin registration failed"
      );
    });

    it("should log error if plugin registration fails", async () => {
      const { fastify, registerBasePlugins } = await import(
        "../../src/plugins/fastify"
      );
      const consoleSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const mockError = new Error("Plugin registration failed");

      // Make the register method throw an error for this test
      vi.mocked(fastify.register).mockRejectedValueOnce(mockError);

      try {
        await registerBasePlugins();
      } catch (error) {
        // We expect this to throw
      }

      expect(consoleSpy).toHaveBeenCalledWith(
        "Error registering base plugins:",
        mockError
      );
      consoleSpy.mockRestore();
    });
  });
});
