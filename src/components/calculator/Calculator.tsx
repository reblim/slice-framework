import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, BarChart3, Check, Copy, RotateCcw, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckField, Choice, Help, Segmented, Step, Stepper, TextField } from "./Fields";
import { Notice, Results, Warnings } from "./Results";
import { HistoryEditor } from "./HistoryEditor";
import { QuickEstimate } from "./QuickEstimate";
import { comparableHistory, conformance, evidenceLevel, externalLabel, EXAMPLE_COMMITMENT, EXAMPLE_CSV, EXAMPLE_EVIDENCE, EXAMPLE_FLOW, EXAMPLE_SLICE, flowStatus, measuredThroughput, parseHistory, sliceCard, total, type Commitment, type Flow, type Scenario, type Scenarios, type Slice } from "@/lib/calculator";
import { EMPTY_COMMITMENT, EMPTY_FLOW, EMPTY_SCENARIOS, EMPTY_SLICE, historyCoversFourWeeks, historyCsv, importHistory, type HistoryDraft } from "@/lib/calculator-inputs";
import { quickFeatureName, quickResult, quickScenarios, type QuickAnswers, type RangeOverrides } from "@/lib/quick-estimate";

const modes = [
  { value: "0", label: "0 · Obvious and reversible" },
  { value: "1", label: "1 · Bounded feature" },
  { value: "E", label: "E · Test value or price first" },
  { value: "2", label: "2 · Architecture or migration" },
  { value: "3", label: "3 · Money, access or sensitive data" },
] as const;
const risks = [{ value: "Low", label: "Low" }, { value: "Medium", label: "Medium" }, { value: "High", label: "High" }] as const;
const scenarioNames = ["Optimistic", "Expected", "Conservative"] as const;
const scenarioLabels = ["Best case", "Likely", "Worst case"];
const scenarioColumns: { key: keyof Scenario; label: string }[] = [{ key: "active", label: "Active" }, { key: "review", label: "Review & queue" }, { key: "decision", label: "Decision wait" }, { key: "external", label: "External wait" }];
const EVIDENCE_OPTIONS = ["Automated tests pass", "Reviewed by a second person", "Independent security review", "Works in staging", "Product owner accepted", "Monitoring in place"];
const DECIDERS = ["Founder", "Product lead", "Tech lead", "Whole team"];
const TAB_KEY = "slice-calculator-tab";

function whenOptions(): string[] {
  const now = new Date();
  const options = ["This week", "Next week"];
  for (let i = 1; i <= 6; i++) options.push(new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1)).toLocaleString("en", { month: "long", timeZone: "UTC" }));
  const quarter = Math.floor(now.getUTCMonth() / 3);
  for (let i = 1; i <= 3; i++) { const q = quarter + i; options.push(`Q${q % 4 + 1} ${now.getUTCFullYear() + Math.floor(q / 4)}`); }
  return options;
}

function loadTab(): "quick" | "full" { try { return localStorage.getItem(TAB_KEY) === "full" ? "full" : "quick"; } catch { return "quick"; } }
function saveTab(tab: string) { try { localStorage.setItem(TAB_KEY, tab); } catch { /* storage unavailable */ } }

export function Calculator() {
  const [tab, setTab] = useState<"quick" | "full">("quick");
  useEffect(() => { setTab(loadTab()); }, []);
  const switchTab = (next: "quick" | "full") => { setTab(next); saveTab(next); };

  const [slice, setSlice] = useState<Slice>(EMPTY_SLICE);
  const [evidence, setEvidence] = useState<string[]>([]);
  const [evidenceOther, setEvidenceOther] = useState("");
  const [drafts, setDrafts] = useState<HistoryDraft[]>([]);
  const [hasHistory, setHasHistory] = useState(false);
  const [lastChange, setLastChange] = useState("");
  const [noMajorChange, setNoMajorChange] = useState(false);
  const [matchLeverage, setMatchLeverage] = useState(false);
  const [scenarios, setScenarios] = useState<Scenarios>(EMPTY_SCENARIOS);
  const [assumptions, setAssumptions] = useState("");
  const [commitment, setCommitment] = useState<Commitment>(EMPTY_COMMITMENT);
  const [outcome, setOutcome] = useState({ count: "", of: "", unit: "users", action: "", days: "" });
  const [flow, setFlow] = useState<Flow>(EMPTY_FLOW);
  const [throughputNote, setThroughputNote] = useState("");
  const [copied, setCopied] = useState(false);
  const [copySelected, setCopySelected] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [touched, setTouched] = useState<Set<number>>(new Set());
  const resultRef = useRef<HTMLElement>(null);
  const touch = (step: number) => setTouched((current) => current.has(step) ? current : new Set(current).add(step));

  const effectiveSlice = useMemo<Slice>(() => ({ ...slice, acceptance: [...evidence, evidenceOther.trim()].filter(Boolean).join("; ") }), [slice, evidence, evidenceOther]);
  const effectiveCommitment = useMemo<Commitment>(() => {
    if (slice.itemType !== "Bet") return commitment;
    const criterion = outcome.count && outcome.of && outcome.action.trim() && outcome.days ? `Continue if ${outcome.count} of the first ${outcome.of} ${outcome.unit} ${outcome.action.trim()} within ${outcome.days} days` : "";
    return { ...commitment, criterion };
  }, [commitment, outcome, slice.itemType]);
  const effectiveLastChange = noMajorChange ? "" : lastChange;
  const csv = useMemo(() => historyCsv(drafts, drafts.some((row) => "ai_leverage" in row) ? ["ai_leverage"] : []), [drafts]);
  const history = useMemo(() => parseHistory(hasHistory ? csv : ""), [hasHistory, csv]);
  const matches = useMemo(() => comparableHistory(history, effectiveSlice, effectiveLastChange, matchLeverage), [history, effectiveSlice, effectiveLastChange, matchLeverage]);
  const level = evidenceLevel(effectiveSlice.acceptance, matches.comparable.length);
  const conformity = conformance(effectiveCommitment, level);
  const updateSlice = <K extends keyof Slice>(key: K, value: Slice[K]) => { touch(1); setSlice((current) => ({ ...current, [key]: value, ...(key === "mode" && value === "3" ? { risk: "High" as const } : {}) })); };
  const updateCommitment = <K extends keyof Commitment>(key: K, value: Commitment[K]) => { touch(3); setCommitment((current) => ({ ...current, [key]: value })); };
  const updateFlow = <K extends keyof Flow>(key: K, value: Flow[K]) => { touch(4); setFlow((current) => ({ ...current, [key]: value })); };
  const scrollResult = () => resultRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
  const copy = async () => { try { await navigator.clipboard.writeText(sliceCard(effectiveSlice, effectiveCommitment, level, matches.comparable, scenarios, assumptions)); setCopied(true); setCopySelected(false); } catch { scrollResult(); const card = resultRef.current?.querySelector<HTMLTextAreaElement>('textarea[aria-label="Slice card"]'); card?.focus(); card?.select(); setCopySelected(true); } setTimeout(() => { setCopied(false); setCopySelected(false); }, 2000); };
  const load = (example: boolean) => {
    setSlice(example ? EXAMPLE_SLICE : EMPTY_SLICE); setEvidence(example ? [...EXAMPLE_EVIDENCE] : []); setEvidenceOther(""); setDrafts(example ? importHistory(EXAMPLE_CSV).rows : []); setHasHistory(example); setLastChange(example ? "2026-07-01" : ""); setNoMajorChange(false); setMatchLeverage(false); setScenarios(example ? EMPTY_SCENARIOS : EMPTY_SCENARIOS); setAssumptions(example ? "The managed auth provider stays within its current limits and the tech lead can review within one working day." : ""); setCommitment(example ? EXAMPLE_COMMITMENT : EMPTY_COMMITMENT); setOutcome({ count: "", of: "", unit: "users", action: "", days: "" }); setFlow(example ? EXAMPLE_FLOW : EMPTY_FLOW); setThroughputNote(""); setCopied(false); setCopySelected(false); setTouched(new Set()); setResetKey((key) => key + 1);
  };
  const continueFromQuick = (answers: QuickAnswers, overrides: RangeOverrides) => {
    const result = quickResult(answers, overrides);
    setSlice({ ...EMPTY_SLICE, title: quickFeatureName(answers), risk: answers.risk || "Medium" });
    if (result.kind === "ready") setScenarios(quickScenarios(result));
    setTouched(new Set([1, 2]));
    switchTab("full");
  };
  const anyTouched = touched.size > 0;
  return <main className="calculator-page">
    <h1 className="text-3xl font-semibold">Forecast calculator</h1>
    <div className="calc-tabs" role="tablist" aria-label="Calculator mode">
      <Button variant="outline" role="tab" aria-selected={tab === "quick"} className={tab === "quick" ? "selected" : ""} onClick={() => switchTab("quick")}>Quick estimate</Button>
      <Button variant="outline" role="tab" aria-selected={tab === "full"} className={tab === "full" ? "selected" : ""} onClick={() => switchTab("full")}>Full SLICE forecast</Button>
    </div>
    {tab === "quick" ? <QuickEstimate onContinue={continueFromQuick} /> : <>
    <div className="my-6 flex flex-wrap gap-3"><Button variant="outline" onClick={() => load(true)}><FlaskConical size={16} />Try example: authentication</Button><Button variant="ghost" onClick={() => load(false)}><RotateCcw size={16} />Reset</Button></div>
    <div className="calc-result-bar">{anyTouched ? <><Button variant="ghost" onClick={scrollResult} className="calc-result-link"><span className="min-w-0 flex-1 break-words text-left text-sm">{externalLabel(effectiveSlice, effectiveCommitment, level, matches.comparable.length)}</span><ArrowDown size={16} className="shrink-0" /></Button><div className="flex flex-wrap items-center gap-2"><span className="status-badge inline-flex items-center">{level}<Help label={level} /></span><span className={`calc-state ${conformity.tone === "success" ? "calc-success" : "calc-danger"}`}>{conformity.tone === "success" ? "Conformant" : "Needs a fix"}</span><Button variant="outline" onClick={copy} className="ml-auto">{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Copied" : copySelected ? "Text selected" : "Copy slice card"}</Button></div></> : <p className="text-sm text-muted-foreground">Answer the questions above to see your estimate.</p>}</div>
    <div key={resetKey} className="space-y-5">
      <Step number={1} title="The slice" explanation="Name one checkable piece and what counts as done."><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0 space-y-2 sm:col-span-2"><span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">Slice title<Help label="Slice title" /></span><input aria-label="Slice title" placeholder="e.g. Email and password sign-in" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={slice.title} onChange={(event) => { touch(1); updateSlice("title", event.target.value); }} /></div>
        <Choice label="Size" value={slice.size} options={["XS", "S", "M", "L", "XL"]} onChange={(value) => updateSlice("size", value)} />
        <Choice label="Work type" value={slice.workType} options={["ui", "data", "integration", "ai", "infra"]} onChange={(value) => updateSlice("workType", value)} />
        <Choice label="Planning mode" value={slice.mode} options={modes} onChange={(value) => updateSlice("mode", value as Slice["mode"])} />
        <div className="min-w-0 space-y-2 sm:col-span-2"><span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">Acceptance evidence<Help label="Acceptance evidence" /></span><div className="space-y-2">{EVIDENCE_OPTIONS.map((option) => <label key={option} className="flex items-center gap-3 text-sm"><input type="checkbox" className="size-4" checked={evidence.includes(option)} onChange={(event) => { touch(1); setEvidence((current) => event.target.checked ? [...current, option] : current.filter((item) => item !== option)); }} />{option}</label>)}<input aria-label="Other evidence" placeholder="Other (optional)" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={evidenceOther} onChange={(event) => { touch(1); setEvidenceOther(event.target.value); }} /></div></div>
      </div><details className="calc-details"><summary>More details</summary><div className="mt-4 grid gap-4 sm:grid-cols-2"><div className="min-w-0 space-y-2"><span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">Roadmap item<Help label="Roadmap item" /></span><input aria-label="Roadmap item" placeholder="e.g. Self-serve onboarding" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm" value={slice.item} onChange={(event) => updateSlice("item", event.target.value)} /></div><Choice label="Item type" value={slice.itemType} options={["Bet", "Obligation", "Improvement"] as const} onChange={(value) => updateSlice("itemType", value)} /><Choice label="Codebase context" value={slice.context} options={["greenfield", "established", "legacy"]} onChange={(value) => updateSlice("context", value)} /><Segmented label="Risk" value={slice.risk} options={risks} onChange={(value) => updateSlice("risk", value)} /><Segmented label="AI leverage" value={slice.leverage} options={risks} onChange={(value) => updateSlice("leverage", value)} /></div>{slice.mode === "3" && <p className="mt-3 text-sm text-muted-foreground">Mode 3 is always High risk for verification.</p>}</details>{touched.has(1) && <Warnings slice={effectiveSlice} />}</Step>
      <Step number={2} title="Your estimate" explanation="Use finished similar slices, or give your best judgment."><div className="space-y-3"><div className="flex items-center gap-1"><p className="text-sm font-medium text-foreground">Have you finished similar slices?</p><Help label="Your estimate question" /></div><div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="History available"><Button variant="outline" className={`calc-estimate-option ${!hasHistory ? "selected" : ""}`} aria-pressed={!hasHistory} onClick={() => { touch(2); setHasHistory(false); }}>Not yet: this is one of our first slices</Button><Button variant="outline" className={`calc-estimate-option ${hasHistory ? "selected" : ""}`} aria-pressed={hasHistory} onClick={() => { touch(2); setHasHistory(true); }}>Yes: we have finished at least 7 similar slices</Button></div></div>
        {hasHistory ? <><HistoryEditor rows={drafts} setRows={(rows) => { touch(2); setDrafts(rows); }} slice={effectiveSlice} lastChange={effectiveLastChange} matchLeverage={matchLeverage} /><div className="flex flex-wrap items-end gap-4"><TextField label="Last major change" value={lastChange} type="date" onChange={(value) => { touch(2); setLastChange(value); setNoMajorChange(false); }} /><CheckField label="No major change" checked={noMajorChange} onChange={(value) => { touch(2); setNoMajorChange(value); }} /></div><CheckField label="Also match on AI leverage" checked={history.columns.includes("ai_leverage") && matchLeverage} disabled={!history.columns.includes("ai_leverage")} onChange={(value) => { touch(2); setMatchLeverage(value); }} /><div className="border-l-2 border-border pl-4"><p className="font-semibold tabular-nums" data-testid="comparable-count">{matches.comparable.length} comparable</p><p className="mt-1 text-sm text-muted-foreground">{matches.excluded} rows excluded: {matches.otherClass} other reference class / {matches.beforeChange} before the change{history.invalid ? ` / ${history.invalid} invalid` : ""}.</p>{matches.comparable.length < 7 && <p className="mt-2 text-sm calc-warning-text">F2 needs 7 or more; {7 - matches.comparable.length} to go</p>}</div>{touched.has(2) && history.errors.length > 0 && <div role="alert"><Notice tone="danger">{history.errors.join(" ")}</Notice></div>}</> : <><p className="text-xs text-muted-foreground">Working days · start to accepted</p><div className="overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead><tr><th className="py-2 pr-2 text-left font-medium">Scenario</th>{scenarioColumns.map((column) => <th key={column.key} className="px-1 py-2 text-left"><span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">{column.label}<Help label={column.label} /></span></th>)}</tr></thead><tbody>{scenarioNames.map((name, index) => <tr key={name} className="border-t border-border"><th scope="row" className="py-3 pr-2 text-left text-xs font-medium">{scenarioLabels[index]}</th>{scenarioColumns.map((column) => <td key={column.key} className="px-1 py-3"><Stepper label={`${name} ${column.label}`} step={0.5} value={scenarios[name][column.key]} onChange={(value) => { touch(2); setScenarios((current) => ({ ...current, [name]: { ...current[name], [column.key]: value } })); }} /></td>)}</tr>)}</tbody></table></div></>}
        <details className="calc-details"><summary>Add assumptions</summary><div className="mt-3"><TextField label="Assumptions" value={assumptions} onChange={(value) => { touch(2); setAssumptions(value); }} multiline /></div></details>
      </Step>
      <Step number={3} title="Sharing the date" summary={`${effectiveCommitment.type} · ${effectiveCommitment.when}`} collapsed explanation="Choose what the date means and who makes the call."><div className="grid gap-4 sm:grid-cols-2"><Segmented label="Commitment type" value={effectiveCommitment.type} options={[{ value: "Direction", label: "Direction" }, { value: "Target", label: "Target" }, { value: "Commitment", label: "Commitment" }] as const} onChange={(value) => updateCommitment("type", value)} /><Choice label="When" value={effectiveCommitment.when} options={whenOptions()} onChange={(value) => updateCommitment("when", value)} /><Choice label="Decider" value={effectiveCommitment.decider} options={DECIDERS} onChange={(value) => updateCommitment("decider", value)} /></div>{effectiveCommitment.type === "Commitment" && level === "F1" && <CheckField label="Decider accepts F1 risk in writing" checked={effectiveCommitment.riskAccepted} onChange={(value) => updateCommitment("riskAccepted", value)} />}{slice.itemType === "Bet" && <div className="space-y-3"><p className="text-sm font-medium text-foreground">Outcome<Help label="Outcome forecast and criterion" /></p><p className="flex flex-wrap items-center gap-2 text-sm">Continue if <input aria-label="Outcome count" inputMode="numeric" className="h-9 w-16 rounded-md border border-input bg-transparent px-2 text-sm tabular-nums" value={outcome.count} onChange={(event) => { touch(3); setOutcome((current) => ({ ...current, count: event.target.value })); }} /> of the first <input aria-label="Outcome of" inputMode="numeric" className="h-9 w-16 rounded-md border border-input bg-transparent px-2 text-sm tabular-nums" value={outcome.of} onChange={(event) => { touch(3); setOutcome((current) => ({ ...current, of: event.target.value })); }} /> <select aria-label="Outcome unit" className="h-9 rounded-md border border-input bg-transparent px-2 text-sm" value={outcome.unit} onChange={(event) => { touch(3); setOutcome((current) => ({ ...current, unit: event.target.value })); }}><option>users</option><option>customers</option><option>teams</option></select> <input aria-label="Outcome action" placeholder="do what" className="h-9 min-w-32 flex-1 rounded-md border border-input bg-transparent px-2 text-sm" value={outcome.action} onChange={(event) => { touch(3); setOutcome((current) => ({ ...current, action: event.target.value })); }} /> within <input aria-label="Outcome days" inputMode="numeric" className="h-9 w-16 rounded-md border border-input bg-transparent px-2 text-sm tabular-nums" value={outcome.days} onChange={(event) => { touch(3); setOutcome((current) => ({ ...current, days: event.target.value })); }} /> days</p><Choice label="Outcome forecast level" value={effectiveCommitment.outcomeLevel} options={["F0", "F1"] as const} onChange={(value) => updateCommitment("outcomeLevel", value)} /></div>}</Step>
      <Step number={4} title="Can we start now?" summary={touched.has(4) ? (flowStatus(flow).tone === "danger" ? "Don't start yet" : flowStatus(flow).tone === "warning" ? "At the limit" : "Room to start") : undefined} collapsed explanation="Check the queue before adding more work."><div className="grid gap-4 sm:grid-cols-2"><Choice label="Constraint" value={flow.constraint} options={["Verification", "QA", "Decisions", "Deployment approval", "Customer access", "Legal clearance"]} onChange={(value) => updateFlow("constraint", value)} />
        {([["Slices waiting at the constraint", "waiting"], ["Slices it clears per week", "clears"], ["Slices in progress", "wip"], ["Accepted per week", "throughput"]] as const).map(([label, key]) => <div key={key} className="min-w-0 space-y-2"><span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">{label}<Help label={label} /></span><Stepper label={label} value={flow[key]} onChange={(value) => updateFlow(key, value)} /></div>)}
      </div>{historyCoversFourWeeks(history.rows) && <Button variant="outline" className="h-auto min-h-9 whitespace-normal text-left" onClick={() => { const value = measuredThroughput(history.rows); updateFlow("throughput", value); setThroughputNote(`${value} accepted per week · all valid history rows accepted in its last 28 days ÷ 4`); }}><BarChart3 size={16} className="shrink-0" />Use throughput measured from history</Button>}<p role="status" className="text-xs text-muted-foreground">{throughputNote}</p></Step>
    </div>
    <section ref={resultRef} id="calculator-result" className="calc-full-result"><h2 className="text-2xl font-semibold">Result</h2>{anyTouched ? <Results slice={effectiveSlice} history={history} rows={matches.comparable} scenarios={scenarios} level={level} commitment={effectiveCommitment} flow={flow} assumptions={assumptions} /> : <p className="mt-4 text-sm text-muted-foreground">Answer the questions above to see your estimate.</p>}</section>
    </>}
    <footer className="mt-8 space-y-3 border-t border-border py-8 text-sm leading-relaxed text-muted-foreground"><h2 className="font-semibold text-foreground">What this calculator will not do (rule 8.7)</h2><p>Convert sizes to hours or scale any number by an AI factor; show percentiles from judgment (P50/P85 belong to F3, unavailable in the alpha); show a range without its sample count.</p><p>Coverage is (n−1)/(n+1): the chance the next comparable slice lands inside the range of n past ones.</p></footer>
  </main>;
}
