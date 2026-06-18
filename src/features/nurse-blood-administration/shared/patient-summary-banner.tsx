"use client";

import { Card, CardContent } from "@/components/ui/card";
import { bloodAdministrationEpisode, otherComponentMonitoringSchedule, wholeBloodMonitoringSchedule } from "../blood-administration-data";

type PatientSummaryField = {
  label: string;
  value: string;
};
const schedule = getScheduleFor(bloodAdministrationEpisode.componentType);
function getScheduleFor(componentType: string) {
  return componentType === "Packed Red Cells" || componentType === "Whole Blood / Leucoreduced Red Cells"
    ? wholeBloodMonitoringSchedule
    : otherComponentMonitoringSchedule;
}
  const requiresFinalPost = bloodAdministrationEpisode.componentType === "Packed Red Cells" || bloodAdministrationEpisode.componentType === "Whole Blood / Leucoreduced Red Cells";

const patientFields: PatientSummaryField[] = [
  { label: "Name", value: "Meera Joshi" },
  { label: "I.D. No. (Hospital ID / UHID)", value: "UHID-45821" },
  { label: "I.P. No. (Admission No.)", value: "ADM-90211" },
  { label: "Age", value: "42 years" },
  { label: "Sex", value: "Female" },
  { label: "Ward / Bed No.", value: "Ward 3 / Bed 12" },
  { label: "Blood Group", value: "A+" },
  { label: "Bag no.", value: "BU-10231" },
  { label: "Component", value: "Packed Red Cells" },
];

function PatientField({ label, value }: PatientSummaryField) {
  const isName = label === "Name";

  return (
    <div className={`min-w-0 rounded-lg border px-3 py-2 ${isName ? "border-primary/20 bg-primary/10" : "border-primary/10 bg-white/70"}`}>
      <div className="sr-only">{label}</div>
      <div className={`truncate leading-5 ${isName ? "text-base font-bold text-primary" : "text-sm font-semibold text-foreground"}`}>{value}</div>
    </div>
  );
}

export function PatientSummaryBanner() {
  return (
    <Card className="border-primary/15 bg-gradient-to-r from-primary/10 via-primary/5 to-white shadow-sm">
      <CardContent className="space-y-3 p-3">
        <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary/70">Patient Info</div>

        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {patientFields.map((field) => (
            <PatientField key={field.label} {...field} />
          ))}
        </div>

        <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary/70">Monitoring Schedule</p>
            <div className="flex flex-wrap gap-2">
              {[
                schedule[0]?.label === "Immediately before starting transfusion" ? "Pre-start" : "Pre-start",
                schedule[1]?.label === "15 min after commencement" ? "15 min" : "15 min",
                requiresFinalPost ? "1 hr - due now" : "Completion due now",
                "Completion",
                requiresFinalPost ? "1 hr post" : "No post-completion",
              ].map((label: string, index: number) => (
                <button
                  key={label}
                  type="button"
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${index < 2 ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : index === 2 ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100" : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
      </CardContent>
    </Card>
  );
}
