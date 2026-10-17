import { describe, expect, it } from "vitest";
import { classificationWarnings, comparableHistory, conformance, coverage, dateValue, deliveryForecast, effectiveRisk, evidenceLevel, EXAMPLE_COMMITMENT, EXAMPLE_CSV, EXAMPLE_FLOW, EXAMPLE_SCENARIOS, EXAMPLE_SLICE, flowStatus, measuredThroughput, parseHistory, planning, scenarioOrderValid, timeBreakdown, total } from "@/lib/calculator";

const history = parseHistory(EXAMPLE_CSV);
const matching = comparableHistory(history, EXAMPLE_SLICE, "2026-07-01", false);
const header = "slice,size,work_type,mode,context,started,accepted";

describe("Measured slice evidence", () => {
  it("matches nine supplied slices and excludes two other classes and one before the change", () => {
    expect(matching.comparable.map((row) => row.cycle)).toEqual([11, 7, 16, 9, 14, 8, 10, 11, 11]);
    expect([matching.otherClass, matching.beforeChange, matching.excluded]).toEqual([2, 1, 3]);
  });
  it("uses the observed 7–16 day range", () => {
    const values = matching.comparable.map((row) => row.cycle);
    expect([Math.min(...values), Math.max(...values)]).toEqual([7, 16]);
  });
  it("computes 80 percent coverage from nine observations", () => expect(coverage(9)).toBe(80));
  it("requires acceptance evidence even with nine comparable slices", () => expect(evidenceLevel("  \n ", 9)).toBe("F0"));
  it("uses F1 until seven comparable rows", () => expect(evidenceLevel("Accepted by test", 6)).toBe("F1"));
  it("uses F2 starting at seven comparable rows", () => expect(evidenceLevel("Accepted by test", 7)).toBe("F2"));
  it("keeps cycle times at a minimum of one calendar day", () => {
    expect(parseHistory(`${header}\nA,M,ui,1,established,2026-07-01,2026-07-01`).rows[0]?.cycle).toBe(1);
  });
  it("includes starts exactly on the major change date", () => {
    const input = parseHistory(`${header}\nA,M,integration,3,established,2026-07-01,2026-07-02`);
    expect(comparableHistory(input, EXAMPLE_SLICE, "2026-07-01", false).comparable).toHaveLength(1);
  });
  it.each(["size", "work_type", "mode", "context"] as const)("requires a match on %s", (key) => {
    const row = history.rows[1];
    if (!row) throw new Error("Example row missing");
    expect(comparableHistory({ ...history, rows: [{ ...row, [key]: "different" }] }, EXAMPLE_SLICE, "2026-07-01", false).otherClass).toBe(1);
  });
  it("matches leverage only when the column exists and the checkbox is enabled", () => {
    const input = parseHistory(`${header},ai_leverage\nA,M,integration,3,established,2026-07-01,2026-07-02,Low`);
    expect(comparableHistory(input, EXAMPLE_SLICE, "2026-07-01", true).comparable).toHaveLength(0);
    expect(comparableHistory(input, EXAMPLE_SLICE, "2026-07-01", false).comparable).toHaveLength(1);
  });
  it("rejects invalid calendar dates and reversed dates", () => {
    expect(dateValue("2026-02-30")).toBeUndefined();
    expect(parseHistory(`${header}\nA,M,ui,1,established,2026-07-02,2026-07-01`).invalid).toBe(1);
  });
  it("reads quoted CSV values correctly", () => expect(parseHistory(`${header}\n"Invite, by email",M,ui,1,established,2026-07-01,2026-07-02`).rows[0]?.slice).toBe("Invite, by email"));
  it("rejects missing required columns", () => expect(parseHistory("slice,size\nA,M").rows).toHaveLength(0));
});

describe("Judgment and recorded waits", () => {
  it("totals all four working-day components", () => expect(total({ active: 4, review: 2, decision: 1, external: 3 })).toBe(10));
  it("detects out-of-order scenario totals", () => expect(scenarioOrderValid({ ...EXAMPLE_SCENARIOS, Optimistic: { active: 100, review: 0, decision: 0, external: 0 } })).toBe(false));
  it("does not scale forecasts by AI leverage", () => {
    const low = comparableHistory(history, { ...EXAMPLE_SLICE, leverage: "Low" }, "2026-07-01", false);
    expect(deliveryForecast("F2", low.comparable, EXAMPLE_SCENARIOS)).toBe(deliveryForecast("F2", matching.comparable, EXAMPLE_SCENARIOS));
  });
  it("sums recorded wait hours as calendar days at F2", () => {
    const values = timeBreakdown("F2", matching.comparable, EXAMPLE_SCENARIOS.Expected, history.columns);
    expect(values.segments[0]?.value).toBeCloseTo(306 / 24);
    expect(values.segments[1]?.value).toBeCloseTo(116 / 24);
    expect(values.segments[2]?.value).toBeCloseTo(97 - 422 / 24);
    expect(values.decisionPercent).toBeCloseTo(116 / 24 / 97 * 100);
  });
  it("uses the Expected scenario at F1", () => expect(timeBreakdown("F1", [], EXAMPLE_SCENARIOS.Expected, []).segments.map((segment) => segment.value)).toEqual([4, 2, 1, 0]));
  it("identifies decision wait at exactly twenty percent", () => expect(timeBreakdown("F1", [], { active: 4, review: 0, decision: 1, external: 0 }, []).decisionPercent).toBe(20));
  it("reports missing wait evidence instead of silently implying zero", () => {
    const input = parseHistory(`${header}\nA,M,ui,1,established,2026-07-01,2026-07-02`);
    expect(timeBreakdown("F2", input.rows, EXAMPLE_SCENARIOS.Expected, input.columns).missing).toEqual(["review_wait_hours", "decision_latency_hours"]);
  });
});

describe("Commitment and flow rules", () => {
  it.each(["Target", "Commitment"] as const)("disallows an F0 %s", (type) => expect(conformance({ ...EXAMPLE_COMMITMENT, type }, "F0").tone).toBe("danger"));
  it("allows an F0 Direction", () => expect(conformance({ ...EXAMPLE_COMMITMENT, type: "Direction" }, "F0").tone).toBe("success"));
  it("requires written F1 risk acceptance for a Commitment", () => expect(conformance({ ...EXAMPLE_COMMITMENT, type: "Commitment", riskAccepted: false }, "F1").tone).toBe("danger"));
  it("permits a Commitment with written F1 risk acceptance", () => expect(conformance({ ...EXAMPLE_COMMITMENT, type: "Commitment", riskAccepted: true }, "F1").tone).toBe("success"));
  it("permits F2 Commitments", () => expect(conformance({ ...EXAMPLE_COMMITMENT, type: "Commitment" }, "F2").tone).toBe("success"));
  it("has room when three wait and four clear weekly", () => expect(flowStatus(EXAMPLE_FLOW).tone).toBe("success"));
  it("is at the limit when waiting equals capacity", () => expect(flowStatus({ ...EXAMPLE_FLOW, waiting: 3 }).tone).toBe("warning"));
  it("stops starting above one week of waiting work", () => expect(flowStatus({ ...EXAMPLE_FLOW, waiting: 4 }).tone).toBe("danger"));
  it("computes example Little's Law as two weeks", () => expect(EXAMPLE_FLOW.wip / EXAMPLE_FLOW.throughput).toBe(2));
  it("measures three acceptances in the CSV's last twenty-eight days divided by four", () => expect(measuredThroughput(history.rows)).toBe(0.75));
  it("has zero measured throughput with no history", () => expect(measuredThroughput([])).toBe(0));
});

describe("Classification and verification", () => {
  it("forces High verification risk in mode 3", () => expect(effectiveRisk({ ...EXAMPLE_SLICE, mode: "3", risk: "Low" })).toBe("High"));
  it("retains chosen risk outside mode 3", () => expect(effectiveRisk({ ...EXAMPLE_SLICE, mode: "1", risk: "Low" })).toBe("Low"));
  it("warns for XL slices", () => expect(classificationWarnings({ ...EXAMPLE_SLICE, mode: "1", size: "XL" })).toHaveLength(1));
  it.each(["L", "XL"])("warns on an Improvement sized %s", (size) => expect(classificationWarnings({ ...EXAMPLE_SLICE, mode: "1", itemType: "Improvement", size })).toHaveLength(size === "XL" ? 2 : 1));
  it("warns for experiment mode", () => expect(classificationWarnings({ ...EXAMPLE_SLICE, mode: "E" })).toHaveLength(1));
  it("sets direct-mode coordination to five minutes", () => expect(planning["0"].time).toBe("5 minutes"));
});