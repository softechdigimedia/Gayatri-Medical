import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarClock, CalendarPlus, HeartPulse, LayoutDashboard, LogOut, Menu, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useRoles } from "@/lib/staff";

const NAV = [
  { to: "/doctors", label: "Doctors" },
  { to: "/departments", label: "Departments" },
  { to: "/services", label: "Services" },
  { to: "/health-resources", label: "Health Resources" },
  // { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const { user, loading } = useAuth();
  const { isAdmin, canManage } = useRoles();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="section flex h-16 items-center gap-6">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Gayatri Medical home">
          <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartPulse aria-hidden className="size-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Gayatri Medical</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {!loading && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                  My account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate text-xs font-normal text-muted-foreground">
                  {user.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/patient/dashboard">
                    <LayoutDashboard aria-hidden className="size-4" /> Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/patient/appointments">My appointments</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/patient/profile">Profile</Link>
                </DropdownMenuItem>
                {canManage ? <DropdownMenuItem asChild><Link to="/manage"><CalendarClock aria-hidden className="size-4"/>Management</Link></DropdownMenuItem> : null}
                {isAdmin ? <DropdownMenuItem asChild><Link to="/admin"><ShieldCheck aria-hidden className="size-4"/>Administration</Link></DropdownMenuItem> : null}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void signOut()}>
                  <LogOut aria-hidden className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="hidden md:inline-flex">
                <Link to="/auth" search={{ mode: "register" }}>
                  Register
                </Link>
              </Button>
            </>
          )}

          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/booking">
              <CalendarPlus aria-hidden className="size-4" /> Book Appointment
            </Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu aria-hidden className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="font-display">Menu</SheetTitle>
              <nav aria-label="Mobile" className="mt-6 flex flex-col gap-1">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="mt-4 border-t pt-4">
                  {user ? (
                    <>
                      <Link
                        to="/patient/dashboard"
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                      >
                        My dashboard
                      </Link>
                      {canManage ? <Link to="/manage" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">Management</Link> : null}
                      {isAdmin ? <Link to="/admin" onClick={() => setOpen(false)} className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary">Administration</Link> : null}
                      <button
                        type="button"
                        onClick={() => {
                          setOpen(false);
                          void signOut();
                        }}
                        className="block w-full rounded-md px-3 py-2.5 text-left text-sm font-medium hover:bg-secondary"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-3 py-2.5 text-sm font-medium hover:bg-secondary"
                    >
                      Login or register
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export function MobileBookingBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 p-3 backdrop-blur sm:hidden">
      <Button asChild className="w-full" size="lg">
        <Link to="/booking">
          <CalendarPlus aria-hidden className="size-4" /> Book Appointment
        </Link>
      </Button>
    </div>
  );
}
