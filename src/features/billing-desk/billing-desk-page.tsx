"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Bell, ChevronDown, MessageSquareText, Minus, Plus, Printer, ReceiptText, RefreshCcw, Search, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  billingAppointments,
  billingDeskSteps,
  billingDoctorFees,
  billingPatients,
  billingReferrals,
  billingServices,
  type BillingReferral,
  type BillingDeskPatient,
  type BillingDeskService,
  type BillingDeskStep,
  type BillingAppointment,
} from "@/data/billing-desk";
import { cn } from "@/lib/utils";

type BillLine = BillingDeskService & { qty: number };
type PaymentLine = { id: string; mode: "Cash" | "Card" | "UPI" | "Insurance"; amount: number; status: "Pending" | "Confirmed" };
type AppointmentVisitType = BillingAppointment["visitType"];
type AppointmentBillingStatus = BillingAppointment["billingStatus"];
type BillingTotals = { subtotal: number; discount: number; tax: number; total: number; insuranceAmount: number; paid: number; balance: number; patientPayable: number };
type BillingState = {
  activePatient: BillingDeskPatient;
  patients: BillingDeskPatient[];
  activeReferral: BillingReferral;
  lines: BillLine[];
  payments: PaymentLine[];
  removedLine: BillLine | null;
  billStatus: "Draft" | "Ready" | "Paid" | "Partial";
  lastSavedAt: string;
};
type BillingAction =
  | { type: "selectPatient"; patient: BillingDeskPatient }
  | { type: "registerPatient"; patient: BillingDeskPatient }
  | { type: "selectReferral"; referral: BillingReferral }
  | { type: "addService"; service: BillingDeskService; qty?: number }
  | { type: "addPackage"; service: BillingDeskService }
  | { type: "qty"; id: string; delta: number }
  | { type: "remove"; id: string }
  | { type: "undoRemove" }
  | { type: "reset" }
  | { type: "pay"; mode: PaymentLine["mode"]; amount: number };

function calculateTotals(lines: BillLine[], payments: PaymentLine[], patient: BillingDeskPatient): BillingTotals {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = lines.reduce((sum, line) => sum + line.price * line.qty * line.discount / 100, 0);
  const tax = lines.reduce((sum, line) => {
    const base = line.price * line.qty;
    return sum + (base - base * line.discount / 100) * line.tax / 100;
  }, 0);
  const total = subtotal - discount + tax;
  const confirmedPaid = payments.filter((payment) => payment.status === "Confirmed").reduce((sum, payment) => sum + payment.amount, 0);
  const insuranceAmount = patient.insuranceStatus === "Approved" || patient.insuranceStatus === "Pre-auth required" ? Math.round(total * 0.55) : 0;
  const patientPayable = Math.max(total - insuranceAmount, 0);
  return { subtotal, discount, tax, total, insuranceAmount, paid: confirmedPaid, patientPayable, balance: Math.max(patientPayable - confirmedPaid, 0) };
}

const initialBillingState: BillingState = {
  activePatient: billingPatients[0],
  patients: billingPatients,
  activeReferral: billingReferrals[3],
  lines: [{ ...billingServices[0], qty: 1 }, { ...billingServices[9], qty: 1 }, { ...billingServices[11], qty: 1 }],
  payments: [],
  removedLine: null,
  billStatus: "Draft",
  lastSavedAt: "Autosaved just now",
};

function referralForPatient(patient: BillingDeskPatient) {
  return billingReferrals.find((referral) => referral.doctor === patient.referralSource || referral.organization === patient.referralSource || referral.source === patient.referralSource) ?? billingReferrals[0];
}

function billingReducer(state: BillingState, action: BillingAction): BillingState {
  const saved = "Autosaved just now";
  if (action.type === "selectPatient") {
    return { ...state, activePatient: action.patient, activeReferral: referralForPatient(action.patient), billStatus: "Draft", lastSavedAt: saved };
  }
  if (action.type === "registerPatient") {
    return { ...state, patients: [action.patient, ...state.patients], activePatient: action.patient, activeReferral: referralForPatient(action.patient), lastSavedAt: saved };
  }
  if (action.type === "selectReferral") return { ...state, activeReferral: action.referral, lastSavedAt: saved };
  if (action.type === "addPackage") {
    const included = (action.service.includedServiceIds ?? []).map((id) => billingServices.find((service) => service.id === id)).filter(Boolean) as BillingDeskService[];
    const withoutDupes = [action.service, ...included.map((service) => ({ ...service, discount: 100 }))].filter((service) => !state.lines.some((line) => line.id === service.id));
    return { ...state, lines: [...state.lines, ...withoutDupes.map((service) => ({ ...service, qty: 1 }))], billStatus: "Ready", lastSavedAt: saved };
  }
  if (action.type === "addService") {
    if (state.lines.some((line) => line.id === action.service.id)) return state;
    return { ...state, lines: [...state.lines, { ...action.service, qty: action.qty ?? 1 }], billStatus: "Ready", lastSavedAt: saved };
  }
  if (action.type === "qty") return { ...state, lines: state.lines.map((line) => line.id === action.id ? { ...line, qty: Math.max(1, line.qty + action.delta) } : line), lastSavedAt: saved };
  if (action.type === "remove") {
    const removedLine = state.lines.find((line) => line.id === action.id) ?? null;
    return { ...state, lines: state.lines.filter((line) => line.id !== action.id), removedLine, lastSavedAt: saved };
  }
  if (action.type === "undoRemove" && state.removedLine) return { ...state, lines: [...state.lines, state.removedLine], removedLine: null, lastSavedAt: saved };
  if (action.type === "pay") return { ...state, payments: [...state.payments, { id: `pay-${Date.now()}`, mode: action.mode, amount: action.amount, status: "Confirmed" }], billStatus: "Partial", lastSavedAt: saved };
  if (action.type === "reset") return { ...initialBillingState, activePatient: state.activePatient, patients: state.patients, activeReferral: state.activeReferral };
  return state;
}

const BillingDeskContext = React.createContext<{
  state: BillingState;
  totals: BillingTotals;
  dispatch: React.Dispatch<BillingAction>;
  addService: (service: BillingDeskService) => void;
} | null>(null);

function useBillingDesk() {
  const context = React.useContext(BillingDeskContext);
  if (!context) throw new Error("BillingDeskContext missing");
  return context;
}

function BillingDeskProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(billingReducer, initialBillingState);
  const totals = React.useMemo(() => calculateTotals(state.lines, state.payments, state.activePatient), [state.lines, state.payments, state.activePatient]);
  const addService = React.useCallback((service: BillingDeskService) => {
    const duplicate = state.lines.some((line) => line.id === service.id);
    if (duplicate) {
      toast.warning(`${service.name} already added`);
      return;
    }
    dispatch(service.category === "Package" ? { type: "addPackage", service } : { type: "addService", service });
    toast.success(`${service.name} added to bill`);
  }, [state.lines]);
  React.useEffect(() => {
    window.localStorage.setItem("plasmit-billing-desk-draft", JSON.stringify({ patient: state.activePatient.uhid, lines: state.lines.length, at: state.lastSavedAt }));
  }, [state.activePatient.uhid, state.lines.length, state.lastSavedAt]);
  return <BillingDeskContext.Provider value={{ state, totals, dispatch, addService }}>{children}</BillingDeskContext.Provider>;
}

const stepRoute: Record<BillingDeskStep, string> = {
  patient: "/billing-desk/patient",
  referral: "/billing-desk",
  appointments: "/billing-desk",
  pathology: "/billing-desk/tests",
  radiology: "/billing-desk/tests",
  packages: "/billing-desk/packages",
  "quick-tests": "/billing-desk/tests",
  "individual-tests": "/billing-desk/tests",
  summary: "/billing-desk/summary",
  payment: "/billing-desk/payment",
};

function money(value: number) {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}

function PageMotion({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}

function BillingDeskTopbar() {
  return (
    <Card className="sticky top-0 z-20">
      <CardContent className="flex flex-col gap-3 p-3 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search staff, settings, profile..." />
          <Badge tone="muted" className="hidden shrink-0 md:inline-flex">Ctrl K</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" aria-label="Notifications"><Bell className="h-4 w-4" /></Button>
          <Button size="icon" variant="outline" aria-label="Messages"><MessageSquareText className="h-4 w-4" /></Button>
          <div className="flex h-10 items-center gap-2 rounded-lg border border-border bg-white px-2 shadow-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">RB</div>
            <div className="hidden text-xs sm:block"><div className="font-bold text-foreground">Rohit B.</div><div className="text-muted-foreground">Billing Desk</div></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowTabs({ active, onChange }: { active: BillingDeskStep; onChange: (step: BillingDeskStep) => void }) {
  return (
    <Card className="sticky top-16 z-10">
      <CardContent className="flex gap-1 overflow-x-auto p-2">
        {billingDeskSteps.slice(0, 9).map((step) => {
          const Icon = step.icon;
          const selected = active === step.id;
          return (
            <button key={step.id} onClick={() => onChange(step.id)} className={cn("flex h-10 shrink-0 items-center gap-2 rounded-lg px-3 text-sm font-semibold transition", selected ? "bg-primary text-white shadow-[0_8px_18px_rgba(115,103,240,0.20)]" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{step.label}</span>
            </button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function PatientCard({ patient, selected, onSelect }: { patient: BillingDeskPatient; selected: boolean; onSelect: () => void }) {
  return (
    <button onClick={onSelect} className={cn("w-full rounded-xl border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-soft/40 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]", selected ? "border-primary ring-2 ring-primary/15" : "border-border")}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><div className="text-base font-bold text-foreground">{patient.name}</div><div className="mt-1 text-xs font-semibold text-muted-foreground">{patient.uhid} • {patient.phone}</div></div>
        {selected ? <Badge tone="info">Selected</Badge> : <Badge tone={patient.status === "Due" ? "warning" : patient.status === "Insurance" ? "info" : "muted"}>{patient.status}</Badge>}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <span>{patient.ageGender}</span><span>Blood {patient.bloodGroup}</span><span>Reg {patient.registeredAt}</span>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge tone="muted">{patient.payer}</Badge>
        <Badge tone={patient.insuranceStatus === "Approved" ? "success" : patient.insuranceStatus === "Pre-auth required" || patient.insuranceStatus === "Pending" ? "warning" : "muted"}>{patient.insuranceStatus}</Badge>
        <Badge tone="muted">{patient.lastVisit}</Badge>
      </div>
    </button>
  );
}

function PatientWorkspace({ selectedPatient, patients, onSelect, onRegister }: { selectedPatient: BillingDeskPatient; patients: BillingDeskPatient[]; onSelect: (patient: BillingDeskPatient) => void; onRegister: (patient: BillingDeskPatient) => void }) {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [payer, setPayer] = React.useState("All payers");
  const [city, setCity] = React.useState("All cities");
  const [source, setSource] = React.useState("All sources");
  const [page, setPage] = React.useState(1);
  const [registerOpen, setRegisterOpen] = React.useState(false);
  const [draft, setDraft] = React.useState({
    name: "",
    phone: "",
    age: "",
    gender: "Female",
    dob: "",
    bloodGroup: "O+",
    payerType: "Self",
    payer: "Self",
    department: "General Medicine",
    visitType: "OPD",
    city: "Pune",
    state: "Maharashtra",
    address: "",
    email: "",
    idType: "Aadhaar",
    idNumber: "",
    source: "Walk-in",
    doctor: "Dr. Kavita Rao",
  });
  React.useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 220);
    return () => window.clearTimeout(timer);
  }, [search]);
  React.useEffect(() => setPage(1), [debouncedSearch, payer, city, source]);
  const payers = ["All payers", ...Array.from(new Set(patients.map((patient) => patient.payer)))];
  const cities = ["All cities", ...Array.from(new Set(patients.map((patient) => patient.city)))];
  const sources = ["All sources", ...Array.from(new Set(patients.map((patient) => patient.source)))];
  const rows = patients.filter((patient) => {
    const matchesSearch = `${patient.name} ${patient.uhid} ${patient.phone} ${patient.bloodGroup} ${patient.address} ${patient.payer} ${patient.city}`.toLowerCase().includes(debouncedSearch.toLowerCase());
    return matchesSearch && (payer === "All payers" || patient.payer === payer) && (city === "All cities" || patient.city === city) && (source === "All sources" || patient.source === source);
  });
  const pageSize = 4;
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));
  const visibleRows = rows.slice((page - 1) * pageSize, page * pageSize);
  const duplicate = patients.some((patient) => patient.phone.replace(/\D/g, "") === draft.phone.replace(/\D/g, "") && draft.phone);
  const createPatient = () => {
    if (!draft.name.trim() || draft.phone.replace(/\D/g, "").length < 8) {
      toast.error("Patient name and valid phone are required");
      return;
    }
    const now = Date.now().toString();
    const patient: BillingDeskPatient = {
      id: `pat-${now}`,
      name: draft.name.trim(),
      uhid: `PLH-${now.slice(-6)}`,
      phone: draft.phone,
      ageGender: `${draft.age || "New"}/${draft.gender.charAt(0)}`,
      bloodGroup: draft.bloodGroup,
      registeredAt: "Today",
      payer: draft.payer,
      address: draft.address || "Quick registration address pending",
      city: draft.city,
      source: draft.visitType,
      doctor: draft.doctor,
      status: draft.payerType === "Self" ? "Active" : draft.payerType === "Corporate" ? "Corporate" : "Insurance",
      referralSource: draft.source,
      lastVisit: "New registration",
      insuranceStatus: draft.payerType === "Self" ? "Not required" : "Pending",
    };
    onRegister(patient);
    setRegisterOpen(false);
    setDraft({ name: "", phone: "", age: "", gender: "Female", dob: "", bloodGroup: "O+", payerType: "Self", payer: "Self", department: "General Medicine", visitType: "OPD", city: "Pune", state: "Maharashtra", address: "", email: "", idType: "Aadhaar", idNumber: "", source: "Walk-in", doctor: "Dr. Kavita Rao" });
    toast.success(`${patient.name} registered and selected`);
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-white px-3 shadow-sm"><Search className="h-4 w-4 text-muted-foreground" /><Input className="border-0 shadow-none focus:ring-0" placeholder="Search by patient, UHID, phone, payer, city..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
            <PatientFilter label="Payer" value={payer} onChange={setPayer} options={payers} />
            <PatientFilter label="City" value={city} onChange={setCity} options={cities} />
            <PatientFilter label="Source" value={source} onChange={setSource} options={sources} />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>{rows.length} matching patients</span>
            {(search || payer !== "All payers" || city !== "All cities" || source !== "All sources") ? <Button size="sm" variant="ghost" onClick={() => { setSearch(""); setPayer("All payers"); setCity("All cities"); setSource("All sources"); }}>Clear filters</Button> : null}
          </div>
          <div className="flex flex-wrap gap-2">
            {patients.slice(0, 3).map((patient) => <Button key={patient.id} size="sm" variant={selectedPatient.id === patient.id ? "default" : "outline"} onClick={() => onSelect(patient)}>{patient.name}</Button>)}
          </div>
          <div className="grid gap-3 xl:grid-cols-2">{visibleRows.map((patient) => <PatientCard key={patient.id} patient={patient} selected={selectedPatient.id === patient.id} onSelect={() => { onSelect(patient); toast.success(`${patient.name} selected`); }} />)}</div>
          {!rows.length ? <EmptyState icon={Search} title="No patient found" description="Try another UHID, phone number, city, payer, or blood group." /> : null}
          {rows.length > pageSize ? (
            <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
              <span className="font-semibold text-muted-foreground">Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>Previous</Button>
                <Button size="sm" variant="outline" disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next</Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div><div className="font-bold text-foreground">Register New Patient</div><div className="text-sm text-muted-foreground">Create UHID from the billing desk when no existing patient is found.</div></div>
          <Button variant={registerOpen ? "default" : "outline"} onClick={() => setRegisterOpen((open) => !open)}><Plus className="h-4 w-4" />{registerOpen ? "Close registration" : "Open quick registration"}</Button>
        </CardContent>
        {registerOpen ? (
          <CardContent className="border-t border-border bg-surface-muted/45 p-4">
            {duplicate ? <AlertHint text="Duplicate detection: this phone number already exists in patient master." /> : null}
            <div className="mt-3 rounded-2xl border border-border bg-white p-4 shadow-soft">
              <div className="mb-4 flex flex-col gap-1 border-b border-border pb-3">
                <div className="text-sm font-bold text-foreground">Quick UHID registration</div>
                <div className="text-xs font-medium text-muted-foreground">Minimum demographics for billing, appointment, and diagnostics handoff.</div>
              </div>
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                <QuickRegisterField label="Patient name" required value={draft.name} placeholder="e.g. Meera Joshi" onChange={(value) => setDraft((current) => ({ ...current, name: value }))} />
                <QuickRegisterField label="Phone" required value={draft.phone} placeholder="+91 98765 44210" onChange={(value) => setDraft((current) => ({ ...current, phone: value }))} />
                <QuickRegisterField label="Age" required value={draft.age} placeholder="42" onChange={(value) => setDraft((current) => ({ ...current, age: value }))} />
                <QuickRegisterSelect label="Gender" required value={draft.gender} onChange={(value) => setDraft((current) => ({ ...current, gender: value }))} options={["Female", "Male", "Other", "Unknown"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterField label="Date of birth" value={draft.dob} placeholder="18 Apr 1984" onChange={(value) => setDraft((current) => ({ ...current, dob: value }))} />
                <QuickRegisterSelect label="Blood group" value={draft.bloodGroup} onChange={(value) => setDraft((current) => ({ ...current, bloodGroup: value }))} options={["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-", "Unknown"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterSelect label="Visit type" value={draft.visitType} onChange={(value) => setDraft((current) => ({ ...current, visitType: value }))} options={["OPD", "IPD", "Emergency", "Lab", "Radiology"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterSelect label="Department" value={draft.department} onChange={(value) => setDraft((current) => ({ ...current, department: value }))} options={["General Medicine", "Cardiology", "Orthopedics", "Pediatrics", "Emergency", "Diagnostics"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterSelect label="Payer type" value={draft.payerType} onChange={(value) => setDraft((current) => ({ ...current, payerType: value, payer: value === "Self" ? "Self" : current.payer }))} options={["Self", "Insurance", "Corporate", "TPA", "CGHS"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterField label="Payer / company" value={draft.payer} placeholder="Self / Star Health / Corporate" onChange={(value) => setDraft((current) => ({ ...current, payer: value }))} />
                <QuickRegisterSelect label="Referral source" value={draft.source} onChange={(value) => setDraft((current) => ({ ...current, source: value }))} options={["Walk-in", "Doctor referral", "Corporate", "Camp", "TPA"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterSelect label="ID type" value={draft.idType} onChange={(value) => setDraft((current) => ({ ...current, idType: value }))} options={["Aadhaar", "PAN", "Passport", "Driving license", "Voter ID", "Not available"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterField label="ID number" value={draft.idNumber} placeholder="Masked / last 4 digits" onChange={(value) => setDraft((current) => ({ ...current, idNumber: value }))} />
                <QuickRegisterField label="Email" value={draft.email} placeholder="patient@example.com" onChange={(value) => setDraft((current) => ({ ...current, email: value }))} />
                <QuickRegisterSelect label="City" value={draft.city} onChange={(value) => setDraft((current) => ({ ...current, city: value }))} options={["Pune", "Delhi", "Noida", "Gurugram", "Mumbai", "Bengaluru"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterSelect label="State" value={draft.state} onChange={(value) => setDraft((current) => ({ ...current, state: value }))} options={["Maharashtra", "Delhi", "Uttar Pradesh", "Haryana", "Karnataka"].map((item) => ({ label: item, value: item }))} />
                <QuickRegisterField label="Address" value={draft.address} placeholder="House / area / landmark" onChange={(value) => setDraft((current) => ({ ...current, address: value }))} className="xl:col-span-2" />
                <QuickRegisterSelect label="Consultant" value={draft.doctor} onChange={(value) => setDraft((current) => ({ ...current, doctor: value }))} options={billingDoctorFees.map((doctor) => ({ label: `${doctor.doctor} - ${doctor.department}`, value: doctor.doctor }))} className="xl:col-span-2" />
              </div>
              <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-surface-muted p-3 md:flex-row md:items-center md:justify-between">
                <div className="text-xs font-medium text-muted-foreground">New patient will be auto-selected in Billing Desk after UHID creation.</div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setRegisterOpen(false)}>Cancel</Button>
                  <Button onClick={createPatient}>Create UHID & select</Button>
                </div>
              </div>
            </div>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}

function QuickRegisterField({ label, value, placeholder, onChange, required, className }: { label: string; value: string; placeholder: string; onChange: (value: string) => void; required?: boolean; className?: string }) {
  return (
    <label className={cn("rounded-xl border border-border bg-white p-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15", className)}>
      <span className="mb-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">{label}{required ? <span className="text-danger">*</span> : null}</span>
      <Input className="h-11 border-0 bg-transparent px-0 text-sm font-semibold shadow-none focus:ring-0" placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function QuickRegisterSelect({ label, value, onChange, options, required, className }: { label: string; value: string; onChange: (value: string) => void; options: { label: string; value: string }[]; required?: boolean; className?: string }) {
  return (
    <label className={cn("group block space-y-1.5", className)}>
      <span className="flex items-center gap-1 text-xs font-bold text-muted-foreground">{label}{required ? <span className="text-danger">*</span> : null}</span>
      <span className="relative block">
        <select className="h-11 w-full appearance-none rounded-xl border border-input bg-white px-3.5 pr-11 text-sm font-semibold text-foreground shadow-sm outline-none transition hover:border-primary/45 focus:border-primary focus:ring-2 focus:ring-primary/15" value={value} onChange={(event) => onChange(event.target.value)}>
          {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
        <span className="pointer-events-none absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-surface-muted text-muted-foreground transition group-focus-within:border-primary/30 group-focus-within:bg-primary-soft group-focus-within:text-primary">
          <ChevronDown className="h-4 w-4" />
        </span>
      </span>
    </label>
  );
}

function PatientFilter({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative min-w-[150px]">
      <span className="sr-only">{label}</span>
      <select className="h-10 w-full appearance-none rounded-lg border border-input bg-white px-3 pr-9 text-sm font-semibold text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
    </label>
  );
}

function ServiceCard({ service, added, onAdd }: { service: BillingDeskService; added: boolean; onAdd: () => void }) {
  return (
    <Card className={cn("transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]", added ? "border-primary" : "")}>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div><div className="font-bold text-foreground">{service.name}</div><div className="mt-1 text-xs text-muted-foreground">{service.group} • {service.meta}</div></div>
          <Badge tone={service.urgency === "Stat" ? "danger" : service.urgency === "Urgent" ? "warning" : "muted"}>{service.urgency ?? service.category}</Badge>
        </div>
        <div className="flex flex-wrap gap-2">
          {service.tat ? <Badge tone="muted">TAT {service.tat}</Badge> : null}
          {service.sample ? <Badge tone="muted">{service.sample}</Badge> : null}
          {service.modality ? <Badge tone="info">{service.modality}</Badge> : null}
          {service.fasting ? <Badge tone="warning">Fasting</Badge> : null}
          {service.contrast ? <Badge tone="warning">Contrast</Badge> : null}
          {service.insuranceCovered ? <Badge tone="success">Insurance covered</Badge> : null}
        </div>
        <div className="flex items-center justify-between"><div className="text-lg font-bold text-foreground">{money(service.price)}</div><Button size="sm" variant={added ? "outline" : "default"} onClick={onAdd}>{added ? "Added" : "Add"}</Button></div>
      </CardContent>
    </Card>
  );
}

function ReferralWorkspace({ activeReferral, onSelect }: { activeReferral: BillingReferral; onSelect: (referral: BillingReferral) => void }) {
  const [source, setSource] = React.useState("All sources");
  const [search, setSearch] = React.useState("");
  const sources = ["All sources", ...Array.from(new Set(billingReferrals.map((item) => item.source)))];
  const rows = billingReferrals.filter((item) => {
    const matchesSource = source === "All sources" || item.source === source;
    const matchesSearch = `${item.doctor} ${item.organization} ${item.source} ${item.notes}`.toLowerCase().includes(search.toLowerCase());
    return matchesSource && matchesSearch;
  });
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-white px-3 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input className="border-0 shadow-none focus:ring-0" placeholder="Search referring doctor, clinic, TPA, camp..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <PatientFilter label="Referral source" value={source} onChange={setSource} options={sources} />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge tone="info">Recent: {billingReferrals[0].doctor}</Badge>
            <Badge tone="success">Favorite: {billingReferrals[1].organization}</Badge>
            <Badge tone="warning">Smart suggestion: match payer/referral source</Badge>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {rows.map((referral) => (
              <button key={referral.id} onClick={() => { onSelect(referral); toast.success(`${referral.doctor} referral selected`); }} className={cn("rounded-xl border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-soft/40 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]", activeReferral.id === referral.id ? "border-primary ring-2 ring-primary/15" : "border-border")}>
                <div className="flex items-start justify-between gap-3">
                  <div><div className="font-bold text-foreground">{referral.doctor}</div><div className="mt-1 text-xs font-semibold text-muted-foreground">{referral.organization} • {referral.source}</div></div>
                  <Badge tone={referral.status === "Mapped" ? "success" : referral.status === "Approval needed" ? "warning" : "muted"}>{referral.status}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2"><Badge tone="info">Commission {referral.commission}</Badge><span className="text-xs text-muted-foreground">{referral.notes}</span></div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Referral billing mapping</CardTitle><CardDescription>Selected referral details are carried into bill audit and payout rules.</CardDescription></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          <label className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">Referring doctor/source</span><Input value={activeReferral.doctor} readOnly /></label>
          <label className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">Referral source</span><Input value={activeReferral.source} readOnly /></label>
          <label className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">Commission mapping</span><Input value={activeReferral.commission} readOnly /></label>
          <label className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">Approval status</span><Input value={activeReferral.status} readOnly /></label>
          <label className="space-y-1 md:col-span-2"><span className="text-xs font-semibold text-muted-foreground">Notes</span><textarea className="min-h-24 w-full rounded-lg border border-input bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring/15" defaultValue={activeReferral.notes} key={activeReferral.id} /></label>
          <div className="rounded-xl border border-primary/20 bg-primary-soft p-3 text-sm md:col-span-2">
            <div className="font-bold text-foreground">Commission preview</div>
            <div className="mt-1 text-muted-foreground">{activeReferral.commission} mapping will be attached to this bill audit trail after save.</div>
          </div>
          <Button className="md:col-span-2" onClick={() => toast.success("Referral mapping saved")}>Save referral mapping</Button>
        </CardContent>
      </Card>
    </div>
  );
}

function AppointmentsWorkspace({ patient, onAdd }: { patient: BillingDeskPatient; onAdd: (service: BillingDeskService) => void }) {
  const patientAppointments = billingAppointments.filter((appointment) => appointment.patientId === patient.id);
  const appointments = patientAppointments.length ? patientAppointments : billingAppointments;
  const [selectedId, setSelectedId] = React.useState(appointments[0].id);
  const selected = appointments.find((appointment) => appointment.id === selectedId) ?? appointments[0];
  const [mappedDoctor, setMappedDoctor] = React.useState(selected.doctor);
  const [billingStatus, setBillingStatus] = React.useState(selected.billingStatus);
  const [visitType, setVisitType] = React.useState(selected.visitType);
  const doctorFee = billingDoctorFees.find((doctor) => doctor.doctor === mappedDoctor) ?? billingDoctorFees[0];
  const discount = billingStatus === "Package covered" ? 100 : 0;
  const addAppointmentFee = () => {
    onAdd({
      id: `appt-fee-${selected.id}-${mappedDoctor.toLowerCase().replaceAll(" ", "-").replaceAll(".", "")}`,
      name: `${doctorFee.department} consultation fee`,
      category: "Appointment",
      group: doctorFee.department,
      price: doctorFee.fee,
      discount,
      tax: 0,
      meta: `${selected.appointmentNo} • ${mappedDoctor} • ${visitType} • ${selected.slot}`,
    });
  };
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3">
          <div className="grid gap-3 lg:grid-cols-2">
            {appointments.map((appointment) => (
              <button key={appointment.id} onClick={() => { setSelectedId(appointment.id); setMappedDoctor(appointment.doctor); setBillingStatus(appointment.billingStatus); setVisitType(appointment.visitType); toast.success(`${appointment.appointmentNo} selected`); }} className={cn("rounded-xl border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-soft/40 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]", selected.id === appointment.id ? "border-primary ring-2 ring-primary/15" : "border-border")}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-foreground">{appointment.appointmentNo}</div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">{appointment.department} • {appointment.doctor}</div>
                  </div>
                  <Badge tone={appointment.status === "Checked-in" || appointment.status === "Waiting" ? "success" : appointment.status === "Completed" ? "muted" : "info"}>{appointment.status}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                  <span>{appointment.slot}</span>
                  <span>{appointment.room}</span>
                  <span>{appointment.visitType}</span>
                  <span>{appointment.billingStatus}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Consultation fee mapping</CardTitle>
            <CardDescription>Fast counter workflow for appointment, doctor, fee, and billing handoff.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-4">
            <div className="grid gap-3 rounded-xl border border-border bg-surface-muted p-3 md:grid-cols-2">
              <SelectField label="Appointment" value={selectedId} onChange={(value) => { const next = appointments.find((appointment) => appointment.id === value); setSelectedId(value); if (next) { setMappedDoctor(next.doctor); setBillingStatus(next.billingStatus); setVisitType(next.visitType); } }} options={appointments.map((appointment) => ({ label: `${appointment.appointmentNo} - ${appointment.slot}`, value: appointment.id }))} />
              <DoctorFeeSelect value={mappedDoctor} onChange={setMappedDoctor} />
              <SelectField label="Visit type" value={visitType} onChange={(value) => setVisitType(value as AppointmentVisitType)} options={["New", "Follow-up", "Review", "Teleconsult"].map((item) => ({ label: item, value: item }))} />
              <SelectField label="Billing status" value={billingStatus} onChange={(value) => setBillingStatus(value as AppointmentBillingStatus)} options={["Unbilled", "Billed", "Package covered"].map((item) => ({ label: item, value: item }))} />
            </div>
            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <MappedValue label="Department" value={doctorFee.department} />
              <MappedValue label="Room" value={doctorFee.room} />
              <MappedValue label="Slot" value={selected.slot} />
              <MappedValue label="Audit ref" value={selected.appointmentNo} />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge tone={selected.status === "Checked-in" || selected.status === "Waiting" ? "success" : "info"}>{selected.status}</Badge>
              <Badge tone={billingStatus === "Package covered" ? "warning" : "muted"}>{billingStatus}</Badge>
              <Badge tone="info">{visitType}</Badge>
              <Badge tone="muted">Doctor revenue mapped</Badge>
            </div>
          </div>
          <div className="rounded-xl border border-primary/20 bg-primary-soft/60 p-4">
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Charge preview</div>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Consultation fee</span><span className="font-bold">{money(doctorFee.fee)}</span></div>
              <div className="flex justify-between gap-3"><span className="text-muted-foreground">Discount</span><span className="font-bold">{discount}%</span></div>
              <div className="flex justify-between gap-3 border-t border-primary/15 pt-2"><span className="font-semibold text-foreground">Billable amount</span><span className="text-xl font-bold text-primary">{money(doctorFee.fee - (doctorFee.fee * discount / 100))}</span></div>
            </div>
            <div className="mt-4 grid gap-2">
              <Button onClick={addAppointmentFee}><Plus className="h-4 w-4" />Add consultation fee</Button>
              <Button variant="outline" onClick={() => toast.info(`${mappedDoctor} mapping confirmed`)}>Confirm mapping</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: { label: string; value: string }[] }) {
  return (
    <label className="relative space-y-1">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <select className="h-10 w-full appearance-none rounded-lg border border-input bg-white px-3 pr-9 text-sm font-semibold text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15" value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
    </label>
  );
}

function MappedValue({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-white px-3 py-2">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function DoctorFeeSelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <label className="relative space-y-1">
      <span className="text-xs font-semibold text-muted-foreground">Doctor</span>
      <select className="h-10 w-full appearance-none rounded-lg border border-input bg-white px-3 pr-9 text-sm font-semibold text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15" value={value} onChange={(event) => onChange(event.target.value)}>
        {billingDoctorFees.map((doctor) => <option key={doctor.doctor} value={doctor.doctor}>{doctor.doctor}</option>)}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-3 right-3 h-4 w-4 text-muted-foreground" />
    </label>
  );
}

function FormCard({ title, description, fields }: { title: string; description: string; fields: string[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {fields.map((field) => <label key={field} className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">{field}</span><Input placeholder={field} /></label>)}
        <Button className="md:col-span-2" onClick={() => toast.success(`${title} details saved`)}>Save {title.toLowerCase()}</Button>
      </CardContent>
    </Card>
  );
}

function ServiceGrid({ category, onAdd, lines }: { category: BillingDeskService["category"]; onAdd: (service: BillingDeskService) => void; lines: BillLine[] }) {
  const [search, setSearch] = React.useState("");
  const [group, setGroup] = React.useState("All groups");
  const [urgency, setUrgency] = React.useState("All urgency");
  const baseServices = billingServices.filter((service) => service.category === category);
  const groups = ["All groups", ...Array.from(new Set(baseServices.map((service) => service.group)))];
  const urgencies = ["All urgency", "Routine", "Urgent", "Stat"];
  const services = baseServices.filter((service) => {
    const matchesSearch = `${service.name} ${service.group} ${service.meta} ${service.sample ?? ""} ${service.modality ?? ""}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (group === "All groups" || service.group === group) && (urgency === "All urgency" || service.urgency === urgency);
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-3 shadow-soft md:flex-row md:items-center">
        <Input placeholder={`Search ${category.toLowerCase()} catalog...`} value={search} onChange={(event) => setSearch(event.target.value)} />
        <PatientFilter label="Category" value={group} onChange={setGroup} options={groups} />
        <PatientFilter label="Urgency" value={urgency} onChange={setUrgency} options={urgencies} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">{services.map((service) => <ServiceCard key={service.id} service={service} added={lines.some((line) => line.id === service.id)} onAdd={() => onAdd(service)} />)}</div>
      {!services.length ? <EmptyState icon={Search} title="No services found" description="Clear search or filters to view the diagnostic catalog." /> : null}
    </div>
  );
}

function PackagesWorkspace({ onAdd, lines }: { onAdd: (service: BillingDeskService) => void; lines: BillLine[] }) {
  return (
    <div className="space-y-4">
      <AlertHint text="High-value billing package detected." />
      <ServiceGrid category="Package" onAdd={onAdd} lines={lines} />
    </div>
  );
}

function AlertHint({ text }: { text: string }) {
  return <div className="flex items-center gap-2 rounded-xl border border-warning/30 bg-warning/10 px-3 py-2 text-sm font-semibold text-warning"><ShieldAlert className="h-4 w-4" />{text}</div>;
}

function SummaryTable({ lines, totals, removedLine, onQty, onRemove, onUndo }: { lines: BillLine[]; totals: BillingTotals; removedLine: BillLine | null; onQty: (id: string, delta: number) => void; onRemove: (id: string) => void; onUndo: () => void }) {
  if (!lines.length) return <EmptyState icon={ReceiptText} title="No bill items yet" description="Add pathology, radiology, packages, quick tests, or consultation charges to build the bill." />;
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-4">
        <MappedValue label="Subtotal" value={money(totals.subtotal)} />
        <MappedValue label="Discount" value={money(totals.discount)} />
        <MappedValue label="Tax" value={money(totals.tax)} />
        <MappedValue label="Patient payable" value={money(totals.patientPayable)} />
      </div>
      {removedLine ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-warning/30 bg-warning/10 p-3 text-sm">
          <span className="font-semibold text-warning">{removedLine.name} removed from bill.</span>
          <Button size="sm" variant="outline" onClick={onUndo}>Undo remove</Button>
        </div>
      ) : null}
      <Card>
        <CardHeader><CardTitle>Detailed bill table</CardTitle><CardDescription>Inline quantity edit, discount, tax, subtotal, insurance adjustment, and remove actions.</CardDescription></CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full min-w-[820px] text-sm">
            <thead className="bg-surface-muted text-xs text-muted-foreground"><tr>{["Service", "Category", "Qty", "Amount", "Discount", "Tax", "Subtotal", ""].map((head) => <th key={head} className="px-3 py-3 text-left font-semibold">{head}</th>)}</tr></thead>
            <tbody>{lines.map((line) => {
              const base = line.price * line.qty;
              const discount = base * line.discount / 100;
              const tax = (base - discount) * line.tax / 100;
              return <tr key={line.id} className="border-t border-border"><td className="px-3 py-3 font-semibold">{line.name}<div className="text-xs font-normal text-muted-foreground">{line.meta}</div></td><td className="px-3 py-3">{line.category}</td><td className="px-3 py-3"><div className="flex items-center gap-1"><Button size="icon" variant="outline" onClick={() => onQty(line.id, -1)}><Minus className="h-3 w-3" /></Button><span className="w-7 text-center font-bold">{line.qty}</span><Button size="icon" variant="outline" onClick={() => onQty(line.id, 1)}><Plus className="h-3 w-3" /></Button></div></td><td className="px-3 py-3">{money(base)}</td><td className="px-3 py-3">{money(discount)}</td><td className="px-3 py-3">{money(tax)}</td><td className="px-3 py-3 font-bold">{money(base - discount + tax)}</td><td className="px-3 py-3"><Button size="icon" variant="ghost" onClick={() => onRemove(line.id)}><Trash2 className="h-4 w-4" /></Button></td></tr>;
            })}</tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentWorkspace({ total, balance, paid, onPay }: { total: number; balance: number; paid: number; onPay: (mode: PaymentLine["mode"], amount: number) => void }) {
  const [mode, setMode] = React.useState<PaymentLine["mode"]>("UPI");
  const [amount, setAmount] = React.useState(Math.max(balance, 0).toString());
  React.useEffect(() => setAmount(Math.max(balance, 0).toString()), [balance]);
  const submitPayment = () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast.error("Enter a valid payment amount");
      return;
    }
    onPay(mode, Math.min(value, balance));
    toast.success(`${mode} payment recorded`);
  };
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle>Payment workflow</CardTitle><CardDescription>Cash, card, UPI, insurance, partial and split payment support.</CardDescription></CardHeader><CardContent className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">{(["Cash", "Card", "UPI", "Insurance"] as PaymentLine["mode"][]).map((item) => <button key={item} onClick={() => setMode(item)} className={cn("rounded-xl border bg-white p-4 text-left font-bold shadow-soft transition hover:border-primary hover:bg-primary-soft", mode === item ? "border-primary ring-2 ring-primary/15" : "border-border")}>{item}<div className="mt-1 text-xs font-medium text-muted-foreground">Collect against {money(balance)}</div></button>)}</div>
          <div className="rounded-xl border border-border bg-surface-muted p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <SelectField label="Payment mode" value={mode} onChange={(value) => setMode(value as PaymentLine["mode"])} options={["Cash", "Card", "UPI", "Insurance"].map((item) => ({ label: item, value: item }))} />
              <label className="space-y-1"><span className="text-xs font-semibold text-muted-foreground">Amount</span><Input type="number" value={amount} onChange={(event) => setAmount(event.target.value)} /></label>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={submitPayment}>Record payment</Button>
              <Button variant="outline" onClick={() => toast.info("Refund workflow ready")}>Refund</Button>
              <Button variant="outline" onClick={() => toast.success("PDF invoice queued")}>Download PDF</Button>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-primary/20 bg-primary-soft/60 p-4">
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Receipt preview</div>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Patient payable</span><span className="font-bold">{money(total)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Paid</span><span className="font-bold">{money(paid)}</span></div>
            <div className="flex justify-between border-t border-primary/15 pt-2"><span className="font-semibold">Live balance</span><span className="text-xl font-bold text-primary">{money(balance)}</span></div>
          </div>
          <Button className="mt-4 w-full" disabled={balance > 0} onClick={() => toast.success("Payment confirmed and receipt generated")}><Printer className="h-4 w-4" />Print receipt</Button>
        </div>
      </CardContent></Card>
    </div>
  );
}

function RightSummary({ patient, lines, totals, referral, onReset }: { patient: BillingDeskPatient; lines: BillLine[]; totals: BillingTotals; referral: BillingReferral; onReset: () => void }) {
  const pathology = lines.filter((line) => line.category === "Pathology" || line.category === "Quick Test" || line.category === "Individual Test").length;
  const radiology = lines.filter((line) => line.category === "Radiology").length;
  const alerts = [
    patient.insuranceStatus === "Pre-auth required" ? "Insurance pre-approval required." : null,
    referral.status === "Mapped" ? "Doctor referral commission applied." : null,
    lines.some((line) => line.category === "Package") ? "Similar package savings applied to bill." : null,
    lines.some((line) => line.urgency === "Stat") ? "Stat diagnostic handoff required." : null,
  ].filter(Boolean) as string[];
  return (
    <div className="sticky top-20 space-y-4">
      <Card><CardHeader><CardTitle>Current Patient</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{[["UHID", patient.uhid], ["Name", patient.name], ["Age/Gender", patient.ageGender], ["Blood", patient.bloodGroup], ["Phone", patient.phone], ["Payer", patient.payer], ["Address", patient.address], ["Source", patient.source], ["Doctor", patient.doctor], ["Referral", patient.referralSource], ["Last visit", patient.lastVisit]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-border py-1.5 last:border-0"><span className="text-xs font-semibold text-muted-foreground">{label}</span><span className="text-right font-semibold">{value}</span></div>)}<Button className="mt-2 w-full" variant="outline" asChild><Link href={`/patients/${patient.id}`}>Open patient profile</Link></Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Bill Summary</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{[["Subtotal", money(totals.subtotal)], ["Discount", money(totals.discount)], ["Tax", money(totals.tax)], ["Grand total", money(totals.total)], ["Insurance amount", money(totals.insuranceAmount)], ["Patient payable", money(totals.patientPayable)], ["Paid amount", money(totals.paid)], ["Balance", money(totals.balance)]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-bold">{value}</span></div>)}<Button className="mt-3 w-full" onClick={() => toast.success("Bill generated successfully")}><ReceiptText className="h-4 w-4" />Generate Bill</Button><Button className="w-full" variant="outline" onClick={onReset}><RefreshCcw className="h-4 w-4" />Reset</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Diagnostic handoff</CardTitle></CardHeader><CardContent className="space-y-2">{[["Pathology orders", pathology ? `${pathology} ready` : "Pending"], ["Radiology orders", radiology ? `${radiology} ready` : "Pending"], ["Billing status", lines.length ? "Ready" : "Pending"], ["Handoff readiness", totals.balance <= 0 && lines.length ? "Completed" : "Pending"]].map(([label, status]) => <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm"><span>{label}</span><Badge tone={status === "Completed" || status.includes("ready") || status === "Ready" ? "success" : "warning"}>{status}</Badge></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Alerts</CardTitle></CardHeader><CardContent className="space-y-2">{alerts.length ? alerts.map((alert) => <AlertHint key={alert} text={alert} />) : <div className="text-sm text-muted-foreground">No active billing alerts.</div>}</CardContent></Card>
      <Card><CardHeader><CardTitle>Insurance Status</CardTitle></CardHeader><CardContent className="flex items-center justify-between gap-3"><Badge tone={patient.insuranceStatus === "Approved" ? "success" : patient.insuranceStatus === "Not required" ? "muted" : "warning"}>{patient.insuranceStatus}</Badge><span className="text-right text-sm font-semibold text-muted-foreground">{patient.payer}</span></CardContent></Card>
    </div>
  );
}

export function BillingDeskPage({ initialStep = "patient" }: { initialStep?: BillingDeskStep }) {
  return (
    <BillingDeskProvider>
      <React.Suspense fallback={<BillingDeskLoading />}>
        <BillingDeskInner initialStep={initialStep} />
      </React.Suspense>
    </BillingDeskProvider>
  );
}

function BillingDeskLoading() {
  return (
    <PageMotion>
      <BillingDeskTopbar />
      <Card>
        <CardContent className="p-4 text-sm font-semibold text-muted-foreground">Loading billing desk...</CardContent>
      </Card>
    </PageMotion>
  );
}

function BillingDeskInner({ initialStep }: { initialStep: BillingDeskStep }) {
  const { state, totals, dispatch, addService } = useBillingDesk();
  const [active, setActive] = React.useState<BillingDeskStep>(initialStep);
  const searchParams = useSearchParams();
  const routedPatientId = searchParams.get("patientId");
  React.useEffect(() => {
    if (!routedPatientId || state.activePatient.id === routedPatientId) return;
    const routedPatient = state.patients.find((patient) => patient.id === routedPatientId);
    if (routedPatient) dispatch({ type: "selectPatient", patient: routedPatient });
  }, [dispatch, routedPatientId, state.activePatient.id, state.patients]);
  const changeStep = (step: BillingDeskStep) => {
    setActive(step);
    history.replaceState(null, "", stepRoute[step]);
  };
  return (
    <PageMotion>
      <BillingDeskTopbar />
      <WorkflowTabs active={active} onChange={changeStep} />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4">
          {active === "patient" ? <PatientWorkspace selectedPatient={state.activePatient} patients={state.patients} onSelect={(patient) => dispatch({ type: "selectPatient", patient })} onRegister={(patient) => dispatch({ type: "registerPatient", patient })} /> : null}
          {active === "referral" ? <ReferralWorkspace activeReferral={state.activeReferral} onSelect={(referral) => dispatch({ type: "selectReferral", referral })} /> : null}
          {active === "appointments" ? <AppointmentsWorkspace patient={state.activePatient} onAdd={addService} /> : null}
          {active === "pathology" ? <ServiceGrid category="Pathology" onAdd={addService} lines={state.lines} /> : null}
          {active === "radiology" ? <ServiceGrid category="Radiology" onAdd={addService} lines={state.lines} /> : null}
          {active === "packages" ? <PackagesWorkspace onAdd={addService} lines={state.lines} /> : null}
          {active === "quick-tests" ? <ServiceGrid category="Quick Test" onAdd={addService} lines={state.lines} /> : null}
          {active === "individual-tests" ? <ServiceGrid category="Individual Test" onAdd={addService} lines={state.lines} /> : null}
          {active === "summary" ? <SummaryTable lines={state.lines} totals={totals} removedLine={state.removedLine} onQty={(id, delta) => dispatch({ type: "qty", id, delta })} onRemove={(id) => dispatch({ type: "remove", id })} onUndo={() => dispatch({ type: "undoRemove" })} /> : null}
          {active === "payment" ? <PaymentWorkspace total={totals.patientPayable} balance={totals.balance} paid={totals.paid} onPay={(mode, amount) => dispatch({ type: "pay", mode, amount })} /> : null}
        </main>
        <aside><RightSummary patient={state.activePatient} lines={state.lines} totals={totals} referral={state.activeReferral} onReset={() => { dispatch({ type: "reset" }); toast.info("Billing desk reset"); }} /></aside>
      </div>
      <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-xl border border-border bg-white/95 p-2 shadow-[0_16px_40px_rgba(39,37,54,0.18)] backdrop-blur md:hidden">
        {(["patient", "pathology", "summary", "payment"] as BillingDeskStep[]).map((step) => <Button key={step} className="flex-1" size="sm" variant={active === step ? "default" : "outline"} onClick={() => changeStep(step)}>{billingDeskSteps.find((item) => item.id === step)?.label}</Button>)}
      </div>
    </PageMotion>
  );
}
