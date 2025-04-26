import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { authorizeRoutes } from "../../src/routes/authorize";
import { closeTestServer, getTestServer } from "../helpers";

describe("Authorize Endpoint", () => {
  beforeAll(async () => {
    const server = await getTestServer();
    server.register(authorizeRoutes);
  });

  afterAll(async () => {
    await closeTestServer();
  });

  it("should allow access when policy matches", async () => {
    const server = await getTestServer();
    const response = await server.inject({
      method: "POST",
      url: "/authorize",
      payload: {
        subject: { id: "user1", roles: ["admin"] },
        action: "read",
        resource: { id: "doc1", type: "document" },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ allowed: true });
  });

  it("should deny access when policy doesn't match", async () => {
    const server = await getTestServer();
    const response = await server.inject({
      method: "POST",
      url: "/authorize",
      payload: {
        subject: { id: "user1", roles: ["admin"] },
        action: "write",
        resource: { id: "doc1", type: "document" },
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual({ allowed: false });
  });
});
