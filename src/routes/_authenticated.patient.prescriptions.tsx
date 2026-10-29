import { createFileRoute } from "@tanstack/react-router";

import { DocumentList } from "@/components/clinic/DocumentList";
import { PatientShell } from "@/components/clinic/PatientShell";

export const Route = createFileRoute("/_authenticated/patient/prescriptions")({
  head: () => ({
    meta: [
      { title: "Prescriptions — Aarogya Care" },
      { name: "description", content: "Prescriptions issued by your Aarogya Care doctors." },
      { property: "og:title", content: "Prescriptions — Aarogya Care" },
      { property: "og:description", content: "All your prescriptions in one place." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => (
    <PatientShell title="Prescriptions">
      <DocumentList kind="prescription" />
    </PatientShell>
  ),
});
