"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, Reorder } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Bell,
  Brain,
  ChevronDown,
  ClipboardCheck,
  Download,
  FileText,
  GripVertical,
  Mic,
  PhoneCall,
  Pill,
  Printer,
  Radio,
  Save,
  Search,
  Send,
  ShieldAlert,
  Stethoscope,
  Syringe,
  UserRound,
  Waves,
  Zap,
} from "lucide-react";
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { mockPatients, mockPatientVisits } from "@/data/patients";
import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "danger" | "info" | "critical" | "muted";
type NeuroModuleId = "gcs" | "sedation" | "evd" | "delirium" | "pupil" | "motor" | "reflexes" | "ventilation" | "seizure" | "timeline";

type NeuroPatient = {
  id: string;
  name: string;
  uhid: string;
  ageGender: string;
  bed: string;
  consultant: string;
  encounter: string;
  allergies: string;
  riskFlags: string[];
};

type NeuroModule = {
  id: NeuroModuleId;
  title: string;
  subtitle: string;
  status: string;
  tone: Tone;
  owner: string;
  updatedAt: string;
};

const neuroRoutes = [
  { label: "Overview", href: "/neuro-icu" },
  { label: "GCS", href: "/neuro-icu/gcs" },
  { label: "Sedation", href: "/neuro-icu/sedation" },
  { label: "EVD", href: "/neuro-icu/evd" },
  { label: "Delirium", href: "/neuro-icu/delirium" },
  { label: "Pupil", href: "/neuro-icu/pupil" },
  { label: "Motor", href: "/neuro-icu/motor-sensory" },
  { label: "Timeline", href: "/neuro-icu/timeline" },
  { label: "Seizure", href: "/neuro-icu/seizure" },
  { label: "Ventilation", href: "/neuro-icu/ventilation" },
  { label: "Reports", href: "/neuro-icu/reports" },
  { label: "Analytics", href: "/neuro-icu/analytics" },
];

const neuroTrendData = [
  { time: "00", gcs: 14, icp: 17, map: 82, cpp: 65, sedation: -1, spo2: 97, drain: 12, delirium: 1 },
  { time: "04", gcs: 13, icp: 19, map: 80, cpp: 61, sedation: -2, spo2: 96, drain: 16, delirium: 1 },
  { time: "08", gcs: 13, icp: 21, map: 79, cpp: 58, sedation: -2, spo2: 96, drain: 18, delirium: 2 },
  { time: "12", gcs: 12, icp: 23, map: 78, cpp: 55, sedation: -3, spo2: 95, drain: 22, delirium: 2 },
  { time: "16", gcs: 11, icp: 24, map: 77, cpp: 53, sedation: -2, spo2: 96, drain: 31, delirium: 3 },
  { time: "20", gcs: 11, icp: 24, map: 78, cpp: 54, sedation: -2, spo2: 96, drain: 36, delirium: 3 },
];

const overviewStats = [
  { label: "GCS", value: "11", unit: "/15", status: "Watch", tone: "warning" as Tone, color: "#F5A524", key: "gcs", trend: [15, 14, 13, 12, 11, 11] },
  { label: "ICP", value: "24", unit: "mmHg", status: "High", tone: "critical" as Tone, color: "#E5484D", key: "icp", trend: [18, 19, 21, 23, 24, 24] },
  { label: "MAP", value: "78", unit: "mmHg", status: "Target", tone: "success" as Tone, color: "#18B67A", key: "map", trend: [74, 76, 79, 78, 77, 78] },
  { label: "CPP", value: "54", unit: "mmHg", status: "Low", tone: "warning" as Tone, color: "#F5A524", key: "cpp", trend: [62, 60, 58, 55, 53, 54] },
  { label: "Sedation", value: "-2", unit: "RASS", status: "Goal", tone: "info" as Tone, color: "#4F6EF7", key: "sedation", trend: [-3, -2, -2, -1, -2, -2] },
  { label: "SpO2", value: "96", unit: "%", status: "Stable", tone: "success" as Tone, color: "#18B67A", key: "spo2", trend: [97, 96, 96, 95, 96, 96] },
  { label: "Drain Output", value: "146", unit: "ml/24h", status: "Rising", tone: "danger" as Tone, color: "#E5484D", key: "drain", trend: [18, 22, 24, 29, 31, 36] },
  { label: "Delirium", value: "CAM+", unit: "", status: "Risk", tone: "warning" as Tone, color: "#7C6BFF", key: "delirium", trend: [0, 1, 1, 2, 2, 3] },
];

const initialModules: NeuroModule[] = [
  { id: "gcs", title: "GCS Assessment", subtitle: "Eye, verbal, motor response with calculated severity", status: "Autosaved", tone: "warning", owner: "Dr. Kavita Rao", updatedAt: "2 min ago" },
  { id: "sedation", title: "Sedation Monitoring", subtitle: "RASS target, active infusion and protocol safety", status: "Protocol active", tone: "info", owner: "Nurse Anika", updatedAt: "4 min ago" },
  { id: "evd", title: "EVD Monitoring", subtitle: "Drain output, pressure, waveform and thresholds", status: "Alert", tone: "critical", owner: "Dr. Rakesh Menon", updatedAt: "6 min ago" },
  { id: "delirium", title: "Delirium Assessment", subtitle: "CAM-ICU scoring and cognitive trend markers", status: "CAM positive", tone: "warning", owner: "Neuro team", updatedAt: "12 min ago" },
  { id: "pupil", title: "Pupillary Tracking", subtitle: "Pupil size, NPi, reactivity and asymmetry", status: "Reactive", tone: "success", owner: "Nurse Dev", updatedAt: "18 min ago" },
  { id: "motor", title: "Motor Response", subtitle: "Limb power, tone, sensory level and laterality", status: "Compare", tone: "info", owner: "Registrar", updatedAt: "22 min ago" },
  { id: "reflexes", title: "Neuro Reflexes", subtitle: "Brainstem, plantar and cranial reflex checks", status: "Stable", tone: "success", owner: "Resident team", updatedAt: "28 min ago" },
  { id: "ventilation", title: "Ventilation Status", subtitle: "CO2, oxygenation and neuro pressure correlation", status: "Synced", tone: "info", owner: "RT team", updatedAt: "34 min ago" },
  { id: "seizure", title: "Seizure Events", subtitle: "Events, EEG handoff and rescue readiness", status: "No event", tone: "success", owner: "Neuro ICU", updatedAt: "41 min ago" },
  { id: "timeline", title: "Neuro Timeline", subtitle: "Hourly observations and deterioration heatmap", status: "Live", tone: "info", owner: "Bedside team", updatedAt: "Now" },
];

function patientName(patient: (typeof mockPatients)[number]) {
  return `${patient.firstName} ${patient.lastName}`.trim();
}

function neuroPatientFromRecord(patient: (typeof mockPatients)[number]): NeuroPatient {
  const visits = mockPatientVisits.filter((visit) => visit.patientId === patient.id);
  const activeVisit = visits.find((visit) => visit.status === "Active") ?? visits[0];
  const allergy = patient.alertFlags.find((flag) => flag.toLowerCase().includes("allergy"));
  return {
    id: patient.id,
    name: patientName(patient),
    uhid: patient.uhid,
    ageGender: `${patient.age}/${patient.gender.charAt(0)}`,
    bed: activeVisit?.visitType === "IPD" ? `${activeVisit.department} ICU / Bed 07` : `${patient.department} ICU / Bed 07`,
    consultant: activeVisit?.provider ?? "Dr. Kavita Rao",
    encounter: activeVisit ? `${activeVisit.visitType}-${activeVisit.referenceNumber}` : "ICU-NEURO-1042",
    allergies: allergy?.replace(/^Allergy:\s*/i, "") ?? "No known allergy",
    riskFlags: patient.alertFlags.length ? patient.alertFlags : ["High acuity watch", "Fall risk"],
  };
}

function useNeuroPatient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("patientId") ?? mockPatients[0].id;
  const record = mockPatients.find((patient) => patient.id === selectedId) ?? mockPatients[0];
  const patient = neuroPatientFromRecord(record);
  const withPatient = React.useCallback((href: string) => `${href}${href.includes("?") ? "&" : "?"}patientId=${record.id}`, [record.id]);
  const selectPatient = React.useCallback((patientId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("patientId", patientId);
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);
  return { patient, selectedPatientId: record.id, withPatient, selectPatient };
}

function PageMotion({ children }: { children: React.ReactNode }) {
  return <motion.div animate={{ opacity: 1, y: 0 }} className="space-y-4" initial={{ opacity: 0, y: 8 }} transition={{ duration: 0.22, ease: "easeOut" }}>{children}</motion.div>;
}

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

function NeuroCommandCenter({ patient, selectedPatientId, selectPatient }: { patient: NeuroPatient; selectedPatientId: string; selectPatient: (patientId: string) => void }) {
  const [query, setQuery] = React.useState("");
  const patientResults = React.useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return [];
    return mockPatients.filter((item) => `${patientName(item)} ${item.uhid} ${item.mobile} ${item.department}`.toLowerCase().includes(normalized)).slice(0, 6);
  }, [query]);
  return (
    <div className="sticky top-0 z-30 -mx-2 rounded-b-[28px] border border-t-0 border-[rgba(15,23,42,0.08)] bg-[#F4F7FC]/92 px-2 pb-3 pt-2 shadow-[0_18px_44px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#f7f9ff_54%,#eef2ff_100%)] p-3 shadow-[0_12px_34px_rgba(31,41,55,0.08)]">
        <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_420px]">
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#4F6EF7,#7C6BFF)] text-lg font-black text-white shadow-[0_10px_24px_rgba(79,110,247,0.32)]">
              {patient.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}
              <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#18B67A] shadow-[0_0_0_5px_rgba(24,182,122,0.16)]" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-xl font-black text-[#111827]">{patient.name}</h1>
                <Badge tone="info">Neuro ICU</Badge>
                <Badge tone="critical">High acuity</Badge>
                <span className="inline-flex items-center gap-1 rounded-full border border-[#18B67A]/20 bg-[#18B67A]/10 px-2 py-0.5 text-[11px] font-bold text-[#15845b]"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#18B67A]" />Live monitoring</span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-[#6B7280]">
                <span>UHID {patient.uhid}</span>
                <span>MRN {selectedPatientId.toUpperCase()}</span>
                <span>{patient.bed}</span>
                <span>ICU census 18/24</span>
                <span>Last synced 42 sec ago</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B7280]" />
              <Input className="h-11 rounded-2xl border-[rgba(15,23,42,0.08)] bg-white/90 pl-9 text-sm font-semibold shadow-inner" placeholder="Search patient, UHID, MRN..." value={query} onChange={(event) => setQuery(event.target.value)} />
              {query ? (
                <div className="absolute right-0 top-12 z-50 max-h-72 w-full overflow-auto rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-1 shadow-[0_18px_48px_rgba(15,23,42,0.16)]">
                  {patientResults.length ? patientResults.map((item) => (
                    <button className="w-full rounded-xl px-3 py-2 text-left text-sm transition hover:bg-[#F4F7FC]" key={item.id} onClick={() => { selectPatient(item.id); setQuery(""); }} type="button">
                      <span className="block font-bold text-[#111827]">{patientName(item)}</span>
                      <span className="text-xs font-semibold text-[#6B7280]">{item.uhid} | {item.mobile} | {item.department}</span>
                    </button>
                  )) : <div className="px-3 py-4 text-sm font-semibold text-[#6B7280]">No matching patient found.</div>}
                </div>
              ) : null}
            </div>
            <div className="flex flex-wrap justify-end gap-2">
              <Button size="sm" variant="outline" onClick={() => toast.info("Shift handover opened")}><ClipboardCheck className="h-4 w-4" />Shift handover</Button>
              <Button size="sm" variant="outline" onClick={() => toast.warning("Emergency neuro pathway armed")}><ShieldAlert className="h-4 w-4" />Emergency</Button>
              <Button size="sm" onClick={() => toast.success("Neuro ICU state saved")}><Save className="h-4 w-4" />Saved</Button>
            </div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge tone="danger">3 critical alerts</Badge>
          <Badge tone="warning">ICP threshold active</Badge>
          <Badge tone="info">Consultant note pending</Badge>
          <Badge tone="success">Device feed connected</Badge>
        </div>
      </div>
    </div>
  );
}

function NeuroStatRibbon() {
  return (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
      {overviewStats.map((stat) => (
        <motion.button whileHover={{ y: -2 }} className="rounded-[20px] border border-white/70 bg-white/76 p-3 text-left shadow-[0_10px_28px_rgba(15,23,42,0.07)] backdrop-blur transition focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" key={stat.label} type="button">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.14em] text-[#6B7280]">{stat.label}</div>
              <div className="mt-1 flex items-baseline gap-1"><span className="text-2xl font-black text-[#111827]">{stat.value}</span><span className="text-xs font-bold text-[#6B7280]">{stat.unit}</span></div>
            </div>
            <span className="relative flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${stat.color}14` }}>
              <span className="absolute h-7 w-7 rounded-full border-2" style={{ borderColor: stat.color }} />
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: stat.color }} />
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <MiniSparkline color={stat.color} values={stat.trend} />
            <Badge tone={stat.tone}>{stat.status}</Badge>
          </div>
        </motion.button>
      ))}
    </div>
  );
}

function NeuroTabs({ withPatient }: { withPatient: (href: string) => string }) {
  const pathname = usePathname();
  return (
    <div className="overflow-x-auto rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-white/80 p-1 shadow-[0_10px_28px_rgba(15,23,42,0.05)]">
      <div className="flex min-w-max gap-1">
        {neuroRoutes.map((route) => {
          const active = pathname === route.href;
          return <Button asChild className={cn("rounded-2xl", active && "bg-[linear-gradient(135deg,#4F6EF7,#7C6BFF)] text-white")} key={route.href} size="sm" variant={active ? "default" : "ghost"}><a href={withPatient(route.href)}>{route.label}</a></Button>;
        })}
      </div>
    </div>
  );
}

function NeuroModuleShell({ module, children }: { module: NeuroModule; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(true);
  return (
    <Reorder.Item value={module} as="div" className="min-w-0">
      <motion.section layout className="overflow-hidden rounded-[24px] border border-[rgba(15,23,42,0.08)] bg-white/88 shadow-[0_14px_42px_rgba(15,23,42,0.07)] backdrop-blur">
        <button className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" onClick={() => setOpen((value) => !value)} type="button">
          <div className="flex min-w-0 items-center gap-3">
            <GripVertical className="h-4 w-4 shrink-0 text-[#9CA3AF]" />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2"><h2 className="truncate text-sm font-black text-[#111827]">{module.title}</h2><Badge tone={module.tone}>{module.status}</Badge></div>
              <p className="mt-0.5 truncate text-xs font-semibold text-[#6B7280]">{module.subtitle}</p>
            </div>
          </div>
          <div className="hidden shrink-0 text-right text-[11px] font-bold text-[#6B7280] sm:block"><div>{module.owner}</div><div>{module.updatedAt}</div></div>
          <ChevronDown className={cn("h-4 w-4 shrink-0 text-[#6B7280] transition", open && "rotate-180")} />
        </button>
        {open ? <motion.div layout className="border-t border-[rgba(15,23,42,0.08)] px-4 py-4">{children}</motion.div> : null}
      </motion.section>
    </Reorder.Item>
  );
}

function GcsWorkflow() {
  const [eye, setEye] = React.useState(3);
  const [verbal, setVerbal] = React.useState(3);
  const [motor, setMotor] = React.useState(5);
  const score = eye + verbal + motor;
  const color = score <= 8 ? "#E5484D" : score <= 12 ? "#F5A524" : "#18B67A";
  const groups = [
    { label: "Eye", value: eye, setValue: setEye, options: [[4, "Spontaneous"], [3, "Voice"], [2, "Pain"], [1, "None"]] },
    { label: "Verbal", value: verbal, setValue: setVerbal, options: [[5, "Oriented"], [4, "Confused"], [3, "Words"], [2, "Sounds"], [1, "None"]] },
    { label: "Motor", value: motor, setValue: setMotor, options: [[6, "Obeys"], [5, "Localizes"], [4, "Withdraws"], [3, "Flexion"], [2, "Extension"], [1, "None"]] },
  ] as const;
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_210px]">
      <div className="space-y-3">
        {groups.map((group) => (
          <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3" key={group.label}>
            <div className="mb-2 flex items-center justify-between"><span className="text-xs font-black uppercase tracking-[0.12em] text-[#6B7280]">{group.label} response</span><Badge tone="info">{group.value}</Badge></div>
            <div className="grid grid-cols-2 gap-1.5 md:grid-cols-3">
              {group.options.map(([value, label]) => <button className={cn("rounded-xl border px-2 py-2 text-xs font-black transition", group.value === value ? "border-[#4F6EF7] bg-[#4F6EF7] text-white shadow-[0_8px_20px_rgba(79,110,247,0.25)]" : "border-[rgba(15,23,42,0.08)] bg-white text-[#4B5563] hover:border-[#4F6EF7]/35")} key={label} onClick={() => group.setValue(value)} type="button">{value} - {label}</button>)}
            </div>
          </div>
        ))}
        <textarea className="min-h-24 w-full rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#4F6EF7]/20" defaultValue="GCS reduced compared with previous score. Repeat pupils and ICP correlation advised." />
      </div>
      <div className="rounded-[22px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,#ffffff,#f7f9ff)] p-4 text-center">
        <motion.div key={score} animate={{ scale: [0.96, 1.04, 1] }} className={cn("mx-auto flex h-28 w-28 items-center justify-center rounded-full border-[10px] text-4xl font-black", score <= 8 && "animate-pulse")} style={{ borderColor: `${color}55`, color }}>{score}</motion.div>
        <div className="mt-3 text-xs font-black uppercase tracking-[0.16em] text-[#6B7280]">Live GCS</div>
        <div className="mt-1 text-sm font-black text-[#111827]">{score <= 8 ? "Severe injury" : score <= 12 ? "Moderate injury" : "Mild injury"}</div>
        <div className="mt-3 flex flex-col gap-2"><Button size="sm" variant="outline"><Mic className="h-4 w-4" />Dictate</Button><Button size="sm"><PhoneCall className="h-4 w-4" />Consult Neuro</Button></div>
      </div>
    </div>
  );
}

function SedationWorkflow() {
  const [rate, setRate] = React.useState(18);
  const [target, setTarget] = React.useState("-2");
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
      <div className="space-y-3">
        <div className="grid gap-3 md:grid-cols-3">
          {["Propofol", "Fentanyl", "Dexmedetomidine"].map((drug, index) => <button className={cn("rounded-2xl border p-3 text-left transition", index === 0 ? "border-[#4F6EF7]/35 bg-[#4F6EF7]/10 text-[#2446d8]" : "border-[rgba(15,23,42,0.08)] bg-white")} key={drug} type="button"><Syringe className="mb-2 h-4 w-4" /><span className="text-sm font-black">{drug}</span><span className="mt-1 block text-xs font-semibold text-[#6B7280]">{index === 0 ? "Active infusion" : "Available"}</span></button>)}
        </div>
        <label className="block rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3"><div className="flex items-center justify-between text-sm font-black"><span>Propofol infusion rate</span><span>{rate} mcg/kg/min</span></div><input className="mt-3 w-full accent-[#4F6EF7]" max="60" min="0" onChange={(event) => setRate(Number(event.target.value))} type="range" value={rate} /></label>
        <div className="flex flex-wrap gap-2">{["0", "-1", "-2", "-3", "-4", "-5"].map((score) => <button className={cn("rounded-xl border px-3 py-2 text-xs font-black", target === score ? "border-[#7C6BFF] bg-[#7C6BFF] text-white" : "border-[rgba(15,23,42,0.08)] bg-white")} key={score} onClick={() => setTarget(score)} type="button">RASS {score}</button>)}</div>
      </div>
      <div className="space-y-3 rounded-[22px] border border-[#18B67A]/20 bg-[#18B67A]/10 p-3"><Badge tone="success">Within protocol</Badge><div className="text-2xl font-black text-[#166b4b]">Target RASS {target}</div><p className="text-xs font-semibold text-[#166b4b]">Maintain current rate, repeat sedation score in 30 minutes, watch MAP if titrating upward.</p><div className="rounded-xl bg-white/70 p-2 text-xs font-bold text-[#6B7280]">Interaction watch: fentanyl + propofol respiratory depression risk monitored.</div></div>
    </div>
  );
}

function EvdWorkflow() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
      <ChartCard title="ICP and EVD Output" dataKeys={[["icp", "#E5484D"], ["drain", "#4F6EF7"]]} />
      <div className="space-y-2">{[["Drain pressure", "18 cmH2O", "warning"], ["Output this hour", "36 ml", "danger"], ["24h cumulative", "146 ml", "info"], ["Fluid color", "Xanthochromic", "warning"]].map(([label, value, tone]) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-3" key={label}><div className="text-[11px] font-black uppercase tracking-[0.12em] text-[#6B7280]">{label}</div><div className="mt-1 flex items-center justify-between gap-2"><span className="text-lg font-black text-[#111827]">{value}</span><Badge tone={tone as Tone}>{tone}</Badge></div></div>)}</div>
      <div className="grid gap-2 md:grid-cols-3 lg:col-span-2">{["Waveform dampening detected", "Height changed +2 cm", "Output velocity above baseline"].map((item) => <div className="rounded-2xl border border-[#E5484D]/20 bg-[#E5484D]/10 p-3 text-sm font-bold text-[#b4232a]" key={item}>{item}</div>)}</div>
    </div>
  );
}

function DeliriumWorkflow() {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {["Acute onset/fluctuating course", "Inattention", "Altered consciousness", "Disorganized thinking"].map((question, index) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3" key={question}><div className="text-sm font-black text-[#111827]">{question}</div><div className="mt-3 grid grid-cols-2 gap-2"><button className={cn("rounded-xl px-3 py-2 text-xs font-black", index < 2 ? "bg-[#F5A524] text-white" : "bg-white text-[#6B7280]")} type="button">Yes</button><button className={cn("rounded-xl px-3 py-2 text-xs font-black", index >= 2 ? "bg-[#18B67A] text-white" : "bg-white text-[#6B7280]")} type="button">No</button></div></div>)}
      <div className="rounded-2xl border border-[#F5A524]/20 bg-[#F5A524]/10 p-3 md:col-span-2"><div className="flex flex-wrap items-center justify-between gap-2"><div className="font-black text-[#8a5c00]">CAM-ICU positive risk pattern</div><Badge tone="success">Consultant verified</Badge></div><p className="mt-1 text-sm font-semibold text-[#8a5c00]">Sleep disturbance and agitation markers increased overnight. Reorientation protocol and medication review recommended.</p></div>
    </div>
  );
}

function CompactWorkflow({ icon: Icon, title, rows }: { icon: typeof Brain; title: string; rows: string[] }) {
  return (
    <div className="space-y-3"><div className="flex items-center gap-2"><Icon className="h-5 w-5 text-[#4F6EF7]" /><div className="text-sm font-black text-[#111827]">{title}</div></div><div className="grid gap-2 md:grid-cols-2">{rows.map((row) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] px-3 py-2 text-sm font-bold text-[#374151]" key={row}>{row}</div>)}</div></div>
  );
}

function TimelineWorkflow() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-6 gap-1">{Array.from({ length: 24 }).map((_, index) => <div className={cn("h-8 rounded-lg", index > 15 ? "bg-[#E5484D]/70" : index > 10 ? "bg-[#F5A524]/65" : "bg-[#18B67A]/55")} key={index} title={`${index}:00 neuro observation`} />)}</div>
      {["20:00 GCS 11, ICP 24, drain 36 ml", "18:00 Pupils equal, NPi 3.8/3.7", "16:00 Sedation target adjusted to RASS -2"].map((event) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white px-3 py-2 text-sm font-bold text-[#374151]" key={event}>{event}</div>)}
    </div>
  );
}

function ModuleContent({ id }: { id: NeuroModuleId }) {
  if (id === "gcs") return <GcsWorkflow />;
  if (id === "sedation") return <SedationWorkflow />;
  if (id === "evd") return <EvdWorkflow />;
  if (id === "delirium") return <DeliriumWorkflow />;
  if (id === "timeline") return <TimelineWorkflow />;
  const content: Record<Exclude<NeuroModuleId, "gcs" | "sedation" | "evd" | "delirium" | "timeline">, { icon: typeof Brain; title: string; rows: string[] }> = {
    pupil: { icon: UserRound, title: "Pupil and NPi checks", rows: ["Right 3.2 mm reactive", "Left 3.1 mm reactive", "NPi R 3.8 / L 3.7", "No anisocoria"] },
    motor: { icon: Activity, title: "Motor and sensory map", rows: ["RUL 4/5, LUL 5/5", "RLL 4/5, LLL 5/5", "No sensory level", "Tone mildly increased R"] },
    reflexes: { icon: Zap, title: "Reflex documentation", rows: ["Corneal reflex present", "Cough reflex weak", "Plantar equivocal R", "Doll eye deferred"] },
    ventilation: { icon: Waves, title: "Ventilation correlation", rows: ["EtCO2 36 mmHg", "SIMV VC synced", "PaCO2 target met", "SpO2 96% FiO2 35"] },
    seizure: { icon: Radio, title: "Seizure surveillance", rows: ["No observed event", "EEG order prepared", "Levetiracetam active", "Rescue med checked"] },
  };
  return <CompactWorkflow {...content[id]} />;
}

function MonitoringGrid() {
  const [modules, setModules] = React.useState(initialModules);
  return <Reorder.Group axis="y" className="grid gap-4 xl:grid-cols-2" values={modules} onReorder={setModules}>{modules.map((module) => <NeuroModuleShell key={module.id} module={module}><ModuleContent id={module.id} /></NeuroModuleShell>)}</Reorder.Group>;
}

function ChartCard({ title, dataKeys }: { title: string; dataKeys: [string, string][] }) {
  return (
    <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/88 shadow-[0_14px_42px_rgba(15,23,42,0.07)]">
      <CardHeader><CardTitle>{title}</CardTitle><CardDescription>Last 24h bedside feed</CardDescription></CardHeader>
      <CardContent className="h-56 p-4">
        <ResponsiveContainer height="100%" width="100%">
          <LineChart data={neuroTrendData}><CartesianGrid stroke="#E6EAF4" vertical={false} /><XAxis dataKey="time" tick={{ fill: "#6B7280", fontSize: 11 }} /><YAxis tick={{ fill: "#6B7280", fontSize: 11 }} /><Tooltip contentStyle={{ borderRadius: 14, border: "1px solid rgba(15,23,42,0.08)" }} />{dataKeys.map(([key, color]) => <Line dataKey={key} dot={false} key={key} stroke={color} strokeWidth={2.5} type="monotone" />)}</LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

function ChartDeck() {
  return <div className="grid gap-4 xl:grid-cols-3"><ChartCard title="GCS / ICP Trend" dataKeys={[["gcs", "#4F6EF7"], ["icp", "#E5484D"]]} /><ChartCard title="Sedation / SpO2" dataKeys={[["sedation", "#7C6BFF"], ["spo2", "#18B67A"]]} /><ChartCard title="Drain / CPP" dataKeys={[["drain", "#4F6EF7"], ["cpp", "#F5A524"]]} /></div>;
}

function IntelligenceRail({ patient }: { patient: NeuroPatient }) {
  const cards = [
    { title: "Clinical AI Summary", icon: Brain, tone: "info" as Tone, body: "GCS down 2 points in 12h with ICP above target. Sedation in goal range; drainage velocity increased after 16:00." },
    { title: "Deterioration Warnings", icon: AlertTriangle, tone: "critical" as Tone, body: "ICP > 22 mmHg sustained, CAM positive, drain output rising. Escalation criteria partially met." },
    { title: "Critical Labs", icon: Stethoscope, tone: "warning" as Tone, body: "Na 132, K 4.2, Hb 10.8, WBC 13.2. Osmolality review pending." },
    { title: "Medication Conflicts", icon: Pill, tone: "success" as Tone, body: "No hard conflict. Sedation + opioid respiratory depression warning monitored." },
  ];
  return (
    <aside className="space-y-4 xl:sticky xl:top-48 xl:self-start">
      <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-[#111827] text-white shadow-[0_18px_48px_rgba(15,23,42,0.18)]">
        <CardContent className="space-y-3 p-4"><div className="flex items-center justify-between"><div><div className="text-xs font-black uppercase tracking-[0.16em] text-white/55">Patient intelligence</div><div className="mt-1 text-lg font-black">{patient.name}</div></div><Bell className="h-5 w-5 text-[#F5A524]" /></div><div className="grid grid-cols-2 gap-2">{[["NEWS", "6"], ["Fall", "High"], ["Pressure", "Mod"], ["Tasks", "9"]].map(([label, value]) => <div className="rounded-2xl bg-white/8 p-3" key={label}><div className="text-[11px] font-bold uppercase text-white/50">{label}</div><div className="text-xl font-black">{value}</div></div>)}</div></CardContent>
      </Card>
      {cards.map((card) => { const Icon = card.icon; return <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[0_14px_42px_rgba(15,23,42,0.07)]" key={card.title}><CardContent className="space-y-2 p-4"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><Icon className="h-4 w-4 text-[#4F6EF7]" /><div className="text-sm font-black text-[#111827]">{card.title}</div></div><Badge tone={card.tone}>{card.tone}</Badge></div><p className="text-sm font-semibold leading-6 text-[#4B5563]">{card.body}</p></CardContent></Card>; })}
      <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/90 shadow-[0_14px_42px_rgba(15,23,42,0.07)]"><CardHeader><CardTitle>Live task timeline</CardTitle><CardDescription>Next 90 minutes</CardDescription></CardHeader><CardContent className="space-y-2">{["Repeat GCS and pupils - 10 min", "Neuro consultant review - 15 min", "ICP threshold audit - 30 min", "Sedation reassessment - 45 min", "Print ICU neuro sheet - shift end"].map((task) => <div className="flex gap-2 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-3 text-sm font-bold text-[#374151]" key={task}><span className="mt-1 h-2 w-2 rounded-full bg-[#4F6EF7]" />{task}</div>)}</CardContent></Card>
    </aside>
  );
}

function ActionDock() {
  const actions = [["Save", Save], ["Final submit", Send], ["Escalate care", ShieldAlert], ["Call consultant", PhoneCall], ["Print ICU sheet", Printer], ["Export PDF", Download], ["Compare visits", Activity]] as const;
  return <div className="sticky bottom-3 z-40 rounded-[24px] border border-white/70 bg-white/90 p-2 shadow-[0_18px_52px_rgba(15,23,42,0.16)] backdrop-blur-xl"><div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7">{actions.map(([label, Icon], index) => <Button className={cn("rounded-2xl", index === 1 && "bg-[linear-gradient(135deg,#4F6EF7,#7C6BFF)]")} key={label} variant={index === 1 ? "default" : "outline"} onClick={() => toast.success(`${label} queued`)}><Icon className="h-4 w-4" />{label}</Button>)}</div></div>;
}

function NeuroShell({ children }: { children: React.ReactNode }) {
  const { patient, selectedPatientId, withPatient, selectPatient } = useNeuroPatient();
  return (
    <PageMotion>
      <div className="min-h-screen rounded-[28px] bg-[#F4F7FC] p-2 text-[#111827]">
        <NeuroCommandCenter patient={patient} selectedPatientId={selectedPatientId} selectPatient={selectPatient} />
        <div className="mt-4 space-y-4">
          <NeuroTabs withPatient={withPatient} />
          {children}
        </div>
        <ActionDock />
      </div>
    </PageMotion>
  );
}

export function NeuroOverviewPage() {
  const { patient } = useNeuroPatient();
  return (
    <NeuroShell>
      <NeuroStatRibbon />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4"><ChartDeck /><MonitoringGrid /></main>
        <IntelligenceRail patient={patient} />
      </div>
    </NeuroShell>
  );
}

function DedicatedPage({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  const { patient } = useNeuroPatient();
  return (
    <NeuroShell>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <main className="min-w-0 space-y-4">
          <Card className="rounded-[24px] border-[rgba(15,23,42,0.08)] bg-white/88 shadow-[0_14px_42px_rgba(15,23,42,0.07)]"><CardHeader><div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></div><Badge tone="info">Autosave live</Badge></CardHeader><CardContent>{children}</CardContent></Card>
          <ChartDeck />
        </main>
        <IntelligenceRail patient={patient} />
      </div>
    </NeuroShell>
  );
}

export function NeuroGcsPage() { return <DedicatedPage title="GCS Monitoring" description="Advanced Glasgow Coma Scale workflow with live calculation and recommendations."><GcsWorkflow /></DedicatedPage>; }
export function NeuroSedationPage() { return <DedicatedPage title="Sedation & RASS" description="ICU sedation, drug infusion rates, RASS score and protocol safety."><SedationWorkflow /></DedicatedPage>; }
export function NeuroEvdPage() { return <DedicatedPage title="EVD / Drain Monitoring" description="Drain pressure, output logs, waveform review and anomaly detection."><EvdWorkflow /></DedicatedPage>; }
export function NeuroDeliriumPage() { return <DedicatedPage title="Delirium Assessment" description="CAM-ICU workflow with cognitive trend, sleep markers and verification."><DeliriumWorkflow /></DedicatedPage>; }
export function NeuroPupilPage() { return <DedicatedPage title="Pupillary Assessment" description="Pupil size, NPi, reactivity, laterality and neuro checks."><CompactWorkflow icon={UserRound} title="Pupillary examination" rows={["Right 3.2 mm reactive", "Left 3.1 mm reactive", "NPi R 3.8 / L 3.7", "No anisocoria", "Light reflex brisk", "Repeat in 30 min"]} /></DedicatedPage>; }
export function NeuroMotorSensoryPage() { return <DedicatedPage title="Motor & Sensory" description="Power, tone, sensory level and side-by-side deficit mapping."><CompactWorkflow icon={Activity} title="Motor and sensory map" rows={["RUL 4/5, LUL 5/5", "RLL 4/5, LLL 5/5", "No sensory level", "Tone mildly increased R", "Grip weaker R", "Pain response localizes"]} /></DedicatedPage>; }
export function NeuroTimelinePage() { return <DedicatedPage title="Neuro Observation Timeline" description="Hourly observations, deterioration heatmap and bedside audit history."><TimelineWorkflow /></DedicatedPage>; }
export function NeuroSeizurePage() { return <DedicatedPage title="Seizure Monitoring" description="Event log, EEG handoff, rescue medication and seizure-free intervals."><CompactWorkflow icon={Radio} title="Seizure surveillance" rows={["No observed event", "EEG order prepared", "Levetiracetam active", "Rescue med checked", "Last event: none in 24h", "Family counseling pending"]} /></DedicatedPage>; }
export function NeuroVentilationPage() { return <DedicatedPage title="Ventilation Correlation" description="CO2, oxygenation, sedation and neuro pressure overlay."><CompactWorkflow icon={Waves} title="Ventilation correlation" rows={["EtCO2 36 mmHg", "SIMV VC synced", "PaCO2 target met", "SpO2 96% FiO2 35", "PEEP 5 cmH2O", "ABG review pending"]} /></DedicatedPage>; }
export function NeuroReportsPage() { return <DedicatedPage title="Neuro Reports" description="Printable ICU sheets, consultant summaries and PDF exports."><CompactWorkflow icon={FileText} title="Reports queue" rows={["Neuro ICU sheet ready", "Consultant summary draft", "EVD output PDF queued", "GCS trend report ready", "Nursing handover printable", "EMR sync complete"]} /></DedicatedPage>; }
export function NeuroAnalyticsPage() {
  return (
    <DedicatedPage title="ICU Analytics" description="Unit-level neuro critical care analytics and outcomes signals.">
      <div className="grid gap-3 md:grid-cols-3">
        {[["Deterioration index", "72", "warning"], ["Median ICP", "21 mmHg", "danger"], ["Protocol adherence", "94%", "success"], ["RASS in target", "82%", "info"], ["Drain anomalies", "3", "warning"], ["Consult response", "11 min", "success"]].map(([label, value, tone]) => <div className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[#F8FAFF] p-4" key={label}><div className="text-xs font-black uppercase tracking-[0.12em] text-[#6B7280]">{label}</div><div className="mt-2 flex items-center justify-between"><span className="text-2xl font-black text-[#111827]">{value}</span><Badge tone={tone as Tone}>{tone}</Badge></div></div>)}
      </div>
      <div className="mt-4 h-72 rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4">
        <ResponsiveContainer height="100%" width="100%">
          <AreaChart data={neuroTrendData}><CartesianGrid stroke="#E6EAF4" vertical={false} /><XAxis dataKey="time" /><YAxis /><Tooltip /><Area dataKey="icp" fill="#E5484D" fillOpacity={0.12} stroke="#E5484D" /><Area dataKey="cpp" fill="#4F6EF7" fillOpacity={0.12} stroke="#4F6EF7" /></AreaChart>
        </ResponsiveContainer>
      </div>
    </DedicatedPage>
  );
}
