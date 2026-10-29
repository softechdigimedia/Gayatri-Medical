import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarCheck,
  ClipboardList,
  CreditCard,
  HeartPulse,
  Search,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import { useState } from "react";

import heroImage from "@/assets/hero-clinic.jpg";
import { DoctorCard, DoctorCardSkeleton, type DoctorRow } from "@/components/clinic/DoctorCard";
import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { WhatsAppWidget } from "@/components/clinic/WhatsAppWidget";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { clinicsQuery, departmentsQuery, doctorsQuery } from "@/lib/clinic";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gayatri Medical — Book a doctor in Kolkata.png — Book a doctor in Kolkata" },
      {
        name: "description",
        content:
          "Gayatri Medical runs multi-speciality clinics in Salt Lake, Ballygunge and Howrah. Compare doctors, see live availability and book in under two minutes.",
      },
      { property: "og:title", content: "Gayatri Medical — Book a doctor in Kolkata" },
      {
        property: "og:description",
        content: "Live slot availability across three Kolkata clinics and ten specialists.",
      },
    ],
  }),
  component: HomePage,
});

const STEPS = [
  {
    icon: Search,
    title: "Find your specialist",
    body: "Filter by department, branch, language or consultation fee and read verified patient reviews.",
  },
  {
    icon: CalendarCheck,
    title: "Pick a real open slot",
    body: "Availability is generated from each doctor's roster, breaks, leave and clinic holidays.",
  },
  {
    icon: ClipboardList,
    title: "Share your details",
    body: "Tell us who the appointment is for and the reason for your visit, so the doctor is prepared.",
  },
  {
    icon: CreditCard,
    title: "Pay now or at the clinic",
    body: "Pay online to confirm instantly, or reserve and settle at the reception desk.",
  },
];

function HomePage() {
  const navigate = useNavigate();
  const [department, setDepartment] = useState("all");
  const [clinic, setClinic] = useState("all");
  const { data: departments } = useQuery(departmentsQuery);
  const { data: clinics } = useQuery(clinicsQuery);
  const { data: doctors, isPending } = useQuery(doctorsQuery);

  const featured = ((doctors ?? []) as DoctorRow[]).slice(0, 3);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <section className="hero-panel border-b">
        <div className="section grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
              <HeartPulse aria-hidden className="size-3.5" /> Three clinics across Kolkata & Howrah
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Unhurried care, booked in two minutes.
            </h1>
            <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
              Gayatri Medical brings general medicine, cardiology, paediatrics, orthopaedics and
              dermatology under one roof — with honest waiting times and clear fees.
            </p>

            <div className="mt-8 rounded-xl border bg-card p-4 shadow-raised sm:p-5">
              <h2 className="text-sm font-semibold">Find a doctor</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger aria-label="Department">
                    <SelectValue placeholder="Any speciality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any speciality</SelectItem>
                    {(departments ?? []).map((d) => (
                      <SelectItem key={d.slug} value={d.slug}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={clinic} onValueChange={setClinic}>
                  <SelectTrigger aria-label="Branch">
                    <SelectValue placeholder="Any branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Any branch</SelectItem>
                    {(clinics ?? []).map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() =>
                    navigate({
                      to: "/doctors",
                      search: { department, clinic, q: "", type: "all", sort: "rating" },
                    })
                  }
                >
                  <Search aria-hidden className="size-4" /> Search
                </Button>
              </div>
            </div>

            <dl className="mt-8 grid grid-cols-3 gap-4 text-sm">
              {[
                { label: "Specialists", value: "10" },
                { label: "Departments", value: "5" },
                { label: "Same-week slots", value: "Daily" },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="text-xs text-muted-foreground">{stat.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="overflow-hidden rounded-2xl border shadow-raised">
            <img
              src={heroImage}
              alt="A doctor in a white coat speaking with a patient at an Aarogya Care clinic"
              width={1536}
              height={1024}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="section py-16" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="font-display text-2xl font-semibold sm:text-3xl">
          How booking works
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Every slot you see is checked against the doctor's live schedule before it is offered, and
          again the moment you confirm.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-xl border bg-card p-5 shadow-card">
              <span className="flex size-10 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <step.icon aria-hidden className="size-5" />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold">
                {index + 1}. {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-surface py-16" aria-labelledby="departments">
        <div className="section">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 id="departments" className="font-display text-2xl font-semibold sm:text-3xl">
                Departments
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Five specialities, each with its own consulting rooms and day-care support.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/departments">
                All departments <ArrowRight aria-hidden className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(departments ?? []).map((d) => (
              <Link
                key={d.slug}
                to="/doctors"
                search={{ department: d.slug, clinic: "all", q: "", type: "all", sort: "rating" }}
                className="group rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-raised"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Stethoscope aria-hidden className="size-5" />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold">{d.name}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{d.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  See doctors <ArrowRight aria-hidden className="size-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16" aria-labelledby="top-doctors">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="top-doctors" className="font-display text-2xl font-semibold sm:text-3xl">
              Highest rated this month
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ratings come from patients who completed a consultation.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/doctors">
              All doctors <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }).map((_, i) => <DoctorCardSkeleton key={i} />)
            : featured.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)}
        </div>
      </section>

      <section className="section pb-4">
        <div className="rounded-2xl border bg-primary px-6 py-12 text-primary-foreground sm:px-10">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-semibold sm:text-3xl">
                Need to be seen today?
              </h2>
              <p className="mt-3 text-sm opacity-90">
                Walk-in slots open every morning at 8:00. Book online to hold your place and skip
                the queue at reception.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm opacity-90">
                <li className="inline-flex items-center gap-2">
                  <ShieldCheck aria-hidden className="size-4" /> Free cancellation up to 6 hours
                  before
                </li>
                <li className="inline-flex items-center gap-2">
                  <Users aria-hidden className="size-4" /> Book for a family member
                </li>
              </ul>
            </div>
            <Button asChild size="lg" variant="secondary">
              <Link to="/booking">Book an appointment</Link>
            </Button>
          </div>
        </div>
      </section>
      <WhatsAppWidget />
      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
