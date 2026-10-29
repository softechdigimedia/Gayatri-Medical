import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Building2, Check, Loader2, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DateStrip, SlotGrid } from "@/components/clinic/SlotPicker";
import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import {
  bookAppointment,
  bookingErrorMessage,
  doctorsQuery,
  formatDateLong,
  formatMoney,
  formatTime,
  myPatientQuery,
  myProfileQuery,
  processPayment,
  toDateKey,
  type BookingPayload,
} from "@/lib/clinic";
import { cn } from "@/lib/utils";

type BookingSearch = { doctor?: string | undefined; date?: string | undefined; time?: string | undefined };

export const Route = createFileRoute("/booking/")({
  validateSearch: (search: Record<string, unknown>): BookingSearch => {
    const out: BookingSearch = {};
    for (const k of ["doctor", "date", "time"] as const) {
      const v = search[k];
      if (typeof v === "string") out[k] = v;
    }
    return out;
  },
  head: () => ({
    meta: [
      { title: "Book an appointment — Aarogya Care" },
      {
        name: "description",
        content:
          "Choose a doctor, pick a live open slot, add patient details and pay online or at the clinic — all in one flow.",
      },
      { property: "og:title", content: "Book an appointment — Aarogya Care" },
      {
        property: "og:description",
        content: "Four short steps from doctor to confirmed booking ID.",
      },
    ],
  }),
  component: BookingPage,
});

const STEPS = ["Doctor", "Date & time", "Your details", "Confirm"];
const TAX_RATE = 0.18;

type DoctorRecord = {
  id: string;
  slug: string;
  full_name: string;
  specialty: string;
  consultation_fee: number;
  supports_online: boolean;
  supports_clinic: boolean;
  clinics?: { name: string; city: string } | null;
};

function BookingPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: doctors, isPending: doctorsPending } = useQuery(doctorsQuery);
  const { data: profile } = useQuery({ ...myProfileQuery, enabled: Boolean(user) });
  const { data: patient } = useQuery({ ...myPatientQuery, enabled: Boolean(user) });

  const list = (doctors ?? []) as unknown as DoctorRecord[];
  const [doctorSlug, setDoctorSlug] = useState(search.doctor ?? "");
  const [appointmentType, setAppointmentType] = useState("clinic");
  const [date, setDate] = useState(search.date ?? toDateKey(new Date()));
  const [time, setTime] = useState<string | null>(search.time ?? null);
  const [reason, setReason] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"online" | "clinic">("clinic");
  const [step, setStep] = useState(search.doctor ? (search.time ? 2 : 1) : 0);
  const [details, setDetails] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    address: "",
    city: "",
  });

  const doctor = useMemo(() => list.find((d) => d.slug === doctorSlug), [list, doctorSlug]);

  useEffect(() => {
    if (!patient && !profile) return;
    setDetails((prev) => ({
      full_name: prev.full_name || patient?.full_name || profile?.full_name || "",
      email: prev.email || patient?.email || profile?.email || user?.email || "",
      phone: prev.phone || patient?.phone || profile?.phone || "",
      date_of_birth: prev.date_of_birth || patient?.date_of_birth || profile?.date_of_birth || "",
      gender: prev.gender || patient?.gender || profile?.gender || "",
      address: prev.address || patient?.address || profile?.address || "",
      city: prev.city || patient?.city || profile?.city || "",
    }));
  }, [patient, profile, user]);

  const fee = doctor?.consultation_fee ?? 0;
  const tax = Math.round(fee * TAX_RATE * 100) / 100;
  const total = fee + tax;

  const booking = useMutation({
    mutationFn: async () => {
      const payment = await processPayment(paymentMethod);
      if (!payment.ok) throw new Error("PAYMENT_FAILED");
      const payload: BookingPayload = {
        doctorId: doctor!.id,
        date,
        start: time!,
        appointmentType,
        reason,
        paymentMethod,
        patient: details,
      };
      return bookAppointment(payload);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["slots"] });
      queryClient.invalidateQueries({ queryKey: ["my-appointments"] });
      navigate({ to: "/booking/success", search: { ref: result.booking_ref } });
    },
    onError: (error: Error) => {
      if (error.message === "PAYMENT_FAILED") {
        toast.error("Payment did not go through", {
          description: "No appointment was created. Please try again or pay at the clinic.",
        });
        return;
      }
      toast.error("Could not complete booking", { description: bookingErrorMessage(error.message) });
      if (error.message.includes("SLOT_UNAVAILABLE")) {
        queryClient.invalidateQueries({ queryKey: ["slots"] });
        setTime(null);
        setStep(1);
      }
    },
  });

  const canContinue = [
    Boolean(doctor),
    Boolean(time),
    Boolean(details.full_name && details.phone.length >= 10 && details.email),
    true,
  ][step];

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />

      <div className="border-b bg-surface">
        <div className="section py-10">
          <h1 className="font-display text-3xl font-bold tracking-tight">Book an appointment</h1>
          <ol className="mt-6 flex flex-wrap gap-2" aria-label="Booking steps">
            {STEPS.map((label, index) => (
              <li
                key={label}
                aria-current={index === step ? "step" : undefined}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold",
                  index === step && "border-primary bg-primary text-primary-foreground",
                  index < step && "border-success bg-success-soft text-success",
                  index > step && "bg-card text-muted-foreground",
                )}
              >
                {index < step ? (
                  <Check aria-hidden className="size-3.5" />
                ) : (
                  <span>{index + 1}</span>
                )}
                {label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="section grid gap-8 py-10 lg:grid-cols-[1fr_21rem]">
        <main className="rounded-xl border bg-card p-6 shadow-card">
          {step === 0 ? (
            <section aria-labelledby="step-doctor">
              <h2 id="step-doctor" className="font-display text-lg font-semibold">
                Choose a doctor
              </h2>
              <div className="mt-4 space-y-2">
                <Label>Doctor</Label>
                <Select value={doctorSlug} onValueChange={setDoctorSlug} disabled={doctorsPending}>
                  <SelectTrigger>
                    <SelectValue placeholder={doctorsPending ? "Loading…" : "Select a doctor"} />
                  </SelectTrigger>
                  <SelectContent>
                    {list.map((d) => (
                      <SelectItem key={d.slug} value={d.slug}>
                        {d.full_name} · {d.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Not sure who to see?{" "}
                  <Link to="/doctors" className="underline">
                    Browse profiles and reviews
                  </Link>
                  .
                </p>
              </div>

              {doctor ? (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">Consultation type</h3>
                  <RadioGroup
                    value={appointmentType}
                    onValueChange={setAppointmentType}
                    className="mt-3 grid gap-3 sm:grid-cols-2"
                  >
                    {doctor.supports_clinic ? (
                      <Label
                        htmlFor="type-clinic"
                        className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary"
                      >
                        <RadioGroupItem value="clinic" id="type-clinic" />
                        <span>
                          <span className="flex items-center gap-2 font-semibold">
                            <Building2 aria-hidden className="size-4" /> In clinic
                          </span>
                          <span className="mt-1 block text-xs font-normal text-muted-foreground">
                            {doctor.clinics?.name}, {doctor.clinics?.city}
                          </span>
                        </span>
                      </Label>
                    ) : null}
                    {doctor.supports_online ? (
                      <Label
                        htmlFor="type-online"
                        className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary"
                      >
                        <RadioGroupItem value="online" id="type-online" />
                        <span>
                          <span className="flex items-center gap-2 font-semibold">
                            <Video aria-hidden className="size-4" /> Online
                          </span>
                          <span className="mt-1 block text-xs font-normal text-muted-foreground">
                            Video link sent before your slot
                          </span>
                        </span>
                      </Label>
                    ) : null}
                  </RadioGroup>
                </div>
              ) : null}
            </section>
          ) : null}

          {step === 1 && doctor ? (
            <section aria-labelledby="step-slot">
              <h2 id="step-slot" className="font-display text-lg font-semibold">
                Pick a date and time
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Availability for {doctor.full_name}. Slots must start at least an hour from now.
              </p>
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
            </section>
          ) : null}

          {step === 2 ? (
            <section aria-labelledby="step-details">
              <h2 id="step-details" className="font-display text-lg font-semibold">
                Patient details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Booking for someone else? Enter their details here.
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full name *</Label>
                  <Input
                    id="full_name"
                    value={details.full_name}
                    onChange={(e) => setDetails({ ...details, full_name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile number *</Label>
                  <Input
                    id="phone"
                    inputMode="tel"
                    value={details.phone}
                    onChange={(e) => setDetails({ ...details, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={details.email}
                    onChange={(e) => setDetails({ ...details, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={details.date_of_birth ?? ""}
                    onChange={(e) => setDetails({ ...details, date_of_birth: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select
                    value={details.gender}
                    onValueChange={(v) => setDetails({ ...details, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Prefer not to say" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={details.city ?? ""}
                    onChange={(e) => setDetails({ ...details, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={details.address ?? ""}
                    onChange={(e) => setDetails({ ...details, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="reason">Reason for visit</Label>
                  <Textarea
                    id="reason"
                    rows={3}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Symptoms, duration, and any medicines you are taking"
                  />
                </div>
              </div>
              {!user ? (
                <p className="mt-4 rounded-lg bg-info-soft px-4 py-3 text-xs text-info">
                  You are booking as a guest.{" "}
                  <Link to="/auth" search={{ mode: "register" }} className="underline">
                    Create an account
                  </Link>{" "}
                  to see this appointment in a dashboard later.
                </p>
              ) : null}
            </section>
          ) : null}

          {step === 3 && doctor && time ? (
            <section aria-labelledby="step-confirm">
              <h2 id="step-confirm" className="font-display text-lg font-semibold">
                Review and pay
              </h2>
              <dl className="mt-5 divide-y rounded-lg border text-sm">
                {[
                  ["Doctor", `${doctor.full_name} · ${doctor.specialty}`],
                  [
                    "When",
                    `${formatDateLong(date)} at ${formatTime(time)}`,
                  ],
                  [
                    "Type",
                    appointmentType === "online"
                      ? "Online consultation"
                      : `In clinic · ${doctor.clinics?.name ?? ""}`,
                  ],
                  ["Patient", `${details.full_name} · ${details.phone}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex flex-wrap justify-between gap-2 px-4 py-3">
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="font-medium">{value}</dd>
                  </div>
                ))}
              </dl>

              <h3 className="mt-6 text-sm font-semibold">Payment</h3>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(v) => setPaymentMethod(v as "online" | "clinic")}
                className="mt-3 grid gap-3 sm:grid-cols-2"
              >
                <Label
                  htmlFor="pay-online"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary"
                >
                  <RadioGroupItem value="online" id="pay-online" />
                  <span>
                    <span className="font-semibold">Pay online now</span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Appointment is confirmed immediately.
                    </span>
                  </span>
                </Label>
                <Label
                  htmlFor="pay-clinic"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border p-4 has-[:checked]:border-primary"
                >
                  <RadioGroupItem value="clinic" id="pay-clinic" />
                  <span>
                    <span className="font-semibold">Pay at the clinic</span>
                    <span className="mt-1 block text-xs font-normal text-muted-foreground">
                      Slot is held as pending until reception confirms.
                    </span>
                  </span>
                </Label>
              </RadioGroup>
            </section>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-3 border-t pt-5">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0 || booking.isPending}
            >
              <ArrowLeft aria-hidden className="size-4" /> Back
            </Button>
            {step < 3 ? (
              <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
                Continue
              </Button>
            ) : (
              <Button onClick={() => booking.mutate()} disabled={booking.isPending}>
                {booking.isPending ? (
                  <>
                    <Loader2 aria-hidden className="size-4 animate-spin" /> Processing…
                  </>
                ) : paymentMethod === "online" ? (
                  `Pay ${formatMoney(total)} & confirm`
                ) : (
                  "Confirm appointment"
                )}
              </Button>
            )}
          </div>
        </main>

        <aside className="self-start rounded-xl border bg-card p-6 text-sm shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-base font-semibold">Summary</h2>
          {doctor ? (
            <>
              <p className="mt-3 font-medium">{doctor.full_name}</p>
              <p className="text-muted-foreground">{doctor.specialty}</p>
              {time ? (
                <p className="mt-3 text-muted-foreground">
                  {formatDateLong(date)} · {formatTime(time)}
                </p>
              ) : (
                <p className="mt-3 text-muted-foreground">No slot selected yet</p>
              )}
              <dl className="mt-5 space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Consultation fee</dt>
                  <dd>{formatMoney(fee)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">GST (18%)</dt>
                  <dd>{formatMoney(tax)}</dd>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <dt>Total</dt>
                  <dd>{formatMoney(total)}</dd>
                </div>
              </dl>
            </>
          ) : (
            <p className="mt-3 text-muted-foreground">Choose a doctor to see fees.</p>
          )}
          <p className="mt-5 text-xs text-muted-foreground">
            Free cancellation up to 6 hours before your slot.
          </p>
        </aside>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
