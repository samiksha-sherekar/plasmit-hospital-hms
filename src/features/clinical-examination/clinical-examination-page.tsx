"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowRight, CheckCircle2, ClipboardCheck, Filter, Mic, Plus, Printer, RefreshCcw, Save, Search, ShieldCheck, Star } from "lucide-react";
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
  clinicalPatient,
  clinicalScores,
  clinicalSpecialties,
  clinicalTimeline,
  clinicalTrendData,
  databaseTables,
  examinationDefaultNotes,
  examinationFindings,
  examinationSections,
  quickClinicalActions,
  reportLinks,
  type ClinicalSeverity,
  type SpecialtyId,
} from "@/data/clinical-examination";
import { cn } from "@/lib/utils";

const severityTone: Record<ClinicalSeverity, "success" | "warning" | "danger" | "critical"> = {
  Normal: "success",
  Mild: "warning",
  Moderate: "warning",
  Severe: "danger",
  Critical: "critical",
};

const toggleOptions = ["Normal", "Mild", "Moderate", "Severe", "Absent", "Present", "Positive", "Negative"];

function PageMotion({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}

function PatientHeaderStrip() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Clinical examination workspace</div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">{clinicalPatient.name}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => window.print()}><Printer className="h-4 w-4" />Print</Button>
            <Button variant="outline" onClick={() => toast.info("Last clinical draft restored")}><RefreshCcw className="h-4 w-4" />Restore draft</Button>
            <Button onClick={() => toast.success("Clinical draft autosaved")}><Save className="h-4 w-4" />Save draft</Button>
          </div>
        </div>
        <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-6">
          {[
            ["UHID", clinicalPatient.uhid],
            ["Age/Gender", clinicalPatient.ageGender],
            ["IPD/OPD No.", clinicalPatient.encounter],
            ["Ward/Bed", clinicalPatient.wardBed],
            ["Consultant", clinicalPatient.consultant],
            ["Allergy", clinicalPatient.allergies],
          ].map(([label, value]) => (
            <div className="rounded-lg border border-border bg-surface-muted px-3 py-2" key={label}>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {clinicalPatient.flags.map((flag) => <Badge key={flag} tone={flag.includes("BP") ? "warning" : "danger"}>{flag}</Badge>)}
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

function QuickActions() {
  return (
    <Card>
      <CardContent className="grid gap-2 p-3 sm:grid-cols-2 xl:grid-cols-4">
        {quickClinicalActions.map((action, index) => (
          <Button key={action} variant={index === 0 ? "default" : "outline"} onClick={() => toast.info(`${action} opened in static preview`)}>
            <ClipboardCheck className="h-4 w-4" />
            {action}
          </Button>
        ))}
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
  const sections = examinationSections[specialty as keyof typeof examinationSections] ?? examinationSections.cvs;
  const activeSpecialty = clinicalSpecialties.find((item) => item.id === specialty) ?? clinicalSpecialties[0];
  const findings = examinationFindings[specialty] ?? examinationFindings.cvs;
  const defaultNote = examinationDefaultNotes[specialty] ?? examinationDefaultNotes.cvs;
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-white p-4 shadow-soft md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Active examination template</div>
          <h2 className="mt-1 text-xl font-bold text-foreground">{activeSpecialty.label} Examination</h2>
          <p className="mt-1 text-sm text-muted-foreground">{activeSpecialty.department} specialty template with fast toggle entry, scoring, notes, and trends.</p>
        </div>
        <Badge tone="info">{sections.length} categories</Badge>
      </div>
    <div className="grid min-w-0 gap-4 xl:grid-cols-[230px_minmax(0,1fr)_320px]">
      <Card className="xl:sticky xl:top-20 xl:self-start">
        <CardHeader><CardTitle>Categories</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sections.map((section, index) => <button className={cn("flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-semibold transition", index === 0 ? "bg-primary-soft text-primary" : "hover:bg-surface-muted")} key={section}><span>{section}</span><ArrowRight className="h-4 w-4" /></button>)}
        </CardContent>
      </Card>
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

export function ClinicalExaminationPage() {
  const [specialty, setSpecialty] = React.useState<SpecialtyId>("cvs");
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const openSpecialty = (id: SpecialtyId) => {
    setSpecialty(id);
    setActiveTab("entry");
    toast.success(`${clinicalSpecialties.find((item) => item.id === id)?.label ?? "Specialty"} examination opened`);
  };
  return (
    <PageMotion>
      <PatientHeaderStrip />
      <QuickActions />
      <SummaryCards />
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-white shadow-sm">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="specialty">Specialty</TabsTrigger>
          <TabsTrigger value="entry">Examination</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <AlertBanner icon={Filter} tone="info" title="Fast doctor landing screen">Patient context, quick clinical actions, timeline, risk cards, and current examination state stay visible before entry.</AlertBanner>
            <SpecialtyPicker selected={specialty} onSelect={openSpecialty} />
          </div>
          <TimelinePanel />
        </TabsContent>
        <TabsContent value="specialty"><SpecialtyPicker selected={specialty} onSelect={openSpecialty} /></TabsContent>
        <TabsContent value="entry"><ExaminationWorkspace specialty={specialty} /></TabsContent>
        <TabsContent value="graphs" className="space-y-4"><TrendCard /><ClinicalScorePanel /></TabsContent>
        <TabsContent value="builder"><BuilderAndReports /></TabsContent>
        <TabsContent value="timeline" className="grid gap-4 xl:grid-cols-[380px_minmax(0,1fr)]"><TimelinePanel /><NotesApprovalArchitecture /></TabsContent>
        <TabsContent value="workflow" className="space-y-4"><MobileTabletOptimization /><NotesApprovalArchitecture /></TabsContent>
      </Tabs>
      <div className="fixed inset-x-3 bottom-3 z-30 flex gap-2 rounded-xl border border-border bg-white/95 p-2 shadow-[0_16px_40px_rgba(39,37,54,0.18)] backdrop-blur md:hidden">
        {["Exam", "Scores", "Notes", "Save"].map((item, index) => <Button className="flex-1" key={item} size="sm" variant={index === 3 ? "default" : "outline"}>{item}</Button>)}
      </div>
      <StickyActionBar onSave={() => toast.success("Clinical examination saved as draft")} saveLabel="Final submit" />
    </PageMotion>
  );
}
