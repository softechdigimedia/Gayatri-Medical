import { supabase } from "@/integrations/supabase/client";

export type Doctor = {
  id: string;
  slug: string;
  full_name: string;
  qualification: string;
  specialty: string;
  department_id: string | null;
  clinic_id: string | null;
  experience_years: number;
  gender: string;
  languages: string[];
  registration_no: string | null;
  about: string | null;
  expertise: string[];
  consultation_fee: number;
  supports_online: boolean;
  supports_clinic: boolean;
  rating: number;
  review_count: number;
  photo_url: string | null;
};

export type Slot = { slot_time: string; is_available: boolean; reason: string };

export const CURRENCY = "₹";

export function formatMoney(value: number) {
  return `${CURRENCY}${Number(value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export function formatTime(value: string) {
  const [h, m] = value.split(":");
  const hour = Number(h);
  const suffix = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:${m} ${suffix}`;
}

export function formatDateLong(value: string) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function toDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function upcomingDates(count = 14) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
}

/* ------------------------------ queries ------------------------------ */

export const departmentsQuery = {
  queryKey: ["departments"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    return data;
  },
};

export const clinicsQuery = {
  queryKey: ["clinics"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("clinics")
      .select("*")
      .eq("is_active", true)
      .order("name");
    if (error) throw error;
    return data;
  },
};

export const doctorsQuery = {
  queryKey: ["doctors"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("doctors")
      .select("*, departments(name, slug), clinics(name, city, slug)")
      .eq("is_active", true)
      .order("rating", { ascending: false });
    if (error) throw error;
    return data;
  },
};

export function doctorQuery(slug: string) {
  return {
    queryKey: ["doctor", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*, departments(name, slug), clinics(name, city, address, slug)")
        .eq("slug", slug)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  };
}

export function doctorByIdQuery(id: string) {
  return {
    queryKey: ["doctor-id", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("*, departments(name, slug), clinics(name, city, address, slug)")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  };
}

export function reviewsQuery(doctorId: string) {
  return {
    queryKey: ["reviews", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("doctor_id", doctorId)
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return data;
    },
    enabled: Boolean(doctorId),
  };
}

export function slotsQuery(doctorId: string, date: string) {
  return {
    queryKey: ["slots", doctorId, date],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_doctor_slots", {
        _doctor_id: doctorId,
        _date: date,
      });
      if (error) throw error;
      return (data ?? []) as Slot[];
    },
    enabled: Boolean(doctorId && date),
    staleTime: 15_000,
  };
}

export function nextSlotQuery(doctorId: string) {
  return {
    queryKey: ["next-slot", doctorId],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("next_available_slot", {
        _doctor_id: doctorId,
      });
      if (error) throw error;
      return (data?.[0] ?? null) as { slot_date: string; slot_time: string } | null;
    },
    enabled: Boolean(doctorId),
    staleTime: 60_000,
  };
}

export const myAppointmentsQuery = {
  queryKey: ["my-appointments"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("appointments")
      .select(
        "*, doctors(full_name, slug, specialty, photo_url), clinics(name, city, address), payments(status, method, amount)",
      )
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false });
    if (error) throw error;
    return data;
  },
};

export const myPatientQuery = {
  queryKey: ["my-patient"],
  queryFn: async () => {
    const { data, error } = await supabase.from("patients").select("*").limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const myProfileQuery = {
  queryKey: ["my-profile"],
  queryFn: async () => {
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", auth.user.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },
};

export const myDocumentsQuery = {
  queryKey: ["my-documents"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("documents")
      .select("*, doctors(full_name, specialty)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  },
};

export const myNotificationsQuery = {
  queryKey: ["my-notifications"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);
    if (error) throw error;
    return data;
  },
};

/* ------------------------------ mutations ------------------------------ */

export type BookingPayload = {
  doctorId: string;
  date: string;
  start: string;
  appointmentType: string;
  reason: string;
  paymentMethod: "online" | "clinic";
  patient: {
    full_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    address: string;
    city: string;
  };
};

export type BookingResult = {
  id: string;
  booking_ref: string;
  status: string;
  total: number;
  payment_status: string;
};

/** Payment is intentionally abstracted: swapping in a real gateway only changes this function. */
export async function processPayment(method: "online" | "clinic") {
  if (method === "clinic") return { ok: true as const, reference: null };
  await new Promise((resolve) => setTimeout(resolve, 900));
  return { ok: true as const, reference: `SIM-${Date.now()}` };
}

export const BOOKING_ERRORS: Record<string, string> = {
  SLOT_UNAVAILABLE: "That slot has just been taken. Please choose another time.",
  SLOT_TOO_SOON: "This time is too close to now. Please pick a later slot.",
  DOCTOR_UNAVAILABLE: "This doctor is not accepting appointments right now.",
  NOT_CANCELLABLE: "This appointment can no longer be cancelled.",
  FORBIDDEN: "You do not have permission to change this appointment.",
  NOT_FOUND: "We could not find that appointment.",
};

export function bookingErrorMessage(message: string) {
  const key = Object.keys(BOOKING_ERRORS).find((k) => message.includes(k));
  return key ? BOOKING_ERRORS[key] : "Something went wrong. Please try again.";
}

export async function bookAppointment(payload: BookingPayload): Promise<BookingResult> {
  const { data, error } = await supabase.rpc("book_appointment", {
    _doctor_id: payload.doctorId,
    _date: payload.date,
    _start: payload.start,
    _appointment_type: payload.appointmentType,
    _patient: payload.patient,
    _reason: payload.reason,
    _payment_method: payload.paymentMethod,
  });
  if (error) throw new Error(error.message);
  return data as unknown as BookingResult;
}

export async function cancelAppointment(id: string) {
  const { error } = await supabase.rpc("cancel_appointment", { _appointment_id: id });
  if (error) throw new Error(error.message);
}

export async function rescheduleAppointment(id: string, date: string, start: string) {
  const { error } = await supabase.rpc("reschedule_appointment", {
    _appointment_id: id,
    _date: date,
    _start: start,
  });
  if (error) throw new Error(error.message);
}
