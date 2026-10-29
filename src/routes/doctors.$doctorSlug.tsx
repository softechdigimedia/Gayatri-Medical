import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  Languages,
  MapPin,
  Star,
  Stethoscope,
  Video,
} from "lucide-react";
import { useState } from "react";

import { DateStrip, SlotGrid } from "@/components/clinic/SlotPicker";
import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { doctorQuery, formatMoney, reviewsQuery, toDateKey } from "@/lib/clinic";

export const Route = createFileRoute("/doctors/$doctorSlug")({
  loader: async ({ params, context }) => {
    const doctor = await context.queryClient.ensureQueryData(doctorQuery(params.doctorSlug));
    if (!doctor) throw notFound();
    return { name: doctor.full_name as string, specialty: doctor.specialty as string };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Doctor unavailable — Aarogya Care" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.name} — ${loaderData.specialty} | Aarogya Care`;
    const description = `Profile, fees and live appointment availability for ${loaderData.name}, ${loaderData.specialty} at Aarogya Care.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: DoctorProfilePage,
  notFoundComponent: () => (
    <div className="section py-24 text-center">
      <h1 className="font-display text-2xl font-semibold">We could not find that doctor</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The profile may have been moved or the doctor is no longer consulting here.
      </p>
      <Button asChild className="mt-6">
        <Link to="/doctors">Browse all doctors</Link>
      </Button>
    </div>
  ),
  errorComponent: () => (
    <p role="alert" className="section py-24 text-center text-sm text-destructive">
      This profile did not load. Please refresh the page.
    </p>
  ),
});

function DoctorProfilePage() {
  const { doctorSlug } = Route.useParams();
  const navigate = useNavigate();
  const { data: doctor, isPending } = useQuery(doctorQuery(doctorSlug));
  const { data: reviews } = useQuery(reviewsQuery(doctor?.id ?? ""));
  const [date, setDate] = useState(() => toDateKey(new Date()));
  const [time, setTime] = useState<string | null>(null);

  if (isPending) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <div className="section space-y-4 py-16">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!doctor) return null;

  const clinic = doctor.clinics as { name: string; city: string; address: string } | null;

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />

      <div className="border-b bg-surface">
        <div className="section flex flex-wrap items-start gap-6 py-10">
          <span
            aria-hidden
            className="flex size-20 items-center justify-center rounded-2xl bg-primary-soft font-display text-2xl font-semibold text-primary"
          >
            {doctor.full_name
              .replace("Dr. ", "")
              .split(" ")
              .map((p: string) => p[0])
              .slice(0, 2)
              .join("")}
          </span>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">{doctor.full_name}</h1>
            <p className="mt-1 text-accent">{doctor.specialty}</p>
            <p className="mt-1 text-sm text-muted-foreground">{doctor.qualification}</p>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Star aria-hidden className="size-4 text-warning" />
                <span className="font-semibold text-foreground">{doctor.rating}</span> (
                {doctor.review_count} reviews)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Award aria-hidden className="size-4" /> {doctor.experience_years} years experience
              </span>
              {clinic ? (
                <span className="inline-flex items-center gap-1.5">
                  <MapPin aria-hidden className="size-4" /> {clinic.name}, {clinic.city}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Languages aria-hidden className="size-4" />{" "}
                {(doctor.languages as string[]).join(", ")}
              </span>
            </div>
          </div>
          <div className="rounded-xl border bg-card p-5 text-sm shadow-card">
            <p className="text-xs text-muted-foreground">Consultation fee</p>
            <p className="font-display text-2xl font-semibold">
              {formatMoney(doctor.consultation_fee)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">+ 18% GST at checkout</p>
            <Button asChild className="mt-4 w-full">
              <Link to="/booking" search={{ doctor: doctor.slug }}>
                Book appointment
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="section grid gap-8 py-10 lg:grid-cols-[1fr_22rem]">
        <main className="space-y-8">
          <section aria-labelledby="availability" className="rounded-xl border bg-card p-5 shadow-card">
            <h2 id="availability" className="font-display text-lg font-semibold">
              <CalendarDays aria-hidden className="mr-2 inline size-5 text-accent" />
              Availability
            </h2>
            <div className="mt-4">
              <DateStrip
                selected={date}
                onSelect={(next) => {
                  setDate(next);
                  setTime(null);
                }}
              />
            </div>
            <div className="mt-4">
              <SlotGrid doctorId={doctor.id} date={date} selected={time} onSelect={setTime} />
            </div>
            <Button
              className="mt-5"
              disabled={!time}
              onClick={() =>
                navigate({
                  to: "/booking",
                  search: { doctor: doctor.slug, date, time: time ?? undefined },
                })
              }
            >
              Continue with selected slot
            </Button>
          </section>

          <section aria-labelledby="about-doctor" className="rounded-xl border bg-card p-5 shadow-card">
            <h2 id="about-doctor" className="font-display text-lg font-semibold">
              About
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{doctor.about}</p>
            <h3 className="mt-6 text-sm font-semibold">Areas of expertise</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {(doctor.expertise as string[]).map((item) => (
                <li
                  key={item}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section aria-labelledby="reviews" className="rounded-xl border bg-card p-5 shadow-card">
            <h2 id="reviews" className="font-display text-lg font-semibold">
              Patient reviews
            </h2>
            {(reviews ?? []).length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No reviews yet.</p>
            ) : (
              <ul className="mt-4 space-y-4">
                {(reviews ?? []).map((review) => (
                  <li key={review.id} className="rounded-lg bg-surface p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-semibold">{review.patient_name}</p>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-warning">
                        <Star aria-hidden className="size-3.5" /> {review.rating}/5
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{review.comment}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </main>

        <aside className="space-y-4 self-start lg:sticky lg:top-24">
          <div className="rounded-xl border bg-card p-5 text-sm shadow-card">
            <h2 className="font-display text-base font-semibold">Consultation modes</h2>
            <ul className="mt-3 space-y-2 text-muted-foreground">
              {doctor.supports_clinic ? (
                <li className="inline-flex items-center gap-2">
                  <Stethoscope aria-hidden className="size-4 text-accent" /> In-clinic visit
                </li>
              ) : null}
              {doctor.supports_online ? (
                <li className="inline-flex items-center gap-2">
                  <Video aria-hidden className="size-4 text-accent" /> Online consultation
                </li>
              ) : null}
              <li className="inline-flex items-center gap-2">
                <BadgeCheck aria-hidden className="size-4 text-accent" /> Reg. no.{" "}
                {doctor.registration_no}
              </li>
            </ul>
          </div>
          {clinic ? (
            <div className="rounded-xl border bg-card p-5 text-sm shadow-card">
              <h2 className="font-display text-base font-semibold">Clinic</h2>
              <p className="mt-2 font-medium">{clinic.name}</p>
              <p className="mt-1 text-muted-foreground">{clinic.address}</p>
              <p className="text-muted-foreground">{clinic.city}</p>
            </div>
          ) : null}
        </aside>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
