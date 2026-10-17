import { describe, expect, it } from "vitest";
import {
  addWorkingDays,
  EMPTY_QUICK,
  formatCalendarDate,
  liveRange,
  NO_OVERRIDES,
  QUICK_EXAMPLE,
  quickCopyLine,
  quickResult,
  quickScenarios,
  roundHalf,
  type RangeOverrides,
} from "@/lib/quick-estimate";

describe("Quick estimate", () => {
  it("is incomplete on an empty form", () =>
    expect(quickResult(EMPTY_QUICK, NO_OVERRIDES).kind).toBe("incomplete"));
  it("requires a name for Something else", () =>
    expect(quickResult({ ...QUICK_EXAMPLE, feature: "other" }, NO_OVERRIDES).kind).toBe(
      "incomplete",
    ));
  it("blocks slices bigger than a week", () =>
    expect(quickResult({ ...QUICK_EXAMPLE, build: "bigger" }, NO_OVERRIDES).kind).toBe("too-big"));
  it("is not estimated with big open questions", () =>
    expect(quickResult({ ...QUICK_EXAMPLE, decision: "big" }, NO_OVERRIDES).kind).toBe(
      "undecided",
    ));
  it("sums lower and upper bounds for the authentication example", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect([result.low, result.high]).toEqual([3.5, 9.5]);
    expect(result.buildPercent).toBe(15);
    expect(result.parts.map((part) => part.label)).toEqual([
      "Build (AI)",
      "Review & testing",
      "Decisions",
      "Waiting",
    ]);
  });
  it("rounds totals to half days", () =>
    expect([roundHalf(3.26), roundHalf(3.24)]).toEqual([3.5, 3]));
  it("builds the copyable line", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(quickCopyLine(QUICK_EXAMPLE, result)).toBe(
      "Authentication (sign-up, sign-in, password reset) · Target · F1 · 3.5–9.5 working days",
    );
  });
  it("maps parts to F1 scenarios as lower, midpoint and upper bounds", () => {
    const result = quickResult(QUICK_EXAMPLE, NO_OVERRIDES);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(quickScenarios(result)).toEqual({
      "Best case": { active: 0.5, review: 2, decision: 1, external: 0 },
      Likely: { active: 1, review: 3.5, decision: 2, external: 0 },
      "Worst case": { active: 1.5, review: 5, decision: 3, external: 0 },
    });
  });
  it("rounds the live window up to weekdays", () => {
    expect(liveRange("2026-10-16", 3.5, 9.5)).toEqual({
      from: "21 October 2026",
      to: "29 October 2026",
    });
    const saturday = addWorkingDays(new Date(2026, 9, 17), 1);
    expect(saturday.getDay()).toBe(1);
  });
  it("counts the start date as day 1 when it is a weekday, and rolls a weekend start to Monday", () => {
    // 0 stays on a weekday start. 0.5 rounds up to 1, so it finishes on that same day. Five weekdays run forward, skipping Saturday and Sunday.
    const done = (start: string, days: number) =>
      formatCalendarDate(
        addWorkingDays(
          new Date(
            Number(start.slice(0, 4)),
            Number(start.slice(5, 7)) - 1,
            Number(start.slice(8, 10)),
          ),
          days,
        ),
      );
    const cases: [weekday: string, start: string, days: number, expected: string][] = [
      ["Monday", "2026-10-19", 0, "19 October 2026"],
      ["Monday", "2026-10-19", 0.5, "19 October 2026"],
      ["Monday", "2026-10-19", 1, "19 October 2026"],
      ["Monday", "2026-10-19", 5, "23 October 2026"],
      ["Friday", "2026-10-16", 0, "16 October 2026"],
      ["Friday", "2026-10-16", 0.5, "16 October 2026"],
      ["Friday", "2026-10-16", 1, "16 October 2026"],
      ["Friday", "2026-10-16", 5, "22 October 2026"],
      ["Saturday", "2026-10-17", 0, "19 October 2026"],
      ["Saturday", "2026-10-17", 0.5, "19 October 2026"],
      ["Saturday", "2026-10-17", 1, "19 October 2026"],
      ["Saturday", "2026-10-17", 5, "23 October 2026"],
      ["Sunday", "2026-10-18", 0, "19 October 2026"],
      ["Sunday", "2026-10-18", 0.5, "19 October 2026"],
      ["Sunday", "2026-10-18", 1, "19 October 2026"],
      ["Sunday", "2026-10-18", 5, "23 October 2026"],
    ];
    for (const [weekday, start, days, expected] of cases)
      expect(done(start, days), `${weekday} + ${days} working days`).toBe(expected);
  });
  it("applies saved range overrides", () => {
    const overrides: RangeOverrides = { ...NO_OVERRIDES, risk: { High: { low: 3, high: 6 } } };
    const result = quickResult(QUICK_EXAMPLE, overrides);
    if (result.kind !== "ready") throw new Error("expected ready");
    expect(result.parts[1]?.range).toEqual({ low: 3, high: 6 });
  });
});
