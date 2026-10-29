import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarClock, CalendarOff, Coffee, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/clinic/EmptyState";
import { MANAGEMENT_NAV, StaffShell } from "@/components/clinic/StaffShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { formatTime } from "@/lib/clinic";
import { useEffectiveRole } from "@/lib/staff";

type ScheduleRow = {
  id: string;
  doctor_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  slot_minutes: number;
  is_active: boolean;
};

type BreakRow = { id: string; doctor_id: string; weekday: number; start_time: string; end_time: string; label: string | null };
type LeaveRow = { id: string; doctor_id: string; start_date: string; end_date: string; reason: string | null };

export const Route = createFileRoute("/_authenticated/manage/schedules")({
  head: () => ({
    meta: [
      { title: "Doctor slots — Management | Aarogya Care" },
      { name: "description", content: "Set doctor working hours, breaks and leave." },
      { property: "og:title", content: "Doctor slots — Management | Aarogya Care" },
      { property: "og:description", content: "Set doctor working hours, breaks and leave." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SchedulesPage,
});

function SchedulesPage() {
  const { canManage, loading } = useEffectiveRole();
  return (
    <StaffShell area="Management" nav={MANAGEMENT_NAV} title="Doctor slots" allowed={canManage} loading={loading}>
      <ScheduleEditor />
    </StaffShell>
  );
}

function ScheduleEditor() {
  const qc = useQueryClient();
  const [doctorId, setDoctorId] = useState("");
  const [weekday, setWeekday] = useState("1");
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("17:00");
  const [slot, setSlot] = useState("30");
  const [breakStart, setBreakStart] = useState("13:00");
  const [breakEnd, setBreakEnd] = useState("14:00");
  const [breakLabel, setBreakLabel] = useState("Break");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  const doctors = useQuery({
    queryKey: ["manage-doctors"],
    queryFn: async () => {
      const { data, error } = await supabase.from("doctors").select("id, full_name, specialty").order("full_name");
      if (error) throw error;
      return data;
    },
  });
  const schedules = useQuery({
    queryKey: ["manage-schedules", doctorId],
    enabled: Boolean(doctorId),
    queryFn: async () => {
      const [{ data: schedule, error: se }, { data: breaks, error: be }, { data: leave, error: le }] = await Promise.all([
        supabase.from("doctor_schedules").select("*").eq("doctor_id", doctorId).order("weekday"),
        supabase.from("doctor_breaks").select("*").eq("doctor_id", doctorId).order("weekday"),
        supabase.from("doctor_leave").select("*").eq("doctor_id", doctorId).order("start_date", { ascending: false }),
      ]);
      if (se) throw se;
      if (be) throw be;
      if (le) throw le;
      return { schedule: schedule as ScheduleRow[], breaks: breaks as BreakRow[], leave: leave as LeaveRow[] };
    },
  });
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["manage-schedules"] });
    void qc.invalidateQueries({ queryKey: ["slots"] });
    void qc.invalidateQueries({ queryKey: ["next-slot"] });
  };

  const saveSchedule = useMutation({
    mutationFn: async () => {
      if (!doctorId) throw new Error("Choose a doctor first.");
      const row = schedules.data?.schedule.find((s) => s.weekday === Number(weekday));
      const change = { doctor_id: doctorId, weekday: Number(weekday), start_time: start, end_time: end, slot_minutes: Number(slot), is_active: true };
      const request = row
        ? supabase.from("doctor_schedules").update(change).eq("id", row.id)
        : supabase.from("doctor_schedules").insert(change);
      const { error } = await request;
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Working hours saved"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const saveBreak = useMutation({
    mutationFn: async () => {
      if (!doctorId) throw new Error("Choose a doctor first.");
      const { error } = await supabase.from("doctor_breaks").insert({ doctor_id: doctorId, weekday: Number(weekday), start_time: breakStart, end_time: breakEnd, label: breakLabel });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Break added"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const saveLeave = useMutation({
    mutationFn: async () => {
      if (!doctorId || !leaveStart || !leaveEnd) throw new Error("Choose a doctor and leave dates.");
      const { error } = await supabase.from("doctor_leave").insert({ doctor_id: doctorId, start_date: leaveStart, end_date: leaveEnd, reason: leaveReason || null });
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Leave added"); setLeaveStart(""); setLeaveEnd(""); setLeaveReason(""); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async ({ table, id }: { table: "doctor_schedules" | "doctor_breaks" | "doctor_leave"; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Schedule entry removed"); refresh(); },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="space-y-5">
      <div className="max-w-xl space-y-2">
        <Label>Doctor</Label>
        <Select value={doctorId} onValueChange={setDoctorId}>
          <SelectTrigger><SelectValue placeholder="Choose a doctor" /></SelectTrigger>
          <SelectContent>{doctors.data?.map((d) => <SelectItem key={d.id} value={d.id}>{d.full_name} · {d.specialty}</SelectItem>)}</SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="hours">
        <TabsList>
          <TabsTrigger value="hours"><CalendarClock aria-hidden className="mr-2 size-4" />Working hours</TabsTrigger>
          <TabsTrigger value="breaks"><Coffee aria-hidden className="mr-2 size-4" />Breaks</TabsTrigger>
          <TabsTrigger value="leave"><CalendarOff aria-hidden className="mr-2 size-4" />Leave</TabsTrigger>
        </TabsList>
        <TabsContent value="hours" className="space-y-4">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2"><Label>Weekday</Label><Select value={weekday} onValueChange={setWeekday}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,i)=><SelectItem key={d} value={String(i+1)}>{d}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="hours-start">Start</Label><Input id="hours-start" type="time" value={start} onChange={(e)=>setStart(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="hours-end">End</Label><Input id="hours-end" type="time" value={end} onChange={(e)=>setEnd(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="slot-minutes">Slot length (min)</Label><Input id="slot-minutes" type="number" min={10} max={180} step={5} value={slot} onChange={(e)=>setSlot(e.target.value)} /></div>
            <div className="flex items-end"><Button onClick={()=>saveSchedule.mutate()} disabled={!doctorId || saveSchedule.isPending}>Save hours</Button></div>
          </div>
          <div className="space-y-2">{schedules.isPending && doctorId ? <Skeleton className="h-16 w-full"/> : schedules.data?.schedule.map((s)=><div key={s.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm"><span className="font-medium">{["","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][s.weekday]} · {formatTime(s.start_time)}–{formatTime(s.end_time)} · {s.slot_minutes} min</span><Button size="icon" variant="ghost" aria-label="Remove working hours" onClick={()=>remove.mutate({table:"doctor_schedules",id:s.id})}><Trash2 aria-hidden className="size-4"/></Button></div>)}</div>
        </TabsContent>
        <TabsContent value="breaks" className="space-y-4">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="space-y-2"><Label>Weekday</Label><Select value={weekday} onValueChange={setWeekday}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"].map((d,i)=><SelectItem key={d} value={String(i+1)}>{d}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="break-start">Start</Label><Input id="break-start" type="time" value={breakStart} onChange={(e)=>setBreakStart(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="break-end">End</Label><Input id="break-end" type="time" value={breakEnd} onChange={(e)=>setBreakEnd(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="break-label">Label</Label><Input id="break-label" value={breakLabel} onChange={(e)=>setBreakLabel(e.target.value)} /></div>
            <div className="flex items-end"><Button onClick={()=>saveBreak.mutate()} disabled={!doctorId || saveBreak.isPending}>Add break</Button></div>
          </div>
          <div className="space-y-2">{schedules.data?.breaks.map((b)=><div key={b.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm"><span>{["","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"][b.weekday]} · {formatTime(b.start_time)}–{formatTime(b.end_time)} · {b.label}</span><Button size="icon" variant="ghost" aria-label="Remove break" onClick={()=>remove.mutate({table:"doctor_breaks",id:b.id})}><Trash2 aria-hidden className="size-4"/></Button></div>)}</div>
        </TabsContent>
        <TabsContent value="leave" className="space-y-4">
          <div className="grid gap-4 rounded-lg border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2"><Label htmlFor="leave-start">First day</Label><Input id="leave-start" type="date" value={leaveStart} onChange={(e)=>setLeaveStart(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="leave-end">Last day</Label><Input id="leave-end" type="date" value={leaveEnd} onChange={(e)=>setLeaveEnd(e.target.value)} /></div>
            <div className="space-y-2"><Label htmlFor="leave-reason">Reason</Label><Textarea id="leave-reason" value={leaveReason} onChange={(e)=>setLeaveReason(e.target.value)} /></div>
            <div className="flex items-end"><Button onClick={()=>saveLeave.mutate()} disabled={!doctorId || saveLeave.isPending}>Add leave</Button></div>
          </div>
          {schedules.data?.leave.length ? <div className="space-y-2">{schedules.data.leave.map((l)=><div key={l.id} className="flex items-center justify-between gap-3 rounded-lg border bg-card px-4 py-3 text-sm"><span>{l.start_date}–{l.end_date}{l.reason ? ` · ${l.reason}` : ""}</span><Button size="icon" variant="ghost" aria-label="Remove leave" onClick={()=>remove.mutate({table:"doctor_leave",id:l.id})}><Trash2 aria-hidden className="size-4"/></Button></div>)}</div> : doctorId ? <EmptyState icon={CalendarOff} title="No planned leave" description="Add time off to prevent appointments during these dates."/> : null}
        </TabsContent>
      </Tabs>
    </div>
  );
}