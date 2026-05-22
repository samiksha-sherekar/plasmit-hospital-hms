import type { LucideIcon } from "lucide-react";
import { Activity, Droplets, Gauge, HeartPulse, Stethoscope, Thermometer, Waves } from "lucide-react";

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
  { label: "Abdominal", route: "/icu-monitoring/abdominal", ready: true },
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

export type AbdominalParameterId = "iap" | "ng-output" | "gastrostomy-output" | "abdominal-drains";

export type AbdominalMetric = {
  id: AbdominalParameterId;
  label: string;
  value: string;
  unit: string;
  updatedAt: string;
  status: CvsStatus;
  icon: LucideIcon;
  color: string;
  sparkline: number[];
};

export type AbdominalTrendPoint = {
  time: string;
  iap: number;
  ngOutput: number;
  gastrostomyOutput: number;
  abdominalDrains: number;
};

export type AbdominalHourlyRecord = {
  time: string;
  value: number;
  total12h: number;
  total24h: number;
};

export type AbdominalComparisonRecord = {
  parameter: string;
  hourly: number[];
  total12h: number;
  total24h: number;
};

export const abdominalPatient = {
  name: "Aarav Mehta",
  mrn: "MRN-ICU-20491",
  bed: "ICU-2 / Bed 08",
  dateTime: "Today 18:00",
};

export const abdominalMetrics: AbdominalMetric[] = [
  { id: "iap", label: "Intra-abdominal Pressure", value: "14", unit: "mmHg", updatedAt: "8 min ago", status: "Stable", icon: Gauge, color: "#7367f0", sparkline: [13, 14, 14, 13, 14, 15, 14] },
  { id: "ng-output", label: "NG Output Total", value: "850", unit: "ml / 24 hrs", updatedAt: "15 min ago", status: "Watch", icon: Droplets, color: "#3baed8", sparkline: [22, 30, 34, 38, 42, 48, 52] },
  { id: "gastrostomy-output", label: "Gastrostomy Output", value: "210", unit: "ml / 24 hrs", updatedAt: "22 min ago", status: "Stable", icon: Stethoscope, color: "#22a06b", sparkline: [8, 10, 9, 11, 10, 12, 13] },
  { id: "abdominal-drains", label: "Abdominal Drains Output", value: "640", unit: "ml / 24 hrs", updatedAt: "18 min ago", status: "Watch", icon: Activity, color: "#5b8def", sparkline: [24, 26, 28, 31, 32, 35, 36] },
];

export const abdominalTrendData: AbdominalTrendPoint[] = [
  { time: "06:00", iap: 13, ngOutput: 28, gastrostomyOutput: 8, abdominalDrains: 24 },
  { time: "08:00", iap: 14, ngOutput: 34, gastrostomyOutput: 10, abdominalDrains: 26 },
  { time: "10:00", iap: 14, ngOutput: 38, gastrostomyOutput: 9, abdominalDrains: 28 },
  { time: "12:00", iap: 13, ngOutput: 42, gastrostomyOutput: 11, abdominalDrains: 31 },
  { time: "14:00", iap: 14, ngOutput: 48, gastrostomyOutput: 10, abdominalDrains: 32 },
  { time: "16:00", iap: 15, ngOutput: 50, gastrostomyOutput: 12, abdominalDrains: 35 },
  { time: "18:00", iap: 14, ngOutput: 56, gastrostomyOutput: 13, abdominalDrains: 36 },
];

export const abdominalChartConfigs = [
  { id: "iap", label: "IAP trend", latest: "14 mmHg", total: "Mean 14", dataKey: "iap", unit: "mmHg", color: "#7367f0" },
  { id: "ng-output", label: "NG Output trend", latest: "56 ml/hr", total: "850 ml / 24 hrs", dataKey: "ngOutput", unit: "ml/hr", color: "#3baed8" },
  { id: "gastrostomy-output", label: "Gastrostomy Output trend", latest: "13 ml/hr", total: "210 ml / 24 hrs", dataKey: "gastrostomyOutput", unit: "ml/hr", color: "#22a06b" },
  { id: "abdominal-drains", label: "Abdominal Drains Output trend", latest: "36 ml/hr", total: "640 ml / 24 hrs", dataKey: "abdominalDrains", unit: "ml/hr", color: "#5b8def" },
] as const;

export const abdominalHourlyRecords: Record<AbdominalParameterId, AbdominalHourlyRecord[]> = {
  iap: [
    { time: "13:00", value: 14, total12h: 168, total24h: 334 },
    { time: "14:00", value: 14, total12h: 168, total24h: 334 },
    { time: "15:00", value: 15, total12h: 169, total24h: 334 },
    { time: "16:00", value: 15, total12h: 169, total24h: 334 },
    { time: "17:00", value: 14, total12h: 168, total24h: 334 },
    { time: "18:00", value: 14, total12h: 168, total24h: 334 },
  ],
  "ng-output": [
    { time: "13:00", value: 42, total12h: 490, total24h: 850 },
    { time: "14:00", value: 48, total12h: 506, total24h: 850 },
    { time: "15:00", value: 46, total12h: 520, total24h: 850 },
    { time: "16:00", value: 50, total12h: 536, total24h: 850 },
    { time: "17:00", value: 52, total12h: 552, total24h: 850 },
    { time: "18:00", value: 56, total12h: 568, total24h: 850 },
  ],
  "gastrostomy-output": [
    { time: "13:00", value: 11, total12h: 104, total24h: 210 },
    { time: "14:00", value: 10, total12h: 106, total24h: 210 },
    { time: "15:00", value: 12, total12h: 111, total24h: 210 },
    { time: "16:00", value: 12, total12h: 115, total24h: 210 },
    { time: "17:00", value: 13, total12h: 119, total24h: 210 },
    { time: "18:00", value: 13, total12h: 123, total24h: 210 },
  ],
  "abdominal-drains": [
    { time: "13:00", value: 31, total12h: 360, total24h: 640 },
    { time: "14:00", value: 32, total12h: 374, total24h: 640 },
    { time: "15:00", value: 34, total12h: 390, total24h: 640 },
    { time: "16:00", value: 35, total12h: 404, total24h: 640 },
    { time: "17:00", value: 35, total12h: 420, total24h: 640 },
    { time: "18:00", value: 36, total12h: 436, total24h: 640 },
  ],
};

export const abdominalComparisonRecords: AbdominalComparisonRecord[] = [
  { parameter: "Intra-abdominal Pressure", hourly: [13, 14, 14, 13, 14, 15, 14, 14], total12h: 168, total24h: 334 },
  { parameter: "NG Output", hourly: [28, 34, 38, 42, 48, 50, 52, 56], total12h: 568, total24h: 850 },
  { parameter: "Gastrostomy Output", hourly: [8, 10, 9, 11, 10, 12, 13, 13], total12h: 123, total24h: 210 },
  { parameter: "Abdominal Drains Output", hourly: [24, 26, 28, 31, 32, 35, 35, 36], total12h: 436, total24h: 640 },
];

export const abdominalInsights = [
  "IAP stable below critical threshold.",
  "NG output increased by 18% in last 6 hours.",
  "Drain output pattern requires monitoring.",
  "No sudden abdominal pressure spike detected.",
];

export const abdominalApiEndpoints = {
  summary: "GET /api/v1/icu/abdominal/:patientId/summary",
  trends: "GET /api/v1/icu/abdominal/:patientId/trends",
  records: "GET /api/v1/icu/abdominal/:patientId/records",
  notes: "POST /api/v1/icu/abdominal/:patientId/notes",
};
