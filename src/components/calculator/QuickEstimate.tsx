import { useEffect, useId, useMemo, useState } from "react";
import { Check, Copy, RotateCcw, FlaskConical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Help, RadioGroup, Stepper } from "./Fields";
import { BUILD_OPTIONS, calendarISO, DECISION_OPTIONS, EXTERNAL_OPTIONS, EMPTY_QUICK, FEATURE_GROUPS, FEATURE_GUIDANCE, loadOverrides, liveRange, NO_OVERRIDES, QUICK_EXAMPLE, quickCopyLine, quickFeatureName, quickResult, RISK_OPTIONS, saveOverrides, type FeatureKey, type QuickAnswers, type RangeOverrides, type Range } from "@/lib/quick-estimate";
import { formatNumber } from "@/lib/calculator";

const rangeText = (range: Range | null) => {
  if (!range) return "";
  const amount = range.low === range.high ? formatNumber(range.low) : `${formatNumber(range.low)}–${formatNumber(range.high)}`;
  return `${amount} days`;
};

export function QuickEstimate({ onContinue }: { onContinue: (answers: QuickAnswers, overrides: RangeOverrides) => void }) {
  const [answers, setAnswers] = useState<QuickAnswers>(EMPTY_QUICK);
  const [overrides, setOverrides] = useState<RangeOverrides>(NO_OVERRIDES);
  const [startDate, setStartDate] = useState("");
  useEffect(() => { setOverrides(loadOverrides()); setStartDate(calendarISO(new Date())); }, []);
  const result = useMemo(() => quickResult(answers, overrides), [answers, overrides]);
  const [copied, setCopied] = useState(false);
  const update = <K extends keyof QuickAnswers>(key: K, value: QuickAnswers[K]) => setAnswers((current) => {
    const next = { ...current, [key]: value };
    if (key === "feature") { const preset = FEATURE_GUIDANCE[value as FeatureKey]?.risk; if (preset) next.risk = preset; }
    return next;
  });
  const setRange = (group: keyof RangeOverrides, key: string, range: Range) => setOverrides((current) => { const next = { ...current, [group]: { ...current[group], [key]: range } }; saveOverrides(next); return next; });
  const copy = async () => { if (result.kind !== "ready") return; try { await navigator.clipboard.writeText(quickCopyLine(answers, result)); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ } };
  const buildHelp = useId();
  const guidance = FEATURE_GUIDANCE[answers.feature];
  const featureOptions = [...FEATURE_GROUPS.flatMap((group) => group.features.map((feature) => ({ value: feature.key, label: feature.label, group: group.label }))), { value: "other" as const, label: "Something else", span: true }];
  const live = result.kind === "ready" ? liveRange(startDate, result.low, result.high) : null;
  return <div className="calc-quick">
    <p className="text-base leading-7 text-muted-foreground">AI makes building fast. Reviewing, deciding and waiting still take time. This adds it all up.</p>
    <div className="my-6 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setAnswers(QUICK_EXAMPLE)}><FlaskConical size={16} />Try example: authentication</Button><Button variant="ghost" onClick={() => { setAnswers(EMPTY_QUICK); setStartDate(calendarISO(new Date())); }}><RotateCcw size={16} />Reset</Button></div>

    <section className="calc-step"><h2 className="text-base font-semibold">1. What are you building?</h2><div className="mt-4 space-y-3">
      <RadioGroup label="Feature" variant="chips" value={answers.feature} options={featureOptions} onChange={(value) => update("feature", value)} />
      {answers.feature === "other" && <Input aria-label="Feature name" placeholder="e.g. Team roles and permissions" value={answers.featureText} onChange={(event) => update("featureText", event.target.value)} />}
      {guidance?.note && <p className="text-sm text-muted-foreground">{guidance.note}</p>}
    </div></section>

    <section className="calc-step"><h2 className="flex items-center gap-1 text-base font-semibold">2. How long does building take with AI?<Help label="Build time with AI" id={buildHelp} /></h2><div className="mt-4">
      <RadioGroup label="Build time with AI" describedBy={buildHelp} variant="rows" value={answers.build} options={BUILD_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: rangeText(option.range) }))} onChange={(value) => update("build", value)} />
      <p className="mt-3 text-sm text-muted-foreground">Building in old or fragile code? AI helps less there, so pick a longer option.</p>
      {answers.build === "bigger" && <p role="status" className="mt-3 text-sm calc-warning-text">That's too big for one estimate. Split it into smaller pieces first.</p>}
    </div></section>

    <section className="calc-step"><h2 className="text-base font-semibold">3. How risky is it?</h2><div className="mt-4">
      <RadioGroup label="Risk" variant="cards" value={answers.risk} options={RISK_OPTIONS.map((option) => ({ value: option.key, label: option.label, description: option.description, meta: rangeText(option.range) }))} onChange={(value) => update("risk", value)} />
    </div>{answers.risk === "High" && !guidance?.note && <p className="mt-3 text-sm text-muted-foreground">{RISK_OPTIONS[2]?.note}</p>}</section>

    <section className="calc-step"><h2 className="text-base font-semibold">4. What still needs deciding or designing?</h2><div className="mt-4">
      <RadioGroup label="Decisions and design" variant="rows" value={answers.decision} options={DECISION_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: option.range ? rangeText(option.range) : "Decide first" }))} onChange={(value) => update("decision", value)} />
      {answers.decision === "big" && <p role="status" className="mt-3 text-sm calc-warning-text">Decide first, or run a Mode E experiment. Then estimate.</p>}
    </div></section>

    <section className="calc-step"><h2 className="text-base font-semibold">5. Waiting on anyone outside the team?</h2><div className="mt-4">
      <RadioGroup label="Waiting" variant="rows" value={answers.external} options={EXTERNAL_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: rangeText(option.range) }))} onChange={(value) => update("external", value)} />
      <p className="mt-3 text-sm text-muted-foreground">For example a vendor, another team, a customer, app store review, a security review or legal approval.</p>
    </div>
    <div className="mt-4 max-w-xs space-y-2"><label className="text-sm font-medium text-foreground" htmlFor="quick-start-date">Start date</label><input id="quick-start-date" type="date" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={startDate} onChange={(event) => setStartDate(event.target.value)} /></div></section>

    <details className="calc-details"><summary>Adjust the suggested days</summary><p className="mt-2 text-xs text-muted-foreground">Starting suggestions. Change them to fit your team.</p><div className="mt-4 space-y-3">
      {BUILD_OPTIONS.filter((option) => option.range).map((option) => <div key={option.key} className="flex items-center justify-between gap-3 text-sm"><span>{option.label}</span><span className="flex items-center gap-2"><Stepper label={`${option.label} low`} step={0.25} value={overrides.build[option.key as "day"]?.low ?? option.range!.low} onChange={(value) => setRange("build", option.key, { low: value, high: overrides.build[option.key as "day"]?.high ?? option.range!.high })} /><Stepper label={`${option.label} high`} step={0.25} value={overrides.build[option.key as "day"]?.high ?? option.range!.high} onChange={(value) => setRange("build", option.key, { low: overrides.build[option.key as "day"]?.low ?? option.range!.low, high: value })} /></span></div>)}
      {RISK_OPTIONS.map((option) => <div key={option.key} className="flex items-center justify-between gap-3 text-sm"><span>Review: {option.label}</span><span className="flex items-center gap-2"><Stepper label={`${option.label} review low`} step={0.25} value={overrides.risk[option.key]?.low ?? option.range.low} onChange={(value) => setRange("risk", option.key, { low: value, high: overrides.risk[option.key]?.high ?? option.range.high })} /><Stepper label={`${option.label} review high`} step={0.25} value={overrides.risk[option.key]?.high ?? option.range.high} onChange={(value) => setRange("risk", option.key, { low: overrides.risk[option.key]?.low ?? option.range.low, high: value })} /></span></div>)}
      {DECISION_OPTIONS.filter((option) => option.range).map((option) => <div key={option.key} className="flex items-center justify-between gap-3 text-sm"><span>Decisions: {option.label}</span><span className="flex items-center gap-2"><Stepper label={`${option.label} low`} step={0.25} value={overrides.decision[option.key as "clear"]?.low ?? option.range!.low} onChange={(value) => setRange("decision", option.key, { low: value, high: overrides.decision[option.key as "clear"]?.high ?? option.range!.high })} /><Stepper label={`${option.label} high`} step={0.25} value={overrides.decision[option.key as "clear"]?.high ?? option.range!.high} onChange={(value) => setRange("decision", option.key, { low: overrides.decision[option.key as "clear"]?.low ?? option.range!.low, high: value })} /></span></div>)}
      {EXTERNAL_OPTIONS.map((option) => <div key={option.key} className="flex items-center justify-between gap-3 text-sm"><span>Waiting: {option.label}</span><span className="flex items-center gap-2"><Stepper label={`${option.label} low`} step={0.25} value={overrides.external[option.key]?.low ?? option.range.low} onChange={(value) => setRange("external", option.key, { low: value, high: overrides.external[option.key]?.high ?? option.range.high })} /><Stepper label={`${option.label} high`} step={0.25} value={overrides.external[option.key]?.high ?? option.range.high} onChange={(value) => setRange("external", option.key, { low: overrides.external[option.key]?.low ?? option.range.low, high: value })} /></span></div>)}
    </div></details>

    <section className="calc-full-result" aria-live="polite">
      {result.kind === "incomplete" && <p className="text-sm text-muted-foreground">Answer the questions above to see your estimate.</p>}
      {result.kind === "undecided" && <p className="text-lg">Not estimated yet · F0</p>}
      {result.kind === "ready" && <>
        <p className="text-3xl font-semibold tabular-nums" data-testid="quick-result">{result.low}–{result.high} working days until it's live</p>
        {live && <p className="mt-2 text-sm" data-testid="quick-live">Likely live between {live.from} and {live.to}</p>}
        {live && <p className="mt-1 text-xs text-muted-foreground">Weekends skipped; public holidays and part-time work not included.</p>}
        <div className="calc-breakdown mt-4" aria-label="Time breakdown">{result.parts.map((part, index) => { const mid = (part.range.low + part.range.high) / 2; return mid > 0 ? <span key={part.label} className={`calc-segment-${index}`} style={{ flexGrow: mid }} title={`${part.label}: ${formatNumber(part.range.low)}–${formatNumber(part.range.high)} days`} /> : null; })}</div>
        <ul className="mt-2 space-y-1 text-xs">{result.parts.map((part, index) => <li key={part.label} className="flex items-center justify-between gap-3"><span className="flex gap-2"><span className={`calc-segment-${index} mt-1 size-2 shrink-0 bg-current`} />{part.label}</span><span className="tabular-nums">{formatNumber(part.range.low)}–{formatNumber(part.range.high)} days</span></li>)}</ul>
        <p className="mt-4 text-sm text-muted-foreground">These are days of work and waiting for one slice. If the team juggles several things at once, the calendar time is longer. The full forecast's flow check shows that.</p>
        <p className="mt-4 text-sm">Building is {result.buildPercent}% of the time. The rest is proving it works and deciding.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3"><code className="min-w-0 flex-1 break-words rounded border border-border bg-muted px-3 py-2 text-xs" data-testid="quick-copy-line">{quickCopyLine(answers, result)}</code><Button variant="outline" size="icon" title="Copy estimate line" aria-label="Copy estimate line" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}</Button></div>
        <p className="mt-3 text-xs text-muted-foreground">F1 is a judgment estimate. After 7 similar finished pieces of work, use the Full SLICE forecast for a measured range.</p>
        <Button className="mt-4" onClick={() => onContinue(answers, overrides)}>Continue in Full SLICE forecast<ArrowRight size={16} /></Button>
      </>}
    </section>
  </div>;
}
