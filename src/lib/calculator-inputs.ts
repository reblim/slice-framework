import Papa from "papaparse";
import {
  dateValue,
  EXAMPLE_COMMITMENT,
  EXAMPLE_SLICE,
  type HistoryRow,
  type Scenarios,
  type Flow,
} from "./calculator";

export const EMPTY_SLICE = { ...EXAMPLE_SLICE, title: "", item: "", acceptance: "" };
export const EMPTY_COMMITMENT = {
  ...EXAMPLE_COMMITMENT,
  decider: "",
  criterion: "",
  outcomeLevel: "F0" as const,
};
export const EMPTY_SCENARIOS: Scenarios = {
  "Best case": { active: 0, review: 0, decision: 0, external: 0 },
  Likely: { active: 0, review: 0, decision: 0, external: 0 },
  "Worst case": { active: 0, review: 0, decision: 0, external: 0 },
};
export const EMPTY_FLOW: Flow = {
  constraint: "Verification",
  waiting: 0,
  clears: 0,
  wip: 0,
  throughput: 0,
};
export function decimalNumber(raw: string) {
  return Math.max(0, Number(raw.trim().replace(",", ".")) || 0);
}
export const HISTORY_COLUMNS = [
  "slice",
  "size",
  "work_type",
  "mode",
  "context",
  "started",
  "accepted",
  "review_wait_hours",
  "decision_latency_hours",
] as const;
export type HistoryDraft = Record<string, string>;
export const blankHistoryRow = (): HistoryDraft =>
  Object.fromEntries(HISTORY_COLUMNS.map((key) => [key, ""]));
const headerAliases: Record<string, string> = {
  "work type": "work_type",
  "review wait h": "review_wait_hours",
  "decision wait h": "decision_latency_hours",
  "ai leverage": "ai_leverage",
};
export function importHistory(text: string): { rows: HistoryDraft[]; errors: string[] } {
  const parsed = Papa.parse<string[]>(text.trim(), { skipEmptyLines: "greedy" });
  const first = parsed.data[0];
  if (!first) return { rows: [], errors: [] };
  const header = first.map((value) => {
    const normalized = value.trim().toLowerCase();
    return headerAliases[normalized] ?? normalized;
  });
  const hasHeader = header.includes("slice") && header.includes("started");
  const columns = hasHeader ? header : [...HISTORY_COLUMNS];
  const data = hasHeader ? parsed.data.slice(1) : parsed.data;
  const errors = parsed.errors.map((error) => error.message);
  if (data.some((row) => row.length !== columns.length))
    errors.push("Each row must have the same number of cells as the table headers.");
  if (errors.length) return { rows: [], errors };
  return {
    rows: data.map((cells) => ({
      ...blankHistoryRow(),
      ...Object.fromEntries(columns.map((key, i) => [key, (cells[i] ?? "").trim()])),
    })),
    errors: [],
  };
}
export function historyCsv(rows: HistoryDraft[], extraColumns: string[] = []) {
  const fields = [
    ...HISTORY_COLUMNS,
    ...extraColumns.filter((key) => !HISTORY_COLUMNS.some((column) => column === key)),
  ];
  return Papa.unparse({
    fields,
    data: rows.map((row) =>
      fields.map((key) =>
        key.endsWith("_hours") ? (row[key] ?? "").replace(",", ".") : (row[key] ?? ""),
      ),
    ),
  });
}
export function historyCoversFourWeeks(rows: HistoryRow[]) {
  if (!rows.length) return false;
  const starts = rows.map((row) => dateValue(row.started) ?? 0);
  const ends = rows.map((row) => dateValue(row.accepted) ?? 0);
  return Math.max(...ends) - Math.min(...starts) >= 28 * 86_400_000;
}
