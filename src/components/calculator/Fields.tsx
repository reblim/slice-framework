import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { decimalNumber, } from "@/lib/calculator-inputs";
import { formatNumber } from "@/lib/calculator";
import { labelHelp } from "./help";

export function Help({ label, id }: { label: string; id?: string }) {
  const [open, setOpen] = useState(false);
  const generated = useId();
  const text = labelHelp(label);
  const descriptionId = id ?? generated;
  if (!text) return null;
  const closeOnEscape = (event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    event.stopPropagation();
    setOpen(false);
  };
  return <Popover open={open} onOpenChange={setOpen}><span id={descriptionId} className="sr-only">{text}</span><span className="inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className="calc-help" aria-label={`About ${label}`} aria-describedby={descriptionId} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={closeOnEscape}><Info size={14} /></Button></PopoverTrigger></span><PopoverContent className="calc-help-bubble" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onKeyDown={closeOnEscape}>{text}</PopoverContent></Popover>;
}
export type RadioOption<T extends string> = { value: T; label: string; description?: string; meta?: string; span?: boolean };
export function RadioGroup<T extends string>({ label, value, options, onChange, variant, className = "", describedBy, disabled = false }: { label: string; value: T | ""; options: readonly RadioOption<T>[]; onChange: (value: T) => void; variant: "cards" | "chips" | "rows"; className?: string; describedBy?: string; disabled?: boolean }) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const selected = options.findIndex((option) => option.value === value);
  const tabIndexFor = (index: number) => (value === "" ? index === 0 : index === selected) ? 0 : -1;
  const move = (index: number) => {
    const option = options[(index + options.length) % options.length];
    if (!option || disabled) return;
    onChange(option.value);
    refs.current[(index + options.length) % options.length]?.focus();
  };
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = refs.current.findIndex((element) => element === document.activeElement);
    const index = current === -1 ? Math.max(selected, 0) : current;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); move(index + 1); }
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); move(index - 1); }
    else if (event.key === " ") { event.preventDefault(); move(index); }
  };
  return <div role="radiogroup" aria-label={label} aria-describedby={describedBy} className={`calc-radios calc-radios-${variant} ${className}`} onKeyDown={onKeyDown}>{options.map((option, index) => {
    const checked = value === option.value;
    return <button key={option.value} type="button" role="radio" aria-checked={checked} disabled={disabled} tabIndex={tabIndexFor(index)} ref={(element) => { refs.current[index] = element; }} className={`calc-radio ${option.span ? "span-full" : ""} ${checked ? "selected" : ""}`} onClick={() => onChange(option.value)}>
      {variant === "cards" ? <><span className="calc-risk-label">{option.label}</span>{option.description ? <span className="calc-risk-desc">{option.description}</span> : null}{option.meta ? <span className="calc-days-pill">{option.meta}</span> : null}</> : variant === "rows" ? <><span className="calc-option-label">{option.label}</span>{option.meta ? <span className="calc-option-days">{option.meta}</span> : null}</> : option.label}
    </button>;
  })}</div>;
}
export function Label({ label, helpId }: { label: string; helpId?: string }) { return <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">{label}<Help label={label} id={helpId} /></span>; }
export function Field({ label, children, wide = false, helpId }: { label: string; children: ReactNode; wide?: boolean; helpId?: string }) {
  const generated = useId();
  const id = labelHelp(label) ? (helpId ?? generated) : undefined;
  return <div className={`min-w-0 space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label label={label} helpId={id} />{children}</div>;
}
export function TextField({ label, value, onChange, multiline = false, wide = false, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean; type?: string; placeholder?: string }) {
  const helpId = useId();
  const described = labelHelp(label) ? helpId : undefined;
  return <Field label={label} wide={wide} helpId={described}>{multiline ? <Textarea aria-label={label} aria-describedby={described} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} rows={3} /> : <Input aria-label={label} aria-describedby={described} placeholder={placeholder} type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</Field>;
}
export function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[] | readonly { value: T; label: string }[]; onChange: (value: T) => void }) {
  const helpId = useId();
  const described = labelHelp(label) ? helpId : undefined;
  return <Field label={label} helpId={described}><Select value={value} onValueChange={(next) => { const match = options.find((option) => (typeof option === "string" ? option : option.value) === next); if (match !== undefined) onChange(typeof match === "string" ? match : match.value); }}><SelectTrigger aria-label={label} aria-describedby={described} className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => { const key = typeof option === "string" ? option : option.value; return <SelectItem key={key} value={key}>{typeof option === "string" ? option : option.label}</SelectItem>; })}</SelectContent></Select></Field>;
}
export function DecimalInput({ label, value, onChange, className = "" }: { label: string; value: number; onChange: (value: number) => void; className?: string }) {
  const [raw, setRaw] = useState(value === 0 ? "" : formatNumber(value));
  useEffect(() => { setRaw((current) => decimalNumber(current) === value ? current : value === 0 ? "" : formatNumber(value)); }, [value]);
  return <Input aria-label={label} inputMode="decimal" type="text" className={`tabular-nums ${className}`} value={raw} onChange={(event) => { const next = event.target.value; if (/^\d*(?:[.,]\d*)?$/.test(next)) { setRaw(next); onChange(decimalNumber(next)); } }} onBlur={() => setRaw(raw === "" ? "" : formatNumber(value))} />;
}
export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><DecimalInput label={label} value={value} onChange={onChange} /></Field>; }
export function CheckField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  const helpId = useId();
  const described = labelHelp(label) ? helpId : undefined;
  return <div className="flex items-center gap-2"><label className={`flex items-center gap-3 text-sm ${disabled ? "text-muted-foreground" : ""}`}><Checkbox aria-describedby={described} checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)} />{label}</label><Help label={label} id={described} /></div>;
}
export function Segmented<T extends string>({ label, value, options, onChange, disabled = false, variant = "chips" }: { label: string; value: T | ""; options: readonly { value: T; label: string; description?: string }[]; onChange: (value: T) => void; disabled?: boolean; variant?: "cards" | "chips" }) {
  const helpId = useId();
  const described = labelHelp(label) ? helpId : undefined;
  return <Field label={label} helpId={described}><RadioGroup label={label} value={value} variant={variant} describedBy={described} disabled={disabled} options={options} onChange={onChange} /></Field>;
}
export function Stepper({ label, value, onChange, step = 1, min = 0, describedBy }: { label: string; value: number; onChange: (value: number) => void; step?: number; min?: number; describedBy?: string }) {
  const clamp = (next: number) => Math.max(min, Math.round(next / step) * step);
  return <div className="calc-stepper" aria-label={label} aria-describedby={describedBy}><Button type="button" variant="outline" size="icon" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(clamp(value - step))}>−</Button><span className="tabular-nums" aria-live="polite">{formatNumber(value)}</span><Button type="button" variant="outline" size="icon" aria-label={`Increase ${label}`} onClick={() => onChange(clamp(value + step))}>+</Button></div>;
}
export function StepperField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return <Field label={label}><Stepper label={label} value={value} onChange={onChange} step={step} /></Field>;
}
export function Step({ number, title, explanation, summary, collapsed = false, children }: { number: number; title: string; explanation: string; summary?: string | undefined; collapsed?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(!collapsed);
  const heading = <><span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-sm text-muted-foreground">{number}</span><span className="min-w-0 flex-1 text-left"><span className="block text-base font-semibold">{title}</span>{summary && <span className="block text-xs font-normal text-muted-foreground">{summary}</span>}</span></>;
  return <section className="calc-step"><h2>{collapsed ? <Button variant="ghost" onClick={() => setOpen(!open)} className="h-auto w-full justify-start gap-3 rounded-none p-0 hover:bg-transparent" aria-expanded={open}>{heading}<ChevronDown size={16} className={open ? "rotate-180" : ""} /></Button> : <span className="flex items-center gap-3">{heading}</span>}</h2>{open && <div className="mt-4 space-y-5"><p className="text-sm leading-6 text-muted-foreground">{explanation}</p>{children}</div>}</section>;
}
