import { Link } from "@tanstack/react-router";
import { CalendarClock, CalendarDays, LayoutDashboard, Loader2, ShieldAlert, type LucideIcon, UserRoundCog } from "lucide-react";
import type { ReactNode } from "react";

import { EmptyState } from "@/components/clinic/EmptyState";
import { SiteHeader } from "@/components/clinic/SiteHeader";
import { Button } from "@/components/ui/button";

export type StaffNavItem = { to: string; label: string; icon: LucideIcon };

export const MANAGEMENT_NAV: StaffNavItem[] = [
  { to: "/manage", label: "Appointments", icon: CalendarDays },
  { to: "/manage/schedules", label: "Doctor slots", icon: CalendarClock },
];

export const ADMIN_NAV: StaffNavItem[] = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard },
  { to: "/admin/accounts", label: "Accounts & roles", icon: UserRoundCog },
  { to: "/admin/clinics", label: "Clinics & doctors", icon: CalendarDays },
  { to: "/admin/settings", label: "Booking settings", icon: CalendarClock },
];

export function StaffShell({
  area,
  nav,
  title,
  allowed,
  loading,
  denied,
  children,
}: {
  area: string;
  nav: StaffNavItem[];
  title: string;
  allowed: boolean;
  loading: boolean;
  denied?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30">
      <SiteHeader />
      <div className="section grid flex-1 gap-8 py-8 lg:grid-cols-[220px_1fr]">
        <nav aria-label={area} className="flex gap-1 overflow-x-auto lg:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:block">
            {area}
          </p>
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: true }}
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-primary-soft font-semibold text-primary" }}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0">
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <div className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16 text-muted-foreground">
                <Loader2 aria-hidden className="size-6 animate-spin" />
              </div>
            ) : allowed ? (
              children
            ) : (
              (denied ?? (
                <EmptyState
                  icon={ShieldAlert}
                  title="You don't have access to this area"
                  description="Ask an administrator to give your account the right role."
                  action={
                    <Button asChild variant="outline">
                      <Link to="/">Back to home</Link>
                    </Button>
                  }
                />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
