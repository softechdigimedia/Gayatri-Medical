# Clinic Booking & Management Platform

A multi-doctor clinic platform with four experiences: patient website, doctor workspace, management panel, and admin console. Real logins, real database, real slot booking rules — not mock screens.

Your brief is very large, so I'll build it in phases and you can review after each. Phase 1 is the foundation plus the whole patient booking journey, because that's the part patients touch.

## Design direction

Following your brief: clean, spacious, trustworthy. Deep navy primary, soft medical teal accent, white/light neutral surfaces, subtle borders, medium-radius cards, strong typographic hierarchy, restrained motion. No gradients, glass, or neon. Status is always shown with an icon plus label, never colour alone.

## Phase 1 — Foundation + patient booking (this phase)

**Backend (Lovable Cloud)**
- Email/password sign-up and sign-in, plus a separate roles table (patient, doctor, manager, admin, staff) so permissions are enforced in the database, not just hidden in the interface.
- Tables: clinics, departments, doctors, doctor schedules, breaks, leave, clinic holidays, patients, appointments, payments, notifications, settings.
- Row-level security on everything: patients see only their own records, doctors only their own appointments, managers and admins see clinic-wide data.
- Slot generation on the server from each doctor's working hours, slot length, breaks, leave, holidays, and already-booked appointments. No hardcoded time lists.
- Booking rules enforced server-side: no double-booking (unique constraint + transaction), no past dates, minimum advance notice, cancel/reschedule releases the old slot, unpaid online bookings stay pending rather than confirmed.
- Realistic fictional Indian demo data seeded by migration: 3 clinics, 5 departments, 10 doctors with schedules and leave, 30 patients, ~100 appointments across every status, payments, notifications.

**Patient-facing pages**
- Home with hero, search by specialty and branch, featured departments and doctors, trust section, footer.
- `/doctors` — search and filters (specialty, gender, experience, fee, available today/this week, online/in-clinic) with doctor cards showing next free slot.
- `/doctors/:id` — full profile, fees, locations, reviews, date strip and live slot grid with unavailable slots visibly disabled.
- `/booking` — multi-step flow: doctor & type → date & slot → patient details (auto-filled when signed in) → summary with fee, tax, total → payment choice (online or pay at clinic) → confirmation with booking ID, add-to-calendar and download.
- `/patient/dashboard`, `/patient/appointments` (cancel, reschedule, history), `/patient/profile`, documents & prescriptions.
- `/departments`, `/services`, `/about`, `/contact`, sign-in and sign-up.

**Design system + states**
Tokens for colour, type, spacing, radius, shadow; button/input/card/table/dialog/badge variants; skeleton loaders, empty states with icon + explanation + action, and consistent error handling for every failure in your brief.

Online payment is architected behind a single abstraction returning a pending-payment state, so a real gateway can be plugged in later without touching the booking logic. No card processing goes live in this phase.

## Phase 2 — Doctor workspace

Today's and upcoming appointments, patient view, calendar, availability and leave editor, consultation notes, prescription upload, status changes (completed / cancelled / no-show).

## Phase 3 — Management panel

Operational dashboard, revenue and appointment analytics, doctors, schedules, patients, appointments, branches, booking rules, staff, reports.

## Phase 4 — Admin console

Users, roles and permissions, all clinical and financial records, departments, clinics, payments, notifications, content, settings (booking rules, tax, currency, timezone, holidays), audit log, security.

## Technical notes

- TanStack Start with file-based routes; protected areas live under an authenticated layout, each role gated by a role check.
- All reads and writes go through server functions using the signed-in user's own database permissions; slot generation and booking are single server-side transactions.
- Data fetching via TanStack Query with loader prefetch, debounced search, server-side pagination on large lists.
- Deployment stays on Lovable Cloud rather than a separate Express/Redis/S3 stack; the same Postgres, storage, auth, and server-function boundaries are preserved, so integrations remain swappable.
- Each public route gets its own title, description, and social preview metadata.

## Open question

I'll treat online payment as architecture-only in Phase 1. If you want a live Razorpay or Stripe checkout, tell me which and I'll wire it when we reach that step.
