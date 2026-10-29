import { Link } from "@tanstack/react-router";
import { HeartPulse, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-surface">
      <div className="section grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse aria-hidden className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">Gayatri Medical</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            A multi-speciality clinic network across Kolkata and Howrah, with same-week appointments and unhurried consultations.
          </p>
        </div>
        <nav aria-label="Care" className="text-sm">
          <h2 className="font-display text-sm font-semibold">Care</h2>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            <li>
              <Link to="/doctors" className="hover:text-foreground">
                Find a doctor
              </Link>
            </li>
            <li>
              <Link to="/departments" className="hover:text-foreground">
                Departments
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-foreground">
                Services
              </Link>
            </li>
            <li>
              <Link to="/booking" className="hover:text-foreground">
                Book an appointment
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Clinic" className="text-sm">
          <h2 className="font-display text-sm font-semibold">Clinic</h2>
          <ul className="mt-4 space-y-2.5 text-muted-foreground">
            <li>
              <Link to="/about" className="hover:text-foreground">
                About us
              </Link>
            </li>
            <li>
              <Link to="/health-resources" className="hover:text-foreground">
                Health resources
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-foreground">
                Patient login
              </Link>
            </li>
          </ul>
        </nav>

        <div className="text-sm">
          <h2 className="font-display text-sm font-semibold">Reach us</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            <li className="flex gap-2.5">
              <Phone aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              +91 33 4000 1200
            </li>
            <li className="flex gap-2.5">
              <Mail aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              care@aarogyacare.in
            </li>
            <li className="flex gap-2.5">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" />
              Nagerbazar, Dum Dum, South Dumdum, West Bengal
            </li>
          </ul>
        </div>
      </div>
      <div className="section flex flex-col gap-2 border-t py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Gayatri Medical.</p>
        <p>For medical emergencies call your local emergency number immediately.</p>
      </div>
    </footer>
  );
}
