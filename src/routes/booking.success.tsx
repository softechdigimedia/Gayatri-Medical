import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarCheck, CircleCheckBig, Clock, MapPin } from "lucide-react";

import { SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/booking/success")({
  validateSearch: (search: Record<string, unknown>) => ({
    ref: typeof search["ref"] === "string" ? search["ref"] : "",
  }),
  head: () => ({
    meta: [
      { title: "Appointment confirmed — Aarogya Care" },
      { name: "description", content: "Your Aarogya Care appointment booking is confirmed." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const { ref } = Route.useSearch();

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="section flex flex-col items-center py-20 text-center">
        <span className="flex size-16 items-center justify-center rounded-full bg-success-soft text-success">
          <CircleCheckBig aria-hidden className="size-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold tracking-tight">
          Your appointment is booked
        </h1>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          We have sent the details to your email. Please arrive ten minutes early with any previous
          reports or prescriptions.
        </p>

        {ref ? (
          <div className="mt-8 rounded-xl border bg-card px-8 py-5 shadow-card">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Booking ID</p>
            <p className="mt-1 font-display text-2xl font-semibold">{ref}</p>
          </div>
        ) : null}

        <ul className="mt-10 grid max-w-2xl gap-4 text-left sm:grid-cols-3">
          <li className="rounded-xl border bg-card p-5 text-sm shadow-card">
            <Clock aria-hidden className="size-5 text-accent" />
            <p className="mt-3 font-semibold">Arrive early</p>
            <p className="mt-1 text-muted-foreground">Reception check-in takes a few minutes.</p>
          </li>
          <li className="rounded-xl border bg-card p-5 text-sm shadow-card">
            <CalendarCheck aria-hidden className="size-5 text-accent" />
            <p className="mt-3 font-semibold">Change plans?</p>
            <p className="mt-1 text-muted-foreground">
              Cancel or move your slot free up to 6 hours before.
            </p>
          </li>
          <li className="rounded-xl border bg-card p-5 text-sm shadow-card">
            <MapPin aria-hidden className="size-5 text-accent" />
            <p className="mt-3 font-semibold">Find the branch</p>
            <p className="mt-1 text-muted-foreground">
              Addresses and timings are on our contact page.
            </p>
          </li>
        </ul>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button asChild>
            <Link to="/patient/appointments">View my appointments</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Back to home</Link>
          </Button>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
