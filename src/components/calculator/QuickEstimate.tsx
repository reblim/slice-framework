import { useEffect, useId, useMemo, useState } from "react";
import { Check, Copy, RotateCcw, FlaskConical, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Help, RadioGroup, Stepper } from "./Fields";
import { BUILD_OPTIONS, DECISION_OPTIONS, EXTERNAL_OPTIONS, EMPTY_QUICK, FEATURES, HIGH_RISK_FEATURES, loadOverrides, NO_OVERRIDES, QUICK_EXAMPLE, quickCopyLine, quickFeatureName, quickResult, RISK_OPTIONS, saveOverrides, type QuickAnswers, type RangeOverrides, type Range } from "@/lib/quick-estimate";
import { formatNumber } from "@/lib/calculator";

const rangeText = (range: Range | null) => {
  if (!range) return "";
  const amount = range.low === range.high ? formatNumber(range.low) : `${formatNumber(range.low)}–${formatNumber(range.high)}`;
  return `${amount} days`;
};

export function QuickEstimate({ onContinue }: { onContinue: (answers: QuickAnswers, overrides: RangeOverrides) => void }) {
  const [answers, setAnswers] = useState<QuickAnswers>(EMPTY_QUICK);
  const [overrides, setOverrides] = useState<RangeOverrides>(NO_OVERRIDES);
  useEffect(() => { setOverrides(loadOverrides()); }, []);
  const result = useMemo(() => quickResult(answers, overrides), [answers, overrides]);
  const [copied, setCopied] = useState(false);
  const update = <K extends keyof QuickAnswers>(key: K, value: QuickAnswers[K]) => setAnswers((current) => {
    const next = { ...current, [key]: value };
    if (key === "feature" && HIGH_RISK_FEATURES.includes(value as QuickAnswers["feature"])) next.risk = "High";
    return next;
  });
  const setRange = (group: keyof RangeOverrides, key: string, range: Range) => setOverrides((current) => { const next = { ...current, [group]: { ...current[group], [key]: range } }; saveOverrides(next); return next; });
  const copy = async () => { if (result.kind !== "ready") return; try { await navigator.clipboard.writeText(quickCopyLine(answers, result)); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch { /* clipboard unavailable */ } };
  const buildHelp = useId();
  const highRiskNote = HIGH_RISK_FEATURES.includes(answers.feature) ? "Logins and payments are always high risk." : undefined;
  return <div className="calc-quick">
    <p className="text-base leading-7 text-muted-foreground">AI makes building fast. Reviewing, deciding and waiting still take time. This adds it all up.</p>
    <div className="my-6 flex flex-wrap gap-3"><Button variant="outline" onClick={() => setAnswers(QUICK_EXAMPLE)}><FlaskConical size={16} />Try example: authentication</Button><Button variant="ghost" onClick={() => setAnswers(EMPTY_QUICK)}><RotateCcw size={16} />Reset</Button></div>

    <section className="calc-step"><h2 className="text-base font-semibold">1. What are you building?</h2><div className="mt-4 space-y-3">
      <RadioGroup label="Feature" variant="chips" value={answers.feature} options={FEATURES.map((feature) => ({ value: feature.key, label: feature.label, span: feature.key === "other" }))} onChange={(value) => update("feature", value)} />
      {answers.feature === "other" && <Input aria-label="Feature name" placeholder="e.g. Team roles and permissions" value={answers.featureText} onChange={(event) => update("featureText", event.target.value)} />}
    </div></section>

    <section className="calc-step"><h2 className="flex items-center gap-1 text-base font-semibold">2. How long does building take with AI?<Help label="Build time with AI" id={buildHelp} /></h2><div className="mt-4">
      <RadioGroup label="Build time with AI" describedBy={buildHelp} variant="rows" value={answers.build} options={BUILD_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: rangeText(option.range) }))} onChange={(value) => update("build", value)} />
      {answers.build === "bigger" && <p role="status" className="mt-3 text-sm calc-warning-text">That's too big for one estimate. Split it into smaller pieces first.</p>}
    </div></section>

    <section className="calc-step"><h2 className="text-base font-semibold">3. How risky is it?</h2><div className="mt-4">
      <RadioGroup label="Risk" variant="cards" value={answers.risk} options={RISK_OPTIONS.map((option) => ({ value: option.key, label: option.label, description: option.description, meta: rangeText(option.range) }))} onChange={(value) => update("risk", value)} />
    </div>{answers.risk === "High" && <p className="mt-3 text-sm text-muted-foreground">{highRiskNote ?? RISK_OPTIONS[2]?.note}</p>}</section>

    <section className="calc-step"><h2 className="text-base font-semibold">4. Is anything still undecided?</h2><div className="mt-4">
      <RadioGroup label="Undecided" variant="rows" value={answers.decision} options={DECISION_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: rangeText(option.range) }))} onChange={(value) => update("decision", value)} />
      {answers.decision === "big" && <p role="status" className="mt-3 text-sm calc-warning-text">Decide first. Run a quick test or make the call, then estimate.</p>}
    </div></section>

    <section className="calc-step"><h2 className="text-base font-semibold">5. Waiting on anyone outside the team?</h2><div className="mt-4">
      <RadioGroup label="Waiting" variant="rows" value={answers.external} options={EXTERNAL_OPTIONS.map((option) => ({ value: option.key, label: option.label, meta: rangeText(option.range) }))} onChange={(value) => update("external", value)} />
    </div></section>

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
        <div className="mt-4 flex h-5 w-full overflow-hidden rounded" aria-label="Time breakdown">{result.parts.map((part, index) => { const totalMid = result.parts.reduce((acc, item) => acc + (item.range.low + item.range.high) / 2, 0); const mid = (part.range.low + part.range.high) / 2; return <svg key={part.label} width={totalMid ? `${mid / totalMid * 100}%` : "0%"} height="20" className={`calc-segment-${index}`}><rect width="100%" height="100%" fill="currentColor" /><title>{`${part.label}: ${formatNumber(mid)} days`}</title></svg>; })}</div>
        <ul className="mt-2 space-y-1 text-xs">{result.parts.map((part, index) => <li key={part.label} className="flex items-center justify-between gap-3"><span className="flex gap-2"><span className={`calc-segment-${index} mt-1 size-2 shrink-0 bg-current`} />{part.label}</span><span className="tabular-nums">{formatNumber(part.range.low)}–{formatNumber(part.range.high)} days</span></li>)}</ul>
        <p className="mt-4 text-sm">Building is {result.buildPercent}% of the time. The rest is proving it works and deciding.</p>
        <div className="mt-4 flex flex-wrap items-center gap-3"><code className="min-w-0 flex-1 break-words rounded border border-border bg-muted px-3 py-2 text-xs" data-testid="quick-copy-line">{quickCopyLine(answers, result)}</code><Button variant="outline" size="icon" title="Copy estimate line" aria-label="Copy estimate line" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}</Button></div>
        <p className="mt-3 text-xs text-muted-foreground">F1 is a judgment estimate. After 7 similar finished pieces of work, use the Full SLICE forecast for a measured range.</p>
        <Button className="mt-4" onClick={() => onContinue(answers, overrides)}>Continue in Full SLICE forecast<ArrowRight size={16} /></Button>
      </>}
    </section>
  </div>;
}
