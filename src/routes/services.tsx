import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Baby,
  FlaskConical,
  HeartPulse,
  Microscope,
  Syringe,
  Video,
} from "lucide-react";

import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — Aarogya Care" },
      {
        name: "description",
        content:
          "Consultations, diagnostics, vaccinations, health check packages, physiotherapy and online consultations at Aarogya Care.",
      },
      { property: "og:title", content: "Services — Aarogya Care" },
      {
        property: "og:description",
        content: "Everything from a first consultation to follow-up diagnostics under one roof.",
      },
    ],
  }),
  component: ServicesPage,
});

const SERVICES = [
  {
    icon: HeartPulse,
    title: "Specialist consultations",
    body: "Twenty-minute slots as standard, thirty for first visits, so nothing is rushed.",
    price: "From ₹500",
  },
  {
    icon: Microscope,
    title: "Pathology & diagnostics",
    body: "Blood work, urine analysis and cultures collected in-clinic with same-day reports.",
    price: "From ₹250",
  },
  {
    icon: Activity,
    title: "Cardiac screening",
    body: "ECG, echocardiography and treadmill tests reviewed by our cardiology team.",
    price: "From ₹1,200",
  },
  {
    icon: Syringe,
    title: "Adult vaccinations",
    body: "Influenza, hepatitis, typhoid and tetanus, with reminders for the next dose.",
    price: "From ₹400",
  },
  {
    icon: Baby,
    title: "Child wellness",
    body: "Growth tracking, immunisation schedules and paediatric nutrition advice.",
    price: "From ₹450",
  },
  {
    icon: FlaskConical,
    title: "Health check packages",
    body: "Annual panels for adults over 35, including kidney, liver, thyroid and lipid profiles.",
    price: "From ₹2,400",
  },
  {
    icon: Video,
    title: "Online consultations",
    body: "Video review for reports, prescriptions and follow-ups, with most doctors on the roster.",
    price: "From ₹450",
  },
];

function ServicesPage() {
  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <div className="border-b bg-surface">
        <div className="section py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">Services</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Fees shown are indicative and exclude 18% GST. Your final amount is always confirmed
            before you pay.
          </p>
        </div>
      </div>

      <div className="section grid gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <article key={service.title} className="rounded-xl border bg-card p-6 shadow-card">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
              <service.icon aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-lg font-semibold">{service.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{service.body}</p>
            <p className="mt-4 text-sm font-semibold text-accent">{service.price}</p>
          </article>
        ))}
      </div>

      <div className="section pb-6">
        <div className="rounded-2xl border bg-surface px-6 py-10 text-center">
          <h2 className="font-display text-2xl font-semibold">Not sure which service you need?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Start with a general medicine consultation — our physicians will order only the tests
            that matter for your symptoms.
          </p>
          <Button asChild className="mt-6">
            <Link to="/booking">Book a consultation</Link>
          </Button>
        </div>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
