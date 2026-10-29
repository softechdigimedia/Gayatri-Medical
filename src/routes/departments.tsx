import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Stethoscope } from "lucide-react";

import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Skeleton } from "@/components/ui/skeleton";
import { departmentsQuery, doctorsQuery } from "@/lib/clinic";

export const Route = createFileRoute("/departments")({
  head: () => ({
    meta: [
      { title: "Departments — Aarogya Care" },
      {
        name: "description",
        content:
          "General medicine, cardiology, paediatrics, orthopaedics and dermatology at Aarogya Care clinics in Kolkata and Howrah.",
      },
      { property: "og:title", content: "Departments — Aarogya Care" },
      {
        property: "og:description",
        content: "Five specialities, each with its own consulting rooms and day-care support.",
      },
    ],
  }),
  component: DepartmentsPage,
});

function DepartmentsPage() {
  const { data: departments, isPending } = useQuery(departmentsQuery);
  const { data: doctors } = useQuery(doctorsQuery);

  function countFor(slug: string) {
    return ((doctors ?? []) as { departments?: { slug: string } | null }[]).filter(
      (d) => d.departments?.slug === slug,
    ).length;
  }

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <div className="border-b bg-surface">
        <div className="section py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">Departments</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Each department runs daily clinics, with shared diagnostics and a single medical record
            across all three branches.
          </p>
        </div>
      </div>

      <div className="section grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)
          : (departments ?? []).map((d) => (
              <article key={d.slug} className="rounded-xl border bg-card p-6 shadow-card">
                <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Stethoscope aria-hidden className="size-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold">{d.name}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
                <p className="mt-4 text-xs font-medium text-muted-foreground">
                  {countFor(d.slug)} specialists
                </p>
                <Link
                  to="/doctors"
                  search={{ department: d.slug, clinic: "all", q: "", type: "all", sort: "rating" }}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                >
                  See doctors <ArrowRight aria-hidden className="size-4" />
                </Link>
              </article>
            ))}
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
