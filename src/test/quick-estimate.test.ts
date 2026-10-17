import { describe, expect, it } from "vitest";
import { EMPTY_QUICK, NO_OVERRIDES, QUICK_EXAMPLE, quickCopyLine, quickResult, quickScenarios, roundHalf, type RangeOverrides } from "@/lib/quick-estimate";

describe("Quick estimate", () => {
  it("is incomplete on an empty form", () => expect(quickResult(EMPTY_QUICK, NO_OVERRIDES).kind).toBe("incomplete"));
  it("requires a name for Something else", () => expect(quickResult({ ...QUICK_EXAMPLE, feature: "other" }, NO_OVERRIDES).kind).toBe("incomplete"));
  it("blocks slices bigger than a week", () => expect(quickResult({ ...QUICK_EXAMPLE, build: "bigger" }, NO_OVERRIDES).kind).toBe("too-big"));
  it("is not estimated with big open questions", () => expect(quickResult({ ...QUICK_EXAMPLE, decision: "big" }, NO_OVERRIDES).kind).toBe("undecided"));
  it("sums lower and upper bounds for the authentication example", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect([result.low, result.high]).toEqual([3.5, 9.5]);
    expect(result.buildPercent).toBe(15);
    expect(result.parts.map((part) => part.label)).toEqual(["Build (AI)", "Review & testing", "Decisions", "Waiting"]);
  });
  it("rounds totals to half days", () => expect([roundHalf(3.26), roundHalf(3.24)]).toEqual([3.5, 3]));
  it("builds the copyable line", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(quickCopyLine(QUICK_EXAMPLE, result)).toBe("Authentication (sign-up, sign-in, password reset) · Target · F1 · 3.5–9.5 working days");
  });
  it("maps parts to F1 scenarios as lower, midpoint and upper bounds", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(quickScenarios(result)).toEqual({
      Optimistic: { active: 0.5, review: 2, decision: 1, external: 0 },
      Expected: { active: 1, review: 3.5, decision: 2, external: 0 },
      Conservative: { active: 1.5, review: 5, decision: 3, external: 0 },
    });
  });
  it("applies saved range overrides", () => {
    const overrides: RangeOverrides = { ...NO_OVERRIDES, risk: { High: { low: 3, high: 6 } } };
    const result = quickResult(QUICK_EXAMPLE, overrides);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(result.parts[1]?.range).toEqual({ low: 3, high: 6 });
  });
});
