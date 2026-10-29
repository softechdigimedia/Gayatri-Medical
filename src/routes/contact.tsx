import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Clock, Mail, MapPin, Phone, Siren } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { MobileBookingBar, SiteHeader } from "@/components/clinic/SiteHeader";
import { SiteFooter } from "@/components/clinic/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { clinicsQuery, formatTime } from "@/lib/clinic";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Aarogya Care — phone, email and branch addresses" },
      {
        name: "description",
        content:
          "Call +91 33 4000 1200, email care@aarogyacare.in, or visit at Nagerbazar, Dum Dum, South Dumdum, West Bengal",
      },
      { property: "og:title", content: "Contact Aarogya Care" },
      {
        property: "og:description",
        content: "Phone, email and addresses for all three Aarogya Care branches.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: clinics } = useQuery(clinicsQuery);
  const [sending, setSending] = useState(false);

  return (
    <div className="min-h-screen pb-20 sm:pb-0">
      <SiteHeader />
      <div className="border-b bg-surface">
        <div className="section py-12">
          <h1 className="font-display text-3xl font-bold tracking-tight">Contact us</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Reception answers calls between 8:00 AM and 8:00 PM. For appointment changes, your
            dashboard is fastest.
          </p>
        </div>
      </div>

      <div className="section grid gap-8 py-12 lg:grid-cols-[1fr_24rem]">
        <form
          className="rounded-xl border bg-card p-6 shadow-card"
          onSubmit={(event) => {
            event.preventDefault();
            setSending(true);
            const form = event.currentTarget;
            setTimeout(() => {
              setSending(false);
              form.reset();
              toast.success("Message sent", {
                description: "Our front desk replies within one working day.",
              });
            }, 700);
          }}
        >
          <h2 className="font-display text-lg font-semibold">Send us a message</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full name</Label>
              <Input id="name" name="name" required autoComplete="name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" required inputMode="tel" autoComplete="tel" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="message">How can we help?</Label>
              <Textarea id="message" name="message" rows={5} required />
            </div>
          </div>
          <Button type="submit" className="mt-5" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Please do not share clinical details or emergencies through this form.
          </p>
        </form>

        <aside className="space-y-4">
          <div className="rounded-xl border bg-card p-6 text-sm shadow-card">
            <h2 className="font-display text-base font-semibold">Reach us</h2>
            <ul className="mt-4 space-y-3 text-muted-foreground">
              <li className="flex gap-2.5">
                <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" /> +91 33 4000
                1200
              </li>
              <li className="flex gap-2.5">
                <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />{" "}
                care@aarogyacare.in
              </li>
              <li className="flex gap-2.5">
                <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" /> Mon–Sat, 8:00
                AM – 8:00 PM
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-destructive/30 bg-destructive-soft p-6 text-sm">
            <h2 className="inline-flex items-center gap-2 font-display text-base font-semibold text-destructive">
              <Siren aria-hidden className="size-4" /> Emergencies
            </h2>
            <p className="mt-2 text-destructive">
              Gayatri Medical is not an emergency department. For chest pain, breathlessness, heavy
              bleeding or loss of consciousness, call your local emergency number immediately.
            </p>
          </div>
        </aside>
      </div>

      <SiteFooter />
      <MobileBookingBar />
    </div>
  );
}
