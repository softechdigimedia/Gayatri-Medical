import {
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  CircleSlash,
  RotateCcw,
  UserX,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Tone = "info" | "success" | "warning" | "destructive" | "muted";

const TONES: Record<Tone, string> = {
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning",
  destructive: "bg-destructive-soft text-destructive",
  muted: "bg-muted text-muted-foreground",
};

const MAP: Record<string, { label: string; tone: Tone; icon: LucideIcon }> = {
  pending: { label: "Pending", tone: "warning", icon: CalendarClock },
  confirmed: { label: "Confirmed", tone: "info", icon: BadgeCheck },
  completed: { label: "Completed", tone: "success", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", tone: "destructive", icon: XCircle },
  no_show: { label: "No-show", tone: "muted", icon: UserX },
  paid: { label: "Paid", tone: "success", icon: CircleDollarSign },
  unpaid: { label: "Pay at clinic", tone: "warning", icon: CircleSlash },
  refunded: { label: "Refunded", tone: "info", icon: RotateCcw },
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const meta = MAP[status] ?? { label: status, tone: "muted" as Tone, icon: CircleSlash };
  const Icon = meta.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONES[meta.tone],
        className,
      )}
    >
      <Icon aria-hidden className="size-3.5" />
      {meta.label}
    </span>
  );
}
