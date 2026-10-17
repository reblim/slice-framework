import { useRef, useState, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Help } from "./Fields";
import { classificationWarnings, conformance, coverage, deliveryForecast, effectiveRisk, externalLabel, flowStatus, formatNumber, planning, scenarioOrderValid, sliceCard, timeBreakdown, total, verification, type Commitment, type Flow, type History, type HistoryRow, type Level, type Scenarios, type Slice } from "@/lib/calculator";

export function Notice({ tone, children }: { tone: "danger" | "warning" | "success"; children: ReactNode }) {
  return <p className={`calc-notice calc-${tone}`}>{children}</p>;
}
function Panel({ title, children }: { title: string; children: ReactNode }) {
  return <section className="space-y-4 border-t border-border py-6"><h2 className="text-base font-semibold">{title}</h2>{children}</section>;
}
function DotStrip({ rows }: { rows: HistoryRow[] }) {
  const times = rows.map((row) => row.cycle);
  const min = Math.min(...times);
  const max = Math.max(...times);
  const scale = Math.max(max - min, 1);
  const duplicates = new Map<number, number>();
  const dots = rows.map((row) => { const stack = duplicates.get(row.cycle) ?? 0; duplicates.set(row.cycle, stack + 1); return { row, stack }; });
  const height = Math.max(72, (Math.max(...Array.from(duplicates.values())) + 1) * 16);
  return <figure className="space-y-2"><svg viewBox={`0 0 400 ${height}`} className="w-full text-foreground" role="img" aria-label={`Cycle times of ${rows.length} comparable accepted slices: ${times.join(", ")} calendar days`}><rect x="16" y="4" width="368" height={height - 8} rx="4" className="fill-muted" /><line x1="16" x2="384" y1={height - 16} y2={height - 16} className="stroke-border" />{dots.map(({ row, stack }, index) => <circle key={`${row.slice}-${index}`} cx={min === max ? 200 : 16 + (row.cycle - min) / scale * 368} cy={height - 27 - stack * 16} r="5" className="fill-primary"><title>{`${row.slice}: ${row.cycle} days`}</title></circle>)}</svg><figcaption className="flex justify-between text-xs text-muted-foreground"><span>{min} days</span><span>Observed range · n={rows.length}</span><span>{max} days</span></figcaption></figure>;
}
export function Results({ slice, history, rows, scenarios, level, commitment, flow, assumptions }: { slice: Slice; history: History; rows: HistoryRow[]; scenarios: Scenarios; level: Level; commitment: Commitment; flow: Flow; assumptions: string }) {
  const forecast = deliveryForecast(level, rows, scenarios);
  const conformity = conformance(commitment, level);
  const flowState = flowStatus(flow);
  const breakdown = timeBreakdown(level, rows, scenarios.Expected, history.columns);
  const breakdownTotal = breakdown.segments.reduce((acc, segment) => acc + segment.value, 0);
  const risk = effectiveRisk(slice);
  const card = sliceCard(slice, commitment, level, rows, scenarios, assumptions);
  const cardRef = useRef<HTMLTextAreaElement>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "selected">("idle");
  const copy = async () => {
    try { await navigator.clipboard.writeText(card); setCopyState("copied"); }
    catch { cardRef.current?.focus(); cardRef.current?.select(); setCopyState("selected"); }
    setTimeout(() => setCopyState("idle"), 2000);
  };
  return <>
    <Panel title="Delivery forecast">
      <div className="flex gap-2" aria-label={`Evidence level ${level}`}>{["F0", "F1", "F2", "F3"].map((value) => <span key={value} aria-describedby={`level-help-${value}`} className={`flex h-8 items-center justify-center rounded border pl-2 text-sm font-medium ${value === level ? "border-link text-link" : "border-border text-muted-foreground"} ${value === "F3" ? "opacity-40" : ""}`}>{value}<Help label={value} id={`level-help-${value}`} /></span>)}</div>
      <p className={level === "F0" ? "text-lg" : "text-3xl font-semibold tabular-nums"}>{forecast}</p>
      {level === "F1" && <><div className="grid grid-cols-3 gap-2 text-sm">{Object.entries(scenarios).map(([name, scenario]) => <div key={name}><p className="text-xs text-muted-foreground">{name}</p><p className="mt-1 font-medium tabular-nums">{formatNumber(total(scenario))} days</p></div>)}</div><p className="text-sm text-muted-foreground">scenarios, not probabilities</p>{!scenarioOrderValid(scenarios) && <Notice tone="warning">Scenario totals must satisfy Optimistic ≤ Expected ≤ Conservative.</Notice>}</>}
      {level === "F2" && <><p className="text-sm leading-relaxed text-muted-foreground">Observed range of {rows.length} comparable accepted slices. About {coverage(rows.length)}% of comparable slices from a stable process land inside it; it says nothing about this one slice.</p><DotStrip rows={rows} /></>}
    </Panel>
    <Panel title="External label"><p className="break-words text-sm font-medium leading-relaxed" data-testid="external-label">{externalLabel(slice, commitment, level, rows.length)}</p><Notice tone={conformity.tone}>{conformity.text}</Notice>{slice.itemType === "Bet" && <><p className="break-words text-sm">Outcome · {slice.item} · {commitment.outcomeLevel} · {commitment.criterion}</p><p className="text-xs leading-relaxed text-muted-foreground">Delivery and outcome are never merged into one confidence figure.</p></>}</Panel>
    <Panel title="Where the time goes"><p className="text-xs text-muted-foreground">T_slice = active + review &amp; queue + decision wait + external wait</p>{level === "F0" ? <p className="text-sm text-muted-foreground">Define acceptance evidence first.</p> : <><p className="text-xs text-muted-foreground">{level === "F1" ? "Expected scenario · working days" : `Summed evidence · ${rows.length} comparable slices · calendar days`}</p>{breakdown.inconsistent ? <Notice tone="danger">Recorded wait exceeds total cycle time. Correct the history before interpreting the breakdown.</Notice> : <><div className="flex h-5 w-full overflow-hidden rounded" aria-label="Time breakdown">{breakdown.segments.map((segment, index) => <svg key={segment.label} width={breakdownTotal ? `${segment.value / breakdownTotal * 100}%` : "0%"} height="20" className={`calc-segment-${index}`}><rect width="100%" height="100%" fill="currentColor" /><title>{`${segment.label}: ${formatNumber(segment.value)} days`}</title></svg>)}</div><ul className="space-y-2 text-xs">{breakdown.segments.map((segment, index) => <li key={segment.label} className="flex items-start justify-between gap-3"><span className="flex gap-2"><span className={`calc-segment-${index} mt-1 size-2 shrink-0 bg-current`} />{segment.label}</span><span className="shrink-0 tabular-nums">{formatNumber(segment.value)} d</span></li>)}</ul></>}{breakdown.missing.length > 0 && <Notice tone="warning">Missing or incomplete columns: {breakdown.missing.join(", ")}. Wait time cannot be fully separated.</Notice>}{breakdown.decisionPercent >= 20 && <Notice tone="warning">Decision wait is {formatNumber(breakdown.decisionPercent)}% of the time: the decider is a candidate constraint.</Notice>}</>}</Panel>
    <Panel title="Flow check">{flow.waiting > 0 && flow.clears > 0 ? <Notice tone={flowState.tone}>{flowState.text}</Notice> : <p className="text-sm text-muted-foreground">Enter the waiting and clears-per-week numbers above to check the flow.</p>}{flow.waiting > flow.clears && flow.constraint === "Decisions" && <p className="text-sm text-destructive">Stop producing options nobody is ready to evaluate.</p>}<p className="text-sm leading-relaxed">{flow.wip} in progress ÷ {flow.throughput} a week {flow.throughput > 0 ? `≈ ${formatNumber(flow.wip / flow.throughput)} weeks average cycle time` : "· average cycle time unavailable at zero throughput"}</p>{flow.constraint === "Verification" && <p className="text-xs leading-relaxed text-muted-foreground">Verification: presumed until wait times show otherwise; re-identify monthly.</p>}</Panel>
    <Panel title="Planning and verification"><dl className="space-y-3 text-sm"><div><dt className="text-xs text-muted-foreground">Mode {slice.mode} output</dt><dd className="mt-1 font-medium">{planning[slice.mode].output}</dd></div><div className="border-l-2 border-border pl-3"><dt className="text-xs text-muted-foreground">Coordination time</dt><dd className="mt-1">{planning[slice.mode].time}</dd><dd className="mt-1 text-xs text-muted-foreground">illustrative; exceed only with a recorded reason</dd></div></dl><p className="text-sm">Reference class: {slice.size} / {slice.workType} / Mode {slice.mode} / {slice.context}</p><p className="text-sm">AI leverage: {slice.leverage}: recorded, never a multiplier</p><div><h3 className="text-sm font-medium">Verification floor · {risk}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{verification[risk]}</p></div>{risk !== "Low" && <Notice tone="warning">No unreviewed merges. Self-review or a second agent is a check, never independent approval.</Notice>}</Panel>
    <Panel title="Slice card"><div className="flex items-center justify-end gap-2"><span role="status" className="text-xs text-muted-foreground">{copyState === "copied" ? "Copied" : copyState === "selected" ? "Text selected" : ""}</span><Button variant="outline" size="icon" title="Copy slice card" aria-label="Copy slice card" onClick={copy}>{copyState === "copied" ? <Check size={16} /> : <Copy size={16} />}</Button></div><Textarea ref={cardRef} value={card} readOnly aria-label="Slice card" className="min-h-64 font-mono text-xs leading-relaxed" /></Panel>
  </>;
}

export function Warnings({ slice }: { slice: Slice }) {
  return <>{classificationWarnings(slice).map((warning) => <Notice key={warning} tone="warning">{warning}</Notice>)}</>;
}