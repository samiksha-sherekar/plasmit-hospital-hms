import type { LucideIcon } from "lucide-react";
import { Activity, HeartPulse, Stethoscope, Thermometer, Waves } from "lucide-react";

export type CvsStatus = "Stable" | "Watch" | "Critical";
export type CvsParameterId = "heart-rate" | "temperature" | "bp-nibp" | "bp-arterial" | "cvp" | "pcwp";

export type CvsMetric = {
  id: CvsParameterId;
  label: string;
  shortLabel: string;
  value: string;
  unit: string;
  detail?: string;
  updatedAt: string;
  status: CvsStatus;
  icon: LucideIcon;
  color: string;
  sparkline: number[];
};

export type CvsTrendPoint = {
  time: string;
  hr: number;
  temperature: number;
  nibpMap: number;
  arterialMap: number;
  cvp: number;
  pcwp: number;
};

export type CvsRecord = {
  id: string;
  dateTime: string;
  hr: number;
  temperature: number;
  nibp: string;
  arterial: string;
  cvp: number;
  pcwp: number;
  notes: string;
};

export const icuModules = [
  { label: "CVS", route: "/icu-monitoring/cvs", ready: true },
  { label: "Respiratory", route: "/icu-monitoring", ready: false },
  { label: "Abdominal", route: "/icu-monitoring", ready: false },
  { label: "Lines & Devices", route: "/icu-monitoring", ready: false },
  { label: "Drains & Tubes", route: "/icu-monitoring", ready: false },
  { label: "Neuro", route: "/icu-monitoring", ready: false },
  { label: "Renal", route: "/icu-monitoring", ready: false },
];

export const cvsMetrics: CvsMetric[] = [
  { id: "heart-rate", label: "Heart Rate", shortLabel: "HR", value: "86", unit: "bpm", updatedAt: "2 min ago", status: "Stable", icon: HeartPulse, color: "#7367f0", sparkline: [82, 84, 83, 86, 85, 87, 86] },
  { id: "temperature", label: "Temperature", shortLabel: "Temp", value: "37.2", unit: "C", updatedAt: "5 min ago", status: "Watch", icon: Thermometer, color: "#3baed8", sparkline: [36.8, 37.0, 37.1, 37.2, 37.3, 37.2, 37.2] },
  { id: "bp-nibp", label: "BP NIBP", shortLabel: "NIBP", value: "120/80", unit: "mmHg", detail: "MAP 93", updatedAt: "4 min ago", status: "Stable", icon: Activity, color: "#22a06b", sparkline: [91, 92, 94, 93, 92, 93, 93] },
  { id: "bp-arterial", label: "BP Arterial Line", shortLabel: "Art BP", value: "118/76", unit: "mmHg", detail: "MAP 90", updatedAt: "1 min ago", status: "Stable", icon: Waves, color: "#5b8def", sparkline: [89, 90, 91, 90, 90, 91, 90] },
  { id: "cvp", label: "CVP", shortLabel: "CVP", value: "8", unit: "mmHg", updatedAt: "7 min ago", status: "Stable", icon: Stethoscope, color: "#9b72f2", sparkline: [7, 8, 8, 9, 8, 8, 8] },
  { id: "pcwp", label: "PCWP", shortLabel: "PCWP", value: "12", unit: "mmHg", updatedAt: "12 min ago", status: "Stable", icon: Activity, color: "#2f80ed", sparkline: [11, 11, 12, 12, 13, 12, 12] },
];

export const cvsTrendData: CvsTrendPoint[] = [
  { time: "06:00", hr: 82, temperature: 36.8, nibpMap: 91, arterialMap: 89, cvp: 7, pcwp: 11 },
  { time: "08:00", hr: 84, temperature: 37.0, nibpMap: 92, arterialMap: 90, cvp: 8, pcwp: 11 },
  { time: "10:00", hr: 83, temperature: 37.1, nibpMap: 94, arterialMap: 91, cvp: 8, pcwp: 12 },
  { time: "12:00", hr: 86, temperature: 37.2, nibpMap: 93, arterialMap: 90, cvp: 9, pcwp: 12 },
  { time: "14:00", hr: 85, temperature: 37.3, nibpMap: 92, arterialMap: 90, cvp: 8, pcwp: 13 },
  { time: "16:00", hr: 87, temperature: 37.2, nibpMap: 93, arterialMap: 91, cvp: 8, pcwp: 12 },
  { time: "18:00", hr: 86, temperature: 37.2, nibpMap: 93, arterialMap: 90, cvp: 8, pcwp: 12 },
];

export const cvsRecords: CvsRecord[] = [
  { id: "cvs-001", dateTime: "Today 18:00", hr: 86, temperature: 37.2, nibp: "120/80/93", arterial: "118/76/90", cvp: 8, pcwp: 12, notes: "Awake, perfusion warm, no acute BP drop." },
  { id: "cvs-002", dateTime: "Today 16:00", hr: 87, temperature: 37.2, nibp: "121/79/93", arterial: "119/77/91", cvp: 8, pcwp: 12, notes: "MAP maintained above target." },
  { id: "cvs-003", dateTime: "Today 14:00", hr: 85, temperature: 37.3, nibp: "118/78/92", arterial: "116/75/90", cvp: 8, pcwp: 13, notes: "Low-grade temperature watch." },
  { id: "cvs-004", dateTime: "Today 12:00", hr: 86, temperature: 37.2, nibp: "120/80/93", arterial: "118/76/90", cvp: 9, pcwp: 12, notes: "Transducer zeroed, waveform acceptable." },
  { id: "cvs-005", dateTime: "Today 10:00", hr: 83, temperature: 37.1, nibp: "122/82/94", arterial: "120/78/91", cvp: 8, pcwp: 12, notes: "No rhythm change." },
  { id: "cvs-006", dateTime: "Today 08:00", hr: 84, temperature: 37.0, nibp: "119/78/92", arterial: "117/76/90", cvp: 8, pcwp: 11, notes: "Volume status stable." },
];

export const cvsInsights = [
  "MAP stable above 65 for last 6 readings",
  "No sudden BP drop detected",
  "CVP trend suggests stable volume status",
];

export const cvsParameterCards = [
  { id: "heart-rate", label: "Heart Rate", description: "Rhythm, source, and bedside notes", route: "/icu-monitoring/cvs/heart-rate", icon: HeartPulse },
  { id: "temperature", label: "Temperature", description: "Temperature source, site, and notes", route: "/icu-monitoring/cvs/temperature", icon: Thermometer },
  { id: "bp-nibp", label: "Blood Pressure - NIBP", description: "SBP, DBP, MAP, position, arm, cuff", route: "/icu-monitoring/cvs/bp-nibp", icon: Activity },
  { id: "bp-arterial", label: "Blood Pressure - Arterial Line", description: "Line site, waveform, zeroing status", route: "/icu-monitoring/cvs/bp-arterial", icon: Waves },
  { id: "cvp", label: "CVP", description: "Position, waveform, transducer state", route: "/icu-monitoring/cvs/cvp", icon: Stethoscope },
  { id: "pcwp", label: "PCWP", description: "Pulmonary wedge pressure capture", route: "/icu-monitoring/cvs/pcwp", icon: Activity },
];

export const trendOptions = [
  { id: "hr", label: "HR", key: "hr", unit: "bpm", color: "#7367f0" },
  { id: "temperature", label: "Temperature", key: "temperature", unit: "C", color: "#3baed8" },
  { id: "bp-nibp", label: "BP NIBP", key: "nibpMap", unit: "MAP", color: "#22a06b" },
  { id: "bp-arterial", label: "BP Arterial", key: "arterialMap", unit: "MAP", color: "#5b8def" },
  { id: "cvp", label: "CVP", key: "cvp", unit: "mmHg", color: "#9b72f2" },
  { id: "pcwp", label: "PCWP", key: "pcwp", unit: "mmHg", color: "#2f80ed" },
] as const;
