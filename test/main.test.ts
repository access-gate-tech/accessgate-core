import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { buildServer } from "../src/main";
import { OPALikeEngine } from "../src/engines/opaLikeEngine";
import { getTestServer, closeTestServer } from "./helpers";

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
