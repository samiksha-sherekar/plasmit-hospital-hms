"use client";

import * as React from "react";
import { motion, Reorder } from "framer-motion";
import { Activity, AlertTriangle, Bed, Bell, Brain, CheckCircle2, ChevronDown, ClipboardCheck, ClipboardList, Download, Droplets, FileText, FlaskConical, Gauge, GripVertical, HeartPulse, Mic, Moon, PhoneCall, Pill, Plus, Printer, Radio, RefreshCcw, Save, Search, Send, ShieldAlert, ShieldCheck, Star, Stethoscope, Syringe, UserRound, Waves, Zap } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StickyActionBar } from "@/features/admin/admin-shared";
import {
  backendApis,
  builderFields,
  clinicalScores,
  clinicalSpecialties,
  clinicalTimeline,
  clinicalTrendData,
  databaseTables,
  examinationDefaultNotes,
  examinationFindings,
  quickClinicalActions,
  reportLinks,
  type ClinicalSeverity,
  type SpecialtyId,
} from "@/data/clinical-examination";
import { mockPatients, mockPatientVisits } from "@/data/patients";
import { cn } from "@/lib/utils";

const severityTone: Record<ClinicalSeverity, "success" | "warning" | "danger" | "critical"> = {
  Normal: "success",
  Mild: "warning",
  Moderate: "warning",
  Severe: "danger",
  Critical: "critical",
};

const toggleOptions = ["Normal", "Mild", "Moderate", "Severe", "Absent", "Present", "Positive", "Negative"];

type ClinicalPatientContext = {
  id: string;
  uhid: string;
  name: string;
  ageGender: string;
  encounter: string;
  wardBed: string;
  consultant: string;
  allergies: string;
  flags: string[];
};

function patientName(patient: (typeof mockPatients)[number]) {
  return `${patient.firstName} ${patient.middleName ? `${patient.middleName} ` : ""}${patient.lastName}`;
}

function consultantForDepartment(department: string) {
  const mapping: Record<string, string> = {
    Cardiology: "Dr. Kavita Rao",
    Orthopedics: "Dr. Aman Verma",
    Pediatrics: "Dr. Neha Malik",
    Emergency: "Emergency Desk",
    Oncology: "Dr. Neha Malik",
  };
  return mapping[department] ?? "Dr. Kavita Rao";
}

function clinicalPatientFromRecord(patient: (typeof mockPatients)[number]): ClinicalPatientContext {
  const visits = mockPatientVisits.filter((visit) => visit.patientId === patient.id);
  const encounter = visits.length ? visits.map((visit) => visit.referenceNumber).join(" / ") : "No active encounter";
  const activeVisit = visits.find((visit) => visit.status === "Active") ?? visits[0];
  const allergyFlags = patient.alertFlags.filter((flag) => flag.toLowerCase().includes("allergy"));
  const nonAllergyFlags = patient.alertFlags.filter((flag) => !flag.toLowerCase().includes("allergy"));

  return {
    id: patient.id,
    uhid: patient.uhid,
    name: patientName(patient),
    ageGender: `${patient.age}/${patient.gender.charAt(0)}`,
    encounter,
    wardBed: activeVisit?.visitType === "IPD" ? `${patient.department} Ward / Bed pending` : `${patient.department} ${activeVisit?.visitType ?? "OPD"}`,
    consultant: activeVisit?.provider ?? consultantForDepartment(patient.department),
    allergies: allergyFlags.length ? allergyFlags.map((flag) => flag.replace(/^Allergy:\s*/i, "")).join(", ") : "No known allergy",
    flags: nonAllergyFlags.length ? nonAllergyFlags : ["No active risk flag"],
  };
}

function PageMotion({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}

function PatientHeaderStrip({ patient, selectedPatientId, onPatientChange }: { patient: ClinicalPatientContext; selectedPatientId: string; onPatientChange: (patientId: string) => void }) {
  const [patientSearch, setPatientSearch] = React.useState("");
  const patientResults = React.useMemo(() => {
    const query = patientSearch.trim().toLowerCase();
    if (!query) return [];
    return mockPatients
      .filter((item) => `${patientName(item)} ${item.uhid} ${item.mobile} ${item.department}`.toLowerCase().includes(query))
      .slice(0, 8);
  }, [patientSearch]);

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Clinical examination workspace</div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">{patient.name}</h1>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">Selected from patient registry by patientId: {selectedPatientId}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative w-full sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search clinical examination patient"
                className="h-10 bg-white pl-9 font-semibold"
                placeholder="Search patient / UHID"
                value={patientSearch}
                onChange={(event) => setPatientSearch(event.target.value)}
              />
              {patientSearch ? (
                <div className="absolute right-0 top-11 z-50 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-white p-1 shadow-soft">
                  {patientResults.length ? patientResults.map((item) => (
                    <button
                      className="flex w-full flex-col rounded-md px-3 py-2 text-left text-sm outline-none hover:bg-surface-muted focus-visible:bg-surface-muted"
                      key={item.id}
                      onClick={() => {
                        onPatientChange(item.id);
                        setPatientSearch("");
                      }}
                      type="button"
                    >
                      <span className="font-semibold text-foreground">{patientName(item)}</span>
                      <span className="text-xs text-muted-foreground">{item.uhid} | {item.age}/{item.gender} | {item.department}</span>
                    </button>
                  )) : (
                    <div className="px-3 py-3 text-sm text-muted-foreground">No patient found.</div>
                  )}
                </div>
              ) : null}
            </div>
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
            <Button variant="outline" onClick={() => toast.info("Last clinical draft restored")}><RefreshCcw className="h-4 w-4" />Restore draft</Button>
            <Button onClick={() => toast.success("Clinical draft autosaved")}><Save className="h-4 w-4" />Save draft</Button>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["UHID", patient.uhid],
            ["Age/Gender", patient.ageGender],
            ["IPD/OPD No.", patient.encounter],
            ["Ward/Bed", patient.wardBed],
            ["Consultant", patient.consultant],
            ["Allergy", patient.allergies],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-border bg-surface-muted px-3 py-2" key={label}>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {patient.flags.map((flag) => <Badge key={flag} tone={flag.includes("BP") || flag.includes("Outstanding") || flag.includes("Minor") ? "warning" : "danger"}>{flag}</Badge>)}
          <Badge tone="info">Autosave every 20 sec</Badge>
          <Badge tone="muted">Keyboard shortcuts ready</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryCards() {
  const cards = [
    ["Vitals", "BP 148/92, Pulse 86", "Moderate", "Review BP trend before final submit"],
    ["Diagnosis", "Hypertension follow-up", "Mild", "Linked with OPD/IPD encounter"],
    ["Risk Score", "NEWS 4", "Moderate", "Auto score from vitals and findings"],
    ["Complaints", "Chest tightness improved", "Mild", "Current complaint summary"],
    ["Critical observations", "No acute red flag", "Normal", "Allergy remains active"],
  ] as const;
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {cards.map(([label, value, severity, note]) => (
        <Card className="transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]" key={label}>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-semibold text-muted-foreground">{label}</div>
              <Badge tone={severityTone[severity]}>{severity}</Badge>
            </div>
            <div className="text-xl font-bold text-foreground">{value}</div>
            <p className="text-xs text-muted-foreground">{note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function QuickActions({ active, onSelect }: { active: string; onSelect: (action: string) => void }) {
  const actionIcons = {
    "Clinical Examination": Stethoscope,
    "Progress Notes": FileText,
    Orders: ClipboardList,
    Prescription: Pill,
    Vitals: HeartPulse,
    Reports: FlaskConical,
    "Nursing Notes": Bed,
    "Discharge Summary": Activity,
  } as Record<string, typeof Stethoscope>;
  return (
    <Card>
      <CardContent className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickClinicalActions.map((action) => {
          const Icon = actionIcons[action] ?? ClipboardCheck;
          return (
          <Button key={action} variant={active === action ? "default" : "outline"} onClick={() => onSelect(action)}>
            <Icon className="h-4 w-4" />
            {action}
          </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}

function SpecialtyPicker({ selected, onSelect }: { selected: SpecialtyId; onSelect: (id: SpecialtyId) => void }) {
  const [search, setSearch] = React.useState("");
  const [department, setDepartment] = React.useState("All departments");
  const departments = ["All departments", ...Array.from(new Set(clinicalSpecialties.map((item) => item.department)))];
  const specialties = clinicalSpecialties.filter((item) => {
    const matchesSearch = `${item.label} ${item.department}`.toLowerCase().includes(search.toLowerCase());
    return matchesSearch && (department === "All departments" || item.department === department);
  });
  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-3 shadow-soft md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search specialty or department..." />
        </div>
        <select className="h-10 rounded-lg border border-input bg-white px-3 text-sm font-medium outline-none focus:ring-2 focus:ring-ring/15" value={department} onChange={(event) => setDepartment(event.target.value)}>
          {departments.map((item) => <option key={item}>{item}</option>)}
        </select>
        <Button variant="outline" onClick={() => toast.success("Custom template builder opened")}><Plus className="h-4 w-4" />Custom template</Button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {specialties.map((item) => {
          const Icon = item.icon;
          const active = selected === item.id;
          return (
            <button className={cn("rounded-xl border bg-white p-4 text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(39,37,54,0.08)]", active ? "border-primary ring-2 ring-primary/15" : "border-border")} key={item.id} onClick={() => onSelect(item.id)}>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-soft text-primary"><Icon className="h-5 w-5" /></div>
                <div className="flex gap-1">{item.favorite ? <Star className="h-4 w-4 fill-warning text-warning" /> : null}{item.recentlyUsed ? <Badge tone="info">Recent</Badge> : null}</div>
              </div>
              <div className="mt-3 text-base font-bold text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.department} template</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ToggleMatrix({ findings, specialtyLabel }: { findings: typeof examinationFindings[SpecialtyId]; specialtyLabel: string }) {
  const [selected, setSelected] = React.useState<Record<string, string>>({
    [findings[0]?.label ?? "Primary finding"]: findings[0]?.severity ?? "Normal",
    [findings[1]?.label ?? "Secondary finding"]: findings[1]?.severity ?? "Normal",
  });
  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{specialtyLabel} toggle-based clinical matrix</CardTitle>
          <CardDescription>Single-click selection with auto score generation and keyboard-friendly focus states.</CardDescription>
        </div>
        <Badge tone="info">Score auto-updates</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {findings.slice(0, 6).map((finding) => (
          <div className="grid gap-2 rounded-lg border border-border bg-surface-muted p-2 lg:grid-cols-[150px_1fr]" key={finding.label}>
            <div className="flex items-center justify-between gap-2 text-sm font-semibold text-foreground">
              {finding.label}
              <Badge tone={severityTone[finding.severity]}>{finding.score ?? 0}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-1 sm:grid-cols-4 xl:grid-cols-8">
              {toggleOptions.map((option) => (
                <button className={cn("h-9 rounded-lg border px-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-ring/20", selected[finding.label] === option ? "border-primary bg-primary text-white shadow-sm" : "border-border bg-white text-muted-foreground hover:text-foreground")} key={option} onClick={() => setSelected({ ...selected, [finding.label]: option })}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function ExaminationWorkspace({ specialty }: { specialty: SpecialtyId }) {
  const activeSpecialty = clinicalSpecialties.find((item) => item.id === specialty) ?? clinicalSpecialties[0];
  const findings = examinationFindings[specialty] ?? examinationFindings.cvs;
  const defaultNote = examinationDefaultNotes[specialty] ?? examinationDefaultNotes.cvs;
  return (
    <div className="space-y-4">
    <div className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0 space-y-4">
        <ToggleMatrix key={specialty} findings={findings} specialtyLabel={activeSpecialty.label} />
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{activeSpecialty.label} findings and notes</CardTitle>
              <CardDescription>Structured {activeSpecialty.department.toLowerCase()} entries, severity, numeric score fields, and doctor impression in one compact working screen.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              {findings.map((item) => (
                <div className="rounded-lg border border-border bg-white p-3" key={item.label}>
                  <div className="flex items-start justify-between gap-2"><div className="text-sm font-semibold">{item.label}</div><Badge tone={severityTone[item.severity]}>{item.severity}</Badge></div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.value}</div>
                </div>
              ))}
            </div>
            <textarea key={specialty} className="min-h-28 w-full rounded-lg border border-input bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring/15" defaultValue={defaultNote} />
            <div className="flex flex-wrap gap-2"><Button variant="outline"><Mic className="h-4 w-4" />Voice typing</Button><Button variant="outline">Insert shortcut</Button><Button>Apply template</Button></div>
          </CardContent>
        </Card>
      </div>
      <div className="min-w-0 space-y-4">
        <ClinicalScorePanel />
        <TrendCard compact />
        <AlertBanner icon={AlertTriangle} tone="warning" title="Risk indicator">NEWS score moderate. Consultant verification recommended before final submit.</AlertBanner>
      </div>
    </div>
    </div>
  );
}

function ClinicalScorePanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Clinical scoring</CardTitle><CardDescription>Auto-calculated risk and red flag state.</CardDescription></CardHeader>
      <CardContent className="space-y-2">
        {clinicalScores.map((score) => (
          <div className="rounded-lg border border-border bg-surface-muted p-3" key={score.label}>
            <div className="flex items-center justify-between gap-2"><div className="text-sm font-bold">{score.label}</div><Badge tone={severityTone[score.severity]}>{score.value}</Badge></div>
            <div className="mt-1 text-xs text-muted-foreground">{score.note}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function TrendCard({ compact }: { compact?: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div><CardTitle>Graph & trend analysis</CardTitle><CardDescription>Vitals, score, recovery, and risk progression.</CardDescription></div>
        {!compact ? <Button size="sm" variant="outline" onClick={() => toast.info("PDF export queued")}><Printer className="h-4 w-4" />PDF</Button> : null}
      </CardHeader>
      <CardContent className={compact ? "h-52 p-3" : "h-80 p-4"}>
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={clinicalTrendData}>
            <CartesianGrid stroke="#e8e5ef" strokeDasharray="3 3" />
            <XAxis dataKey="day" tick={{ fill: "#6f6b80", fontSize: 12 }} />
            <YAxis tick={{ fill: "#6f6b80", fontSize: 12 }} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e5e3ec" }} />
            <Line dataKey="vitals" dot={false} stroke="#7367f0" strokeWidth={3} />
            <Line dataKey="risk" dot={false} stroke="#f59e0b" strokeWidth={3} />
            <Line dataKey="recovery" dot={false} stroke="#22a06b" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function TimelinePanel() {
  return (
    <Card>
      <CardHeader><CardTitle>Clinical history timeline</CardTitle><CardDescription>Date/time-wise entries, previous comparison, and doctor ownership.</CardDescription></CardHeader>
      <CardContent className="space-y-3">
        {clinicalTimeline.map((item) => (
          <div className="rounded-xl border border-border bg-white p-3 shadow-sm" key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-2"><div className="text-sm font-bold text-foreground">{item.specialty} examination</div><Badge tone={item.status.includes("verified") ? "success" : "info"}>{item.status}</Badge></div>
            <div className="mt-1 text-xs font-semibold text-muted-foreground">{item.time} • {item.doctor}</div>
            <p className="mt-2 text-sm text-muted-foreground">{item.summary}</p>
          </div>
        ))}
        <Button className="w-full" variant="outline">Compare visits</Button>
      </CardContent>
    </Card>
  );
}

function BuilderAndReports() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader><CardTitle>Dynamic assessment builder</CardTitle><CardDescription>Configurable sections, scoring, mandatory rules, and conditional logic.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2 sm:grid-cols-2">{builderFields.map((field) => <button className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-left text-sm font-semibold transition hover:bg-white hover:shadow-sm" key={field}><Plus className="mr-2 inline h-4 w-4 text-primary" />{field}</button>)}</div>
          <AlertBanner icon={ShieldCheck} tone="info" title="Template governance">Reusable templates support specialty, department, doctor, mandatory field, score, and audit-ready edit tracking.</AlertBanner>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Investigation & report linking</CardTitle><CardDescription>Inline preview-ready links for labs, ECG, imaging, and uploaded documents.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {reportLinks.map((report) => <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted p-3" key={report.name}><div><div className="text-sm font-bold">{report.type} • {report.name}</div><div className="text-xs text-muted-foreground">{report.time}</div></div><Badge tone={report.status.includes("Critical") ? "danger" : "info"}>{report.status}</Badge></div>)}
        </CardContent>
      </Card>
    </div>
  );
}

function NotesApprovalArchitecture() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Card>
        <CardHeader><CardTitle>Notes & impression</CardTitle><CardDescription>Smart-template ready doctor note surface.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <textarea className="min-h-40 w-full rounded-lg border border-input bg-white p-3 text-sm outline-none focus:ring-2 focus:ring-ring/15" defaultValue="Clinical impression: BP elevation with stable perfusion. Differential diagnosis and follow-up plan to be reviewed with consultant." />
          <div className="flex flex-wrap gap-2"><Button variant="outline"><Mic className="h-4 w-4" />Voice</Button><Button>Save notes</Button></div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Approval workflow</CardTitle><CardDescription>Junior doctor entry, consultant verification, audit logs, and digital signature state.</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {["Junior doctor draft captured", "Consultant verification pending", "Digital signature ready", "Edit history retained"].map((item, index) => <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-muted p-3 text-sm font-semibold" key={item}><CheckCircle2 className={cn("h-4 w-4", index === 1 ? "text-warning" : "text-success")} />{item}</div>)}
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Backend/API ready</CardTitle><CardDescription>Phase-wise contracts and database structure.</CardDescription></CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">{backendApis.slice(0, 5).map((api) => <div className="rounded-md bg-surface-muted px-2 py-1 text-xs font-semibold text-muted-foreground" key={api}>{api}</div>)}</div>
          <div className="flex flex-wrap gap-1">{databaseTables.map((table) => <Badge tone="muted" key={table}>{table}</Badge>)}</div>
        </CardContent>
      </Card>
    </div>
  );
}

function MobileTabletOptimization() {
  return (
    <Card>
      <CardHeader><CardTitle>Doctor workflow and mobile/tablet optimization</CardTitle><CardDescription>Low-scroll OPD/IPD rounds flow with touch-friendly actions.</CardDescription></CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {["Select patient", "Open examination", "Select specialty", "Fill findings", "Auto scoring", "Add notes", "Save draft", "Final submit", "Consultant verification"].map((step, index) => <div className="rounded-lg border border-border bg-surface-muted p-3 text-sm font-semibold" key={step}><span className="mr-2 text-primary">{index + 1}.</span>{step}</div>)}
        <div className="rounded-lg border border-primary/20 bg-primary-soft p-3 text-sm font-semibold text-primary xl:col-span-4">Tablet: collapsible left menu, large touch buttons, sticky patient header, floating save. Mobile: step tabs, swipe navigation, bottom action bar, voice input support.</div>
      </CardContent>
    </Card>
  );
}

type ClinicalActionRow = { time: string; type: string; owner: string; status: string; tone: "success" | "warning" | "danger" | "info" | "muted" };

function ClinicalActionWorkspace({ action, specialty, patient, rows, onAddRow, onOpenExamination }: { action: string; specialty: SpecialtyId; patient: ClinicalPatientContext; rows: ClinicalActionRow[]; onAddRow: (row: ClinicalActionRow) => void; onOpenExamination: () => void }) {
  if (action === "Clinical Examination") return <ExaminationWorkspace specialty={specialty} />;
  return <ClinicalActionForm key={action} action={action} patient={patient} rows={rows} onAddRow={onAddRow} onOpenExamination={onOpenExamination} />;
}

function ClinicalActionForm({ action, patient, rows, onAddRow, onOpenExamination }: { action: string; patient: ClinicalPatientContext; rows: ClinicalActionRow[]; onAddRow: (row: ClinicalActionRow) => void; onOpenExamination: () => void }) {
  const config = clinicalActionConfigs[action] ?? clinicalActionConfigs["Progress Notes"];
  const [fieldValues, setFieldValues] = React.useState<Record<string, string>>(() =>
    Object.fromEntries(config.fields.map((field) => [field.label, field.value ?? field.options?.[0] ?? ""])),
  );
  const [note, setNote] = React.useState(config.textarea?.value ?? "");
  const addDynamicEntry = (buttonLabel: string) => {
    const primaryField = config.fields[0];
    const type = fieldValues[primaryField.label] || primaryField.value || primaryField.options?.[0] || config.title;
    const status = dynamicStatusForAction(action, buttonLabel, fieldValues);
    onAddRow({
      time: currentClinicalTime(),
      type,
      owner: action === "Nursing Notes" ? "Nursing team" : action === "Reports" ? "Diagnostics" : "Dr. Kavita Rao",
      status: status.status,
      tone: status.tone,
    });
    toast.success(`${buttonLabel} added to ${action}`);
  };
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>{config.title}</CardTitle>
              <CardDescription>{config.description}</CardDescription>
            </div>
            <Badge tone={config.badgeTone}>{config.badge}</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {config.fields.map((field) => <ClinicalField key={field.label} field={field} value={fieldValues[field.label] ?? field.value ?? field.options?.[0] ?? ""} onChange={(value) => setFieldValues((current) => ({ ...current, [field.label]: value }))} />)}
            </div>
            {config.textarea ? (
              <label className="block space-y-1.5">
                <span className="text-xs font-bold text-muted-foreground">{config.textarea.label}</span>
                <textarea className="min-h-32 w-full rounded-xl border border-input bg-white p-3 text-sm font-semibold outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" value={note} onChange={(event) => setNote(event.target.value)} />
              </label>
            ) : null}
            <div className="flex flex-wrap gap-2 rounded-xl border border-border bg-surface-muted p-3">
              {config.actions.map((item, index) => <Button key={item} variant={index === 0 ? "default" : "outline"} onClick={() => addDynamicEntry(item)}>{item}</Button>)}
            </div>
          </CardContent>
        </Card>
        <ActionDataTable rows={rows} />
      </div>
      <div className="space-y-4">
        <ActionPatientContext patient={patient} />
        <Card>
          <CardHeader><CardTitle>Clinical handoff</CardTitle><CardDescription>Connected status for current encounter.</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {config.handoff.map((item) => <div key={item.label} className="flex items-center justify-between rounded-lg border border-border bg-surface-muted px-3 py-2 text-sm"><span className="font-semibold">{item.label}</span><Badge tone={item.tone}>{item.status}</Badge></div>)}
          </CardContent>
        </Card>
        <AlertBanner icon={ShieldCheck} tone="info" title="Production workflow">Autosave, audit log, consultant verification, print, and EMR handoff states are modeled for this workspace.</AlertBanner>
        <Button className="w-full" variant="outline" onClick={onOpenExamination}>Back to examination</Button>
      </div>
    </div>
  );
}

function currentClinicalTime() {
  return `Today ${new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date())}`;
}

function dynamicStatusForAction(action: string, buttonLabel: string, values: Record<string, string>): Pick<ClinicalActionRow, "status" | "tone"> {
  if (buttonLabel.toLowerCase().includes("print") || buttonLabel.toLowerCase().includes("export")) return { status: "Printed", tone: "success" };
  if (buttonLabel.toLowerCase().includes("verification") || buttonLabel.toLowerCase().includes("sign-off")) return { status: "Pending review", tone: "warning" };
  if (action === "Prescription" && values["Pharmacy status"] === "Send to pharmacy") return { status: "Pharmacy queue", tone: "info" };
  if (action === "Vitals" && values["Pain score"] && !["0", "1", "2"].includes(values["Pain score"])) return { status: "Watch", tone: "warning" };
  if (action === "Reports" && values.Status === "Critical") return { status: "Critical", tone: "danger" };
  if (action === "Discharge Summary") return { status: "Draft saved", tone: "info" };
  return { status: "Saved", tone: "success" };
}

type ClinicalFieldConfig = { label: string; value?: string; options?: string[] };

const clinicalActionConfigs: Record<string, {
  title: string;
  description: string;
  badge: string;
  badgeTone: "success" | "warning" | "danger" | "info" | "muted";
  fields: ClinicalFieldConfig[];
  textarea?: { label: string; value: string };
  actions: string[];
  handoff: { label: string; status: string; tone: "success" | "warning" | "danger" | "info" | "muted" }[];
}> = {
  "Progress Notes": {
    title: "Progress Notes",
    description: "Doctor-facing SOAP notes with autosave, review status, and consultant handoff.",
    badge: "Draft active",
    badgeTone: "info",
    fields: [{ label: "Note type", options: ["SOAP note", "Round note", "Procedure note", "Follow-up note"] }, { label: "Priority", options: ["Routine", "Monitor", "Urgent"] }, { label: "Author", value: "Dr. Kavita Rao" }, { label: "Next review", value: "Today 18:00" }],
    textarea: { label: "Clinical note", value: "Subjective: Chest tightness improved. Objective: BP elevated but perfusion stable. Assessment: Continue BP monitoring. Plan: Review labs and adjust medication if trend persists." },
    actions: ["Save progress note", "Send for verification", "Print note"],
    handoff: [{ label: "Autosave", status: "Ready", tone: "success" }, { label: "Consultant review", status: "Pending", tone: "warning" }, { label: "EMR sync", status: "Queued", tone: "info" }],
  },
  Orders: {
    title: "Clinical Orders",
    description: "Medication, lab, radiology, diet, nursing, and procedure orders for the active encounter.",
    badge: "6 order sets",
    badgeTone: "info",
    fields: [{ label: "Order type", options: ["Lab", "Radiology", "Medication", "Nursing", "Diet", "Procedure"] }, { label: "Priority", options: ["Routine", "Urgent", "STAT"] }, { label: "Department", options: ["Laboratory", "Radiology", "Pharmacy", "Nursing"] }, { label: "Start time", value: "Now" }],
    textarea: { label: "Order instructions", value: "Repeat BP charting 4 hourly. CBC, LFT, KFT and ECG before consultant review." },
    actions: ["Place order", "Save order set", "Print requisition"],
    handoff: [{ label: "Lab handoff", status: "Ready", tone: "success" }, { label: "Pharmacy", status: "Pending", tone: "warning" }, { label: "Billing", status: "Connected", tone: "info" }],
  },
  Prescription: {
    title: "Prescription",
    description: "Medication prescription with allergy warnings, dose checks, frequency, duration, and pharmacy handoff.",
    badge: "Allergy alert",
    badgeTone: "warning",
    fields: [{ label: "Drug", value: "Amlodipine" }, { label: "Dose", options: ["2.5 mg", "5 mg", "10 mg"] }, { label: "Frequency", options: ["OD", "BD", "TDS", "SOS"] }, { label: "Duration", value: "7 days" }, { label: "Route", options: ["Oral", "IV", "IM", "Topical"] }, { label: "Pharmacy status", options: ["Draft", "Send to pharmacy", "Hold"] }],
    textarea: { label: "Prescription notes", value: "Avoid Penicillin. Continue antihypertensive therapy and review BP trend." },
    actions: ["Add medicine", "Send to pharmacy", "Print prescription"],
    handoff: [{ label: "Allergy check", status: "Active", tone: "warning" }, { label: "Drug interaction", status: "Clear", tone: "success" }, { label: "Pharmacy queue", status: "Ready", tone: "info" }],
  },
  Vitals: {
    title: "Vitals",
    description: "High-speed vitals entry with trend context and NEWS scoring readiness.",
    badge: "NEWS 4",
    badgeTone: "warning",
    fields: [{ label: "BP", value: "148/92" }, { label: "Pulse", value: "86 bpm" }, { label: "SpO2", value: "97%" }, { label: "Temperature", value: "37.2 C" }, { label: "Respiratory rate", value: "18/min" }, { label: "Pain score", options: ["0", "1", "2", "3", "4", "5", "6+"] }],
    textarea: { label: "Vitals note", value: "BP remains above baseline. No respiratory distress. Continue monitoring." },
    actions: ["Save vitals", "Add to trend", "Notify nurse"],
    handoff: [{ label: "NEWS score", status: "Moderate", tone: "warning" }, { label: "Nursing chart", status: "Updated", tone: "success" }, { label: "Doctor alert", status: "Notified", tone: "info" }],
  },
  Reports: {
    title: "Reports",
    description: "Lab, radiology, ECG, imaging, and document linking with critical value visibility.",
    badge: "3 linked",
    badgeTone: "info",
    fields: [{ label: "Report type", options: ["Lab", "Radiology", "ECG", "Echo", "Uploaded document"] }, { label: "Status", options: ["Available", "Pending", "Critical", "Reviewed"] }, { label: "Date range", value: "Last 7 days" }, { label: "Compare with", options: ["Previous visit", "Previous admission", "None"] }],
    textarea: { label: "Report interpretation", value: "ECG reviewed. Lab values pending final consultant interpretation." },
    actions: ["Link report", "Mark reviewed", "Export PDF"],
    handoff: [{ label: "Critical values", status: "None", tone: "success" }, { label: "Radiology", status: "Pending", tone: "warning" }, { label: "EMR filing", status: "Ready", tone: "info" }],
  },
  "Nursing Notes": {
    title: "Nursing Notes",
    description: "Nursing observation, care tasks, intake-output note, safety checks, and escalation workflow.",
    badge: "Bedside",
    badgeTone: "info",
    fields: [{ label: "Shift", options: ["Morning", "Evening", "Night"] }, { label: "Care level", options: ["Routine", "Close watch", "Critical"] }, { label: "Fall risk", options: ["Low", "Moderate", "High"] }, { label: "Intake/output", value: "Balanced" }],
    textarea: { label: "Nursing observation", value: "Patient comfortable, oriented, BP monitored. No acute distress. Medication administered as per chart." },
    actions: ["Save nursing note", "Escalate", "Print shift note"],
    handoff: [{ label: "Care plan", status: "Active", tone: "success" }, { label: "Escalation", status: "None", tone: "success" }, { label: "Shift handover", status: "Pending", tone: "warning" }],
  },
  "Discharge Summary": {
    title: "Discharge Summary",
    description: "Discharge-ready diagnosis, course, medication, follow-up, advice, and consultant sign-off.",
    badge: "Not finalized",
    badgeTone: "warning",
    fields: [{ label: "Discharge type", options: ["Routine", "DAMA", "Transfer", "Death summary"] }, { label: "Primary diagnosis", value: "Hypertension follow-up" }, { label: "Follow-up", value: "7 days" }, { label: "Consultant sign-off", options: ["Pending", "Approved"] }],
    textarea: { label: "Summary", value: "Patient clinically stable. BP monitoring advised. Follow up with cardiology OPD with reports." },
    actions: ["Save summary", "Request sign-off", "Print discharge"],
    handoff: [{ label: "Pharmacy clearance", status: "Pending", tone: "warning" }, { label: "Billing clearance", status: "Pending", tone: "warning" }, { label: "Consultant", status: "Review", tone: "info" }],
  },
};

function ClinicalField({ field, value, onChange }: { field: ClinicalFieldConfig; value: string; onChange: (value: string) => void }) {
  return (
    <label className="space-y-1.5 rounded-xl border border-border bg-white p-3 shadow-soft">
      <span className="text-xs font-bold text-muted-foreground">{field.label}</span>
      {field.options ? (
        <select className="h-10 w-full rounded-lg border border-input bg-white px-3 text-sm font-semibold outline-none focus:border-primary focus:ring-2 focus:ring-primary/15" value={value} onChange={(event) => onChange(event.target.value)}>
          {field.options.map((option) => <option key={option}>{option}</option>)}
        </select>
      ) : <Input className="h-10 font-semibold" value={value} placeholder={field.label} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function ActionDataTable({ rows }: { rows: ClinicalActionRow[] }) {
  return (
    <Card>
      <CardHeader><CardTitle>Recent activity</CardTitle><CardDescription>Audit-ready entries for this clinical workflow.</CardDescription></CardHeader>
      <CardContent className="overflow-x-auto p-0">
        <table className="w-full min-w-[680px] text-sm">
          <thead className="bg-surface-muted text-xs text-muted-foreground"><tr>{["Time", "Type", "Owner", "Status", "Action"].map((head) => <th className="px-3 py-3 text-left font-semibold" key={head}>{head}</th>)}</tr></thead>
          <tbody>{rows.map((row) => <tr className="border-t border-border" key={`${row.time}-${row.type}`}><td className="px-3 py-3 font-semibold">{row.time}</td><td className="px-3 py-3">{row.type}</td><td className="px-3 py-3">{row.owner}</td><td className="px-3 py-3"><Badge tone={row.tone}>{row.status}</Badge></td><td className="px-3 py-3"><Button size="sm" variant="outline">Open</Button></td></tr>)}</tbody>
        </table>
      </CardContent>
    </Card>
  );
}

const actionRows: Record<string, ClinicalActionRow[]> = {
  "Progress Notes": [{ time: "Today 10:22", type: "SOAP note", owner: "Dr. Kavita Rao", status: "Draft", tone: "info" }, { time: "Yesterday 18:10", type: "Round note", owner: "Dr. Aman Verma", status: "Verified", tone: "success" }],
  Orders: [{ time: "Today 10:30", type: "CBC, LFT, ECG", owner: "Dr. Kavita Rao", status: "Ordered", tone: "info" }, { time: "Today 09:55", type: "BP charting", owner: "Nursing", status: "Active", tone: "success" }],
  Prescription: [{ time: "Today 10:35", type: "Amlodipine", owner: "Dr. Kavita Rao", status: "Draft", tone: "warning" }, { time: "Yesterday 19:00", type: "Pantoprazole", owner: "Dr. Aman Verma", status: "Dispensed", tone: "success" }],
  Vitals: [{ time: "Today 10:40", type: "BP/Pulse/SpO2", owner: "Nurse Anika", status: "Moderate", tone: "warning" }, { time: "Today 06:00", type: "Morning vitals", owner: "Nurse Dev", status: "Stable", tone: "success" }],
  Reports: [{ time: "Today 09:50", type: "ECG", owner: "Diagnostics", status: "Reviewed", tone: "success" }, { time: "Today 10:05", type: "CBC", owner: "Laboratory", status: "Pending", tone: "warning" }],
  "Nursing Notes": [{ time: "Today 11:00", type: "Shift note", owner: "Nurse Anika", status: "Saved", tone: "success" }, { time: "Today 08:00", type: "Medication note", owner: "Nurse Dev", status: "Completed", tone: "success" }],
  "Discharge Summary": [{ time: "Today 11:15", type: "Draft summary", owner: "Dr. Kavita Rao", status: "Pending", tone: "warning" }, { time: "Yesterday 17:00", type: "Follow-up advice", owner: "Dr. Aman Verma", status: "Ready", tone: "info" }],
};

function ActionPatientContext({ patient }: { patient: ClinicalPatientContext }) {
  return (
    <Card>
      <CardHeader><CardTitle>Patient context</CardTitle></CardHeader>
      <CardContent className="space-y-2 text-sm">
        {[["Patient", patient.name], ["UHID", patient.uhid], ["Encounter", patient.encounter], ["Ward/Bed", patient.wardBed], ["Consultant", patient.consultant]].map(([label, value]) => <div className="flex justify-between gap-3 border-b border-border py-1.5 last:border-0" key={label}><span className="text-xs font-semibold text-muted-foreground">{label}</span><span className="text-right font-semibold">{value}</span></div>)}
      </CardContent>
    </Card>
  );
}

type NeuroModuleId = "gcs" | "sedation" | "evd" | "delirium" | "reflexes" | "motor" | "pupils" | "seizure" | "ventilation" | "timeline";

type NeuroModuleItem = {
  id: NeuroModuleId;
  title: string;
  subtitle: string;
  status: string;
  tone: "success" | "warning" | "danger" | "info" | "critical";
  editedBy: string;
  updatedAt: string;
};

const neuroStats = [
  { label: "GCS", value: "11", unit: "/15", status: "Watch", color: "#F5A524", trend: [15, 14, 13, 12, 11, 11] },
  { label: "ICP", value: "24", unit: "mmHg", status: "High", color: "#E5484D", trend: [18, 19, 21, 23, 24, 24] },
  { label: "MAP", value: "78", unit: "mmHg", status: "Target", color: "#18B67A", trend: [74, 76, 79, 78, 77, 78] },
  { label: "RASS", value: "-2", unit: "", status: "Goal", color: "#4F6EF7", trend: [-3, -2, -2, -1, -2, -2] },
  { label: "SpO2", value: "96", unit: "%", status: "Stable", color: "#18B67A", trend: [97, 96, 96, 95, 96, 96] },
  { label: "Vent", value: "SIMV", unit: "", status: "Synced", color: "#7C6BFF", trend: [8, 9, 8, 8, 7, 8] },
  { label: "Delirium", value: "CAM+", unit: "", status: "Risk", color: "#F5A524", trend: [0, 1, 1, 2, 2, 2] },
  { label: "Drain", value: "146", unit: "ml/24h", status: "Rising", color: "#E5484D", trend: [18, 22, 24, 29, 31, 36] },
];

const neuroTrendData = [
  { time: "00", gcs: 14, icp: 17, sedation: -1, drain: 12 },
  { time: "04", gcs: 13, icp: 19, sedation: -2, drain: 16 },
  { time: "08", gcs: 13, icp: 21, sedation: -2, drain: 18 },
  { time: "12", gcs: 12, icp: 23, sedation: -3, drain: 22 },
  { time: "16", gcs: 11, icp: 24, sedation: -2, drain: 31 },
  { time: "20", gcs: 11, icp: 24, sedation: -2, drain: 36 },
];

const initialNeuroModules: NeuroModuleItem[] = [
  { id: "gcs", title: "GCS Assessment", subtitle: "Eye, verbal, motor response with live severity mapping", status: "Autosaved", tone: "warning", editedBy: "Dr. Kavita Rao", updatedAt: "2 min ago" },
  { id: "sedation", title: "Sedation Monitoring", subtitle: "RASS target, active infusion and protocol safety", status: "Protocol active", tone: "info", editedBy: "ICU nurse Anika", updatedAt: "4 min ago" },
  { id: "evd", title: "EVD Monitoring", subtitle: "Drain output, pressure, waveform and threshold alerts", status: "Alert", tone: "critical", editedBy: "Dr. Rakesh Menon", updatedAt: "6 min ago" },
  { id: "delirium", title: "Delirium Assessment", subtitle: "CAM-ICU scoring with cognitive trend markers", status: "CAM positive", tone: "warning", editedBy: "Dr. Kavita Rao", updatedAt: "12 min ago" },
  { id: "reflexes", title: "Neurological Reflexes", subtitle: "Brainstem, plantar and cranial reflex documentation", status: "Stable", tone: "success", editedBy: "Resident team", updatedAt: "18 min ago" },
  { id: "motor", title: "Motor / Sensory Assessment", subtitle: "Limb power, tone, sensory level and laterality", status: "Compare", tone: "info", editedBy: "Neuro registrar", updatedAt: "22 min ago" },
  { id: "pupils", title: "Pupillary Examination", subtitle: "Size, symmetry, NPi and reactivity log", status: "Reactive", tone: "success", editedBy: "ICU nurse Dev", updatedAt: "28 min ago" },
  { id: "seizure", title: "Seizure Monitoring", subtitle: "Events, EEG handoff and rescue medication readiness", status: "No event", tone: "success", editedBy: "Neuro ICU", updatedAt: "35 min ago" },
  { id: "ventilation", title: "Ventilation Correlation", subtitle: "CO2, oxygenation, sedation and neuro pressure overlay", status: "Synced", tone: "info", editedBy: "Respiratory therapist", updatedAt: "38 min ago" },
  { id: "timeline", title: "Neuro Observation Timeline", subtitle: "Hourly observations and deterioration heatmap", status: "Live", tone: "info", editedBy: "Bedside team", updatedAt: "Now" },
];

function MiniSparkline({ values, color }: { values: number[]; color: string }) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const points = values.map((value, index) => {
    const x = (index / Math.max(values.length - 1, 1)) * 72;
    const y = 28 - ((value - min) / Math.max(max - min, 1)) * 22;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg aria-hidden className="h-8 w-[76px]" viewBox="0 0 76 32">
      <path d={`M0 30 L${points.split(" ").join(" L")} L72 30 Z`} fill={color} opacity="0.08" />
      <polyline fill="none" points={points} stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
    </svg>
  );
}

function NeuroCommandCenter({ patient, selectedPatientId, onPatientChange }: { patient: ClinicalPatientContext; selectedPatientId: string; onPatientChange: (patientId: string) => void }) {
  const [query, setQuery] = React.useState("");
  const patientResults = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return mockPatients.filter((item) => `${patientName(item)} ${item.uhid} ${item.mobile} ${item.department}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query]);
  return (
    <div className="sticky top-0 z-30 -mx-2 rounded-b-[28px] border border-t-0 border-[rgba(15,23,42,0.08)] bg-[#f5f7fb]/92 px-2 pb-3 pt-2 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#f7f9ff_54%,#eef2ff_100%)] p-3 shadow-[0_12px_34px_rgba(31,41,55,0.08)]">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F6EF7,#7C6BFF)] text-lg font-black text-white shadow-[0_10px_24px_rgba(79,110,247,0.32)]">
              {patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
              <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18B67A] shadow-[0_0_0_5px_rgba(24,182,122,0.16)]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-black tracking-normal text-[#1F2937]">{patient.name}</h1>
                <Badge tone="info">Neuro ICU</Badge>
                <Badge tone="critical">High acuity</Badge>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#18B67A]/20 bg-[#18B67A]/10 px-2 py-0.5 text-[11px] font-bold text-[#15845b]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#18B67A]" />Live monitoring</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#6B7280]">
                <span>UHID {patient.uhid}</span>
                <span>MRN {selectedPatientId.toUpperCase()}</span>
                <span>{patient.wardBed}</span>
                <span>Admitted 3d 14h</span>
                <span>Updated 42 sec ago</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <Input className="h-11 rounded-2xl border-[rgba(15,23,42,0.08)] bg-white/90 pl-9 text-sm font-semibold shadow-inner" placeholder="Global patient search, UHID, MRN..." value={query} onChange={(event) => setQuery(event.target.value)} />
              {query ? (
                <div className="absolute right-0 top-12 z-50 max-h-72 w-full overflow-auto rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-1 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
                  {patientResults.length ? patientResults.map((item) => (
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[#F5F7FB]" key={item.id} onClick={() => { onPatientChange(item.id); setQuery(""); }} type="button">
                      <span className="block font-bold text-[#1F2937]">{patientName(item)}</span>
                      <span className="text-xs font-semibold text-[#6B7280]">{item.uhid} | {item.mobile} | {item.department}</span>
                    </button>
                  )) : <div className="px-3 py-4 text-sm font-semibold text-[#6B7280]">No matching patient found.</div>}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.info("Shift handover opened")}><ClipboardCheck className="h-4 w-4" />Shift handover</Button>
              <Button size="sm" variant="outline" onClick={() => toast.warning("Emergency neuro pathway armed")}><ShieldAlert className="h-4 w-4" />Emergency</Button>
              <Button size="sm" onClick={() => toast.success("All neuro observations saved")}><Save className="h-4 w-4" />Saved 20s ago</Button>
            </div>
          </div>
        </div>
        <NeuroStatRibbon />
      </div>
    </div>
  );
}

function NeuroStatRibbon() {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
      {neuroStats.map((stat) => (
        <motion.button whileHover={{ y: -2 }} className="group rounded-[20px] border border-white/70 bg-white/72 p-3 text-left shadow-[0_10px_28px_rgba(15,23,42,0.07)] backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" key={stat.label} type="button">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6B7280]">{stat.label}</div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#1F2937]">{stat.value}</span>
                <span className="text-xs font-bold text-[#6B7280]">{stat.unit}</span>
              </div>
            </div>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${stat.color}14` }}>
              <span className="absolute h-7 w-7 rounded-full border-2" style={{ borderColor: stat.color }} />
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.color }} />
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <MiniSparkline color={stat.color} values={stat.trend} />
            <span className="rounded-full px-2 py-0.5 text-[11px] font-black" style={{ backgroundColor: `${stat.color}12`, color: stat.color }}>{stat.status}</span>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function NeuroModuleShell({ module, children }: { module: NeuroModuleItem; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  return (
    <Reorder.Item value={module} as="div" className="min-w-0">
      <motion.section layout className="overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white/86 shadow-[0_14px_42px_rgba(15,23,42,0.07)] backdrop-blur">
        <button className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" onClick={() => setOpen((value) => !value)} type="button">
          <div className="flex min-w-0 items-center gap-3">
            <GripVertical className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="truncate text-sm font-black text-[#1F2937]">{module.title}</h2>
                <Badge tone={module.tone}>{module.status}</Badge>
              </div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#6B7280]">{module.subtitle}</p>
            </div>
          </div>
          <div className="hidden shrink-0 text-right text-[11px] font-bold text-[#6B7280] sm:block">
            <div>{module.editedBy}</div>
            <div>{module.updatedAt}</div>
          </div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#6B7280] transition", open && "rotate-180")} />
        </button>
        {open ? <motion.div layout className="border-t border-[rgba(15,23,42,0.08)] px-4 py-4">{children}</motion.div> : null}
      </motion.section>
    </Reorder.Item>
  );
}

function GcsModule() {
  const [eye, setEye] = React.useState(3);
  const [verbal, setVerbal] = React.useState(3);
  const [motor, setMotor] = React.useState(5);
  const score = eye + verbal + motor;
  const severity = score <= 8 ? "Critical" : score <= 12 ? "Moderate injury" : "Mild injury";
  const color = score <= 8 ? "#E5484D" : score <= 12 ? "#F5A524" : "#18B67A";
  const groups = [
    { label: "Eye", value: eye, setValue: setEye, options: [[4, "Spontaneous"], [3, "Voice"], [2, "Pain"], [1, "None"]] },
    { label: "Verbal", value: verbal, setValue: setVerbal, options: [[5, "Oriented"], [4, "Confused"], [3, "Words"], [2, "Sounds"], [1, "None"]] },
    { label: "Motor", value: motor, setValue: setMotor, options: [[6, "Obeys"], [5, "Localizes"], [4, "Withdraws"], [3, "Flexion"], [2, "Extension"], [1, "None"]] },
  ] as const;
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_190px]">
      <div className="space-y-3">
        {groups.map((group) => (
          <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3" key={group.label}>
            <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.12em] text-[#6B7280]">{group.label} response</span><Badge tone="info">{group.value}</Badge></div>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
              {group.options.map(([value, label]) => (
                <button className={cn("rounded-xl border px-2 py-2 text-xs font-black transition", group.value === value ? "border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-[0_8px_20px_rgba(79,110,247,0.25)]" : "border-[rgba(15,23,42,0.08)] bg-white text-[#4B5563] hover:border-[#4F6EF7]/35")} key={label} onClick={() => group.setValue(value)} type="button">
                  {value} - {label}
                </button>
              ))}
            </div>
          </div>
        ))}
        <div className="grid gap-2 md:grid-cols-2">
          <textarea className="min-h-24 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" defaultValue="GCS reduced from 13 to 11 over last 8 hours. Repeat pupil and ICP correlation advised." />
          <div className="rounded-2xl border border-[#F5A524]/20 bg-[#F5A524]/10 p-3 text-sm font-bold text-[#8a5c00]">Risk interpretation: downward GCS trend with elevated ICP. Neuro consultant review recommended within 15 minutes.</div>
        </div>
      </div>
      <div className="rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,#ffffff,#f7f9ff)] p-4 text-center">
        <motion.div key={score} animate={{ scale: [0.96, 1.04, 1] }} className={cn("mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[10px] text-4xl font-black", score <= 8 && "animate-pulse")} style={{ borderColor: `${color}55`, color }}>{score}</motion.div>
        <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#6B7280]">Live GCS</div>
        <div className="mt-1 text-sm font-black text-[#1F2937]">{severity}</div>
        <MiniSparkline color={color} values={[15, 14, 13, 13, 12, score]} />
        <div className="mt-3 flex flex-col gap-2"><Button size="sm" variant="outline"><Mic className="h-4 w-4" />Dictate</Button><Button size="sm"><PhoneCall className="h-4 w-4" />Consult Neuro</Button></div>
      </div>
    </div>
  );
}

function SedationModule() {
  const [rate, setRate] = React.useState(18);
  const [target, setTarget] = React.useState("-2");
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          {["Propofol", "Fentanyl", "Dexmedetomidine"].map((drug, index) => <button className={cn("rounded-2xl border p-3 text-left transition", index === 0 ? "border-[#4F6EF7]/35 bg-[#4F6EF7]/10 text-[#2446d8]" : "border-[rgba(15,23,42,0.08)] bg-white")} key={drug} type="button"><Syringe className="mb-2 h-4 w-4" /><span className="text-sm font-black">{drug}</span><span className="mt-1 block text-xs font-semibold text-[#6B7280]">{index === 0 ? "Active infusion" : "Available"}</span></button>)}
        </div>
        <label className="block rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3">
          <div className="flex items-center justify-between text-sm font-black"><span>Propofol infusion rate</span><span>{rate} mcg/kg/min</span></div>
          <input className="mt-3 w-full accent-[#4F6EF7]" max="60" min="0" onChange={(event) => setRate(Number(event.target.value))} type="range" value={rate} />
        </label>
        <div className="flex flex-wrap gap-2">
          {["0", "-1", "-2", "-3", "-4", "-5"].map((score) => <button className={cn("rounded-xl border px-3 py-2 text-xs font-black", target === score ? "border-[#7C6BFF] bg-[#7C6BFF] text-white" : "border-[rgba(15,23,42,0.08)] bg-white")} key={score} onClick={() => setTarget(score)} type="button">RASS {score}</button>)}
        </div>
      </div>
      <div className="space-y-3 rounded-[22px] border border-[#18B67A]/20 bg-[#18B67A]/10 p-3">
        <Badge tone="success">Within protocol</Badge>
        <div className="text-2xl font-black text-[#166b4b]">Target RASS {target}</div>
        <p className="text-xs font-semibold text-[#166b4b]">Recommendation: maintain current rate, repeat sedation score in 30 minutes, watch MAP if titrating upward.</p>
        <div className="rounded-xl bg-white/70 p-2 text-xs font-bold text-[#6B7280]">Interaction watch: fentanyl + propofol respiratory depression risk monitored.</div>
      </div>
    </div>
  );
}

function EvdModule() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_230px]">
      <div className="h-56 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={neuroTrendData}>
            <CartesianGrid stroke="#E6EAF4" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: "#6B7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid rgba(15,23,42,0.08)" }} />
            <Line dataKey="icp" dot={false} stroke="#E5484D" strokeWidth={2.5} />
            <Line dataKey="drain" dot={false} stroke="#4F6EF7" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-2">
        {[["Drain pressure", "18 cmH2O", "warning"], ["Output this hour", "36 ml", "danger"], ["24h cumulative", "146 ml", "info"], ["Fluid color", "Xanthochromic", "warning"]].map(([label, value, tone]) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3" key={label}><div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6B7280]">{label}</div><div className="mt-1 flex items-center justify-between gap-2"><span className="text-lg font-black text-[#1F2937]">{value}</span><Badge tone={tone as "warning" | "danger" | "info"}>{tone}</Badge></div></div>)}
      </div>
      <div className="lg:col-span-2 grid gap-2 md:grid-cols-3">
        {["Waveform dampening detected", "Height changed +2 cm", "Anomaly: output velocity above baseline"].map((item) => <div className="rounded-2xl border border-[#E5484D]/20 bg-[#E5484D]/8 p-3 text-sm font-bold text-[#b4232a]" key={item}>{item}</div>)}
      </div>
    </div>
  );
}

function DeliriumModule() {
  const questions = ["Acute onset/fluctuating course", "Inattention", "Altered consciousness", "Disorganized thinking"];
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {questions.map((question, index) => (
        <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3" key={question}>
          <div className="text-sm font-black text-[#1F2937]">{question}</div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <button className={cn("rounded-xl px-3 py-2 text-xs font-black", index < 2 ? "bg-[#F5A524] text-white" : "bg-white text-[#6B7280]")} type="button">Yes</button>
            <button className={cn("rounded-xl px-3 py-2 text-xs font-black", index >= 2 ? "bg-[#18B67A] text-white" : "bg-white text-[#6B7280]")} type="button">No</button>
          </div>
        </div>
      ))}
      <div className="rounded-2xl border border-[#F5A524]/20 bg-[#F5A524]/10 p-3 md:col-span-2">
        <div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black text-[#8a5c00]">CAM-ICU positive risk pattern</div><Badge tone="success">Consultant verified</Badge></div>
        <p className="mt-1 text-sm font-semibold text-[#8a5c00]">Sleep disturbance and agitation markers increased overnight. Reorientation protocol and medication review recommended.</p>
      </div>
    </div>
  );
}

function CompactNeuroModule({ icon: Icon, title, rows }: { icon: typeof Brain; title: string; rows: string[] }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2"><Icon className="h-5 w-5 text-[#4F6EF7]" /><div className="text-sm font-black text-[#1F2937]">{title}</div></div>
      <div className="grid gap-2 md:grid-cols-2">
        {rows.map((row) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] px-3 py-2 text-sm font-bold text-[#374151]" key={row}>{row}</div>)}
      </div>
    </div>
  );
}

function NeuroTimelineModule() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-1">
        {Array.from({ length: 24 }).map((_, index) => {
          const color = index > 15 ? "bg-[#E5484D]/70" : index > 10 ? "bg-[#F5A524]/65" : "bg-[#18B67A]/55";
          return <div className={cn("h-8 rounded-lg", color)} key={index} title={`${index}:00 neuro observation`} />;
        })}
      </div>
      {["20:00 GCS 11, ICP 24, drain 36 ml", "18:00 Pupils equal, NPi 3.8/3.7", "16:00 Sedation target adjusted to RASS -2"].map((event) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2 text-sm font-bold text-[#374151]" key={event}>{event}</div>)}
    </div>
  );
}

function ModuleContent({ id }: { id: NeuroModuleId }) {
  if (id === "gcs") return <GcsModule />;
  if (id === "sedation") return <SedationModule />;
  if (id === "evd") return <EvdModule />;
  if (id === "delirium") return <DeliriumModule />;
  if (id === "timeline") return <NeuroTimelineModule />;
  const content: Record<Exclude<NeuroModuleId, "gcs" | "sedation" | "evd" | "delirium" | "timeline">, { icon: typeof Brain; title: string; rows: string[] }> = {
    reflexes: { icon: Zap, title: "Reflex documentation", rows: ["Corneal reflex present", "Cough reflex weak", "Plantar equivocal R", "Doll eye deferred"] },
    motor: { icon: Activity, title: "Motor and sensory map", rows: ["RUL 4/5, LUL 5/5", "RLL 4/5, LLL 5/5", "No sensory level", "Tone mildly increased R"] },
    pupils: { icon: UserRound, title: "Pupil and NPi checks", rows: ["Right 3.2 mm reactive", "Left 3.1 mm reactive", "NPi R 3.8 / L 3.7", "No anisocoria"] },
    seizure: { icon: Radio, title: "Seizure surveillance", rows: ["No observed event", "EEG order prepared", "Levetiracetam active", "Rescue med checked"] },
    ventilation: { icon: Waves, title: "Ventilation correlation", rows: ["EtCO2 36 mmHg", "SIMV VC synced", "PaCO2 target met", "SpO2 96% FiO2 35"] },
  };
  return <CompactNeuroModule {...content[id]} />;
}

function NeuroMonitoringGrid() {
  const [modules, setModules] = React.useState(initialNeuroModules);
  return (
    <Reorder.Group axis="y" className="grid gap-4 xl:grid-cols-2" values={modules} onReorder={setModules}>
      {modules.map((module) => <NeuroModuleShell key={module.id} module={module}><ModuleContent id={module.id} /></NeuroModuleShell>)}
    </Reorder.Group>
  );
}

function NeuroChartDeck() {
  return (
    <div className="grid gap-4 xl:grid-cols-3">
      {[
        ["GCS / ICP Trend", "gcs", "#4F6EF7"],
        ["Sedation Curve", "sedation", "#7C6BFF"],
        ["Drain Output", "drain", "#18B67A"],
      ].map(([title, key, color]) => (
        <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/86 shadow-[0_14px_42px_rgba(15,23,42,0.07)]" key={title}>
          <CardHeader><CardTitle>{title}</CardTitle><CardDescription>Last 24h bedside feed</CardDescription></CardHeader>
          <CardContent className="h-56 p-4">
            <ResponsiveContainer height="100%" width="100%">
              <LineChart data={neuroTrendData}>
                <CartesianGrid stroke="#E6EAF4" vertical={false} />
                <XAxis dataKey="time" tick={{ fill: "#6B7280", fontSize: 11 }} />
                <YAxis tick={{ fill: "#6B7280", fontSize: 11 }} />
                <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid rgba(15,23,42,0.08)" }} />
                <Line dataKey={key} dot={false} stroke={color} strokeWidth={2.5} type="monotone" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function IntelligenceRail({ patient }: { patient: ClinicalPatientContext }) {
  const cards = [
    { title: "Clinical AI Summary", icon: Brain, tone: "info" as const, body: "GCS down 2 points in 12h with ICP above target. Sedation in goal range; drainage velocity increased after 16:00." },
    { title: "Red Flags", icon: AlertTriangle, tone: "critical" as const, body: "ICP > 22 mmHg sustained, CAM positive, drain output rising. Escalation criteria partially met." },
    { title: "Critical Labs", icon: FlaskConical, tone: "warning" as const, body: "Na 132, K 4.2, Hb 10.8, WBC 13.2. Osmolality review pending." },
    { title: "Medication Conflicts", icon: Pill, tone: "success" as const, body: "No hard conflict. Sedation + opioid respiratory depression warning monitored." },
  ];
  return (
    <aside className="space-y-4 xl:sticky xl:top-48 xl:self-start">
      <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-[#111827] text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center justify-between"><div><div className="text-xs font-black uppercase tracking-[0.16em] text-white/55">Patient intelligence</div><div className="mt-1 text-lg font-black">{patient.name}</div></div><Bell className="h-5 w-5 text-[#F5A524]" /></div>
          <div className="grid grid-cols-2 gap-2">
            {[["NEWS", "6"], ["Fall", "High"], ["Pressure", "Mod"], ["Tasks", "9"]].map(([label, value]) => <div className="rounded-2xl bg-white/8 p-3" key={label}><div className="text-[11px] font-bold uppercase text-white/50">{label}</div><div className="text-xl font-black">{value}</div></div>)}
          </div>
        </CardContent>
      </Card>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[0_14px_42px_rgba(15,23,42,0.07)]" key={card.title}>
            <CardContent className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#4F6EF7]" /><div className="text-sm font-black text-[#1F2937]">{card.title}</div></div><Badge tone={card.tone}>{card.tone}</Badge></div>
              <p className="text-sm font-semibold leading-6 text-[#4B5563]">{card.body}</p>
            </CardContent>
          </Card>
        );
      })}
      <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
        <CardHeader><CardTitle>Live task timeline</CardTitle><CardDescription>Next 90 minutes</CardDescription></CardHeader>
        <CardContent className="space-y-2">
          {["Repeat GCS and pupils - 10 min", "Neuro consultant review - 15 min", "ICP threshold audit - 30 min", "Sedation reassessment - 45 min", "Print ICU neuro sheet - shift end"].map((task) => <div className="flex gap-2 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3 text-sm font-bold text-[#374151]" key={task}><span className="mt-1 h-2 w-2 rounded-full bg-[#4F6EF7]" />{task}</div>)}
        </CardContent>
      </Card>
    </aside>
  );
}

function NeuroQuickActionDock() {
  const actions = [
    ["Save assessment", Save],
    ["Final submit", Send],
    ["Escalate care", ShieldAlert],
    ["Call consultant", PhoneCall],
    ["Generate report", FileText],
    ["Print ICU sheet", Printer],
    ["Export PDF", Download],
    ["Compare visits", Activity],
  ] as const;
  return (
    <div className="sticky bottom-3 z-40 rounded-[24px] border border-white/70 bg-white/90 p-2 shadow-[0_18px_52px_rgba(15,23,42,0.16)] backdrop-blur-xl">
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
        {actions.map(([label, Icon], index) => <Button className={cn("rounded-2xl", index === 1 && "bg-[linear-gradient(135deg,#4F6EF7,#7C6BFF)]")} key={label} variant={index === 1 ? "default" : "outline"} onClick={() => toast.success(`${label} queued`)}><Icon className="h-4 w-4" />{label}</Button>)}
      </div>
    </div>
  );
}

function NeuroIcuDashboard({ patient, selectedPatientId, onPatientChange }: { patient: ClinicalPatientContext; selectedPatientId: string; onPatientChange: (patientId: string) => void }) {
  return (
    <PageMotion>
      <div className="min-h-screen rounded-[28px] bg-[#F5F7FB] p-2 text-[#1F2937]">
        <NeuroCommandCenter patient={patient} selectedPatientId={selectedPatientId} onPatientChange={onPatientChange} />
        <div className="mt-4 grid gap-4 2xl:grid-cols-[280px_minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="hidden space-y-4 2xl:block">
            <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/86 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
              <CardHeader><CardTitle>Neuro command map</CardTitle><CardDescription>Bedside navigation</CardDescription></CardHeader>
              <CardContent className="space-y-2">
                {[["GCS", Gauge], ["ICP / EVD", Droplets], ["Sedation", Moon], ["Delirium", Brain], ["Ventilation", Waves]].map(([label, Icon]) => <button className="flex w-full items-center gap-2 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] px-3 py-2 text-sm font-black text-[#374151] hover:border-[#4F6EF7]/35" key={label as string} type="button">{React.createElement(Icon as typeof Brain, { className: "h-4 w-4 text-[#4F6EF7]" })}{label as string}</button>)}
              </CardContent>
            </Card>
            <Card className="rounded-[24px] border-[#E5484D]/20 bg-[#E5484D]/8 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
              <CardContent className="space-y-2 p-4"><ShieldAlert className="h-5 w-5 text-[#E5484D]" /><div className="font-black text-[#9f2329]">Deterioration watch active</div><p className="text-sm font-semibold text-[#9f2329]">Trend triggers: GCS drop, ICP high, drain velocity change.</p></CardContent>
            </Card>
          </section>
          <main className="min-w-0 space-y-4">
            <NeuroChartDeck />
            <NeuroMonitoringGrid />
          </main>
          <IntelligenceRail patient={patient} />
        </div>
        <NeuroQuickActionDock />
      </div>
    </PageMotion>
  );
}

export function ClinicalExaminationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPatientId = searchParams.get("patientId") ?? mockPatients[0]?.id;
  const selectedPatientRecord = mockPatients.find((patient) => patient.id === requestedPatientId) ?? mockPatients[0];
  const selectedPatient = clinicalPatientFromRecord(selectedPatientRecord);
  const selectPatient = React.useCallback(
    (patientId: string) => {
      router.push(`/clinical-examination?patientId=${patientId}`);
    },
    [router],
  );
  return <NeuroIcuDashboard patient={selectedPatient} selectedPatientId={selectedPatientRecord.id} onPatientChange={selectPatient} />;
}

export function LegacyClinicalExaminationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPatientId = searchParams.get("patientId") ?? mockPatients[0]?.id;
  const selectedPatientRecord = mockPatients.find((patient) => patient.id === requestedPatientId) ?? mockPatients[0];
  const selectedPatient = clinicalPatientFromRecord(selectedPatientRecord);
  const [specialty, setSpecialty] = React.useState<SpecialtyId>("cvs");
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [activeAction, setActiveAction] = React.useState("Clinical Examination");
  const [inlineSpecialty, setInlineSpecialty] = React.useState<SpecialtyId | null>(null);
  const [actionActivity, setActionActivity] = React.useState<Record<string, ClinicalActionRow[]>>(actionRows);
  const inlineExamRef = React.useRef<HTMLDivElement | null>(null);
  const selectPatient = React.useCallback(
    (patientId: string) => {
      router.push(`/clinical-examination?patientId=${patientId}`);
    },
    [router],
  );
  const openSpecialty = (id: SpecialtyId) => {
    setSpecialty(id);
    setInlineSpecialty(id);
    setActiveAction("Clinical Examination");
    window.setTimeout(() => inlineExamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
    toast.success(`${clinicalSpecialties.find((item) => item.id === id)?.label ?? "Specialty"} examination opened`);
  };
  const openAction = (action: string) => {
    setActiveAction(action);
    if (action === "Clinical Examination") {
      setActiveTab("dashboard");
      setInlineSpecialty(null);
      toast.success(`${action} dashboard opened`);
      return;
    }
    setActiveTab("action");
    toast.success(`${action} opened`);
  };
  const addActionRow = (action: string, row: ClinicalActionRow) => {
    setActionActivity((current) => ({ ...current, [action]: [row, ...(current[action] ?? [])] }));
  };
  return (
    <PageMotion>
      <PatientHeaderStrip patient={selectedPatient} selectedPatientId={selectedPatientRecord.id} onPatientChange={selectPatient} />
      <QuickActions active={activeAction} onSelect={openAction} />
      <SummaryCards />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="specialty">Specialty</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className={cn("gap-4", inlineSpecialty ? "space-y-4" : "grid xl:grid-cols-[minmax(0,1fr)_360px]")}>
          <div className="space-y-4">
            <SpecialtyPicker selected={specialty} onSelect={openSpecialty} />
            {inlineSpecialty ? <div ref={inlineExamRef} className="scroll-mt-24"><ExaminationWorkspace specialty={inlineSpecialty} /></div> : null}
          </div>
          {!inlineSpecialty ? <TimelinePanel /> : null}
        </TabsContent>
        <TabsContent value="specialty" className="space-y-4">
          <SpecialtyPicker selected={specialty} onSelect={openSpecialty} />
          {inlineSpecialty ? <div ref={inlineExamRef} className="scroll-mt-24"><ExaminationWorkspace specialty={inlineSpecialty} /></div> : null}
        </TabsContent>
        <TabsContent value="graphs" className="space-y-4"><TrendCard /><ClinicalScorePanel /></TabsContent>
        <TabsContent value="action"><ClinicalActionWorkspace action={activeAction} specialty={specialty} patient={selectedPatient} rows={actionActivity[activeAction] ?? []} onAddRow={(row) => addActionRow(activeAction, row)} onOpenExamination={() => openAction("Clinical Examination")} /></TabsContent>
      </Tabs>
      <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-xl border border-border bg-white/95 p-2 shadow-[0_16px_40px_rgba(39,37,54,0.18)] backdrop-blur md:hidden">
        {["Exam", "Scores", "Notes", "Save"].map((item, index) => <Button className="flex-1" key={item} size="sm" variant={index === 3 ? "default" : "outline"}>{item}</Button>)}
      </div>
      <StickyActionBar onSave={() => toast.success("Clinical examination saved as draft")} saveLabel="Final submit" />
    </PageMotion>
  );
}
