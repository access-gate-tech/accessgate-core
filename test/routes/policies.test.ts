import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { policiesRoutes } from "../../src/routes/policies";
import { getTestServer, closeTestServer } from "../helpers";

describe("Policies Endpoints", () => {
  beforeAll(async () => {
    const server = await getTestServer();
    server.register(policiesRoutes);
  });

  afterAll(async () => {
    await closeTestServer();
  });

  it("should return empty policies initially", async () => {
    const server = await getTestServer();
    const response = await server.inject({
      method: "GET",
      url: "/policies",
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toEqual([]);
  });

  it("should update policies successfully", async () => {
    const server = await getTestServer();
    const newPolicies = [
      {
        id: "policy-1",
        effect: "allow",
        actions: ["read"],
        resourceType: "document",
      },
    ];

    const response = await server.inject({
      method: "POST",
      url: "/policies",
      payload: newPolicies,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toEqual({
      message: "Policies updated",
    });

    // Verify policies were updated
    const getResponse = await server.inject({
      method: "GET",
      url: "/policies",
    });

    expect(getResponse.statusCode).toBe(200);
    expect(JSON.parse(getResponse.payload)).toEqual(newPolicies);
  });
});
