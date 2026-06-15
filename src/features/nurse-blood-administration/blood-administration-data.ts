export type TimepointLabel =
  | "Immediately before starting transfusion"
  | "15 min after commencement"
  | "Hourly during transfusion"
  | "At completion of each pack"
  | "One hour after completion"
  | "Ad-hoc / Reaction";

export type ComponentCategory =
  | "Whole Blood / Leucoreduced Red Cells"
  | "Packed Red Cells"
  | "Platelets Concentrate"
  | "F.F.P (Fresh Frozen Plasma)"
  | "Cryoprecipitate"
  | "Factor VIII poor plasma"
  | "Platelets on Cell Separator"
  | "Plasma on Cell Separator"
  | "Washed Red Cells"
  | "Others / Procedure";

export type MonitoringScheduleItem = {
  label: TimepointLabel;
  dueMinutes: number | null;
};

export type ReactionSymptom =
  | "Chills"
  | "Fever"
  | "Urticaria"
  | "Pain at site of transfusion"
  | "Dyspnoea"
  | "Hypotension"
  | "Shock"
  | "Hemoglobinuria"
  | "Oliguria/Anuria";

export type BloodAdministrationEpisode = {
  patientName: string;
  mrn: string;
  wardBed: string;
  bloodGroup: string;
  componentType: ComponentCategory;
  bagNo: string;
  startTime: string;
  baselinePulse: number;
  baselineSystolic: number;
  baselineDiastolic: number;
  baselineTemperature: number;
  baselineRespiratoryRate: number;
  clockNo: string;
};

export const bloodAdministrationEpisode: BloodAdministrationEpisode = {
  patientName: "Meera Joshi",
  mrn: "UHID-45821",
  wardBed: "Ward 3 / Bed 12",
  bloodGroup: "A+",
  componentType: "Packed Red Cells",
  bagNo: "BU-10231",
  startTime: "2026-06-15 09:15",
  baselinePulse: 82,
  baselineSystolic: 118,
  baselineDiastolic: 76,
  baselineTemperature: 36.8,
  baselineRespiratoryRate: 18,
  clockNo: "CN-1442",
};

export const wholeBloodMonitoringSchedule: MonitoringScheduleItem[] = [
  { label: "Immediately before starting transfusion", dueMinutes: 0 },
  { label: "15 min after commencement", dueMinutes: 15 },
  { label: "Hourly during transfusion", dueMinutes: 60 },
  { label: "At completion of each pack", dueMinutes: null },
  { label: "One hour after completion", dueMinutes: 60 },
];

export const otherComponentMonitoringSchedule: MonitoringScheduleItem[] = [
  { label: "Immediately before starting transfusion", dueMinutes: 0 },
  { label: "15 min after commencement", dueMinutes: 15 },
  { label: "At completion of each pack", dueMinutes: null },
];

export const reactionSymptoms: ReactionSymptom[] = [
  "Chills",
  "Fever",
  "Urticaria",
  "Pain at site of transfusion",
  "Dyspnoea",
  "Hypotension",
  "Shock",
  "Hemoglobinuria",
  "Oliguria/Anuria",
];
