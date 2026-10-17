import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function Field({ label, children, wide = false }: { label: string; children: ReactNode; wide?: boolean }) {
  return <div className={`min-w-0 space-y-2 ${wide ? "sm:col-span-2" : ""}`}><div className="text-sm font-medium">{label}</div>{children}</div>;
}
export function TextField({ label, value, onChange, multiline = false, wide = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; wide?: boolean; type?: string }) {
  return <Field label={label} wide={wide}>{multiline ? <Textarea aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} rows={3} /> : <Input aria-label={label} type={type} value={value} onChange={(event) => onChange(event.target.value)} />}</Field>;
}
export function Choice<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: readonly T[] | readonly { value: T; label: string }[]; onChange: (value: T) => void }) {
  return <Field label={label}><Select value={value} onValueChange={(next) => { const match = options.find((option) => (typeof option === "string" ? option : option.value) === next); if (match !== undefined) onChange(typeof match === "string" ? match : match.value); }}><SelectTrigger aria-label={label} className="w-full"><SelectValue /></SelectTrigger><SelectContent>{options.map((option) => { const key = typeof option === "string" ? option : option.value; return <SelectItem key={key} value={key}>{typeof option === "string" ? option : option.label}</SelectItem>; })}</SelectContent></Select></Field>;
}
export function NumberField({ label, value, onChange }: { label: string; value: number; onChange: (value: number) => void }) {
  return <Field label={label}><Input aria-label={label} type="number" min={0} step="any" value={value} onChange={(event) => onChange(Math.max(0, Number(event.target.value) || 0))} /></Field>;
}
export function CheckField({ label, checked, onChange, disabled = false }: { label: string; checked: boolean; onChange: (value: boolean) => void; disabled?: boolean }) {
  return <label className={`flex items-center gap-3 text-sm ${disabled ? "text-muted-foreground" : ""}`}><Checkbox checked={checked} disabled={disabled} onCheckedChange={(value) => onChange(value === true)} />{label}</label>;
}
export function Step({ number, title, children }: { number: number; title: string; children: ReactNode }) {
  return <section className="space-y-5 border-t border-border py-7"><h2 className="flex items-center gap-3 text-lg font-semibold"><span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border text-sm text-muted-foreground">{number}</span>{title}</h2>{children}</section>;
}