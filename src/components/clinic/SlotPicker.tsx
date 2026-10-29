import { useQuery } from "@tanstack/react-query";
import { CalendarX2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatTime, slotsQuery, toDateKey, upcomingDates } from "@/lib/clinic";

const REASON_LABEL: Record<string, string> = {
  booked: "Already booked",
  break: "Doctor on ward round",
  leave: "Doctor on leave",
  holiday: "Clinic holiday",
  past: "Too close to start",
};

export function DateStrip({
  selected,
  onSelect,
  days = 14,
}: {
  selected: string;
  onSelect: (date: string) => void;
  days?: number;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Appointment date"
      className="flex gap-2 overflow-x-auto pb-2"
    >
      {upcomingDates(days).map((date) => {
        const key = toDateKey(date);
        const active = key === selected;
        return (
          <button
            key={key}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onSelect(key)}
            className={cn(
              "flex min-w-[4.5rem] flex-col items-center rounded-lg border px-3 py-2.5 text-sm transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "bg-card hover:border-primary/40 hover:bg-secondary",
            )}
          >
            <span className="text-xs uppercase tracking-wide opacity-80">
              {date.toLocaleDateString("en-IN", { weekday: "short" })}
            </span>
            <span className="font-display text-lg font-semibold">{date.getDate()}</span>
            <span className="text-[0.65rem] uppercase opacity-80">
              {date.toLocaleDateString("en-IN", { month: "short" })}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function SlotGrid({
  doctorId,
  date,
  selected,
  onSelect,
}: {
  doctorId: string;
  date: string;
  selected: string | null;
  onSelect: (time: string) => void;
}) {
  const { data: slots, isPending, isError } = useQuery(slotsQuery(doctorId, date));

  if (isPending) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-11 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p role="alert" className="rounded-lg bg-destructive-soft px-4 py-3 text-sm text-destructive">
        We could not load availability. Please try another date.
      </p>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed px-4 py-6 text-sm text-muted-foreground">
        <CalendarX2 aria-hidden className="size-5" />
        The doctor does not hold consultations on this day. Please choose another date.
      </div>
    );
  }

  return (
    <div>
      <div
        role="radiogroup"
        aria-label="Available time slots"
        className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5"
      >
        {slots.map((slot) => {
          const active = selected === slot.slot_time;
          return (
            <button
              key={slot.slot_time}
              type="button"
              role="radio"
              aria-checked={active}
              disabled={!slot.is_available}
              title={slot.is_available ? undefined : REASON_LABEL[slot.reason]}
              onClick={() => onSelect(slot.slot_time)}
              className={cn(
                "rounded-lg border px-2 py-2.5 text-sm font-medium transition-colors",
                active && "border-primary bg-primary text-primary-foreground",
                !active && slot.is_available && "bg-card hover:border-primary/40 hover:bg-secondary",
                !slot.is_available &&
                  "cursor-not-allowed border-dashed bg-muted text-muted-foreground line-through",
              )}
            >
              {formatTime(slot.slot_time)}
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Struck-through times are unavailable — already booked, a break, leave, or a clinic holiday.
      </p>
    </div>
  );
}
