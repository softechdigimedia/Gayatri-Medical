import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { CalendarCheck, MapPin, Star, Stethoscope, Video } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateLong, formatMoney, formatTime, nextSlotQuery } from "@/lib/clinic";

export type DoctorRow = {
  id: string;
  slug: string;
  full_name: string;
  qualification: string;
  specialty: string;
  experience_years: number;
  consultation_fee: number;
  rating: number;
  review_count: number;
  supports_online: boolean;
  supports_clinic: boolean;
  clinics?: { name: string; city: string } | null;
  departments?: { name: string } | null;
};

function initials(name: string) {
  return name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

export function DoctorCard({ doctor }: { doctor: DoctorRow }) {
  const { data: nextSlot, isPending } = useQuery(nextSlotQuery(doctor.id));

  return (
    <article className="flex flex-col rounded-xl border bg-card p-5 shadow-card transition-shadow hover:shadow-raised">
      <div className="flex gap-4">
        <span
          aria-hidden
          className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary-soft font-display text-lg font-semibold text-primary"
        >
          {initials(doctor.full_name)}
        </span>
        <div className="min-w-0">
          <h3 className="truncate font-display text-base font-semibold">{doctor.full_name}</h3>
          <p className="truncate text-sm text-accent">{doctor.specialty}</p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{doctor.qualification}</p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Experience</dt>
          <dd className="font-medium">{doctor.experience_years} years</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Consultation</dt>
          <dd className="font-medium">{formatMoney(doctor.consultation_fee)}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <Star aria-hidden className="size-3.5 text-warning" />
          <span className="font-semibold text-foreground">{doctor.rating}</span>
          <span>({doctor.review_count} reviews)</span>
        </span>
        {doctor.clinics ? (
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" /> {doctor.clinics.name}
          </span>
        ) : null}
        {doctor.supports_online ? (
          <span className="inline-flex items-center gap-1.5">
            <Video aria-hidden className="size-3.5" /> Online
          </span>
        ) : null}
        {doctor.supports_clinic ? (
          <span className="inline-flex items-center gap-1.5">
            <Stethoscope aria-hidden className="size-3.5" /> In clinic
          </span>
        ) : null}
      </div>

      <div className="mt-4 rounded-lg bg-surface px-3 py-2.5 text-xs">
        {isPending ? (
          <Skeleton className="h-4 w-40" />
        ) : nextSlot ? (
          <span className="inline-flex items-center gap-2 font-medium text-success">
            <CalendarCheck aria-hidden className="size-4" />
            Next slot {formatDateLong(nextSlot.slot_date)} · {formatTime(nextSlot.slot_time)}
          </span>
        ) : (
          <span className="text-muted-foreground">No open slots in the next two weeks</span>
        )}
      </div>

      <div className="mt-5 flex gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link to="/doctors/$doctorSlug" params={{ doctorSlug: doctor.slug }}>
            View profile
          </Link>
        </Button>
        <Button asChild className="flex-1">
          <Link to="/booking" search={{ doctor: doctor.slug }}>
            Book
          </Link>
        </Button>
      </div>
    </article>
  );
}

export function DoctorCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-5">
      <div className="flex gap-4">
        <Skeleton className="size-14 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="mt-5 h-10 w-full" />
      <Skeleton className="mt-4 h-9 w-full" />
    </div>
  );
}
