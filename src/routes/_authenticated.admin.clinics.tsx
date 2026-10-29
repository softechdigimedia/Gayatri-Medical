import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Hospital, Stethoscope } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/clinic/EmptyState";
import { ADMIN_NAV, StaffShell } from "@/components/clinic/StaffShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney } from "@/lib/clinic";
import { useRoles } from "@/lib/staff";

type ClinicRow = { id: string; name: string; slug: string; address: string; city: string; phone: string | null; email: string | null; opens_at: string; closes_at: string; is_active: boolean };
type DoctorRow = { id: string; full_name: string; specialty: string; consultation_fee: number; clinic_id: string | null; is_active: boolean };

export const Route = createFileRoute("/_authenticated/admin/clinics")({
  head: () => ({ meta: [
    { title: "Clinics & doctors — Administration | Aarogya Care" },
    { name: "description", content: "Maintain clinic locations and doctor listings." },
    { property: "og:title", content: "Clinics & doctors — Administration | Aarogya Care" },
    { property: "og:description", content: "Maintain clinic locations and doctor listings." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }, { name: "robots", content: "noindex" },
  ] }),
  component: ClinicsPage,
});

function ClinicsPage() {
  const { isAdmin, loading } = useRoles();
  return <StaffShell area="Administration" nav={ADMIN_NAV} title="Clinics & doctors" allowed={isAdmin} loading={loading}><ClinicEditor/></StaffShell>;
}

function ClinicEditor() {
  const qc = useQueryClient();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const clinics = useQuery({ queryKey: ["admin-clinics"], queryFn: async () => {
    const { data, error } = await supabase.from("clinics").select("*").order("name");
    if (error) throw error;
    return data as ClinicRow[];
  }});
  const doctors = useQuery({ queryKey: ["admin-doctors"], queryFn: async () => {
    const { data, error } = await supabase.from("doctors").select("id, full_name, specialty, consultation_fee, clinic_id, is_active").order("full_name");
    if (error) throw error;
    return data as DoctorRow[];
  }});
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["admin-clinics"] });
    void qc.invalidateQueries({ queryKey: ["admin-doctors"] });
    void qc.invalidateQueries({ queryKey: ["clinics"] });
    void qc.invalidateQueries({ queryKey: ["doctors"] });
    void qc.invalidateQueries({ queryKey: ["doctor"] });
  };
  const create = useMutation({ mutationFn: async () => {
    const cleanName = name.trim();
    const cleanCity = city.trim();
    const cleanAddress = address.trim();
    if (!cleanName || !cleanCity || !cleanAddress) throw new Error("Enter a clinic name, address and city.");
    const slug = cleanName.normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const { error } = await supabase.from("clinics").insert({ name: cleanName, slug, address: cleanAddress, city: cleanCity, phone: phone.trim() || null, email: email.trim() || null });
    if (error) throw error;
  }, onSuccess: () => { toast.success("Clinic added"); setName(""); setAddress(""); setCity(""); setPhone(""); setEmail(""); refresh(); }, onError: (error: Error) => toast.error(error.message || "Could not add clinic.") });

  return <div className="space-y-10">
    <section className="space-y-4">
      <div><h2 className="font-display text-lg font-semibold">Clinic locations</h2><p className="mt-1 text-sm text-muted-foreground">Edit branch details and opening hours.</p></div>
      {clinics.isPending ? <div className="space-y-2">{[1,2].map((n)=><Skeleton key={n} className="h-24 w-full"/>)}</div> : clinics.isError ? <p role="alert" className="text-sm text-destructive">Could not load clinics.</p> : clinics.data.length === 0 ? <EmptyState icon={Hospital} title="No clinics yet" description="Add a clinic location below."/> : <div className="divide-y border-y">{clinics.data.map((clinic)=><ClinicRowEditor key={clinic.id} clinic={clinic} onSaved={refresh}/>)}</div>}
      <div className="grid gap-3 border-t pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2"><Label htmlFor="new-clinic-name">Clinic name</Label><Input id="new-clinic-name" value={name} onChange={(e)=>setName(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="new-clinic-city">City</Label><Input id="new-clinic-city" value={city} onChange={(e)=>setCity(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="new-clinic-address">Address</Label><Input id="new-clinic-address" value={address} onChange={(e)=>setAddress(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="new-clinic-phone">Phone</Label><Input id="new-clinic-phone" type="tel" value={phone} onChange={(e)=>setPhone(e.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="new-clinic-email">Email</Label><Input id="new-clinic-email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} /></div>
        <div className="flex items-end"><Button onClick={()=>create.mutate()} disabled={create.isPending}>Add clinic</Button></div>
      </div>
    </section>

    <section className="space-y-4">
      <div><h2 className="font-display text-lg font-semibold">Doctor listings</h2><p className="mt-1 text-sm text-muted-foreground">Adjust consultation fees, clinic assignment and listing availability.</p></div>
      {doctors.isPending ? <div className="space-y-2">{[1,2,3].map((n)=><Skeleton key={n} className="h-20 w-full"/>)}</div> : doctors.isError ? <p role="alert" className="text-sm text-destructive">Could not load doctors.</p> : doctors.data.length === 0 ? <EmptyState icon={Stethoscope} title="No doctors found" description="Doctor profiles will appear here."/> : <div className="divide-y border-y">{doctors.data.map((doctor)=><DoctorRowEditor key={doctor.id} doctor={doctor} clinics={clinics.data ?? []} onSaved={refresh}/>)}</div>}
    </section>
  </div>;
}

function ClinicRowEditor({ clinic, onSaved }: { clinic: ClinicRow; onSaved: () => void }) {
  const [name, setName] = useState(clinic.name);
  const [city, setCity] = useState(clinic.city);
  const [address, setAddress] = useState(clinic.address);
  const [phone, setPhone] = useState(clinic.phone ?? "");
  const [email, setEmail] = useState(clinic.email ?? "");
  const [opens, setOpens] = useState(clinic.opens_at.slice(0,5));
  const [closes, setCloses] = useState(clinic.closes_at.slice(0,5));
  const [active, setActive] = useState(clinic.is_active);
  const save = useMutation({ mutationFn: async () => {
    const slug = name.trim().normalize("NFKD").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
    const { error } = await supabase.from("clinics").update({ name: name.trim(), slug, city: city.trim(), address: address.trim(), phone: phone.trim() || null, email: email.trim() || null, opens_at: opens, closes_at: closes, is_active: active }).eq("id",clinic.id);
    if(error) throw error;
  }, onSuccess:()=>{toast.success("Clinic details saved");onSaved();},onError:()=>toast.error("Could not save clinic details.")});
  return <article className="space-y-3 py-4">
    <div className="flex flex-wrap items-center justify-between gap-3"><h3 className="font-medium">{clinic.name}</h3><div className="flex items-center gap-2"><Switch id={`clinic-active-${clinic.id}`} checked={active} onCheckedChange={setActive}/><Label htmlFor={`clinic-active-${clinic.id}`} className="text-xs">{active ? "Active" : "Inactive"}</Label></div></div>
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <div className="space-y-1"><Label htmlFor={`clinic-name-${clinic.id}`}>Name</Label><Input id={`clinic-name-${clinic.id}`} value={name} onChange={(e)=>setName(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-city-${clinic.id}`}>City</Label><Input id={`clinic-city-${clinic.id}`} value={city} onChange={(e)=>setCity(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-address-${clinic.id}`}>Address</Label><Input id={`clinic-address-${clinic.id}`} value={address} onChange={(e)=>setAddress(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-phone-${clinic.id}`}>Phone</Label><Input id={`clinic-phone-${clinic.id}`} value={phone} onChange={(e)=>setPhone(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-email-${clinic.id}`}>Email</Label><Input id={`clinic-email-${clinic.id}`} value={email} onChange={(e)=>setEmail(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-open-${clinic.id}`}>Opens</Label><Input id={`clinic-open-${clinic.id}`} type="time" value={opens} onChange={(e)=>setOpens(e.target.value)}/></div>
      <div className="space-y-1"><Label htmlFor={`clinic-close-${clinic.id}`}>Closes</Label><Input id={`clinic-close-${clinic.id}`} type="time" value={closes} onChange={(e)=>setCloses(e.target.value)}/></div>
      <div className="flex items-end"><Button variant="outline" onClick={()=>save.mutate()} disabled={save.isPending}>Save clinic</Button></div>
    </div>
  </article>;
}

function DoctorRowEditor({ doctor, clinics, onSaved }: { doctor: DoctorRow; clinics: ClinicRow[]; onSaved: () => void }) {
  const [fee, setFee] = useState(String(doctor.consultation_fee));
  const [clinicId, setClinicId] = useState(doctor.clinic_id ?? "none");
  const [active, setActive] = useState(doctor.is_active);
  const save = useMutation({ mutationFn: async () => {
    const amount = Number(fee);
    if (!Number.isFinite(amount) || amount < 0) throw new Error("Enter a valid consultation fee.");
    const { error } = await supabase.from("doctors").update({ consultation_fee: amount, clinic_id: clinicId === "none" ? null : clinicId, is_active: active }).eq("id",doctor.id);
    if (error) throw error;
  },onSuccess:()=>{toast.success("Doctor listing saved");onSaved();},onError:(error:Error)=>toast.error(error.message||"Could not save doctor listing.")});
  return <article className="grid gap-4 py-4 lg:grid-cols-[minmax(0,1fr)_150px_minmax(190px,240px)_auto_auto] lg:items-end">
    <div className="min-w-0"><h3 className="truncate font-medium">{doctor.full_name}</h3><p className="text-xs text-muted-foreground">{doctor.specialty}</p></div>
    <div className="space-y-1"><Label htmlFor={`fee-${doctor.id}`}>Fee</Label><Input id={`fee-${doctor.id}`} type="number" min="0" step="1" value={fee} onChange={(e)=>setFee(e.target.value)} aria-label={`Fee for ${doctor.full_name}`}/><span className="text-xs text-muted-foreground">Current: {formatMoney(doctor.consultation_fee)}</span></div>
    <div className="space-y-1"><Label htmlFor={`doctor-clinic-${doctor.id}`}>Clinic</Label><Select value={clinicId} onValueChange={setClinicId}><SelectTrigger id={`doctor-clinic-${doctor.id}`}><SelectValue/></SelectTrigger><SelectContent><SelectItem value="none">No clinic assigned</SelectItem>{clinics.map((clinic)=><SelectItem key={clinic.id} value={clinic.id}>{clinic.name}</SelectItem>)}</SelectContent></Select></div>
    <div className="flex items-center gap-2"><Switch id={`doctor-active-${doctor.id}`} checked={active} onCheckedChange={setActive}/><Label htmlFor={`doctor-active-${doctor.id}`} className="text-xs">{active?"Active":"Inactive"}</Label></div>
    <Button variant="outline" onClick={()=>save.mutate()} disabled={save.isPending}>Save</Button>
  </article>;
}