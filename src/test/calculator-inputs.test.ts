import { describe, expect, it } from "vitest";
import { decimalNumber, EMPTY_SLICE, EMPTY_SCENARIOS, historyCoversFourWeeks, historyCsv, importHistory } from "@/lib/calculator-inputs";
import { comparableHistory, evidenceLevel, EXAMPLE_CSV, EXAMPLE_SLICE, parseHistory, total } from "@/lib/calculator";

describe("Calculator input adapters", () => {
  it("accepts 0.75 with a decimal point", () => expect(decimalNumber("0.75")).toBe(0.75));
  it("accepts 0,75 with a decimal comma", () => expect(decimalNumber("0,75")).toBe(0.75));
  it("starts with no acceptance evidence or example title", () => { expect(EMPTY_SLICE.title).toBe(""); expect(evidenceLevel(EMPTY_SLICE.acceptance, 0)).toBe("F0"); expect(total(EMPTY_SCENARIOS.Expected)).toBe(0); });
  it("round-trips example history without changing comparability", () => { const rows = importHistory(EXAMPLE_CSV).rows; expect(rows).toHaveLength(12); expect(comparableHistory(parseHistory(historyCsv(rows)), EXAMPLE_SLICE, "2026-07-01", false).comparable).toHaveLength(9); });
  it("imports tab-separated spreadsheet rows without a header", () => { const result = importHistory("A\tM\tui\t1\testablished\t2026-07-01\t2026-07-29\t0,75\t0"); expect(result.errors).toEqual([]); expect(parseHistory(historyCsv(result.rows)).rows[0]?.review).toBe(0.75); });
  it("imports comma-separated rows and quoted slice titles", () => { const result = importHistory('"Invite, email",M,ui,1,established,2026-07-01,2026-07-29,0,0'); expect(result.rows[0]?.["slice"]).toBe("Invite, email"); });
  it("recognizes human spreadsheet headers", () => { expect(importHistory("Slice\tSize\tWork type\tMode\tContext\tStarted\tAccepted\tReview wait h\tDecision wait h\nA\tM\tui\t1\testablished\t2026-07-01\t2026-07-29\t0\t0").rows[0]?.["work_type"]).toBe("ui"); });
  it("keeps optional AI leverage available", () => { const result = importHistory("slice,size,work_type,mode,context,started,accepted,ai_leverage\nA,M,ui,1,established,2026-07-01,2026-07-29,High"); expect(parseHistory(historyCsv(result.rows, ["ai_leverage"])).rows[0]?.ai_leverage).toBe("High"); });
  it("does not silently accept mismatched pasted columns", () => expect(importHistory("A,M,ui").errors.length).toBeGreaterThan(0));
  it("hides measured throughput when history covers less than four weeks", () => expect(historyCoversFourWeeks(parseHistory("slice,size,work_type,mode,context,started,accepted\nA,M,ui,1,established,2026-07-01,2026-07-28").rows)).toBe(false));
  it("allows measured throughput at exactly four weeks", () => expect(historyCoversFourWeeks(parseHistory("slice,size,work_type,mode,context,started,accepted\nA,M,ui,1,established,2026-07-01,2026-07-29").rows)).toBe(true));
  it("has no four-week history with no rows", () => expect(historyCoversFourWeeks([])).toBe(false));
});
