import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

type AuthSearch = { mode?: "login" | "register" | undefined; redirect?: string | undefined };

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => {
    const out: AuthSearch = { mode: search["mode"] === "register" ? "register" : "login" };
    const r = search["redirect"];
    if (typeof r === "string" && r.startsWith("/")) out.redirect = r;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Patient login — Gayatri Medical" },
      {
        name: "description",
        content:
          "Sign in to your Gayatri Medical account to view appointments, prescriptions and reports.",
      },
      { property: "og:title", content: "Patient login — Gayatri Medical" },
      { property: "og:description", content: "Manage your appointments and records." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [busy, setBusy] = useState(false);
  const destination = redirect ?? "/patient/dashboard";

  useEffect(() => {
    if (!loading && user) navigate({ to: destination, replace: true });
  }, [loading, user, destination, navigate]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    setBusy(true);
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}${destination}`,
            data: { full_name: String(form.get("full_name") ?? "") },
          },
        });
        if (error) throw error;
        toast.success("Account created", {
          description: "Check your inbox to confirm your email, then sign in.",
        });
        navigate({ to: "/auth", search: { mode: "login", redirect } });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: destination });
      }
    } catch (error) {
      toast.error(mode === "register" ? "Could not create account" : "Could not sign in", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setBusy(false);
    }
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed", { description: "Please try again." });
      return;
    }
    if (result.redirected) return;
    navigate({ to: destination });
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="section flex flex-1 items-center justify-center py-14">
        <div className="w-full max-w-md rounded-2xl border bg-card p-7 shadow-raised">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse aria-hidden className="size-5" />
            </span>
            <span className="font-display text-lg font-semibold">Gayatri Medical</span>
          </Link>

          <h1 className="mt-6 font-display text-2xl font-semibold">
            {mode === "register" ? "Create your account" : "Patient login"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "register"
              ? "Keep your appointments, prescriptions and reports in one place."
              : "Sign in to manage appointments and view your records."}
          </p>

          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            {mode === "register" ? (
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" required autoComplete="name" />
              </div>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete={mode === "register" ? "new-password" : "current-password"}
              />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Please wait…" : mode === "register" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full" onClick={() => void googleSignIn()}>
            Continue with Google
          </Button>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "register" ? (
              <>
                Already registered?{" "}
                <Link
                  to="/auth"
                  search={{ mode: "login", redirect }}
                  className="font-semibold text-accent hover:underline"
                >
                  Sign in
                </Link>
              </>
            ) : (
              <>
                New to Gayatri Medical?{" "}
                <Link
                  to="/auth"
                  search={{ mode: "register", redirect }}
                  className="font-semibold text-accent hover:underline"
                >
                  Create an account
                </Link>
              </>
            )}
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            You can also book without an account — <Link to="/booking" className="underline">book as a guest</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}
