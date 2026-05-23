"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, MessageSquareText, Minus, Plus, Printer, ReceiptText, RefreshCcw, Search, ShieldAlert, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  billingApiEndpoints,
  billingDeskSteps,
  billingHints,
  billingPatients,
  billingServices,
  type BillingDeskPatient,
  type BillingDeskService,
  type BillingDeskStep,
} from "@/data/billing-desk";
import { cn } from "@/lib/utils";

type BillLine = BillingDeskService & { qty: number };

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

function WorkflowRail({ active, onChange }: { active: BillingDeskStep; onChange: (step: BillingDeskStep) => void }) {
  return (
    <Card className="sticky top-20 self-start">
      <CardContent className="space-y-1 p-2">
        {billingDeskSteps.slice(0, 9).map((step) => {
          const Icon = step.icon;
          const selected = active === step.id;
          return (
            <button key={step.id} onClick={() => onChange(step.id)} className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition", selected ? "bg-primary text-white shadow-[0_8px_18px_rgba(115,103,240,0.20)]" : "text-muted-foreground hover:bg-surface-muted hover:text-foreground")}>
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
        {selected ? <Badge tone="info">Selected</Badge> : <Badge tone="muted">{patient.source}</Badge>}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
        <span>{patient.ageGender}</span><span>Blood {patient.bloodGroup}</span><span>Reg {patient.registeredAt}</span>
      </div>
    </button>
  );
}

function PatientWorkspace({ selectedPatient, onSelect }: { selectedPatient: BillingDeskPatient; onSelect: (patient: BillingDeskPatient) => void }) {
  const [search, setSearch] = React.useState("");
  const rows = billingPatients.filter((patient) => `${patient.name} ${patient.uhid} ${patient.phone} ${patient.bloodGroup} ${patient.address} ${patient.payer} ${patient.city}`.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div><CardTitle>Search Patient</CardTitle><CardDescription>Find an existing UHID by name, phone, blood group, address, payer, or city.</CardDescription></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-2 lg:flex-row">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-input bg-white px-3 shadow-sm"><Search className="h-4 w-4 text-muted-foreground" /><Input className="border-0 shadow-none focus:ring-0" placeholder="Search by patient, UHID, phone, payer, city..." value={search} onChange={(event) => setSearch(event.target.value)} /></div>
            {["All payers", "All cities", "All sources"].map((filter) => <Button key={filter} variant="outline">{filter}<ChevronDown className="h-4 w-4" /></Button>)}
          </div>
          <div className="grid gap-3 xl:grid-cols-2">{rows.map((patient) => <PatientCard key={patient.id} patient={patient} selected={selectedPatient.id === patient.id} onSelect={() => { onSelect(patient); toast.success(`${patient.name} selected`); }} />)}</div>
          {!rows.length ? <EmptyState icon={Search} title="No patient found" description="Try another UHID, phone number, city, payer, or blood group." /> : null}
        </CardContent>
      </Card>
      <Card className="border-dashed">
        <CardContent className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
          <div><div className="font-bold text-foreground">Register New Patient</div><div className="text-sm text-muted-foreground">Create a UHID quickly when patient is not already registered.</div></div>
          <Button variant="outline" onClick={() => toast.info("Quick UHID registration drawer placeholder")}><Plus className="h-4 w-4" />Open quick registration</Button>
        </CardContent>
      </Card>
    </div>
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
        <div className="flex items-center justify-between"><div className="text-lg font-bold text-foreground">{money(service.price)}</div><Button size="sm" variant={added ? "outline" : "default"} onClick={onAdd}>{added ? "Added" : "Add"}</Button></div>
      </CardContent>
    </Card>
  );
}

function ReferralWorkspace() {
  return <FormCard title="Referral" description="Referring doctor, source, commission mapping, and notes." fields={["Referring doctor", "Referral source", "Commission mapping", "Notes"]} />;
}

function AppointmentsWorkspace({ onAdd }: { onAdd: (service: BillingDeskService) => void }) {
  return <div className="space-y-4"><FormCard title="Appointments" description="Appointment selection, doctor mapping, consultation fee, and slot details." fields={["Appointment", "Doctor mapping", "Slot details"]} /><ServiceGrid category="Appointment" onAdd={onAdd} lines={[]} /></div>;
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
  const services = billingServices.filter((service) => service.category === category);
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-3 shadow-soft md:flex-row md:items-center">
        <Input placeholder={`Search ${category.toLowerCase()} catalog...`} />
        <Button variant="outline">Category</Button><Button variant="outline">Price</Button><Button variant="outline">Urgency</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">{services.map((service) => <ServiceCard key={service.id} service={service} added={lines.some((line) => line.id === service.id)} onAdd={() => onAdd(service)} />)}</div>
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

function SummaryTable({ lines, onQty, onRemove }: { lines: BillLine[]; onQty: (id: string, delta: number) => void; onRemove: (id: string) => void }) {
  if (!lines.length) return <EmptyState icon={ReceiptText} title="No bill items yet" description="Add pathology, radiology, packages, quick tests, or consultation charges to build the bill." />;
  return (
    <Card>
      <CardHeader><CardTitle>Detailed bill table</CardTitle><CardDescription>Inline quantity edit, discount, tax, subtotal, and remove actions.</CardDescription></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-surface-muted text-xs text-muted-foreground"><tr>{["Service", "Qty", "Amount", "Discount", "Tax", "Subtotal", ""].map((head) => <th key={head} className="px-3 py-3 text-left font-semibold">{head}</th>)}</tr></thead>
          <tbody>{lines.map((line) => {
            const base = line.price * line.qty;
            const discount = base * line.discount / 100;
            const tax = (base - discount) * line.tax / 100;
            return <tr key={line.id} className="border-t border-border"><td className="px-3 py-3 font-semibold">{line.name}<div className="text-xs font-normal text-muted-foreground">{line.category}</div></td><td className="px-3 py-3"><div className="flex items-center gap-1"><Button size="icon" variant="outline" onClick={() => onQty(line.id, -1)}><Minus className="h-3 w-3" /></Button><span className="w-7 text-center font-bold">{line.qty}</span><Button size="icon" variant="outline" onClick={() => onQty(line.id, 1)}><Plus className="h-3 w-3" /></Button></div></td><td className="px-3 py-3">{money(base)}</td><td className="px-3 py-3">{money(discount)}</td><td className="px-3 py-3">{money(tax)}</td><td className="px-3 py-3 font-bold">{money(base - discount + tax)}</td><td className="px-3 py-3"><Button size="icon" variant="ghost" onClick={() => onRemove(line.id)}><Trash2 className="h-4 w-4" /></Button></td></tr>;
          })}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function PaymentWorkspace({ total }: { total: number }) {
  return (
    <div className="space-y-4">
      <Card><CardHeader><CardTitle>Payment workflow</CardTitle><CardDescription>Cash, card, UPI, insurance, and split payment support.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{["Cash", "Card", "UPI", "Insurance", "Split payment"].map((mode) => <button key={mode} onClick={() => toast.success(`${mode} selected`)} className="rounded-xl border border-border bg-white p-4 text-left font-bold shadow-soft transition hover:border-primary hover:bg-primary-soft">{mode}<div className="mt-1 text-xs font-medium text-muted-foreground">Collect against {money(total)}</div></button>)}<Button className="md:col-span-2" onClick={() => toast.success("Payment confirmed and receipt generated")}><Printer className="h-4 w-4" />Confirm payment & print receipt</Button></CardContent></Card>
    </div>
  );
}

function RightSummary({ patient, lines, onReset }: { patient: BillingDeskPatient; lines: BillLine[]; onReset: () => void }) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const discount = lines.reduce((sum, line) => sum + line.price * line.qty * line.discount / 100, 0);
  const tax = lines.reduce((sum, line) => sum + (line.price * line.qty - line.price * line.qty * line.discount / 100) * line.tax / 100, 0);
  const total = subtotal - discount + tax;
  const paid = Math.min(total, 1000);
  return (
    <div className="sticky top-20 space-y-4">
      <Card><CardHeader><CardTitle>Current Patient</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{[["UHID", patient.uhid], ["Name", patient.name], ["Age/Gender", patient.ageGender], ["Blood", patient.bloodGroup], ["Phone", patient.phone], ["Payer", patient.payer], ["Address", patient.address], ["Source", patient.source], ["Doctor", patient.doctor]].map(([label, value]) => <div key={label} className="flex justify-between gap-3 border-b border-border py-1.5 last:border-0"><span className="text-xs font-semibold text-muted-foreground">{label}</span><span className="text-right font-semibold">{value}</span></div>)}</CardContent></Card>
      <Card><CardHeader><CardTitle>Bill Summary</CardTitle></CardHeader><CardContent className="space-y-2 text-sm">{[["Subtotal", money(subtotal)], ["Discount", money(discount)], ["Tax", money(tax)], ["Grand total", money(total)], ["Paid amount", money(paid)], ["Payment mode", "UPI + cash"], ["Balance", money(total - paid)]].map(([label, value]) => <div key={label} className="flex justify-between gap-3"><span className="text-muted-foreground">{label}</span><span className="font-bold">{value}</span></div>)}<Button className="mt-3 w-full" onClick={() => toast.success("Bill generated successfully")}><ReceiptText className="h-4 w-4" />Generate Bill</Button><Button className="w-full" variant="outline" onClick={onReset}><RefreshCcw className="h-4 w-4" />Reset</Button></CardContent></Card>
      <Card><CardHeader><CardTitle>Diagnostic handoff</CardTitle></CardHeader><CardContent className="space-y-2">{[["Pathology orders", "Ready"], ["Radiology orders", "Pending"], ["Billing status", lines.length ? "Ready" : "Pending"], ["Handoff readiness", "Completed"]].map(([label, status]) => <div key={label} className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm"><span>{label}</span><Badge tone={status === "Completed" || status === "Ready" ? "success" : "warning"}>{status}</Badge></div>)}</CardContent></Card>
    </div>
  );
}

export function BillingDeskPage({ initialStep = "patient" }: { initialStep?: BillingDeskStep }) {
  const [active, setActive] = React.useState<BillingDeskStep>(initialStep);
  const [selectedPatient, setSelectedPatient] = React.useState(billingPatients[0]);
  const [lines, setLines] = React.useState<BillLine[]>([{ ...billingServices[0], qty: 1 }, { ...billingServices[9], qty: 1 }, { ...billingServices[11], qty: 1 }]);
  const addService = (service: BillingDeskService) => setLines((current) => current.some((line) => line.id === service.id) ? (toast.warning("Duplicate test already added."), current) : (toast.success(`${service.name} added`), [...current, { ...service, qty: 1 }]));
  const total = lines.reduce((sum, line) => {
    const base = line.price * line.qty;
    return sum + base - base * line.discount / 100 + (base - base * line.discount / 100) * line.tax / 100;
  }, 0);
  const changeStep = (step: BillingDeskStep) => {
    setActive(step);
    history.replaceState(null, "", stepRoute[step]);
  };
  return (
    <PageMotion>
      <BillingDeskTopbar />
      <div className="grid gap-4 xl:grid-cols-[210px_minmax(0,1fr)_340px]">
        <WorkflowRail active={active} onChange={changeStep} />
        <main className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-border bg-white p-4 shadow-soft">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div><div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Billing Desk</div><h1 className="mt-1 text-2xl font-bold text-foreground">Front-desk billing workbench</h1><p className="mt-1 text-sm text-muted-foreground">Patient lookup, diagnostics, packages, bill summary, and payment in one fast operational flow.</p></div>
              <div className="flex flex-wrap gap-2">{billingHints.slice(0, 2).map((hint) => <Badge key={hint} tone="warning">{hint}</Badge>)}</div>
            </div>
          </div>
          {active === "patient" ? <PatientWorkspace selectedPatient={selectedPatient} onSelect={setSelectedPatient} /> : null}
          {active === "referral" ? <ReferralWorkspace /> : null}
          {active === "appointments" ? <AppointmentsWorkspace onAdd={addService} /> : null}
          {active === "pathology" ? <ServiceGrid category="Pathology" onAdd={addService} lines={lines} /> : null}
          {active === "radiology" ? <ServiceGrid category="Radiology" onAdd={addService} lines={lines} /> : null}
          {active === "packages" ? <PackagesWorkspace onAdd={addService} lines={lines} /> : null}
          {active === "quick-tests" ? <ServiceGrid category="Quick Test" onAdd={addService} lines={lines} /> : null}
          {active === "individual-tests" ? <ServiceGrid category="Individual Test" onAdd={addService} lines={lines} /> : null}
          {active === "summary" ? <SummaryTable lines={lines} onQty={(id, delta) => setLines((current) => current.map((line) => line.id === id ? { ...line, qty: Math.max(1, line.qty + delta) } : line))} onRemove={(id) => setLines((current) => current.filter((line) => line.id !== id))} /> : null}
          {active === "payment" ? <PaymentWorkspace total={total} /> : null}
          <Card><CardHeader><CardTitle>Backend ready API structure</CardTitle><CardDescription>Mock data is isolated for future API wiring.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-2">{billingApiEndpoints.map((api) => <Badge key={api} tone="muted">{api}</Badge>)}</CardContent></Card>
        </main>
        <aside><RightSummary patient={selectedPatient} lines={lines} onReset={() => { setLines([]); toast.info("Billing desk reset"); }} /></aside>
      </div>
      <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-xl border border-border bg-white/95 p-2 shadow-[0_16px_40px_rgba(39,37,54,0.18)] backdrop-blur md:hidden">
        {(["patient", "pathology", "summary", "payment"] as BillingDeskStep[]).map((step) => <Button key={step} className="flex-1" size="sm" variant={active === step ? "default" : "outline"} onClick={() => changeStep(step)}>{billingDeskSteps.find((item) => item.id === step)?.label}</Button>)}
      </div>
    </PageMotion>
  );
}
