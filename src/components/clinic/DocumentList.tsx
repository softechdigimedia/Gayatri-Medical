import { useQuery } from "@tanstack/react-query";
import { FileText } from "lucide-react";

import { EmptyState } from "@/components/clinic/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDateLong, myDocumentsQuery } from "@/lib/clinic";

export function DocumentList({ kind, exclude }: { kind?: string; exclude?: string }) {
  const { data, isLoading } = useQuery(myDocumentsQuery);
  const rows = (data ?? []).filter((d) => (kind ? d.kind === kind : d.kind !== exclude));
  if (isLoading) return <Skeleton className="h-24 w-full" />;
  if (rows.length === 0)
    return (
      <EmptyState
        icon={FileText}
        title="Nothing here yet"
        description="Your doctor will share files here after your consultation."
      />
    );
  return (
    <ul className="space-y-3">
      {rows.map((d) => (
        <li key={d.id} className="rounded-xl border bg-card p-5 shadow-card">
          <div className="flex flex-wrap justify-between gap-2">
            <p className="font-semibold">{d.title}</p>
            <span className="text-xs text-muted-foreground">{formatDateLong(d.created_at.slice(0, 10))}</span>
          </div>
          {d.doctors ? (
            <p className="text-sm text-muted-foreground">{d.doctors.full_name} · {d.doctors.specialty}</p>
          ) : null}
          {d.content ? <p className="mt-2 whitespace-pre-line text-sm">{d.content}</p> : null}
          {d.file_url ? (
            <a href={d.file_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm font-medium text-primary hover:underline">
              Open file
            </a>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
