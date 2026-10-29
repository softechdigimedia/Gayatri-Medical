import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Hospital, Stethoscope, UserRoundCog } from "lucide-react";

import { StaffShell, ADMIN_NAV } from "@/components/clinic/StaffShell";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/lib/staff";

export const Route = createFileRoute("/_authenticated/admin/")({
  head: () => ({ meta: [
    { title: "Administration — Aarogya Care" },
    { name: "description", content: "Clinic administration overview and operating controls." },
    { property: "og:title", content: "Administration — Aarogya Care" },
    { property: "og:description", content: "Clinic administration overview and operating controls." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AdminOverview,
});

function AdminOverview() {
  const { isAdmin, loading } = useRoles();
  const counts = useQuery({
    queryKey: ["admin-overview"],
    enabled: isAdmin,
    queryFn: async () => {
      const [clinics, doctors, appointments, users] = await Promise.all([
        supabase.from("clinics").select("id", { count: "exact", head: true }),
        supabase.from("doctors").select("id", { count: "exact", head: true }),
        supabase.from("appointments").select("id", { count: "exact", head: true }),
        supabase.from("user_roles").select("user_id", { count: "exact", head: true }),
      ]);
      const error = clinics.error ?? doctors.error ?? appointments.error ?? users.error;
      if (error) throw error;
      return { clinics: clinics.count ?? 0, doctors: doctors.count ?? 0, appointments: appointments.count ?? 0, users: users.count ?? 0 };
    },
  });
  const items = [
    { name: "Clinics", key: "clinics" as const, icon: Hospital, to: "/admin/clinics" as const },
    { name: "Doctors", key: "doctors" as const, icon: Stethoscope, to: "/admin/clinics" as const },
    { name: "Appointments", key: "appointments" as const, icon: CalendarDays, to: "/manage" as const },
    { name: "Accounts with roles", key: "users" as const, icon: UserRoundCog, to: "/admin/accounts" as const },
  ];

  return (
    <StaffShell area="Administration" nav={ADMIN_NAV} title="Administration" allowed={isAdmin} loading={loading}>
      <div className="space-y-7">
        <section aria-label="Clinic totals" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map(({ name, key, icon: Icon, to }) => (
            <Link key={key} to={to} className="group flex min-h-28 items-center justify-between gap-3 border-b bg-card px-4 py-5 transition-colors hover:bg-muted/40">
              <div className="flex items-center gap-3">
                <span className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary"><Icon aria-hidden className="size-5" /></span>
                <div><p className="text-sm text-muted-foreground">{name}</p>{counts.isPending ? <Skeleton className="mt-2 h-6 w-16" /> : <p className="font-display text-2xl font-semibold">{counts.data?.[key] ?? "—"}</p>}</div>
              </div>
              <ArrowRight aria-hidden className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </section>
        {counts.isError ? <p role="alert" className="text-sm text-destructive">Could not load clinic totals.</p> : null}
        <section className="border-t pt-6">
          <h2 className="font-display text-lg font-semibold">Administration</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage access, clinic records, doctor listings and booking rules.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button asChild variant="outline"><Link to="/admin/accounts">Accounts & roles</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/clinics">Clinics & doctors</Link></Button>
            <Button asChild variant="outline"><Link to="/admin/settings">Booking settings</Link></Button>
          </div>
        </section>
      </div>
    </StaffShell>
  );
}