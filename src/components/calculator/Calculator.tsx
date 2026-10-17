import { useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CheckField, Choice, NumberField, Step, TextField } from "./Fields";
import { Notice, Results, Warnings } from "./Results";
import { comparableHistory, evidenceLevel, EXAMPLE_COMMITMENT, EXAMPLE_CSV, EXAMPLE_FLOW, EXAMPLE_SCENARIOS, EXAMPLE_SLICE, formatNumber, measuredThroughput, parseHistory, total, type Commitment, type Flow, type Scenario, type Scenarios, type Slice } from "@/lib/calculator";

const modes = [{ value: "0", label: "0 Direct" }, { value: "1", label: "1 Slice brief" }, { value: "E", label: "E Experiment to decide" }, { value: "2", label: "2 Technical shape" }, { value: "3", label: "3 Assured design" }] as const;
const risks = ["Low", "Medium", "High"] as const;
const scenarioNames = ["Optimistic", "Expected", "Conservative"] as const;
const scenarioColumns: { key: keyof Scenario; label: string }[] = [{ key: "active", label: "Active" }, { key: "review", label: "Review & queue" }, { key: "decision", label: "Decision wait" }, { key: "external", label: "External wait" }];

export function Calculator() {
  const [slice, setSlice] = useState<Slice>(EXAMPLE_SLICE);
  const [csv, setCsv] = useState(EXAMPLE_CSV);
  const [lastChange, setLastChange] = useState("2026-07-01");
  const [matchLeverage, setMatchLeverage] = useState(false);
  const [scenarios, setScenarios] = useState<Scenarios>(EXAMPLE_SCENARIOS);
  const [assumptions, setAssumptions] = useState("Example: email delivery is available and the decider can review within one working day.");
  const [commitment, setCommitment] = useState<Commitment>(EXAMPLE_COMMITMENT);
  const [flow, setFlow] = useState<Flow>(EXAMPLE_FLOW);
  const [throughputNote, setThroughputNote] = useState("");
  const history = useMemo(() => parseHistory(csv), [csv]);
  const matches = useMemo(() => comparableHistory(history, slice, lastChange, matchLeverage), [history, slice, lastChange, matchLeverage]);
  const level = evidenceLevel(slice.acceptance, matches.comparable.length);
  const updateSlice = <K extends keyof Slice>(key: K, value: Slice[K]) => setSlice((current) => ({ ...current, [key]: value }));
  const updateCommitment = <K extends keyof Commitment>(key: K, value: Commitment[K]) => setCommitment((current) => ({ ...current, [key]: value }));
  const updateFlow = <K extends keyof Flow>(key: K, value: Flow[K]) => setFlow((current) => ({ ...current, [key]: value }));
  return <main className="mx-auto max-w-6xl px-4 py-10">
    <div className="mb-8 flex flex-wrap items-center gap-3"><h1 className="text-3xl font-semibold">Forecast calculator</h1><span className="border-l border-border pl-3 text-xs font-medium uppercase text-muted-foreground">Example data</span></div>
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12">
      <div className="min-w-0">
        <Step number={1} title="Classify"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Roadmap item" value={slice.item} onChange={(value) => updateSlice("item", value)} />
          <Choice label="Item type" value={slice.itemType} options={["Bet", "Obligation", "Improvement"] as const} onChange={(value) => updateSlice("itemType", value)} />
          <TextField label="Slice title" value={slice.title} onChange={(value) => updateSlice("title", value)} wide />
          <Choice label="Planning mode" value={slice.mode} options={modes} onChange={(value) => updateSlice("mode", value)} />
          <Choice label="Size" value={slice.size} options={["XS", "S", "M", "L", "XL"]} onChange={(value) => updateSlice("size", value)} />
          <Choice label="Work type" value={slice.workType} options={["ui", "data", "integration", "ai", "infra"]} onChange={(value) => updateSlice("workType", value)} />
          <Choice label="Codebase context" value={slice.context} options={["greenfield", "established", "legacy"]} onChange={(value) => updateSlice("context", value)} />
          <Choice label="Risk" value={slice.risk} options={risks} onChange={(value) => updateSlice("risk", value)} />
          <Choice label="AI leverage" value={slice.leverage} options={risks} onChange={(value) => updateSlice("leverage", value)} />
          <TextField label="Acceptance evidence" value={slice.acceptance} onChange={(value) => updateSlice("acceptance", value)} multiline wide />
        </div><Warnings slice={slice} /></Step>
        <Step number={2} title="Measured history"><Textarea aria-label="History CSV" value={csv} onChange={(event) => setCsv(event.target.value)} rows={11} spellCheck={false} className="font-mono text-xs leading-relaxed" /><TextField label="Last major change" value={lastChange} type="date" onChange={setLastChange} /><CheckField label="Also match on AI leverage" checked={history.columns.includes("ai_leverage") && matchLeverage} disabled={!history.columns.includes("ai_leverage")} onChange={setMatchLeverage} />
          <div className="border-l-2 border-border pl-4"><p className="font-semibold tabular-nums" data-testid="comparable-count">{matches.comparable.length} comparable</p><p className="mt-1 text-sm text-muted-foreground">{matches.excluded} rows excluded: {matches.otherClass} other reference class / {matches.beforeChange} before the change{history.invalid ? ` / ${history.invalid} invalid` : ""}.</p>{matches.comparable.length < 7 && <p className="mt-2 text-sm calc-warning-text">F2 needs 7 or more; {7 - matches.comparable.length} to go</p>}</div>
          {history.errors.length > 0 && <div role="alert"><Notice tone="danger">{history.errors.join(" ")}</Notice></div>}
        </Step>
        <Step number={3} title="Judgment scenarios"><p className="text-xs text-muted-foreground">Working days · example scenarios</p><div className="overflow-x-auto"><table className="w-full min-w-[490px] text-sm"><thead><tr><th className="py-2 pr-2 text-left font-medium">Scenario</th>{scenarioColumns.map((column) => <th key={column.key} className="px-1 py-2 text-left text-xs font-medium text-muted-foreground">{column.label}</th>)}<th className="px-2 py-2 text-right text-xs font-medium">Total</th></tr></thead><tbody>{scenarioNames.map((name) => <tr key={name} className="border-t border-border"><th scope="row" className="py-3 pr-2 text-left text-xs font-medium">{name}</th>{scenarioColumns.map((column) => <td key={column.key} className="px-1 py-3"><Input aria-label={`${name} ${column.label}`} type="number" min={0} step="any" className="min-w-14 px-2 tabular-nums" value={scenarios[name][column.key]} onChange={(event) => { const value = Math.max(0, Number(event.target.value) || 0); setScenarios((current) => ({ ...current, [name]: { ...current[name], [column.key]: value } })); }} /></td>)}<td className="px-2 py-3 text-right font-semibold tabular-nums">{formatNumber(total(scenarios[name]))}</td></tr>)}</tbody></table></div><TextField label="Assumptions" value={assumptions} onChange={setAssumptions} multiline /></Step>
        <Step number={4} title="Commitment and flow"><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Choice label="Commitment type" value={commitment.type} options={["Direction", "Target", "Commitment"] as const} onChange={(value) => updateCommitment("type", value)} /><TextField label="When" value={commitment.when} onChange={(value) => updateCommitment("when", value)} /><TextField label="Decider" value={commitment.decider} onChange={(value) => updateCommitment("decider", value)} /></div><CheckField label="Decider accepts F1 risk in writing" checked={commitment.riskAccepted} onChange={(value) => updateCommitment("riskAccepted", value)} />{slice.itemType === "Bet" && <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Choice label="Outcome forecast level" value={commitment.outcomeLevel} options={["F0", "F1"] as const} onChange={(value) => updateCommitment("outcomeLevel", value)} /><TextField label="Decision criterion" value={commitment.criterion} onChange={(value) => updateCommitment("criterion", value)} multiline wide /></div>}
          <h3 className="pt-3 text-sm font-semibold">Flow</h3><div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><Choice label="Constraint" value={flow.constraint} options={["Verification", "QA", "Decisions", "Deployment approval", "Customer access", "Legal clearance"]} onChange={(value) => updateFlow("constraint", value)} /><NumberField label="Slices waiting at the constraint" value={flow.waiting} onChange={(value) => updateFlow("waiting", value)} /><NumberField label="Slices it clears per week" value={flow.clears} onChange={(value) => updateFlow("clears", value)} /><NumberField label="Slices in progress" value={flow.wip} onChange={(value) => updateFlow("wip", value)} /><NumberField label="Accepted per week" value={flow.throughput} onChange={(value) => updateFlow("throughput", value)} /></div><Button variant="outline" className="h-auto min-h-9 whitespace-normal text-left" disabled={!history.rows.length} onClick={() => { const value = measuredThroughput(history.rows); updateFlow("throughput", value); setThroughputNote(`${value} accepted per week · all valid CSV rows accepted in its last 28 days ÷ 4`); }}><BarChart3 size={16} className="shrink-0" />Use throughput measured from history</Button><p role="status" className="text-xs text-muted-foreground">{throughputNote}</p>
        </Step>
      </div>
      <aside aria-label="Calculator results" className="min-w-0 lg:sticky lg:top-6 lg:max-h-[calc(100dvh-3rem)] lg:self-start lg:overflow-y-auto lg:pr-3"><Results slice={slice} history={history} rows={matches.comparable} scenarios={scenarios} level={level} commitment={commitment} flow={flow} assumptions={assumptions} /></aside>
    </div>
    <footer className="mt-8 max-w-[72ch] space-y-3 border-t border-border py-8 text-sm leading-relaxed text-muted-foreground"><h2 className="font-semibold text-foreground">What this calculator will not do (rule 8.7)</h2><p>Convert sizes to hours or scale any number by an AI factor; show percentiles from judgment (P50/P85 belong to F3, unavailable in the alpha); show a range without its sample count.</p><p>Coverage is (n−1)/(n+1): the chance the next comparable slice lands inside the range of n past ones.</p></footer>
  </main>;
}