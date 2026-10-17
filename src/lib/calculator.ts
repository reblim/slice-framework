import Papa from "papaparse";

export type Level = "F0" | "F1" | "F2";
export type Risk = "Low" | "Medium" | "High";
export type Mode = "0" | "1" | "E" | "2" | "3";
export type Slice = {
  item: string; itemType: "Bet" | "Obligation" | "Improvement"; title: string;
  mode: Mode; size: string; workType: string; context: string; risk: Risk; leverage: Risk; acceptance: string;
};
export type Scenario = { active: number; review: number; decision: number; external: number };
export type Scenarios = Record<"Optimistic" | "Expected" | "Conservative", Scenario>;
export type HistoryRow = { slice: string; size: string; work_type: string; mode: string; context: string; started: string; accepted: string; cycle: number; review?: number | undefined; decision?: number | undefined; ai_leverage?: string | undefined };
export type History = { rows: HistoryRow[]; columns: string[]; errors: string[]; invalid: number };
export type Commitment = { type: "Direction" | "Target" | "Commitment"; when: string; decider: string; riskAccepted: boolean; outcomeLevel: "F0" | "F1"; criterion: string };
export type Flow = { constraint: string; waiting: number; clears: number; wip: number; throughput: number };
const DAY = 86_400_000;
const REQUIRED = ["slice", "size", "work_type", "mode", "context", "started", "accepted"];

export function dateValue(value: string): number | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const time = Date.parse(`${value}T00:00:00Z`);
  return Number.isFinite(time) && new Date(time).toISOString().slice(0, 10) === value ? time : undefined;
}
export function parseHistory(csv: string): History {
  if (!csv.trim()) return { rows: [], columns: [], errors: [], invalid: 0 };
  const parsed = Papa.parse<Record<string, string>>(csv, { header: true, skipEmptyLines: "greedy", transformHeader: (header) => header.trim(), transform: (value) => value.trim() });
  const columns = parsed.meta.fields ?? [];
  const missing = REQUIRED.filter((key) => !columns.includes(key));
  if (missing.length) return { rows: [], columns, errors: [`Missing required columns: ${missing.join(", ")}`], invalid: parsed.data.length };
  const rows: HistoryRow[] = [];
  const errors = parsed.errors.filter((error) => error.type !== "FieldMismatch").map((error) => error.message);
  let invalid = 0;
  parsed.data.forEach((row, index) => {
    const started = dateValue(row["started"] ?? "");
    const accepted = dateValue(row["accepted"] ?? "");
    const numeric = (key: string) => row[key] === undefined || row[key] === "" ? undefined : Number(row[key]);
    const review = numeric("review_wait_hours");
    const decision = numeric("decision_latency_hours");
    const fieldError = parsed.errors.some((error) => error.type === "FieldMismatch" && error.row === index);
    if (REQUIRED.some((key) => !row[key]) || started === undefined || accepted === undefined || accepted < started || fieldError || (review !== undefined && (!Number.isFinite(review) || review < 0)) || (decision !== undefined && (!Number.isFinite(decision) || decision < 0))) {
      invalid++;
      errors.push(`Row ${index + 2}: use all required fields, valid YYYY-MM-DD dates (accepted on or after started), and nonnegative wait hours.`);
      return;
    }
    rows.push({ slice: row["slice"] ?? "", size: row["size"] ?? "", work_type: row["work_type"] ?? "", mode: row["mode"] ?? "", context: row["context"] ?? "", started: row["started"] ?? "", accepted: row["accepted"] ?? "", cycle: Math.max(1, (accepted - started) / DAY), review, decision, ai_leverage: row["ai_leverage"] });
  });
  return { rows, columns, errors, invalid };
}

export function comparableHistory(history: History, slice: Slice, lastChange: string, matchLeverage: boolean) {
  const comparable: HistoryRow[] = [];
  let otherClass = 0;
  let beforeChange = 0;
  const change = dateValue(lastChange);
  for (const row of history.rows) {
    const matches = row.size === slice.size && row.work_type === slice.workType && row.mode === slice.mode && row.context === slice.context && (!matchLeverage || !history.columns.includes("ai_leverage") || row.ai_leverage?.toLowerCase() === slice.leverage.toLowerCase());
    if (!matches) otherClass++;
    else if (change !== undefined && (dateValue(row.started) ?? 0) < change) beforeChange++;
    else comparable.push(row);
  }
  return { comparable, otherClass, beforeChange, excluded: otherClass + beforeChange + history.invalid };
}
export const evidenceLevel = (acceptance: string, count: number): Level => !acceptance.trim() ? "F0" : count >= 7 ? "F2" : "F1";
export const total = (scenario: Scenario) => scenario.active + scenario.review + scenario.decision + scenario.external;
export const scenarioOrderValid = (scenarios: Scenarios) => total(scenarios.Optimistic) <= total(scenarios.Expected) && total(scenarios.Expected) <= total(scenarios.Conservative);
export const formatNumber = (value: number) => Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
export function deliveryForecast(level: Level, rows: HistoryRow[], scenarios: Scenarios) {
  if (level === "F0") return "Not estimated. Define acceptance evidence first.";
  if (level === "F1") return `${formatNumber(total(scenarios.Optimistic))}–${formatNumber(total(scenarios.Conservative))} working days`;
  const times = rows.map((row) => row.cycle);
  return `${Math.min(...times)}–${Math.max(...times)} days`;
}
export const coverage = (count: number) => count > 0 ? Math.round(100 * (count - 1) / (count + 1)) : 0;
export const effectiveRisk = (slice: Slice): Risk => slice.mode === "3" ? "High" : slice.risk;
export const verification: Record<Risk, string> = {
  Low: "Automated tests pass; agent review; human skim of the diff",
  Medium: "Automated tests; full human review of the diff against acceptance evidence",
  High: "Independent review by someone who did not direct the agent; explicit approval for data, money or security changes",
};
export const planning: Record<Mode, { output: string; time: string }> = {
  "0": { output: "One line of acceptance", time: "5 minutes" },
  "1": { output: "A slice card", time: "15–30 minutes" },
  E: { output: "The least costly credible test and one recorded decision", time: "Set by the Learning Investment" },
  "2": { output: "A decision record and a spike", time: "1–2 hours before the spike" },
  "3": { output: "Reviewed design and test plan", time: "Risk-governed, no ceiling" },
};
export function classificationWarnings(slice: Slice): string[] {
  return [slice.mode === "3" ? "Mode 3 is High risk for verification" : "", slice.size === "XL" ? "Split it before review, not after." : "", slice.itemType === "Improvement" && ["L", "XL"].includes(slice.size) ? "Customer-facing work with uncertain value, or work above the appetite, must be a Bet." : "", slice.mode === "E" ? "Forecast the experiment and its decision date, not the build." : ""].filter(Boolean);
}
export function externalLabel(slice: Slice, commitment: Commitment, level: Level, count: number) {
  const evidence = level === "F2" ? `F2 (n=${count})` : level === "F0" ? "F0 · not estimated" : "F1";
  const accepted = level === "F1" && commitment.type === "Commitment" && commitment.riskAccepted;
  return `${slice.title} · ${commitment.type} · ${commitment.when} · ${evidence}${accepted ? ` · F1 risk accepted by ${commitment.decider}` : ""}`;
}
export function conformance(commitment: Commitment, level: Level): { tone: "danger" | "success" | "warning"; text: string } {
  if (level === "F0" && commitment.type !== "Direction") return { tone: "danger", text: "An F0 slice has no forecast to date. Show it as a Direction." };
  if (level === "F1" && commitment.type === "Commitment" && (!commitment.riskAccepted || !commitment.decider.trim())) return { tone: "danger", text: "Not conformant: a Commitment needs F2 or the decider's written acceptance of F1 risk." };
  if (level === "F2") return { tone: "success", text: "Conformant: the range carries its sample count." };
  return { tone: "success", text: level === "F0" ? "Direction · not estimated." : "Conformant: judgment scenarios are labelled F1." };
}
export function measuredThroughput(rows: HistoryRow[]): number {
  if (!rows.length) return 0;
  const latest = Math.max(...rows.map((row) => dateValue(row.accepted) ?? 0));
  return rows.filter((row) => { const accepted = dateValue(row.accepted) ?? 0; return accepted > latest - 28 * DAY && accepted <= latest; }).length / 4;
}
export function flowStatus(flow: Flow): { tone: "danger" | "warning" | "success"; text: string } {
  if (flow.waiting > flow.clears) return { tone: "danger", text: `Don't start this slice yet. More than one week of work waits at ${flow.constraint}. Finish before starting.` };
  if (flow.waiting === flow.clears) return { tone: "warning", text: "At the limit." };
  return { tone: "success", text: "Room to start." };
}
export function timeBreakdown(level: Level, rows: HistoryRow[], expected: Scenario, columns: string[]) {
  if (level === "F0") return { segments: [], missing: [], inconsistent: false, decisionPercent: 0 };
  if (level === "F1") {
    const sum = total(expected);
    return { segments: [{ label: "Active", value: expected.active }, { label: "Review & queue", value: expected.review }, { label: "Decision wait", value: expected.decision }, { label: "External wait", value: expected.external }], missing: [], inconsistent: false, decisionPercent: sum ? expected.decision / sum * 100 : 0 };
  }
  const sum = rows.reduce((acc, row) => acc + row.cycle, 0);
  const review = rows.reduce((acc, row) => acc + (row.review ?? 0) / 24, 0);
  const decision = rows.reduce((acc, row) => acc + (row.decision ?? 0) / 24, 0);
  const missing = [!columns.includes("review_wait_hours") || rows.some((row) => row.review === undefined) ? "review_wait_hours" : "", !columns.includes("decision_latency_hours") || rows.some((row) => row.decision === undefined) ? "decision_latency_hours" : ""].filter(Boolean);
  return { segments: [{ label: "Review & queue", value: review }, { label: "Decision wait", value: decision }, { label: missing.length ? "Unattributed time (incomplete wait evidence)" : "Active + external wait (not separated in the evidence record)", value: Math.max(0, sum - review - decision) }], missing, inconsistent: review + decision > sum, decisionPercent: sum ? decision / sum * 100 : 0 };
}
export function sliceCard(slice: Slice, commitment: Commitment, level: Level, rows: HistoryRow[], scenarios: Scenarios, assumptions: string) {
  const risk = effectiveRisk(slice);
  const scalar = (value: string) => JSON.stringify(value);
  const forecast = `${level}${level === "F2" ? ` (n=${rows.length})` : ""} · ${deliveryForecast(level, rows, scenarios)}${level === "F1" ? " · scenarios, not probabilities" : ""}`;
  return `---\nid: SL-NEW\nroadmap_item: ${scalar(slice.item)}\ntitle: ${scalar(slice.title)}\nmode: ${scalar(slice.mode)}\nsize: ${slice.size}\nwork_type: ${slice.workType}\nforecast: ${scalar(forecast)}\nrisk: ${risk}\nai_leverage: ${slice.leverage}\nevidence_level: ${level}\nstate: ready\n---\n## Acceptance evidence\n${slice.acceptance}\n\n## Verification tier and reviewer\n${risk}: ${verification[risk]}\nReviewer: to be assigned\n\n## Forecast basis (reference class, range or scenarios, assumptions, external label)\nReference class: ${slice.size} / ${slice.workType} / Mode ${slice.mode} / ${slice.context}\n${forecast}\n${level === "F1" ? `Optimistic: ${total(scenarios.Optimistic)}; Expected: ${total(scenarios.Expected)}; Conservative: ${total(scenarios.Conservative)} working days\n` : ""}Assumptions: ${assumptions}\nExternal label: ${externalLabel(slice, commitment, level, rows.length)}${slice.itemType === "Bet" ? `\nOutcome · ${slice.item} · ${commitment.outcomeLevel} · ${commitment.criterion}\nDelivery and outcome are never merged into one confidence figure.` : ""}`;
}

export const EXAMPLE_CSV = `slice,size,work_type,mode,context,started,accepted,review_wait_hours,decision_latency_hours
SL-031,M,ui,1,established,2026-05-12,2026-05-22,30,8
SL-040,M,ui,1,established,2026-07-06,2026-07-14,20,4
SL-041,M,ui,1,established,2026-07-09,2026-07-21,46,12
SL-043,S,ui,1,established,2026-07-13,2026-07-16,6,0
SL-044,M,ui,1,established,2026-07-20,2026-07-27,18,6
SL-046,L,integration,3,established,2026-07-21,2026-08-14,70,30
SL-047,M,ui,1,established,2026-07-28,2026-08-11,52,26
SL-049,M,ui,1,established,2026-08-05,2026-08-12,16,2
SL-052,M,ui,1,established,2026-08-18,2026-08-28,34,10
SL-055,M,ui,1,established,2026-09-01,2026-09-07,12,4
SL-057,M,ui,1,established,2026-09-08,2026-09-22,60,30
SL-060,M,ui,1,established,2026-09-21,2026-09-30,26,8`;
export const EXAMPLE_SLICE: Slice = { item: "Invite teammates by email", itemType: "Bet", title: "Invite teammates by email", mode: "1", size: "M", workType: "ui", context: "established", risk: "Medium", leverage: "High", acceptance: "An invited teammate can accept an email invitation and join the correct workspace; automated tests cover expired and invalid invitations." };
export const EXAMPLE_SCENARIOS: Scenarios = { Optimistic: { active: 2, review: 1, decision: 0, external: 0 }, Expected: { active: 4, review: 2, decision: 1, external: 0 }, Conservative: { active: 6, review: 3, decision: 2, external: 1 } };
export const EXAMPLE_COMMITMENT: Commitment = { type: "Target", when: "Nov", decider: "founder", riskAccepted: false, outcomeLevel: "F1", criterion: "Continue if 8 of the first 30 new workspaces invite a second member within 14 days" };
export const EXAMPLE_FLOW: Flow = { constraint: "Verification", waiting: 3, clears: 4, wip: 6, throughput: 3 };