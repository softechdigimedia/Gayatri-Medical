import { createFileRoute } from "@tanstack/react-router";

import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/health-resources")({
  head: () => ({
    meta: [
      { title: "Health resources — Aarogya Care" },
      {
        name: "description",
        content:
          "Practical guidance from Aarogya Care doctors on blood pressure, diabetes, child fever, back pain and monsoon illness in Kolkata.",
      },
      { property: "og:title", content: "Health resources — Aarogya Care" },
      {
        property: "og:description",
        content: "Short, practical reading written by our clinical team.",
      },
    ],
  }),
  component: HealthResourcesPage,
});

const ARTICLES = [
  {
    title: "Checking blood pressure at home",
    department: "Cardiology",
    body: "Measure after five minutes of sitting, feet flat, arm supported at heart level. Take two readings a minute apart, morning and evening, and note them down for a week before your review.",
  },
  {
    title: "When a child's fever needs a clinic visit",
    department: "Paediatrics",
    body: "Any fever in a baby under three months, a fever above 39°C that does not settle with paracetamol, reduced feeding, unusual drowsiness or a rash that does not fade when pressed should be seen the same day.",
  },
  {
    title: "Living with type 2 diabetes in a Bengali kitchen",
    department: "General Medicine",
    body: "Portion the rice rather than removing it, add a protein and a vegetable to every meal, and keep sweets for occasions. Walking twenty minutes after dinner lowers post-meal sugars measurably.",
  },
  {
    title: "Desk-work back pain",
    department: "Orthopaedics",
    body: "Most low back pain settles within six weeks with movement, not rest. Stand every forty minutes, keep screens at eye level, and see us if pain runs down a leg or affects bladder control.",
  },
  {
    title: "Monsoon skin and fungal infections",
    department: "Dermatology",
    body: "Keep skin folds dry, change out of damp clothes quickly, and avoid sharing towels. Complete the full course of any antifungal cream, even after the itching stops.",
  },
];

const FAQS = [
  {
    q: "How far in advance can I book?",
    a: "Up to 30 days ahead. Slots must be booked at least one hour before the start time.",
  },
  {
    q: "Can I cancel or reschedule?",
    a: "Yes, free of charge up to six hours before your appointment. The slot is released immediately for other patients.",
  },
  {
    q: "Do I have to pay online?",
    a: "No. You can reserve your slot and pay at the clinic reception. Paying online confirms the appointment straight away.",
  },
  {
    q: "Can I book for a family member?",
    a: "Yes. Enter their details at the patient step — the appointment is filed under their name.",
  },
];

function HealthResourcesPage() {
  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <div className="border-b bg-surface">
        <div className="section py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">Health resources</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Short notes from our clinical team. They are general guidance, not a substitute for a
            consultation.
          </p>
        </div>
      </div>

      <div className="section grid gap-8 py-12 lg:grid-cols-[1fr_22rem]">
        <div className="grid gap-4 sm:grid-cols-2">
          {ARTICLES.map((article) => (
            <article key={article.title} className="rounded-xl border bg-card p-6 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-wide text-accent">
                {article.department}
              </p>
              <h2 className="mt-2 font-display text-lg font-semibold">{article.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{article.body}</p>
            </article>
          ))}
        </div>

        <aside className="self-start rounded-xl border bg-card p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="font-display text-lg font-semibold">Booking questions</h2>
          <Accordion type="single" collapsible className="mt-3">
            {FAQS.map((faq) => (
              <AccordionItem key={faq.q} value={faq.q}>
                <AccordionTrigger className="text-left text-sm">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </aside>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
