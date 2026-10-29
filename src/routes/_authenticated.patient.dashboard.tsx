import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CalendarDays, CalendarPlus } from "lucide-react";

import { EmptyState } from "@/components/clinic/EmptyState";
import { PatientShell } from "@/components/clinic/PatientShell";
import { StatusBadge } from "@/components/clinic/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  formatDateLong,
  formatTime,
  myAppointmentsQuery,
  myNotificationsQuery,
  myProfileQuery,
  toDateKey,
} from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/patient/dashboard")({
  head: () => ({
    meta: [
      { title: "My dashboard — Aarogya Care" },
      { name: "description", content: "Your upcoming appointments and updates at Aarogya Care." },
      { property: "og:title", content: "My dashboard — Aarogya Care" },
      { property: "og:description", content: "Upcoming visits, reminders and updates." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const profile = useQuery(myProfileQuery);
  const appts = useQuery(myAppointmentsQuery);
  const notes = useQuery(myNotificationsQuery);
  const today = toDateKey(new Date());
  const upcoming = (appts.data ?? [])
    .filter((a) => a.appointment_date >= today && ["pending", "confirmed"].includes(a.status))
    .reverse()
    .slice(0, 3);
  const name = profile.data?.full_name?.split(" ")[0];

  return (
    <PatientShell title={name ? `Hello, ${name}` : "Your dashboard"}>
      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section aria-labelledby="up" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 id="up" className="font-semibold">Upcoming appointments</h2>
            <Button asChild size="sm">
              <Link to="/booking">
                <CalendarPlus aria-hidden /> Book new
              </Link>
            </Button>
          </div>
          {appts.isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : upcoming.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No upcoming visits"
              description="When you book an appointment it will appear here."
              action={<Button asChild><Link to="/doctors">Find a doctor</Link></Button>}
            />
          ) : (
            upcoming.map((a) => (
              <div key={a.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-card">
                <div>
                  <p className="font-semibold">{a.doctors?.full_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDateLong(a.appointment_date)} · {formatTime(a.start_time)} · {a.clinics?.name}
                  </p>
                </div>
                <StatusBadge status={a.status} />
              </div>
            ))
          )}
          <Link to="/patient/appointments" className="inline-block text-sm font-medium text-primary hover:underline">
            View all appointments
          </Link>
        </section>
        <section aria-labelledby="nt" className="rounded-xl border bg-card p-5 shadow-card">
          <h2 id="nt" className="flex items-center gap-2 font-semibold">
            <Bell aria-hidden className="size-4" /> Updates
          </h2>
          <ul className="mt-3 space-y-3 text-sm">
            {(notes.data ?? []).slice(0, 6).map((n) => (
              <li key={n.id} className="border-b pb-3 last:border-0">
                <p className="font-medium">{n.title}</p>
                <p className="text-muted-foreground">{n.body}</p>
              </li>
            ))}
            {notes.data?.length === 0 ? <li className="text-muted-foreground">No updates yet.</li> : null}
          </ul>
        </section>
      </div>
    </PatientShell>
  );
}
