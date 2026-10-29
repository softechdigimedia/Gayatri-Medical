import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "patient" | "doctor" | "manager" | "admin" | "staff";
export const ALL_ROLES: AppRole[] = ["patient", "doctor", "staff", "manager", "admin"];
export const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // isodow 1..7
export const APPOINTMENT_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"];

export function useRoles() {
  const { user } = useAuth();
  const q = useQuery({
    queryKey: ["my-roles", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      if (!user) return [] as AppRole[];
      const { data, error } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (error) throw error;
      return data.map((r) => r.role as AppRole);
    },
  });
  const roles = q.data ?? [];
  return {
    user,
    roles,
    loading: q.isPending && Boolean(user),
    isAdmin: roles.includes("admin"),
    canManage: roles.some((r) => r === "admin" || r === "manager" || r === "staff"),
  };
}

export function useEffectiveRole() {
  const { roles, loading, isAdmin } = useRoles();
  return { roles, loading, isAdmin, canManage: roles.some((r) => r === "manager" || r === "staff") };
}
