import type { LucideIcon } from "lucide-react";
import { Activity, Bone, Brain, Ear, Eye, HeartPulse, ShieldAlert, Smile, Stethoscope, Users, Workflow } from "lucide-react";

export type ClinicalSeverity = "Normal" | "Mild" | "Moderate" | "Severe" | "Critical";
export type SpecialtyId = "cvs" | "cns" | "respiratory" | "gastro" | "orthopedic" | "ent" | "ophthalmology" | "gynecology" | "pediatrics" | "dermatology" | "psychiatry" | "general";

export type ClinicalSpecialty = {
  id: SpecialtyId;
  label: string;
  department: string;
  recentlyUsed?: boolean;
  favorite?: boolean;
  icon: LucideIcon;
};

export type ExamFinding = {
  label: string;
  value: string;
  severity: ClinicalSeverity;
  score?: number;
};

export type ClinicalTimelineItem = {
  id: string;
  time: string;
  specialty: string;
  doctor: string;
  summary: string;
  status: string;
};

export type ClinicalTrendPoint = {
  day: string;
  vitals: number;
  risk: number;
  recovery: number;
  score: number;
};

export const clinicalPatient = {
  uhid: "PLH-240118",
  name: "Meera Joshi",
  ageGender: "42/F",
  encounter: "IPD-1188 / OPD-5261",
  wardBed: "ICU-2 / Bed 07",
  consultant: "Dr. Kavita Rao",
  allergies: "Penicillin allergy",
  flags: ["Fall risk", "High BP watch", "Anticoagulant review"],
};

export const quickClinicalActions = ["Clinical Examination", "Progress Notes", "Orders", "Prescription", "Vitals", "Reports", "Nursing Notes", "Discharge Summary"];

export const clinicalSpecialties: ClinicalSpecialty[] = [
  { id: "cvs", label: "CVS", department: "Medicine", favorite: true, recentlyUsed: true, icon: HeartPulse },
  { id: "cns", label: "CNS", department: "Neurology", recentlyUsed: true, icon: Brain },
  { id: "respiratory", label: "Respiratory", department: "Pulmonology", favorite: true, icon: Stethoscope },
  { id: "gastro", label: "Gastroenterology", department: "Medicine", icon: Activity },
  { id: "orthopedic", label: "Orthopedic", department: "Orthopedics", icon: Bone },
  { id: "ent", label: "ENT", department: "ENT", icon: Ear },
  { id: "ophthalmology", label: "Ophthalmology", department: "Ophthalmology", icon: Eye },
  { id: "gynecology", label: "Gynecology", department: "OBG", icon: Users },
  { id: "pediatrics", label: "Pediatrics", department: "Pediatrics", icon: Smile },
  { id: "dermatology", label: "Dermatology", department: "Dermatology", icon: ShieldAlert },
  { id: "psychiatry", label: "Psychiatry", department: "Psychiatry", icon: Brain },
  { id: "general", label: "General Medicine", department: "Medicine", recentlyUsed: true, icon: Workflow },
];

export const examinationSections = {
  cvs: ["Heart sounds", "Murmur", "Pulse", "BP", "Peripheral edema", "JVP", "Cyanosis", "Capillary refill", "Chest pain", "Rhythm"],
  cns: ["Consciousness", "Orientation", "Speech", "Motor power", "Sensory exam", "Reflexes", "Cranial nerves", "GCS", "Tremors", "Coordination", "Gait"],
  respiratory: ["Breath sounds", "Wheezing", "Crepitations", "SpO2", "Distress", "Cough", "Chest expansion", "Trachea position"],
  gastro: ["Tenderness", "Distension", "Bowel sounds", "Liver/Spleen", "Vomiting", "Stool history", "Appetite"],
  orthopedic: ["Joint movement", "Pain scale", "Swelling", "Tenderness", "Deformity", "Mobility"],
};

export const cvsFindings: ExamFinding[] = [
  { label: "Heart sounds", value: "S1/S2 audible", severity: "Normal", score: 0 },
  { label: "Murmur", value: "Absent", severity: "Normal", score: 0 },
  { label: "Pulse", value: "Regular, 86 bpm", severity: "Mild", score: 1 },
  { label: "BP", value: "148/92 mmHg", severity: "Moderate", score: 2 },
  { label: "Peripheral edema", value: "Absent", severity: "Normal", score: 0 },
  { label: "JVP", value: "Not raised", severity: "Normal", score: 0 },
  { label: "Capillary refill", value: "2 sec", severity: "Normal", score: 0 },
  { label: "Rhythm abnormality", value: "No acute rhythm change", severity: "Normal", score: 0 },
];

export const clinicalTimeline: ClinicalTimelineItem[] = [
  { id: "ce-001", time: "Today 10:45", specialty: "CVS", doctor: "Dr. Kavita Rao", summary: "BP elevated, perfusion warm, no murmur.", status: "Draft autosaved" },
  { id: "ce-002", time: "Yesterday 18:20", specialty: "Respiratory", doctor: "Dr. Aman Verma", summary: "SpO2 stable on room air, no distress.", status: "Final submitted" },
  { id: "ce-003", time: "Yesterday 10:10", specialty: "CNS", doctor: "Dr. Neha Malik", summary: "GCS 15, motor power symmetric.", status: "Consultant verified" },
];

export const clinicalTrendData: ClinicalTrendPoint[] = [
  { day: "Mon", vitals: 84, risk: 32, recovery: 62, score: 5 },
  { day: "Tue", vitals: 82, risk: 30, recovery: 66, score: 4 },
  { day: "Wed", vitals: 88, risk: 36, recovery: 64, score: 6 },
  { day: "Thu", vitals: 86, risk: 34, recovery: 68, score: 5 },
  { day: "Fri", vitals: 90, risk: 42, recovery: 70, score: 7 },
  { day: "Sat", vitals: 86, risk: 31, recovery: 74, score: 4 },
];

export const clinicalScores = [
  { label: "GCS", value: "15/15", severity: "Normal" as ClinicalSeverity, note: "Eye 4, Verbal 5, Motor 6" },
  { label: "Pain score", value: "3/10", severity: "Mild" as ClinicalSeverity, note: "Controlled with current plan" },
  { label: "NEWS score", value: "4", severity: "Moderate" as ClinicalSeverity, note: "BP and pulse watch" },
  { label: "Fall risk", value: "High", severity: "Severe" as ClinicalSeverity, note: "Bed rail and assisted ambulation" },
];

export const reportLinks = [
  { type: "ECG", name: "12 lead ECG", time: "Today 09:30", status: "Reviewed" },
  { type: "Echo", name: "2D Echo", time: "Yesterday 16:10", status: "Pending comparison" },
  { type: "Lab", name: "CBC, Electrolytes", time: "Today 08:00", status: "Critical value flagged" },
  { type: "X-ray", name: "Chest PA", time: "Yesterday 11:20", status: "Attached" },
];

export const builderFields = ["Radio", "Checkbox", "Numeric", "Text", "Dropdown", "Severity selector", "Image upload"];
export const backendApis = ["GET /api/v1/patients/:id", "GET /api/v1/clinical/templates", "POST /api/v1/clinical/examinations", "GET /api/v1/clinical/graphs/:patientId", "POST /api/v1/clinical/scores/calculate", "GET /api/v1/clinical/history/:patientId", "POST /api/v1/clinical/approvals", "GET /api/v1/clinical/examinations/:id/pdf"];
export const databaseTables = ["patients", "clinical_examinations", "examination_templates", "examination_sections", "examination_fields", "examination_results", "clinical_scores", "clinical_graph_data", "doctor_notes", "approvals", "attachments"];
