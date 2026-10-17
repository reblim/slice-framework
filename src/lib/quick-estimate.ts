export type Range = { low: number; high: number };
export type FeatureKey = "authentication" | "payments" | "settings" | "admin" | "upload" | "email" | "search" | "import" | "integration" | "other";
export type BuildKey = "half-day" | "day" | "two-three" | "week" | "bigger";
export type QuickRisk = "Low" | "Medium" | "High";
export type DecisionKey = "clear" | "few" | "big";
export type ExternalKey = "none" | "one" | "several";

export const FEATURES: { key: FeatureKey; label: string }[] = [
  { key: "authentication", label: "Authentication (sign-up, sign-in, password reset)" },
  { key: "payments", label: "Payments or checkout" },
  { key: "settings", label: "Settings or profile page" },
  { key: "admin", label: "Admin dashboard" },
  { key: "upload", label: "File upload" },
  { key: "email", label: "Email or notifications" },
  { key: "search", label: "Search" },
  { key: "import", label: "Data import or export" },
  { key: "integration", label: "Third-party integration" },
  { key: "other", label: "Something else" },
];
export const BUILD_OPTIONS: { key: BuildKey; label: string; range: Range | null }[] = [
  { key: "half-day", label: "Under half a day", range: { low: 0.25, high: 0.5 } },
  { key: "day", label: "About a day", range: { low: 0.5, high: 1.5 } },
  { key: "two-three", label: "2–3 days", range: { low: 2, high: 3 } },
  { key: "week", label: "About a week", range: { low: 4, high: 6 } },
  { key: "bigger", label: "More than a week", range: null },
];
export const RISK_OPTIONS: { key: QuickRisk; label: string; description: string; range: Range; note?: string }[] = [
  { key: "Low", label: "Low", description: "Easy to undo, no sensitive data", range: { low: 0.25, high: 0.5 } },
  { key: "Medium", label: "Medium", description: "Users see it; needs a full review", range: { low: 0.5, high: 2 } },
  { key: "High", label: "High", description: "Money, logins, personal data, or hard to undo", range: { low: 2, high: 5 }, note: "Needs review by someone who didn't build it. Tip: a managed provider (hosted payments, managed auth) lowers the risk." },
];
export const DECISION_OPTIONS: { key: DecisionKey; label: string; range: Range | null }[] = [
  { key: "clear", label: "Clear", range: { low: 0, high: 0.5 } },
  { key: "few", label: "A few open questions", range: { low: 1, high: 3 } },
  { key: "big", label: "Big open questions", range: null },
];
export const EXTERNAL_OPTIONS: { key: ExternalKey; label: string; range: Range }[] = [
  { key: "none", label: "No", range: { low: 0, high: 0 } },
  { key: "one", label: "One party, e.g. a vendor", range: { low: 1, high: 3 } },
  { key: "several", label: "Several parties or approvals", range: { low: 3, high: 10 } },
];

export type RangeOverrides = {
  build: Partial<Record<Exclude<BuildKey, "bigger">, Range>>;
  risk: Partial<Record<QuickRisk, Range>>;
  decision: Partial<Record<Exclude<DecisionKey, "big">, Range>>;
  external: Partial<Record<ExternalKey, Range>>;
};
export const NO_OVERRIDES: RangeOverrides = { build: {}, risk: {}, decision: {}, external: {} };

export function buildRange(key: BuildKey, overrides: RangeOverrides): Range | null {
  const base = BUILD_OPTIONS.find((option) => option.key === key)?.range ?? null;
  if (!base || key === "bigger") return base;
  return overrides.build[key] ?? base;
}
export function riskRange(key: QuickRisk, overrides: RangeOverrides): Range {
  return overrides.risk[key] ?? RISK_OPTIONS.find((option) => option.key === key)!.range;
}
export function decisionRange(key: DecisionKey, overrides: RangeOverrides): Range | null {
  const base = DECISION_OPTIONS.find((option) => option.key === key)?.range ?? null;
  if (!base || key === "big") return base;
  return overrides.decision[key] ?? base;
}
export function externalRange(key: ExternalKey, overrides: RangeOverrides): Range {
  return overrides.external[key] ?? EXTERNAL_OPTIONS.find((option) => option.key === key)!.range;
}

export type QuickAnswers = { feature: FeatureKey; featureText: string; build: BuildKey | ""; risk: QuickRisk | ""; decision: DecisionKey | ""; external: ExternalKey | "" };
export const EMPTY_QUICK: QuickAnswers = { feature: "authentication", featureText: "", build: "", risk: "", decision: "", external: "" };
export const HIGH_RISK_FEATURES: FeatureKey[] = ["authentication", "payments"];

export const roundHalf = (value: number) => Math.round(value * 2) / 2;
export const midpoint = (range: Range) => (range.low + range.high) / 2;

export type QuickResult =
  | { kind: "incomplete" }
  | { kind: "too-big" }
  | { kind: "undecided" }
  | { kind: "ready"; parts: { label: string; range: Range }[]; low: number; high: number; buildPercent: number };

export function quickResult(answers: QuickAnswers, overrides: RangeOverrides): QuickResult {
  if (!answers.build || !answers.risk || !answers.decision || !answers.external) return { kind: "incomplete" };
  if (answers.feature === "other" && !answers.featureText.trim()) return { kind: "incomplete" };
  const build = buildRange(answers.build, overrides);
  if (!build) return { kind: "too-big" };
  const decision = decisionRange(answers.decision, overrides);
  if (!decision) return { kind: "undecided" };
  const parts: { label: string; range: Range }[] = [
    { label: "Build (AI)", range: build },
    { label: "Review & testing", range: riskRange(answers.risk, overrides) },
    { label: "Decisions", range: decision },
    { label: "Waiting", range: externalRange(answers.external, overrides) },
  ];
  const low = roundHalf(parts.reduce((acc, part) => acc + part.range.low, 0));
  const high = roundHalf(parts.reduce((acc, part) => acc + part.range.high, 0));
  const totalMid = parts.reduce((acc, part) => acc + midpoint(part.range), 0);
  return { kind: "ready", parts, low, high, buildPercent: totalMid ? Math.round(midpoint(build) / totalMid * 100) : 0 };
}

export function quickFeatureName(answers: QuickAnswers): string {
  if (answers.feature === "other") return answers.featureText.trim();
  return FEATURES.find((feature) => feature.key === answers.feature)?.label ?? "";
}
export function quickCopyLine(answers: QuickAnswers, result: Extract<QuickResult, { kind: "ready" }>): string {
  return `${quickFeatureName(answers)} · Target · F1 · ${result.low}–${result.high} working days`;
}
/** Maps the four quick parts onto the F1 scenario columns: best = lower bounds, likely = midpoints, worst = upper bounds. */
export function quickScenarios(result: Extract<QuickResult, { kind: "ready" }>) {
  const column = (pick: (range: Range) => number) => ({
    active: pick(result.parts[0]!.range),
    review: pick(result.parts[1]!.range),
    decision: pick(result.parts[2]!.range),
    external: pick(result.parts[3]!.range),
  });
  return { Optimistic: column((range) => range.low), Expected: column(midpoint), Conservative: column((range) => range.high) };
}

const STORAGE_KEY = "slice-calculator-quick-ranges";
export function loadOverrides(): RangeOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return NO_OVERRIDES;
    const parsed = JSON.parse(raw) as RangeOverrides;
    return { build: parsed.build ?? {}, risk: parsed.risk ?? {}, decision: parsed.decision ?? {}, external: parsed.external ?? {} };
  } catch {
    return NO_OVERRIDES;
  }
}
export function saveOverrides(overrides: RangeOverrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // storage unavailable; overrides live for this session only
  }
}

export const QUICK_EXAMPLE: QuickAnswers = { feature: "authentication", featureText: "", build: "day", risk: "High", decision: "few", external: "none" };
