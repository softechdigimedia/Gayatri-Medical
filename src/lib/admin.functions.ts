import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const roleSchema = z.enum(["patient", "doctor", "manager", "admin", "staff"]);
const roleChangeSchema = z.object({
  userId: z.string().uuid(),
  role: roleSchema,
  grant: z.boolean(),
});

async function requireAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("id")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error || !data) throw new Error("Forbidden");
}

export const listAdminAccounts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await requireAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [{ data, error }, { data: roles, error: rolesError }] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
      supabaseAdmin.from("user_roles").select("user_id, role").order("role"),
    ]);
    if (error) throw new Error("Could not load accounts.");
    if (rolesError) throw new Error("Could not load account roles.");
    const rolesByUser = new Map<string, Database["public"]["Enums"]["app_role"][]>();
    for (const row of roles ?? []) {
      const existing = rolesByUser.get(row.user_id) ?? [];
      existing.push(row.role);
      rolesByUser.set(row.user_id, existing);
    }
    return (data.users ?? []).map((user) => ({
      id: user.id,
      email: user.email ?? "",
      createdAt: user.created_at,
      roles: rolesByUser.get(user.id) ?? [],
    }));
  });

export const changeAdminAccountRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => roleChangeSchema.parse(input))
  .handler(async ({ data, context }) => {
    await requireAdmin(context);
    if (!data.grant && data.role === "admin" && data.userId === context.userId) {
      throw new Error("You cannot remove your own administrator access.");
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (!data.grant && data.role === "admin") {
      const { data: admins, error: adminsError } = await supabaseAdmin
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin");
      if (adminsError) throw new Error("Could not verify administrator access.");
      if ((admins ?? []).length <= 1) throw new Error("At least one administrator must remain.");
    }
    const { error } = await supabaseAdmin.rpc("admin_set_role", {
      _user_id: data.userId,
      _role: data.role,
      _grant: data.grant,
    });
    if (error) throw new Error("Could not update the account role.");
    return { ok: true as const };
  });