import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/clinic/EmptyState";
import { PatientShell } from "@/components/clinic/PatientShell";
import { DateStrip, SlotGrid } from "@/components/clinic/SlotPicker";
import { StatusBadge } from "@/components/clinic/StatusBadge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  bookingErrorMessage,
  cancelAppointment,
  formatDateLong,
  formatMoney,
  formatTime,
  myAppointmentsQuery,
  rescheduleAppointment,
  toDateKey,
} from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/patient/appointments")({
  head: () => ({
    meta: [
      { title: "My appointments — Aarogya Care" },
      { name: "description", content: "View, cancel or reschedule your Aarogya Care appointments." },
      { property: "og:title", content: "My appointments — Aarogya Care" },
      { property: "og:description", content: "Manage your upcoming and past visits." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AppointmentsPage,
});

function AppointmentsPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery(myAppointmentsQuery);
  const [tab, setTab] = useState("upcoming");
  const [moving, setMoving] = useState<{ id: string; doctorId: string } | null>(null);
  const [date, setDate] = useState(toDateKey(new Date()));
  const [time, setTime] = useState<string | null>(null);
  const today = toDateKey(new Date());

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["my-appointments"] });
    qc.invalidateQueries({ queryKey: ["slots"] });
  };
  const cancel = useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => { toast.success("Appointment cancelled. The slot has been released."); refresh(); },
    onError: (e: Error) => toast.error(bookingErrorMessage(e.message)),
  });
  const move = useMutation({
    mutationFn: () => rescheduleAppointment(moving!.id, date, time!),
    onSuccess: () => { toast.success("Appointment rescheduled."); setMoving(null); refresh(); },
    onError: (e: Error) => toast.error(bookingErrorMessage(e.message)),
  });

  const rows = (data ?? []).filter((a) => {
    const active = ["pending", "confirmed"].includes(a.status) && a.appointment_date >= today;
    return tab === "upcoming" ? active : !active;
  });

  return (
    <PatientShell title="My appointments">
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="mt-4 space-y-3">
        {isLoading ? (
          <Skeleton className="h-28 w-full" />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title={tab === "upcoming" ? "No upcoming appointments" : "No past appointments"}
            description="Book a consultation with one of our specialists."
            action={<Button asChild><Link to="/booking">Book appointment</Link></Button>}
          />
        ) : (
          rows.map((a) => (
            <article key={a.id} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Booking {a.booking_ref}</p>
                  <h2 className="font-semibold">{a.doctors?.full_name}</h2>
                  <p className="text-sm text-muted-foreground">{a.doctors?.specialty}</p>
                  <p className="mt-2 text-sm">
                    {formatDateLong(a.appointment_date)} · {formatTime(a.start_time)} ·{" "}
                    {a.appointment_type === "online" ? "Online" : a.clinics?.name}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <StatusBadge status={a.status} />
                  {a.payments?.[0] ? <StatusBadge status={a.payments[0].status} /> : null}
                  <span className="text-sm font-semibold">{formatMoney(Number(a.total))}</span>
                </div>
              </div>
              {tab === "upcoming" ? (
                <div className="mt-4 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => { setMoving({ id: a.id, doctorId: a.doctor_id }); setTime(null); }}
                  >
                    Reschedule
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                    disabled={cancel.isPending}
                    onClick={() => { if (confirm("Cancel this appointment?")) cancel.mutate(a.id); }}
                  >
                    Cancel
                  </Button>
                </div>
              ) : null}
            </article>
          ))
        )}
      </div>

      <Dialog open={!!moving} onOpenChange={(o) => !o && setMoving(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Choose a new time</DialogTitle>
          </DialogHeader>
          {moving ? (
            <div className="space-y-4">
              <DateStrip selected={date} onSelect={(d) => { setDate(d); setTime(null); }} />
              <SlotGrid doctorId={moving.doctorId} date={date} selected={time} onSelect={setTime} />
            </div>
          ) : null}
          <DialogFooter>
            <Button disabled={!time || move.isPending} onClick={() => move.mutate()}>
              Confirm new time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientShell>
  );
}
