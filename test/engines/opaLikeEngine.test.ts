import { describe, it, expect, beforeEach } from "vitest";
import {
  OPALikeEngine,
  Policy,
  AccessInput,
} from "../../src/engines/opaLikeEngine";

describe("OPA-like Engine", () => {
  let engine: OPALikeEngine;

  beforeEach(() => {
    engine = new OPALikeEngine();
  });

  it("should load policies correctly", () => {
    const policies: Policy[] = [
      {
        id: "policy-1",
        effect: "allow",
        actions: ["read"],
        resourceType: "document",
      },
    ];

    engine.loadPolicies(policies);
    expect(engine["policies"]).toEqual(policies);
  });

  it("should allow access when policy matches", () => {
    const policies: Policy[] = [
      {
        id: "policy-1",
        effect: "allow",
        actions: ["read"],
        resourceType: "document",
      },
    ];

    engine.loadPolicies(policies);

    const input: AccessInput = {
      subject: { id: "user1", roles: ["admin"] },
      action: "read",
      resource: { id: "doc1", type: "document" },
    };

    expect(engine.evaluate(input)).toBe(true);
  });

  it("should deny access when policy doesn't match", () => {
    const policies: Policy[] = [
      {
        id: "policy-1",
        effect: "allow",
        actions: ["read"],
        resourceType: "document",
      },
    ];

    engine.loadPolicies(policies);

    const input: AccessInput = {
      subject: { id: "user1", roles: ["admin"] },
      action: "write",
      resource: { id: "doc1", type: "document" },
    };

    expect(engine.evaluate(input)).toBe(false);
  });

  it("should handle conditional policies", () => {
    const policies: Policy[] = [
      {
        id: "policy-1",
        effect: "allow",
        actions: ["read"],
        resourceType: "document",
        condition: (context) => context.isAdmin === true,
      },
    ];

    engine.loadPolicies(policies);

    const input: AccessInput = {
      subject: { id: "user1", roles: ["admin"] },
      action: "read",
      resource: { id: "doc1", type: "document" },
      context: { isAdmin: true },
    };

    expect(engine.evaluate(input)).toBe(true);

    const inputWithoutContext: AccessInput = {
      subject: { id: "user1", roles: ["admin"] },
      action: "read",
      resource: { id: "doc1", type: "document" },
    };

    expect(engine.evaluate(inputWithoutContext)).toBe(false);
  });
});
