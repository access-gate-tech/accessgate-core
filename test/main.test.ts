import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { buildServer } from "../src/main";
import { OPALikeEngine } from "../src/engines/opaLikeEngine";
import { getTestServer, closeTestServer } from "./helpers";
import { registerEnvPlugin } from "../src/plugins/env";

const originalExit = process.exit;
vi.spyOn(process, "exit").mockImplementation((code) => {
  throw new Error(`process.exit called with code ${code}`);
});

vi.mock("../src/plugins/fastify", () => {
  const mockFastify = {
    register: vi.fn(),
    listen: vi.fn().mockResolvedValue(undefined),
    config: {
      PORT: "3000",
      NODE_ENV: "test",
    } as { PORT: string; NODE_ENV: string } | undefined,
  };
  return {
    fastify: mockFastify,
    registerBasePlugins: vi.fn(),
  };
});

vi.mock("../src/plugins/env", () => ({
  registerEnvPlugin: vi.fn(),
}));

vi.mock("../src/routes/healthz", () => ({
  healthcheckRoutes: vi.fn(),
}));

vi.mock("../src/routes/authorize", () => ({
  authorizeRoutes: vi.fn(),
}));

vi.mock("../src/routes/policies", () => ({
  policiesRoutes: vi.fn(),
}));

describe("Server Setup", () => {
  beforeEach(async () => {
    // Reset the engine's policies before each test
    const engine = new OPALikeEngine();
    engine.loadPolicies([]);
    await closeTestServer();
  });

  afterEach(async () => {
    await closeTestServer();
  });

  it("should start the server successfully", async () => {
    const server = await getTestServer();

    // Start the server
    await server.listen({ port: 0 }); // Use port 0 for random available port

    expect(server.server.listening).toBe(true);
  });
});

describe("Server Build", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should build server successfully", async () => {
    const server = await buildServer();
    expect(server).toBeDefined();
    expect(server.config).toBeDefined();
    expect(server.config.PORT).toBe("3000");
  });

  it("should throw error if environment config is not loaded", async () => {
    const { fastify } = await import("../src/plugins/fastify");
    (fastify as any).config = undefined;
    await expect(buildServer()).rejects.toThrow(
      "Environment configuration not loaded"
    );
  });

  it("should handle plugin registration errors", async () => {
    const { fastify } = await import("../src/plugins/fastify");
    vi.mocked(registerEnvPlugin).mockImplementation(async (server) => {
      server.config = {
        PORT: "3000",
        NODE_ENV: "test",
      };
    });
    vi.mocked(fastify.register).mockRejectedValueOnce(
      new Error("Plugin registration failed")
    );
    await expect(buildServer()).rejects.toThrow("Plugin registration failed");
  });

  it("should handle base plugin registration errors", async () => {
    const { registerBasePlugins } = await import("../src/plugins/fastify");
    vi.mocked(registerBasePlugins).mockRejectedValueOnce(
      new Error("Base plugin registration failed")
    );
    await expect(buildServer()).rejects.toThrow(
      "Base plugin registration failed"
    );
  });

  it("should handle environment plugin registration errors", async () => {
    vi.mocked(registerEnvPlugin).mockRejectedValueOnce(
      new Error("Environment plugin registration failed")
    );
    await expect(buildServer()).rejects.toThrow(
      "Environment plugin registration failed"
    );
  });
});
