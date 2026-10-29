import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarClock, CalendarDays, CalendarX2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/clinic/EmptyState";
import { MANAGEMENT_NAV, StaffShell } from "@/components/clinic/StaffShell";
import { StatusBadge } from "@/components/clinic/StatusBadge";
import { DateStrip, SlotGrid } from "@/components/clinic/SlotPicker";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import {
  bookingErrorMessage,
  doctorsQuery,
  formatMoney,
  formatTime,
  rescheduleAppointment,
  toDateKey,
} from "@/lib/clinic";
import { APPOINTMENT_STATUSES, useEffectiveRole } from "@/lib/staff";

export const Route = createFileRoute("/_authenticated/manage/")({
  head: () => ({
    meta: [
      { title: "Appointments — Management | Aarogya Care" },
      { name: "description", content: "Manage clinic appointments, statuses and rescheduling." },
      { property: "og:title", content: "Appointments — Management | Aarogya Care" },
      { property: "og:description", content: "Manage clinic appointments, statuses and rescheduling." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ManageAppointments,
});

function ManageAppointments() {
  const { canManage, loading } = useEffectiveRole();
  return (
    <StaffShell area="Management" nav={MANAGEMENT_NAV} title="Appointments" allowed={canManage} loading={loading}>
      <AppointmentsBoard />
    </StaffShell>
  );
}

function AppointmentsBoard() {
  const qc = useQueryClient();
  const [date, setDate] = useState(toDateKey(new Date()));
  const [doctor, setDoctor] = useState("all");
  const [status, setStatus] = useState("all");
  const [moving, setMoving] = useState<{ id: string; doctorId: string } | null>(null);
  const { data: doctors } = useQuery(doctorsQuery);

  const list = useQuery({
    queryKey: ["manage-appointments", date, doctor, status],
    queryFn: async () => {
      let q = supabase
        .from("appointments")
        .select("*, doctors(full_name, specialty), patients(full_name, phone), payments(status, method)")
        .order("start_time");
      if (date) q = q.eq("appointment_date", date);
      if (doctor !== "all") q = q.eq("doctor_id", doctor);
      if (status !== "all") q = q.eq("status", status);
      const { data, error } = await q.limit(200);
      if (error) throw error;
      return data;
    },
  });

  const setStatusMut = useMutation({
    mutationFn: async ({ id, next }: { id: string; next: string }) => {
      const { error } = await supabase.from("appointments").update({ status: next }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Status updated");
      void qc.invalidateQueries({ queryKey: ["manage-appointments"] });
      void qc.invalidateQueries({ queryKey: ["slots"] });
    },
    onError: (e: Error) => toast.error(bookingErrorMessage(e.message)),
  });

  return (
    <div className="space-y-5">
      <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <Label htmlFor="m-date">Date</Label>
          <Input id="m-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Doctor</Label>
          <Select value={doctor} onValueChange={setDoctor}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All doctors</SelectItem>
              {doctors?.map((d) => (
                <SelectItem key={d.id} value={d.id}>{d.full_name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {APPOINTMENT_STATUSES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {list.isPending ? (
        <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
      ) : list.isError ? (
        <p role="alert" className="rounded-lg bg-destructive-soft px-4 py-3 text-sm text-destructive">Could not load appointments.</p>
      ) : list.data.length === 0 ? (
        <EmptyState icon={CalendarX2} title="No appointments" description="Nothing matches these filters. Try another date or doctor." />
      ) : (
        <div className="overflow-x-auto rounded-xl border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Patient</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.data.map((a) => {
                const pay = Array.isArray(a.payments) ? a.payments[0] : a.payments;
                const locked = a.status === "cancelled" || a.status === "completed";
                return (
                  <tr key={a.id} className="border-b last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="font-medium">{formatTime(a.start_time)}</div>
                      <div className="text-xs text-muted-foreground">{a.booking_ref}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium">{a.patients?.full_name}</div>
                      <div className="text-xs text-muted-foreground">{a.patients?.phone}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{a.doctors?.full_name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{a.appointment_type}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {pay ? <StatusBadge status={pay.status} /> : null}
                        <span className="text-xs text-muted-foreground">{formatMoney(a.total)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Select value={a.status} onValueChange={(next) => setStatusMut.mutate({ id: a.id, next })}>
                        <SelectTrigger className="h-9 w-36" aria-label="Change status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {APPOINTMENT_STATUSES.map((s) => (
                            <SelectItem key={s} value={s} className="capitalize">{s.replace("_", " ")}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" disabled={locked} onClick={() => setMoving({ id: a.id, doctorId: a.doctor_id })}>
                        Reschedule
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {moving ? <RescheduleDialog appt={moving} onClose={() => setMoving(null)} /> : null}
    </div>
  );
}

function RescheduleDialog({ appt, onClose }: { appt: { id: string; doctorId: string }; onClose: () => void }) {
  const qc = useQueryClient();
  const [date, setDate] = useState(toDateKey(new Date()));
  const [time, setTime] = useState<string | null>(null);
  const mut = useMutation({
    mutationFn: () => {
      if (!time) throw new Error("Choose a time slot first.");
      return rescheduleAppointment(appt.id, date, time);
    },
    onSuccess: () => {
      toast.success("Appointment moved");
      void qc.invalidateQueries({ queryKey: ["manage-appointments"] });
      void qc.invalidateQueries({ queryKey: ["slots"] });
      onClose();
    },
    onError: (e: Error) => toast.error(bookingErrorMessage(e.message)),
  });
  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>Reschedule appointment</DialogTitle></DialogHeader>
        <DateStrip selected={date} onSelect={(d) => { setDate(d); setTime(null); }} />
        <SlotGrid doctorId={appt.doctorId} date={date} selected={time} onSelect={setTime} />
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button disabled={!time || mut.isPending} onClick={() => mut.mutate()}>Move appointment</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
