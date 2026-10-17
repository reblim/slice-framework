export type Range = { low: number; high: number };
export type FeatureKey =
  | "authentication"
  | "payments"
  | "settings"
  | "admin"
  | "search"
  | "email"
  | "upload"
  | "mobile"
  | "api"
  | "database"
  | "integration"
  | "import"
  | "reports"
  | "ai"
  | "infra"
  | "bug"
  | "refactor"
  | "performance"
  | "other";
export type BuildKey = "half-day" | "day" | "two-three" | "week" | "bigger";
export type QuickRisk = "Low" | "Medium" | "High";
export type DecisionKey = "clear" | "few" | "big";
export type ExternalKey = "none" | "one" | "several";

export const FEATURE_GROUPS: { label: string; features: { key: FeatureKey; label: string }[] }[] = [
  {
    label: "Product",
    features: [
      { key: "authentication", label: "Authentication (sign-up, sign-in, password reset)" },
      { key: "payments", label: "Payments or checkout" },
      { key: "settings", label: "Settings or profile page" },
      { key: "admin", label: "Admin dashboard" },
      { key: "search", label: "Search" },
      { key: "email", label: "Email or notifications" },
      { key: "upload", label: "File upload" },
      { key: "mobile", label: "Mobile app screen" },
    ],
  },
  {
    label: "Data and platform",
    features: [
      { key: "api", label: "API or backend endpoint" },
      { key: "database", label: "Database change or migration" },
      { key: "integration", label: "Third-party integration" },
      { key: "import", label: "Data import or export" },
      { key: "reports", label: "Reports or analytics" },
      { key: "ai", label: "AI feature (uses a language model)" },
      { key: "infra", label: "Infrastructure or deployment (hosting, CI, monitoring)" },
    ],
  },
  {
    label: "Maintenance",
    features: [
      { key: "bug", label: "Bug fix" },
      { key: "refactor", label: "Refactor or upgrade" },
      { key: "performance", label: "Performance improvement" },
    ],
  },
];
export const FEATURES: { key: FeatureKey; label: string }[] = [
  ...FEATURE_GROUPS.flatMap((group) => group.features),
  { key: "other", label: "Something else" },
];
export const FEATURE_GUIDANCE: Partial<Record<FeatureKey, { risk?: QuickRisk; note: string }>> = {
  authentication: { risk: "High", note: "Logins and payments are always high risk." },
  payments: { risk: "High", note: "Logins and payments are always high risk." },
  database: {
    risk: "High",
    note: "Migrations are hard to undo: test on a copy of real data first.",
  },
  ai: {
    risk: "Medium",
    note: "Model output varies: check it on real examples before you call it done.",
  },
  infra: { risk: "Medium", note: "Plan how to roll back." },
  bug: {
    note: "If the cause is still unknown, choose 'Big open questions' or time-box an investigation first.",
  },
  refactor: { note: "Keep it separate from feature work so review stays small." },
};
export const BUILD_OPTIONS: { key: BuildKey; label: string; range: Range | null }[] = [
  { key: "half-day", label: "Under half a day", range: { low: 0.25, high: 0.5 } },
  { key: "day", label: "About a day", range: { low: 0.5, high: 1.5 } },
  { key: "two-three", label: "2–3 days", range: { low: 2, high: 3 } },
  { key: "week", label: "About a week", range: { low: 4, high: 6 } },
  { key: "bigger", label: "More than a week", range: null },
];
export const RISK_OPTIONS: {
  key: QuickRisk;
  label: string;
  description: string;
  range: Range;
  note?: string;
}[] = [
  {
    key: "Low",
    label: "Low",
    description: "Easy to undo, no sensitive data",
    range: { low: 0.25, high: 0.5 },
  },
  {
    key: "Medium",
    label: "Medium",
    description: "Users see it; needs a full review",
    range: { low: 0.5, high: 2 },
  },
  {
    key: "High",
    label: "High",
    description: "Money, logins, personal data, or hard to undo",
    range: { low: 2, high: 5 },
    note: "Needs review by someone who didn't build it. Tip: a managed provider (hosted payments, managed auth) lowers the risk.",
  },
];
export const DECISION_OPTIONS: { key: DecisionKey; label: string; range: Range | null }[] = [
  { key: "clear", label: "Nothing, it's clear", range: { low: 0, high: 0.5 } },
  { key: "few", label: "Some questions or screens to design", range: { low: 1, high: 3 } },
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

export type QuickAnswers = {
  feature: FeatureKey;
  featureText: string;
  build: BuildKey | "";
  risk: QuickRisk | "";
  decision: DecisionKey | "";
  external: ExternalKey | "";
};
export const EMPTY_QUICK: QuickAnswers = {
  feature: "authentication",
  featureText: "",
  build: "",
  risk: "High",
  decision: "",
  external: "",
};

export const roundHalf = (value: number) => Math.round(value * 2) / 2;
export const midpoint = (range: Range) => (range.low + range.high) / 2;

export type QuickResult =
  | { kind: "incomplete" }
  | { kind: "too-big" }
  | { kind: "undecided" }
  | {
      kind: "ready";
      parts: { label: string; range: Range }[];
      low: number;
      high: number;
      buildPercent: number;
    };

export function quickResult(answers: QuickAnswers, overrides: RangeOverrides): QuickResult {
  if (!answers.build || !answers.risk || !answers.decision || !answers.external)
    return { kind: "incomplete" };
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
  return {
    kind: "ready",
    parts,
    low,
    high,
    buildPercent: totalMid ? Math.round((midpoint(build) / totalMid) * 100) : 0,
  };
}

export function quickFeatureName(answers: QuickAnswers): string {
  if (answers.feature === "other") return answers.featureText.trim();
  return FEATURES.find((feature) => feature.key === answers.feature)?.label ?? "";
}
export function quickCopyLine(
  answers: QuickAnswers,
  result: Extract<QuickResult, { kind: "ready" }>,
): string {
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
  return {
    "Best case": column((range) => range.low),
    Likely: column(midpoint),
    "Worst case": column((range) => range.high),
  };
}

const STORAGE_KEY = "slice-calculator-quick-ranges";
export function loadOverrides(): RangeOverrides {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return NO_OVERRIDES;
    const parsed = JSON.parse(raw) as RangeOverrides;
    return {
      build: parsed.build ?? {},
      risk: parsed.risk ?? {},
      decision: parsed.decision ?? {},
      external: parsed.external ?? {},
    };
  } catch {
    return NO_OVERRIDES;
  }
}
const CALENDAR_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function calendarISO(today: Date): string {
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${today.getFullYear()}-${month}-${day}`;
}

/** Completion date after `workingDays`, counting Monday–Friday and rounding fractions up.
 * The start date counts as day 1 when it is a weekday. A weekend start rolls forward to the next weekday before counting.
 */
export function addWorkingDays(start: Date, workingDays: number): Date {
  const whole = Math.max(0, Math.ceil(workingDays));
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const weekday = () => cursor.getDay() !== 0 && cursor.getDay() !== 6;
  if (whole === 0) {
    while (!weekday()) cursor.setDate(cursor.getDate() + 1);
    return cursor;
  }
  let counted = 0;
  while (counted < whole) {
    if (weekday()) counted += 1;
    if (counted < whole) cursor.setDate(cursor.getDate() + 1);
  }
  return cursor;
}

export function formatCalendarDate(date: Date): string {
  return `${date.getDate()} ${CALENDAR_MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function liveRange(
  startISO: string,
  low: number,
  high: number,
): { from: string; to: string } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(startISO)) return null;
  const [year, month, day] = startISO.split("-").map(Number);
  if (!year || !month || !day) return null;
  const start = new Date(year, month - 1, day);
  if (start.getFullYear() !== year || start.getMonth() !== month - 1 || start.getDate() !== day)
    return null;
  return {
    from: formatCalendarDate(addWorkingDays(start, low)),
    to: formatCalendarDate(addWorkingDays(start, high)),
  };
}

export function saveOverrides(overrides: RangeOverrides) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  } catch {
    // storage unavailable; overrides live for this session only
  }
}

export const QUICK_EXAMPLE: QuickAnswers = {
  feature: "authentication",
  featureText: "",
  build: "day",
  risk: "High",
  decision: "few",
  external: "none",
};
