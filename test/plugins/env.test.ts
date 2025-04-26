import { describe, it, expect, beforeEach, vi } from "vitest";
import { registerEnvPlugin } from "../../src/plugins/env";
import { FastifyInstance } from "fastify";

// Mock fastifyEnv
vi.mock("@fastify/env", () => ({
  default: vi.fn(),
}));

describe("Environment Plugin", () => {
  let mockServer: any;

  beforeEach(() => {
    mockServer = {
      register: vi.fn(),
      config: {
        PORT: "3000",
        NODE_ENV: "development",
      },
    };
  });

  it("should register environment plugin successfully", async () => {
    mockServer.register.mockResolvedValue(undefined);
    await registerEnvPlugin(mockServer);
    expect(mockServer.register).toHaveBeenCalled();
    expect(mockServer.config).toBeDefined();
    expect(mockServer.config.PORT).toBe("3000");
    expect(mockServer.config.NODE_ENV).toBe("development");
  });

  it("should handle environment plugin registration error", async () => {
    mockServer.register.mockRejectedValueOnce(
      new Error("Environment plugin registration failed")
    );
    await expect(registerEnvPlugin(mockServer)).rejects.toThrow(
      "Environment plugin registration failed"
    );
  });

  it("should throw error if config is not loaded", async () => {
    mockServer.config = undefined;
    mockServer.register.mockResolvedValue(undefined);
    await expect(registerEnvPlugin(mockServer)).rejects.toThrow(
      "Environment configuration failed to load"
    );
  });

  it("should set default values if not present", async () => {
    mockServer.config = {
      PORT: "",
      NODE_ENV: "",
    };
    mockServer.register.mockResolvedValue(undefined);
    await registerEnvPlugin(mockServer);
    expect(mockServer.config.PORT).toBe("3000");
    expect(mockServer.config.NODE_ENV).toBe("development");
  });
});
