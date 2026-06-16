"use client";

import { Badge } from "@/components/ui/badge";
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
  return (
    <div className="min-w-0">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="truncate text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function PatientSummaryBanner() {
  return (
    <Card className="border-primary/10 bg-gradient-to-r from-surface to-white shadow-sm">
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-foreground">Patient Demographics</div>
            {/* <div className="mt-1 text-xs text-muted-foreground">Selected inpatient context remains aligned across drug and pathology orders.</div> */}
          </div>
          {/* <Badge tone="info">IPD</Badge> */}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {patientFields.map((field) => (
            <PatientField key={field.label} {...field} />
          ))}
        </div>

        <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">Monitoring Schedule</p>
            <div className="flex flex-wrap gap-3">
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
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${index < 2 ? "border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100" : index === 2 ? "border-amber-400 bg-amber-50 text-amber-900 hover:bg-amber-100" : "border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100"}`}
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
