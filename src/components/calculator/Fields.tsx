import { useEffect, useState, type ReactNode } from "react";
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

export function Help({ label }: { label: string }) {
  const [open, setOpen] = useState(false);
  const text = labelHelp(label);
  if (!text) return null;
  return <Popover open={open} onOpenChange={setOpen}><span className="inline-flex" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}><PopoverTrigger asChild><Button type="button" variant="ghost" size="icon" className="calc-help" aria-label={`About ${label}`} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)}><Info size={14} /></Button></PopoverTrigger></span><PopoverContent className="max-w-[280px] text-[13px] leading-5" onOpenAutoFocus={(event) => event.preventDefault()} onCloseAutoFocus={(event) => event.preventDefault()} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>{text}</PopoverContent></Popover>;
}
export function Label({ label }: { label: string }) { return <span className="inline-flex items-center gap-1 text-sm font-medium text-foreground">{label}<Help label={label} /></span>; }
export function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={`min-w-0 space-y-2 ${wide ? "sm:col-span-2" : ""}`}><Label label={label} />{children}</div>;
}
export function TextField({ label, value, onChange, multiline = false, wide = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean; type?: string }) {
  return <Field label={label} wide={wide}>{multiline ? <Textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} rows={3} /> : <Input aria-label={label} type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</Field>;
}
export function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[] | readonly { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <Field label={label}><Select value={value} onValueChange={(next) => { const match = options.find((option) => (typeof option === "string" ? option : option.value) === next); if (match !== undefined) onChange(typeof match === "string" ? match : match.value); }}><SelectTrigger aria-label={label} className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => { const key = typeof option === "string" ? option : option.value; return <SelectItem key={key} value={key}>{typeof option === "string" ? option : option.label}</SelectItem>; })}</SelectContent></Select></Field>;
}
export function DecimalInput({ label, value, onChange, className = "" }: { label: string; value: number; onChange: (value: number) => void; className?: string }) {
  const [raw, setRaw] = useState(value === 0 ? "" : formatNumber(value));
  useEffect(() => { setRaw((current) => decimalNumber(current) === value ? current : value === 0 ? "" : formatNumber(value)); }, [value]);
  return <Input aria-label={label} inputMode="decimal" type="text" className={`tabular-nums ${className}`} value={raw} onChange={(event) => { const next = event.target.value; if (/^\d*(?:[.,]\d*)?$/.test(next)) { setRaw(next); onChange(decimalNumber(next)); } }} onBlur={() => setRaw(raw === "" ? "" : formatNumber(value))} />;
}
export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) { return <Field label={label}><DecimalInput label={label} value={value} onChange={onChange} /></Field>; }
export function CheckField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return <div className="flex items-center gap-2"><label className={`flex items-center gap-3 text-sm ${disabled ? "text-muted-foreground" : ""}`}><Checkbox checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)} />{label}</label><Help label={label} /></div>;
}
export function Segmented<T extends string>({ label, value, options, onChange, disabled = false }: { label: string; value: T | ""; options: readonly { value: T; label: string; description?: string }[]; onChange: (value: T) => void; disabled?: boolean }) {
  return <Field label={label}><div className="calc-segmented" role="group" aria-label={label}>{options.map((option) => <Button key={option.value} type="button" variant="outline" disabled={disabled} aria-pressed={value === option.value} className={value === option.value ? "selected" : ""} title={option.description} onClick={() => onChange(option.value)}>{option.label}</Button>)}</div></Field>;
}
export function Stepper({ label, value, onChange, step = 1, min = 0 }: { label: string; value: number; onChange: (value: number) => void; step?: number; min?: number }) {
  const clamp = (next: number) => Math.max(min, Math.round(next / step) * step);
  return <div className="calc-stepper" aria-label={label}><Button type="button" variant="outline" size="icon" aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(clamp(value - step))}>−</Button><span className="tabular-nums" aria-live="polite">{formatNumber(value)}</span><Button type="button" variant="outline" size="icon" aria-label={`Increase ${label}`} onClick={() => onChange(clamp(value + step))}>+</Button></div>;
}
export function StepperField({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (value: number) => void; step?: number }) {
  return <Field label={label}><Stepper label={label} value={value} onChange={onChange} step={step} /></Field>;
}
export function Step({ number, title, explanation, summary, collapsed = false, children }: { number: number; title: string; explanation: string; summary?: string | undefined; collapsed?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(!collapsed);
  const heading = <><span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-sm text-muted-foreground">{number}</span><span className="min-w-0 flex-1 text-left"><span className="block text-base font-semibold">{title}</span>{summary && <span className="block text-xs font-normal text-muted-foreground">{summary}</span>}</span></>;
  return <section className="calc-step"><h2>{collapsed ? <Button variant="ghost" onClick={() => setOpen(!open)} className="h-auto w-full justify-start gap-3 rounded-none p-0 hover:bg-transparent" aria-expanded={open}>{heading}<ChevronDown size={16} className={open ? "rotate-180" : ""} /></Button> : <span className="flex items-center gap-3">{heading}</span>}</h2>{open && <div className="mt-4 space-y-5"><p className="text-sm leading-6 text-muted-foreground">{explanation}</p>{children}</div>}</section>;
}
