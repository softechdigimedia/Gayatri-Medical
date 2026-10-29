import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { PatientShell } from "@/components/clinic/PatientShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { myProfileQuery } from "@/lib/clinic";

export const Route = createFileRoute("/_authenticated/patient/profile")({
  head: () => ({
    meta: [
      { title: "My profile — Aarogya Care" },
      { name: "description", content: "Update your contact details for Aarogya Care bookings." },
      { property: "og:title", content: "My profile — Aarogya Care" },
      { property: "og:description", content: "Keep your details up to date." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const FIELDS = [
  ["full_name", "Full name", "text"],
  ["phone", "Phone", "tel"],
  ["date_of_birth", "Date of birth", "date"],
  ["gender", "Gender", "text"],
  ["address", "Address", "text"],
  ["city", "City", "text"],
] as const;

function ProfilePage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data } = useQuery(myProfileQuery);
  const [form, setForm] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!data) return undefined;
    const next: Record<string, string> = {};
    for (const [k] of FIELDS) next[k] = (data[k] as string | null) ?? "";
    setForm(next);
  }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form["full_name"] || null,
        phone: form["phone"] || null,
        date_of_birth: form["date_of_birth"] || null,
        gender: form["gender"] || null,
        address: form["address"] || null,
        city: form["city"] || null,
      })
      .eq("id", user.id);
    setSaving(false);
    if (error) {
      toast.error("Could not save your details. Please try again.");
      return;
    }
    toast.success("Profile updated");
    qc.invalidateQueries({ queryKey: ["my-profile"] });
  }

  return (
    <PatientShell title="My profile">
      <form onSubmit={save} className="grid max-w-2xl gap-4 rounded-xl border bg-card p-6 shadow-card sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label>Email</Label>
          <Input value={user?.email ?? ""} disabled className="mt-1.5" />
        </div>
        {FIELDS.map(([k, label, type]) => (
          <div key={k}>
            <Label htmlFor={k}>{label}</Label>
            <Input
              id={k}
              type={type}
              className="mt-1.5"
              value={form[k] ?? ""}
              onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
            />
          </div>
        ))}
        <div className="sm:col-span-2">
          <Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save changes"}</Button>
        </div>
      </form>
    </PatientShell>
  );
}
