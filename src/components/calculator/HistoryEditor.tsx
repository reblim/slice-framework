import { useRef, useState } from "react";
import { Plus, Upload, ClipboardPaste, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { comparableHistory, parseHistory, type Slice } from "@/lib/calculator";
import {
  blankHistoryRow,
  HISTORY_COLUMNS,
  historyCsv,
  importHistory,
  type HistoryDraft,
} from "@/lib/calculator-inputs";
import { DateField } from "./DateField";
import { Label } from "./Fields";

const labels = [
  "Slice",
  "Size",
  "Work type",
  "Mode",
  "Context",
  "Started",
  "Accepted",
  "Review wait h",
  "Decision wait h",
];
export function HistoryEditor({
  rows,
  setRows,
  slice,
  lastChange,
  matchLeverage,
}: {
  rows: HistoryDraft[];
  setRows: (rows: HistoryDraft[]) => void;
  slice: Slice;
  lastChange: string;
  matchLeverage: boolean;
}) {
  const [pasteOpen, setPasteOpen] = useState(false);
  const [paste, setPaste] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const extras = Array.from(
    new Set(
      rows.flatMap((row) =>
        Object.keys(row).filter((key) => !HISTORY_COLUMNS.some((column) => column === key)),
      ),
    ),
  );
  const columns = [...HISTORY_COLUMNS, ...extras];
  const ingest = (text: string) => {
    const result = importHistory(text);
    setError(result.errors.join(" "));
    if (!result.errors.length) {
      setRows([...rows, ...result.rows]);
      setPasteOpen(false);
      setPaste("");
    }
  };
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="calc-history w-full text-sm">
          <thead>
            <tr>
              {columns.map((key, index) => (
                <th key={key}>
                  <Label label={labels[index] ?? (key === "ai_leverage" ? "AI leverage" : key)} />
                </th>
              ))}
              <th>Status</th>
              <th>
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const parsed = parseHistory(historyCsv([row], extras));
              const matches = comparableHistory(parsed, slice, lastChange, matchLeverage);
              const reason = !parsed.rows.length
                ? "Incomplete or invalid"
                : matches.otherClass
                  ? "Other reference class"
                  : matches.beforeChange
                    ? "Before the change"
                    : "Comparable";
              return (
                <tr
                  key={index}
                  className={reason === "Comparable" ? "calc-comparable" : "calc-excluded"}
                >
                  {columns.map((key, col) => (
                    <td key={key}>
                      {key === "started" || key === "accepted" ? (
                        <DateField
                          label={`Row ${index + 1} ${labels[col] ?? key}`}
                          value={row[key] ?? ""}
                          onChange={(value) =>
                            setRows(
                              rows.map((current, i) =>
                                i === index ? { ...current, [key]: value } : current,
                              ),
                            )
                          }
                          className="h-9 min-w-28 px-2 text-xs"
                        />
                      ) : (
                        <Input
                          aria-label={`Row ${index + 1} ${labels[col] ?? key}`}
                          type="text"
                          inputMode={key.endsWith("_hours") ? "decimal" : undefined}
                          value={row[key] ?? ""}
                          onChange={(event) =>
                            setRows(
                              rows.map((current, i) =>
                                i === index ? { ...current, [key]: event.target.value } : current,
                              ),
                            )
                          }
                          className="h-9 min-w-28 px-2 text-xs"
                        />
                      )}
                    </td>
                  ))}
                  <td className="whitespace-nowrap text-xs">{reason}</td>
                  <td>
                    <Button
                      variant="ghost"
                      size="icon"
                      title={`Remove row ${index + 1}`}
                      aria-label={`Remove row ${index + 1}`}
                      onClick={() => setRows(rows.filter((_, i) => i !== index))}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!rows.length && (
          <p className="p-5 text-sm text-muted-foreground">No finished slices yet.</p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="outline" onClick={() => setRows([...rows, blankHistoryRow()])}>
          <Plus size={16} />
          Add row
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setError("");
            setPasteOpen(true);
          }}
        >
          <ClipboardPaste size={16} />
          Paste from spreadsheet
        </Button>
        <Button variant="outline" onClick={() => fileRef.current?.click()}>
          <Upload size={16} />
          Upload CSV
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv,text/tab-separated-values,.tsv"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (file) {
              try {
                ingest(await file.text());
              } catch {
                setError("This file could not be read.");
              }
            }
            event.target.value = "";
          }}
        />
      </div>
      {error && !pasteOpen && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Dialog open={pasteOpen} onOpenChange={setPasteOpen}>
        <DialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-lg">
          <DialogTitle>Paste from spreadsheet</DialogTitle>
          <DialogDescription>
            Slice · Size · Work type · Mode · Context · Started · Accepted · Review wait h ·
            Decision wait h
          </DialogDescription>
          <Textarea
            aria-label="Spreadsheet rows"
            rows={8}
            value={paste}
            onChange={(event) => setPaste(event.target.value)}
            className="font-mono text-xs"
          />
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button disabled={!paste.trim()} onClick={() => ingest(paste)}>
            Add pasted rows
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
