import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Clock, MapPin, Phone, ShieldCheck, Sparkles, Users } from "lucide-react";

import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { clinicsQuery, formatTime } from "@/lib/clinic";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aarogya Care — our clinics and values" },
      {
        name: "description",
        content:
          "Aarogya Care is a three-branch multi-speciality clinic network in Kolkata and Howrah, built around unhurried consultations and transparent pricing.",
      },
      { property: "og:title", content: "About Aarogya Care" },
      {
        property: "og:description",
        content: "Three branches, ten specialists, one shared medical record.",
      },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  {
    icon: Clock,
    title: "Time you can plan around",
    body: "Slots are held to the roster, so the wait at reception stays short and predictable.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent fees",
    body: "Consultation fee, tax and total are shown before you confirm — nothing is added later.",
  },
  {
    icon: Users,
    title: "One record, three branches",
    body: "Prescriptions and reports follow you, whichever branch you visit next.",
  },
  {
    icon: Sparkles,
    title: "Only the tests you need",
    body: "Our physicians order investigations based on symptoms, not packages.",
  },
];

function AboutPage() {
  const { data: clinics } = useQuery(clinicsQuery);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <div className="hero-panel border-b">
        <div className="section py-16">
          <h1 className="max-w-3xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
            Neighbourhood clinics with hospital-grade discipline.
          </h1>
          <p className="mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
            Aarogya Care began in 2014 with a single consulting room in Salt Lake. Today three
            branches share one roster, one record system and one promise: honest waiting times and
            unhurried consultations.
          </p>
        </div>
      </div>

      <section className="section grid gap-4 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map((value) => (
          <article key={value.title} className="rounded-xl border bg-card p-6 shadow-card">
            <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <value.icon aria-hidden className="size-5" />
            </span>
            <h2 className="mt-4 font-display text-base font-semibold">{value.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
          </article>
        ))}
      </section>

      <section className="bg-surface py-14" aria-labelledby="branches">
        <div className="section">
          <h2 id="branches" className="font-display text-2xl font-semibold">
            Our branches
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(clinics ?? []).map((clinic) => (
              <article key={clinic.id} className="rounded-xl border bg-card p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold">{clinic.name}</h3>
                <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2.5">
                    <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    <span>
                      {clinic.address}
                      <br />
                      {clinic.city}
                    </span>
                  </li>
                  <li className="flex gap-2.5">
                    <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {formatTime(clinic.opens_at)} – {formatTime(clinic.closes_at)}
                  </li>
                  <li className="flex gap-2.5">
                    <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
                    {clinic.phone}
                  </li>
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-14">
        <div className="rounded-2xl border bg-primary px-6 py-10 text-primary-foreground sm:px-10">
          <h2 className="font-display text-2xl font-semibold">Ready when you are</h2>
          <p className="mt-3 max-w-xl text-sm opacity-90">
            Pick a doctor, choose a slot that suits your day, and pay online or at the clinic.
          </p>
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/doctors">Find a doctor</Link>
          </Button>
        </div>
      </section>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
