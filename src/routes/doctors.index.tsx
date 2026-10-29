import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SearchX, Search } from "lucide-react";

import { DoctorCard, DoctorCardSkeleton, type DoctorRow } from "@/components/clinic/DoctorCard";
import { EmptyState } from "@/components/clinic/EmptyState";
import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clinicsQuery, departmentsQuery, doctorsQuery } from "@/lib/clinic";

type DoctorSearch = {
  q?: string;
  department?: string;
  clinic?: string;
  type?: string;
  sort?: string;
};

export const Route = createFileRoute("/doctors/")({
  validateSearch: (search: Record<string, unknown>): DoctorSearch => ({
    q: typeof search["q"] === "string" ? search["q"] : "",
    department: typeof search["department"] === "string" ? search["department"] : "all",
    clinic: typeof search["clinic"] === "string" ? search["clinic"] : "all",
    type: typeof search["type"] === "string" ? search["type"] : "all",
    sort: typeof search["sort"] === "string" ? search["sort"] : "rating",
  }),
  head: () => ({
    meta: [
      { title: "Find a doctor — Aarogya Care" },
      {
        name: "description",
        content:
          "Browse all Aarogya Care specialists by department, branch and consultation type, with live next-available slots.",
      },
      { property: "og:title", content: "Find a doctor — Aarogya Care" },
      {
        property: "og:description",
        content: "Compare specialists, fees and the next open slot across our Kolkata clinics.",
      },
    ],
  }),
  component: DoctorsPage,
  errorComponent: () => (
    <p role="alert" className="section py-20 text-center text-sm text-destructive">
      We could not load the doctor list. Please refresh.
    </p>
  ),
});

type DoctorWithRelations = DoctorRow & {
  languages: string[];
  expertise: string[];
  departments?: { name: string; slug: string } | null;
  clinics?: { name: string; city: string; slug: string } | null;
};

function DoctorsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data, isPending } = useQuery(doctorsQuery);
  const { data: departments } = useQuery(departmentsQuery);
  const { data: clinics } = useQuery(clinicsQuery);

  function update(patch: Partial<DoctorSearch>) {
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  }

  const all = (data ?? []) as unknown as DoctorWithRelations[];
  const term = (search.q ?? "").trim().toLowerCase();

  const filtered = all
    .filter((d) => {
      if (search.department !== "all" && d.departments?.slug !== search.department) return false;
      if (search.clinic !== "all" && d.clinics?.slug !== search.clinic) return false;
      if (search.type === "online" && !d.supports_online) return false;
      if (search.type === "clinic" && !d.supports_clinic) return false;
      if (!term) return true;
      return [d.full_name, d.specialty, d.qualification, ...(d.expertise ?? [])]
        .join(" ")
        .toLowerCase()
        .includes(term);
    })
    .sort((a, b) => {
      if (search.sort === "fee-low") return a.consultation_fee - b.consultation_fee;
      if (search.sort === "fee-high") return b.consultation_fee - a.consultation_fee;
      if (search.sort === "experience") return b.experience_years - a.experience_years;
      return b.rating - a.rating;
    });

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />

      <div className="border-b bg-surface">
        <div className="section py-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">Find a doctor</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {all.length} specialists across Salt Lake, Ballygunge and Howrah. Availability updates
            as appointments are booked.
          </p>
        </div>
      </div>

      <div className="section grid gap-8 py-10 lg:grid-cols-[17rem_1fr]">
        <aside className="space-y-5 self-start rounded-xl border bg-card p-5 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-base font-semibold">Filters</h2>

          <div className="space-y-2">
            <Label htmlFor="doctor-search">Search</Label>
            <div className="relative">
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                id="doctor-search"
                value={search.q}
                onChange={(event) => update({ q: event.target.value })}
                placeholder="Name or condition"
                className="pl-9"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Department</Label>
            <Select value={search.department ?? "all"} onValueChange={(v) => update({ department: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All departments</SelectItem>
                {(departments ?? []).map((d) => (
                  <SelectItem key={d.slug} value={d.slug}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Branch</Label>
            <Select value={search.clinic ?? "all"} onValueChange={(v) => update({ clinic: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All branches</SelectItem>
                {(clinics ?? []).map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Consultation type</Label>
            <Select value={search.type ?? "all"} onValueChange={(v) => update({ type: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any type</SelectItem>
                <SelectItem value="clinic">In clinic</SelectItem>
                <SelectItem value="online">Online</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sort by</Label>
            <Select value={search.sort ?? "rating"} onValueChange={(v) => update({ sort: v })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest rated</SelectItem>
                <SelectItem value="experience">Most experienced</SelectItem>
                <SelectItem value="fee-low">Fee: low to high</SelectItem>
                <SelectItem value="fee-high">Fee: high to low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            className="w-full"
            onClick={() =>
              update({ q: "", department: "all", clinic: "all", type: "all", sort: "rating" })
            }
          >
            Clear filters
          </Button>
        </aside>

        <main>
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            {isPending ? "Loading doctors…" : `${filtered.length} doctors match your filters`}
          </p>
          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <DoctorCardSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={SearchX}
              title="No doctors match these filters"
              description="Try widening the department or branch, or clear the filters to see everyone."
              action={
                <Button
                  onClick={() =>
                    update({ q: "", department: "all", clinic: "all", type: "all", sort: "rating" })
                  }
                >
                  Clear filters
                </Button>
              }
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          )}
        </main>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
