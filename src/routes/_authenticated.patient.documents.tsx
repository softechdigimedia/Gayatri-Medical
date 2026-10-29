import { createFileRoute } from "@tanstack/react-router";

import { DocumentList } from "@/components/clinic/DocumentList";
import { PatientShell } from "@/components/clinic/PatientShell";

export const Route = createFileRoute("/_authenticated/patient/documents")({
  head: () => ({
    meta: [
      { title: "Reports & documents — Aarogya Care" },
      { name: "description", content: "Your lab reports and medical documents from Aarogya Care." },
      { property: "og:title", content: "Reports & documents — Aarogya Care" },
      { property: "og:description", content: "Lab reports and visit documents in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PatientShell title="Reports & documents">
      <DocumentList exclude="prescription" />
    </PatientShell>
  ),
});
