import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Search, UserRoundCog } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/clinic/EmptyState";
import { ADMIN_NAV, StaffShell } from "@/components/clinic/StaffShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useServerFn } from "@tanstack/react-start";
import { changeAdminAccountRole, listAdminAccounts } from "@/lib/admin.functions";
import type { AppRole } from "@/lib/staff";
import { ALL_ROLES, useRoles } from "@/lib/staff";

export const Route = createFileRoute("/_authenticated/admin/accounts")({
  head: () => ({ meta: [
    { title: "Accounts & roles — Administration | Aarogya Care" },
    { name: "description", content: "Review clinic accounts and administer their access roles." },
    { property: "og:title", content: "Accounts & roles — Administration | Aarogya Care" },
    { property: "og:description", content: "Review clinic accounts and administer their access roles." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
    { name: "robots", content: "noindex" },
  ] }),
  component: AccountsPage,
});

function AccountsPage() {
  const { isAdmin, loading } = useRoles();
  return <StaffShell area="Administration" nav={ADMIN_NAV} title="Accounts & roles" allowed={isAdmin} loading={loading}><AccountsBoard /></StaffShell>;
}

function AccountsBoard() {
  const qc = useQueryClient();
  const { user } = useRoles();
  const [search, setSearch] = useState("");
  const listFn = useServerFn(listAdminAccounts);
  const updateFn = useServerFn(changeAdminAccountRole);
  const accounts = useQuery({ queryKey: ["admin-accounts"], queryFn: () => listFn() });
  const changeRole = useMutation({
    mutationFn: ({ userId, role, grant }: { userId: string; role: AppRole; grant: boolean }) => updateFn({ data: { userId, role, grant } }),
    onSuccess: () => { toast.success("Account access updated"); void qc.invalidateQueries({ queryKey: ["admin-accounts"] }); void qc.invalidateQueries({ queryKey: ["my-roles"] }); },
    onError: (error: Error) => toast.error(error.message || "Could not update account access."),
  });
  const filtered = useMemo(() => (accounts.data ?? []).filter((account) => account.email.toLowerCase().includes(search.trim().toLowerCase())), [accounts.data, search]);

  return (
    <div className="space-y-5">
      <div className="max-w-md space-y-2"><Label htmlFor="account-search">Find account</Label><div className="relative"><Search aria-hidden className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/><Input id="account-search" value={search} onChange={(event)=>setSearch(event.target.value)} placeholder="Search by email" className="pl-9" /></div></div>
      {accounts.isPending ? <div className="space-y-2">{[1,2,3].map((n)=><Skeleton key={n} className="h-20 w-full"/>)}</div> : accounts.isError ? <p role="alert" className="text-sm text-destructive">Could not load accounts. Please try again.</p> : filtered.length === 0 ? <EmptyState icon={UserRoundCog} title={search ? "No matching accounts" : "No accounts found"} description={search ? "Try another email address." : "Accounts will appear after users register."}/> : (
        <div className="divide-y border-y">
          {filtered.map((account)=><article key={account.id} className="grid gap-4 py-4 sm:grid-cols-[minmax(0,1fr)_minmax(220px,280px)] sm:items-center">
            <div className="min-w-0"><h2 className="truncate font-medium">{account.email || "Email unavailable"}</h2><p className="mt-1 text-xs text-muted-foreground">Joined {new Date(account.createdAt).toLocaleDateString()}</p><div className="mt-2 flex flex-wrap gap-1.5">{account.roles.length ? account.roles.map((role)=><span key={role} className="rounded-sm border px-2 py-0.5 text-xs capitalize">{role}</span>) : <span className="text-xs text-muted-foreground">No assigned roles</span>}</div></div>
            <div className="space-y-2"><Label htmlFor={`role-${account.id}`}>Assign role</Label><Select value="" onValueChange={(value)=>{ const role=value as AppRole; changeRole.mutate({userId:account.id,role,grant:!account.roles.includes(role)}); }} disabled={changeRole.isPending || account.id===user?.id}>
              <SelectTrigger id={`role-${account.id}`}><SelectValue placeholder={account.id===user?.id ? "Your account" : "Choose a role"}/></SelectTrigger>
              <SelectContent>{ALL_ROLES.map((role)=><SelectItem key={role} value={role}>{account.roles.includes(role) ? `Remove ${role}` : `Grant ${role}`}</SelectItem>)}</SelectContent>
            </Select></div>
          </article>)}
        </div>
      )}
      <p className="text-xs text-muted-foreground">Administrator access cannot be removed from your own account. The final administrator cannot be removed.</p>
    </div>
  );
}