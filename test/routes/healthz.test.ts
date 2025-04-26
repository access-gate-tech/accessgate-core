import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { healthcheckRoutes } from "../../src/routes/healthz";
import { getTestServer, closeTestServer } from "../helpers";

describe("Health Check Endpoint", () => {
  beforeAll(async () => {
    const server = await getTestServer();
    server.register(healthcheckRoutes);
  });

  afterAll(async () => {
    await closeTestServer();
  });

  it("should return status ok", async () => {
    const server = await getTestServer();
    const response = await server.inject({
      method: "GET",
      url: "/healthz",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ status: "ok" });
  });
});
