export type AccessInput = {
  subject: { id: string; roles: string[] };
  action: string;
  resource: { id: string; type: string };
  context?: Record<string, any>;
};

export type Policy = {
  id: string;
  effect: "allow" | "deny";
  actions: string[];
  resourceType: string;
  condition?: (context: Record<string, any>) => boolean;
};

export class OPALikeEngine {
  private policies: Policy[] = [];

  loadPolicies(policies: Policy[]) {
    this.policies = policies;
  }

  evaluate(input: AccessInput): boolean {
    for (const policy of this.policies) {
      if (
        policy.actions.includes(input.action) &&
        policy.resourceType === input.resource.type &&
        (!policy.condition || policy.condition(input.context || {}))
      ) {
        return policy.effect === "allow";
      }
    }
    return false; // default deny
  }
}
