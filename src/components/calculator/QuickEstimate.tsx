import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, Copy, RotateCcw, FlaskConical, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateField } from "./DateField";
import { Help, RadioGroup, Stepper } from "./Fields";
import { revealResult, useMomentaryFlag } from "./result-feedback";
import {
  BUILD_OPTIONS,
  calendarISO,
  DECISION_OPTIONS,
  EXTERNAL_OPTIONS,
  EMPTY_QUICK,
  FEATURE_GROUPS,
  FEATURE_GUIDANCE,
  formatCalendarDate,
  loadOverrides,
  liveRange,
  NO_OVERRIDES,
  QUICK_EXAMPLE,
  quickCopyLine,
  quickFeatureName,
  quickResult,
  RISK_OPTIONS,
  saveOverrides,
  type FeatureKey,
  type QuickAnswers,
  type RangeOverrides,
  type Range,
} from "@/lib/quick-estimate";
import { formatNumber } from "@/lib/calculator";

const rangeText = (range: Range | null) => {
  if (!range) return "";
  const amount =
    range.low === range.high
      ? formatNumber(range.low)
      : `${formatNumber(range.low)}–${formatNumber(range.high)}`;
  return `${amount} days`;
};

export function QuickEstimate({
  onContinue,
}: {
  onContinue: (answers: QuickAnswers, overrides: RangeOverrides) => void;
}) {
  const [answers, setAnswers] = useState<QuickAnswers>(EMPTY_QUICK);
  const [overrides, setOverrides] = useState<RangeOverrides>(NO_OVERRIDES);
  const [startDate, setStartDate] = useState("");
  const [exampleShown, pulseExample] = useMomentaryFlag();
  const [resetShown, pulseReset] = useMomentaryFlag();
  const [reveal, setReveal] = useState(0);
  const resultRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    setOverrides(loadOverrides());
    setStartDate(calendarISO(new Date()));
  }, []);
  useEffect(() => {
    if (reveal === 0) return;
    revealResult(resultRef.current, headingRef.current);
  }, [reveal]);
  const result = useMemo(() => quickResult(answers, overrides), [answers, overrides]);
  const [copied, setCopied] = useState(false);
  const update = <K extends keyof QuickAnswers>(key: K, value: QuickAnswers[K]) =>
    setAnswers((current) => {
      const next = { ...current, [key]: value };
      if (key === "feature") {
        const preset = FEATURE_GUIDANCE[value as FeatureKey]?.risk;
        if (preset) next.risk = preset;
      }
      return next;
    });
  const setRange = (group: keyof RangeOverrides, key: string, range: Range) =>
    setOverrides((current) => {
      const next = { ...current, [group]: { ...current[group], [key]: range } };
      saveOverrides(next);
      return next;
    });
  const copy = async () => {
    if (result.kind !== "ready") return;
    try {
      await navigator.clipboard.writeText(quickCopyLine(answers, result));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };
  const buildHelp = useId();
  const guidance = FEATURE_GUIDANCE[answers.feature];
  const featureOptions = [
    ...FEATURE_GROUPS.flatMap((group) =>
      group.features.map((feature, index) => ({
        value: feature.key,
        label: feature.label,
        group: group.label,
        span: group.features.length % 2 === 1 && index === group.features.length - 1,
      })),
    ),
    { value: "other" as const, label: "Something else", span: true },
  ];
  const live = result.kind === "ready" ? liveRange(startDate, result.low, result.high) : null;
  const headline =
    result.kind === "ready"
      ? `${formatNumber(result.low)}–${formatNumber(result.high)} working days, start to live`
      : "";
  const started = live
    ? formatCalendarDate(
        new Date(
          Number(startDate.slice(0, 4)),
          Number(startDate.slice(5, 7)) - 1,
          Number(startDate.slice(8, 10)),
        ),
      )
    : "";
  return (
    <div className="calc-quick">
      <div className="calc-actions">
        <Button
          variant="outline"
          onClick={() => {
            const previous = answers;
            const previousDate = startDate;
            setAnswers(QUICK_EXAMPLE);
            pulseExample();
            setReveal((value) => value + 1);
            toast("Example loaded: authentication", {
              action: {
                label: "Undo",
                onClick: () => {
                  setAnswers(previous);
                  setStartDate(previousDate);
                },
              },
            });
          }}
        >
          {exampleShown ? <Check size={16} aria-hidden /> : <FlaskConical size={16} aria-hidden />}
          {exampleShown ? "Example loaded" : "Try example: authentication"}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            const previous = answers;
            const previousDate = startDate;
            setAnswers(EMPTY_QUICK);
            setStartDate(calendarISO(new Date()));
            pulseReset();
            setReveal((value) => value + 1);
            toast("Calculator reset", {
              action: {
                label: "Undo",
                onClick: () => {
                  setAnswers(previous);
                  setStartDate(previousDate);
                },
              },
            });
          }}
        >
          {resetShown ? <Check size={16} aria-hidden /> : <RotateCcw size={16} aria-hidden />}
          {resetShown ? "Calculator reset" : "Reset"}
        </Button>
      </div>

      <section className="calc-step">
        <h2 className="calc-question">1. What are you building?</h2>
        <div className="calc-step-body">
          <RadioGroup
            label="Feature"
            variant="chips"
            value={answers.feature}
            options={featureOptions}
            onChange={(value) => update("feature", value)}
          />
          {answers.feature === "other" && (
            <div className="calc-other">
              <label htmlFor="quick-feature-text">What are you building?</label>
              <Input
                id="quick-feature-text"
                aria-label="What are you building?"
                placeholder="e.g. Team roles and permissions"
                value={answers.featureText}
                onChange={(event) => update("featureText", event.target.value)}
              />
            </div>
          )}
          {guidance?.note && <p className="calc-help-line">{guidance.note}</p>}
        </div>
      </section>

      <section className="calc-step">
        <h2 className="calc-question">
          2. How long does building take with AI?
          <Help label="Build time with AI" id={buildHelp} />
        </h2>
        <div className="calc-step-body">
          <RadioGroup
            label="Build time with AI"
            describedBy={buildHelp}
            variant="rows"
            value={answers.build}
            options={BUILD_OPTIONS.map((option) => ({
              value: option.key,
              label: option.label,
              meta: rangeText(option.range),
            }))}
            onChange={(value) => update("build", value)}
          />
          <p className="calc-help-line">
            Building in old or fragile code? AI helps less there, so pick a longer option.
          </p>
          {answers.build === "bigger" && (
            <p role="status" className="calc-help-line calc-warning-text">
              That's too big for one estimate. Split it into smaller pieces first.
            </p>
          )}
        </div>
      </section>

      <section className="calc-step">
        <h2 className="calc-question">3. How risky is it?</h2>
        <div className="calc-step-body">
          <RadioGroup
            label="Risk"
            variant="cards"
            value={answers.risk}
            options={RISK_OPTIONS.map((option) => ({
              value: option.key,
              label: option.label,
              description: option.description,
              meta: rangeText(option.range),
            }))}
            onChange={(value) => update("risk", value)}
          />
          {answers.risk === "High" && !guidance?.note && (
            <p className="calc-help-line">{RISK_OPTIONS[2]?.note}</p>
          )}
        </div>
      </section>

      <section className="calc-step">
        <h2 className="calc-question">4. What still needs deciding or designing?</h2>
        <div className="calc-step-body">
          <RadioGroup
            label="Decisions and design"
            variant="rows"
            value={answers.decision}
            options={DECISION_OPTIONS.map((option) => ({
              value: option.key,
              label: option.label,
              meta: option.range ? rangeText(option.range) : "Decide first",
            }))}
            onChange={(value) => update("decision", value)}
          />
          {answers.decision === "big" && (
            <p role="status" className="calc-help-line calc-warning-text">
              Decide first, or run a Mode E experiment. Then estimate.
            </p>
          )}
        </div>
      </section>

      <section className="calc-step">
        <h2 className="calc-question">5. Waiting on anyone outside the team?</h2>
        <div className="calc-step-body">
          <div>
            <RadioGroup
              label="Waiting"
              variant="rows"
              value={answers.external}
              options={EXTERNAL_OPTIONS.map((option) => ({
                value: option.key,
                label: option.label,
                meta: rangeText(option.range),
              }))}
              onChange={(value) => update("external", value)}
            />
            <p className="calc-help-line">
              For example a vendor, another team, a customer, app store review, a security review or
              legal approval.
            </p>
          </div>
          <div className="calc-start">
            <label htmlFor="quick-start-date">Start date</label>
            <DateField
              id="quick-start-date"
              label="Start date"
              value={startDate}
              onChange={setStartDate}
            />
          </div>
        </div>
      </section>

      <details className="calc-details">
        <summary>Adjust the suggested days</summary>
        <p className="mt-2 text-xs text-muted-foreground">
          Starting suggestions. Change them to fit your team.
        </p>
        <div className="mt-4 space-y-3">
          {BUILD_OPTIONS.filter((option) => option.range).map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3 text-sm">
              <span>{option.label}</span>
              <span className="flex items-center gap-2">
                <Stepper
                  label={`${option.label} low`}
                  step={0.25}
                  value={overrides.build[option.key as "day"]?.low ?? option.range!.low}
                  onChange={(value) =>
                    setRange("build", option.key, {
                      low: value,
                      high: overrides.build[option.key as "day"]?.high ?? option.range!.high,
                    })
                  }
                />
                <Stepper
                  label={`${option.label} high`}
                  step={0.25}
                  value={overrides.build[option.key as "day"]?.high ?? option.range!.high}
                  onChange={(value) =>
                    setRange("build", option.key, {
                      low: overrides.build[option.key as "day"]?.low ?? option.range!.low,
                      high: value,
                    })
                  }
                />
              </span>
            </div>
          ))}
          {RISK_OPTIONS.map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3 text-sm">
              <span>Review: {option.label}</span>
              <span className="flex items-center gap-2">
                <Stepper
                  label={`${option.label} review low`}
                  step={0.25}
                  value={overrides.risk[option.key]?.low ?? option.range.low}
                  onChange={(value) =>
                    setRange("risk", option.key, {
                      low: value,
                      high: overrides.risk[option.key]?.high ?? option.range.high,
                    })
                  }
                />
                <Stepper
                  label={`${option.label} review high`}
                  step={0.25}
                  value={overrides.risk[option.key]?.high ?? option.range.high}
                  onChange={(value) =>
                    setRange("risk", option.key, {
                      low: overrides.risk[option.key]?.low ?? option.range.low,
                      high: value,
                    })
                  }
                />
              </span>
            </div>
          ))}
          {DECISION_OPTIONS.filter((option) => option.range).map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3 text-sm">
              <span>Decisions: {option.label}</span>
              <span className="flex items-center gap-2">
                <Stepper
                  label={`${option.label} low`}
                  step={0.25}
                  value={overrides.decision[option.key as "clear"]?.low ?? option.range!.low}
                  onChange={(value) =>
                    setRange("decision", option.key, {
                      low: value,
                      high: overrides.decision[option.key as "clear"]?.high ?? option.range!.high,
                    })
                  }
                />
                <Stepper
                  label={`${option.label} high`}
                  step={0.25}
                  value={overrides.decision[option.key as "clear"]?.high ?? option.range!.high}
                  onChange={(value) =>
                    setRange("decision", option.key, {
                      low: overrides.decision[option.key as "clear"]?.low ?? option.range!.low,
                      high: value,
                    })
                  }
                />
              </span>
            </div>
          ))}
          {EXTERNAL_OPTIONS.map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3 text-sm">
              <span>Waiting: {option.label}</span>
              <span className="flex items-center gap-2">
                <Stepper
                  label={`${option.label} low`}
                  step={0.25}
                  value={overrides.external[option.key]?.low ?? option.range.low}
                  onChange={(value) =>
                    setRange("external", option.key, {
                      low: value,
                      high: overrides.external[option.key]?.high ?? option.range.high,
                    })
                  }
                />
                <Stepper
                  label={`${option.label} high`}
                  step={0.25}
                  value={overrides.external[option.key]?.high ?? option.range.high}
                  onChange={(value) =>
                    setRange("external", option.key, {
                      low: overrides.external[option.key]?.low ?? option.range.low,
                      high: value,
                    })
                  }
                />
              </span>
            </div>
          ))}
        </div>
      </details>

      <section ref={resultRef} className="calc-full-result" aria-live="polite">
        {result.kind === "incomplete" && (
          <p ref={headingRef} tabIndex={-1} className="text-sm text-muted-foreground">
            Answer the questions above to see your estimate.
          </p>
        )}
        {result.kind === "undecided" && (
          <p ref={headingRef} tabIndex={-1} className="calc-result-headline">
            Not estimated yet · F0
          </p>
        )}
        {result.kind === "ready" && (
          <div className="calc-result-stack">
            <div>
              <p
                ref={headingRef}
                tabIndex={-1}
                className="calc-result-headline tabular-nums"
                data-testid="quick-result"
              >
                {headline}
              </p>
              <p className="calc-help-line">
                F1 · judgment estimate from starting suggestions, not calibrated to your team.
                Assumes the steps run one after another; if they overlap it can be shorter, and if
                the team splits its attention, longer.
              </p>
              {live && (
                <p className="calc-live" data-testid="quick-live">
                  Starting {started}: done by the end of {live.from} at the earliest, {live.to} at
                  the latest.
                </p>
              )}
              {live && (
                <p className="calc-help-line">
                  Weekends skipped; public holidays and part-time work not included.
                </p>
              )}
            </div>
            <div>
              <div className="calc-breakdown" aria-label="Time breakdown">
                {result.parts.map((part, index) => {
                  const mid = (part.range.low + part.range.high) / 2;
                  return mid > 0 ? (
                    <span
                      key={part.label}
                      className={`calc-segment-${index}`}
                      style={{ flexGrow: mid }}
                      title={`${part.label}: ${rangeText(part.range)}`}
                    />
                  ) : null;
                })}
              </div>
              <ul className="calc-legend">
                {result.parts.map((part, index) => (
                  <li key={part.label}>
                    <span className="calc-legend-name">
                      <span className={`calc-segment-${index} size-2 shrink-0 bg-current`} />
                      {part.label}
                    </span>
                    <span className="days">{rangeText(part.range)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="calc-result-notes">
              <p>
                These are days of work and waiting for one slice. If the team juggles several things
                at once, the calendar time is longer. The full forecast's flow check shows that.
              </p>
              <p>
                Building is {result.buildPercent}% of the time. The rest is proving it works and
                deciding.
              </p>
            </div>
            <div className="calc-copybox">
              <code data-testid="quick-copy-line">{quickCopyLine(answers, result)}</code>
              <Button
                variant="outline"
                size="icon"
                title="Copy estimate line"
                aria-label="Copy estimate line"
                onClick={copy}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
              </Button>
            </div>
            <p className="calc-help-line calc-help-flat">
              F1 is a judgment estimate. After 7 similar finished pieces of work, use the Full SLICE
              forecast for a measured range.
            </p>
            <Button onClick={() => onContinue(answers, overrides)}>
              Continue in Full SLICE forecast
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
