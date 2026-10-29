import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ADMIN_NAV, StaffShell } from "@/components/clinic/StaffShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { useRoles } from "@/lib/staff";

type BookingRules = { slot_minutes: number; min_advance_minutes: number; cancellation_window_hours: number; tax_rate: number; max_days_ahead: number };
const DEFAULT_RULES: BookingRules = { slot_minutes: 30, min_advance_minutes: 60, cancellation_window_hours: 6, tax_rate: 0.18, max_days_ahead: 30 };
const FIELDS: { key: keyof BookingRules; label: string; min: number; max: number; step: number }[] = [
  { key: "slot_minutes", label: "Appointment slot length (minutes)", min: 10, max: 180, step: 5 },
  { key: "min_advance_minutes", label: "Minimum advance notice (minutes)", min: 0, max: 10080, step: 15 },
  { key: "cancellation_window_hours", label: "Cancellation window (hours)", min: 0, max: 720, step: 1 },
  { key: "tax_rate", label: "Tax rate (percent)", min: 0, max: 100, step: 0.1 },
  { key: "max_days_ahead", label: "Maximum days ahead to book", min: 1, max: 365, step: 1 },
];

export const Route = createFileRoute("/_authenticated/admin/settings")({
  head: () => ({ meta: [
    { title: "Booking settings — Administration | Aarogya Care" },
    { name: "description", content: "Configure booking lead times, cancellation rules, tax and appointment duration." },
    { property: "og:title", content: "Booking settings — Administration | Aarogya Care" },
    { property: "og:description", content: "Configure booking lead times, cancellation rules, tax and appointment duration." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: SettingsPage,
});

function SettingsPage() {
  const { isAdmin, loading } = useRoles();
  return <StaffShell area="Administration" nav={ADMIN_NAV} title="Booking settings" allowed={isAdmin} loading={loading}><SettingsEditor/></StaffShell>;
}

function SettingsEditor() {
  const qc = useQueryClient();
  const settings = useQuery({ queryKey: ["admin-booking-rules"], queryFn: async () => {
    const { data, error } = await supabase.from("app_settings").select("value").eq("key", "booking_rules").maybeSingle();
    if (error) throw error;
    return data?.value ?? null;
  }});
  const [form, setForm] = useState<BookingRules>(DEFAULT_RULES);
  useEffect(() => {
    const raw = settings.data;
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
    const record = raw as Record<string, Json>;
    setForm({
      slot_minutes: typeof record["slot_minutes"] === "number" ? record["slot_minutes"] : DEFAULT_RULES.slot_minutes,
      min_advance_minutes: typeof record["min_advance_minutes"] === "number" ? record["min_advance_minutes"] : DEFAULT_RULES.min_advance_minutes,
      cancellation_window_hours: typeof record["cancellation_window_hours"] === "number" ? record["cancellation_window_hours"] : DEFAULT_RULES.cancellation_window_hours,
      tax_rate: typeof record["tax_rate"] === "number" ? record["tax_rate"] * 100 : DEFAULT_RULES.tax_rate * 100,
      max_days_ahead: typeof record["max_days_ahead"] === "number" ? record["max_days_ahead"] : DEFAULT_RULES.max_days_ahead,
    });
  }, [settings.data]);
  const save = useMutation({ mutationFn: async () => {
    const value: BookingRules = { ...form, tax_rate: form.tax_rate / 100 };
    const { error } = await supabase.from("app_settings").upsert({ key: "booking_rules", value }, { onConflict: "key" });
    if (error) throw error;
  }, onSuccess: () => { toast.success("Booking settings saved"); void qc.invalidateQueries({ queryKey: ["admin-booking-rules"] }); }, onError: () => toast.error("Could not save booking settings.") });

  return <div className="max-w-3xl space-y-5">
    <p className="text-sm text-muted-foreground">Changes affect new appointment availability and booking rules.</p>
    {settings.isPending ? <Skeleton className="h-64 w-full"/> : settings.isError ? <p role="alert" className="text-sm text-destructive">Could not load booking settings.</p> : <>
      <div className="grid gap-x-6 gap-y-5 border-y py-5 sm:grid-cols-2">
        {FIELDS.map(({key,label,min,max,step})=><div key={key} className="space-y-2"><Label htmlFor={`setting-${key}`}>{label}</Label><Input id={`setting-${key}`} type="number" min={min} max={max} step={step} value={form[key]} onChange={(event)=>setForm((current)=>({...current,[key]:Number(event.target.value)}))}/></div>)}
      </div>
      <div className="flex items-center justify-between gap-4"><p className="text-xs text-muted-foreground"><Settings2 aria-hidden className="mr-1 inline size-4"/>Tax is entered as a percentage.</p><Button onClick={()=>save.mutate()} disabled={save.isPending}>Save settings</Button></div>
    </>}
  </div>;
}