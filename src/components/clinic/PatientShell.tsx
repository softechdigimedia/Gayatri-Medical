import { Link } from "@tanstack/react-router";
import { CalendarDays, FileText, LayoutDashboard, Pill, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { SiteFooter } from "@/components/clinic/SiteFooter";
import { SiteHeader } from "@/components/clinic/SiteHeader";

const NAV = [
  { to: "/patient/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patient/appointments", label: "Appointments", icon: CalendarDays },
  { to: "/patient/documents", label: "Reports & documents", icon: FileText },
  { to: "/patient/prescriptions", label: "Prescriptions", icon: Pill },
  { to: "/patient/profile", label: "Profile", icon: UserRound },
] as const;

export function PatientShell({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="section grid flex-1 gap-8 py-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="My account" className="flex gap-1 overflow-x-auto lg:flex-col">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-primary-soft font-semibold text-primary" }}
            >
              <Icon aria-hidden className="size-4" />
              {label}
            </Link>
          ))}
        </nav>
        <main>
          <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
          <div className="mt-6">{children}</div>
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}
