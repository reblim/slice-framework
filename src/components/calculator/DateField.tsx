import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { calendarISO } from "@/lib/quick-estimate";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseISODate(value: string): Date | undefined {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    return undefined;
  }
  return date;
}

function formatPickerDate(value: string) {
  const date = parseISODate(value);
  if (!date) return "Choose a date";
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function DateField({
  id,
  label,
  value,
  onChange,
  className,
}: {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = parseISODate(value);
  const text = formatPickerDate(value);
  const choose = (date: Date) => {
    onChange(calendarISO(date));
    setOpen(false);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          aria-label={`${label}: ${text}`}
          className={cn("w-full justify-start px-3 font-normal", className)}
        >
          <CalendarIcon />
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        onOpenAutoFocus={(event) => {
          const content = event.currentTarget as HTMLElement;
          const day =
            content.querySelector<HTMLElement>("[data-selected-single='true']") ??
            content.querySelector<HTMLElement>(".rdp-today button");
          if (!day) return;
          event.preventDefault();
          day.focus();
        }}
      >
        <Calendar
          mode="single"
          required
          selected={selected}
          weekStartsOn={1}
          onSelect={choose}
          modifiers={{ weekend: { dayOfWeek: [0, 6] } }}
          modifiersClassNames={{ weekend: "calc-date-weekend" }}
        />
        <div className="border-t border-border p-2">
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => choose(new Date())}
          >
            Today
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
