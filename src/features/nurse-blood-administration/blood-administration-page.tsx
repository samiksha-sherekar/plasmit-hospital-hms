"use client";

import * as React from "react";
import { AlertTriangle, Clock3, Droplets, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

import { AlertBanner } from "@/components/ui/alert-banner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/shell/page-header";
import {
  bloodAdministrationEpisode,
  otherComponentMonitoringSchedule,
  reactionSymptoms,
  wholeBloodMonitoringSchedule,
  type MonitoringScheduleItem,
  type ReactionSymptom,
} from "./blood-administration-data";
import { PatientSummaryBanner } from "./shared/patient-summary-banner";

type VitalsRow = {
  id: string;
  date: string;
  time: string;
  timepointLabel: MonitoringScheduleItem["label"];
  pulse: string;
  systolic: string;
  diastolic: string;
  temperature: string;
  respiratoryRate: string;
  nurseName: string;
  clockNo: string;
};

type BagErrorMap = {
  date?: string;
  time?: string;
  timepointLabel?: string;
  pulse?: string;
  systolic?: string;
  diastolic?: string;
  temperature?: string;
  respiratoryRate?: string;
  nurseName?: string;
  clockNo?: string;
};

const timepointOptions: MonitoringScheduleItem["label"][] = [
  "Immediately before starting transfusion",
  "15 min after commencement",
  "Hourly during transfusion",
  "At completion of each pack",
  "One hour after completion",
  "Ad-hoc / Reaction",
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function timeNow() {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function scheduleFor(componentType: string) {
  return componentType === "Packed Red Cells" || componentType === "Whole Blood / Leucoreduced Red Cells"
    ? wholeBloodMonitoringSchedule
    : otherComponentMonitoringSchedule;
}

function makeVitalsRow(defaultTimepoint: MonitoringScheduleItem["label"]): VitalsRow {
  return {
    id: `row-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    date: todayIso(),
    time: timeNow(),
    timepointLabel: defaultTimepoint,
    pulse: "",
    systolic: "",
    diastolic: "",
    temperature: "",
    respiratoryRate: "",
    nurseName: "Nurse Asha",
    clockNo: bloodAdministrationEpisode.clockNo,
  };
}

function rangeError(value: string, min: number, max: number, label: string) {
  if (!value) return `${label} is required.`;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return `${label} must be numeric.`;
  if (parsed < min || parsed > max) return `${label} must be between ${min} and ${max}.`;
  return "";
}

function temperatureError(current: string, baseline: number) {
  if (!current) return "Temperature is required.";
  const parsed = Number(current);
  if (!Number.isFinite(parsed)) return "Temperature must be numeric.";
  if (parsed < 30 || parsed > 43) return "Temperature must be between 30.0 and 43.0 C.";
  if (parsed - baseline >= 1) return "Temperature rise >= 1 C from baseline may indicate reaction.";
  return "";
}

function getRowErrors(row: VitalsRow, index: number, baselineTemperature: number): BagErrorMap {
  return {
    date: row.date ? "" : `Entry ${index + 1}: date is required.`,
    time: row.time ? "" : `Entry ${index + 1}: time is required.`,
    timepointLabel: row.timepointLabel ? "" : `Entry ${index + 1}: timepoint label is required.`,
    pulse: rangeError(row.pulse, 0, 250, `Entry ${index + 1} pulse`),
    systolic: rangeError(row.systolic, 0, 300, `Entry ${index + 1} systolic BP`),
    diastolic: rangeError(row.diastolic, 0, 200, `Entry ${index + 1} diastolic BP`),
    temperature: temperatureError(row.temperature, baselineTemperature),
    respiratoryRate: rangeError(row.respiratoryRate, 0, 60, `Entry ${index + 1} respiratory rate`),
    nurseName: row.nurseName ? "" : `Entry ${index + 1}: nurse name is required.`,
    clockNo: row.clockNo ? "" : `Entry ${index + 1}: clock number is required.`,
  };
}

export function NurseBloodAdministrationPage() {
  const [rows, setRows] = React.useState<VitalsRow[]>([makeVitalsRow("Immediately before starting transfusion")]);
  const [symptoms, setSymptoms] = React.useState<Record<ReactionSymptom, boolean>>(
    Object.fromEntries(reactionSymptoms.map((symptom) => [symptom, false])) as Record<ReactionSymptom, boolean>,
  );
  const [reactionSeverity, setReactionSeverity] = React.useState("");
  const [actionTaken, setActionTaken] = React.useState("");
  const [episodeCompleted, setEpisodeCompleted] = React.useState(false);
  const [complicationAcknowledged, setComplicationAcknowledged] = React.useState(false);

  const schedule = scheduleFor(bloodAdministrationEpisode.componentType);
  const reactionTriggered = Object.values(symptoms).some(Boolean);
  const requiresFinalObservation =
    bloodAdministrationEpisode.componentType === "Whole Blood" || bloodAdministrationEpisode.componentType === "Packed Red Cells";
  const rowErrors = rows.map((row, index) => getRowErrors(row, index, bloodAdministrationEpisode.baselineTemperature));
  const hasVitalsErrors = rowErrors.some((rowError) => Object.values(rowError).some(Boolean));
  const hasRequiredTimepoints = schedule.every((item) => rows.some((row) => row.timepointLabel === item.label));
  const hasReactionBlockingFields = reactionTriggered && (!reactionSeverity.trim() || !actionTaken.trim());
  const canComplete =
    rows.length > 0 &&
    !hasVitalsErrors &&
    hasRequiredTimepoints &&
    (!reactionTriggered || (!hasReactionBlockingFields && complicationAcknowledged)) &&
    (!requiresFinalObservation || rows.some((row) => row.timepointLabel === "One hour after completion"));

  function updateRow(id: string, patch: Partial<VitalsRow>) {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function addRow() {
    const nextLabel = schedule[Math.min(rows.length, schedule.length - 1)]?.label ?? "Ad-hoc / Reaction";
    setRows((current) => [...current, makeVitalsRow(nextLabel)]);
  }

  function addAdhocRow() {
    setRows((current) => [...current, makeVitalsRow("Ad-hoc / Reaction")]);
    setSymptoms((current) => ({ ...current, Fever: true }));
  }

  function toggleSymptom(symptom: ReactionSymptom) {
    setSymptoms((current) => ({ ...current, [symptom]: !current[symptom] }));
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Nurse" title="Blood Administration" description="Screen 3 transfusion monitoring flowsheet and reaction documentation." />

      <AlertBanner icon={Droplets} tone="info" title="Monitoring schedule">
        {bloodAdministrationEpisode.componentType === "Whole Blood" || bloodAdministrationEpisode.componentType === "Packed Red Cells"
          ? "Whole Blood / Packed RBC schedule is active."
          : "Other component schedule is active."}
      </AlertBanner>
          <PatientSummaryBanner />
      {/* <Card>
        <CardHeader>
          <CardTitle>Active component being transfused</CardTitle>
          <CardDescription>Carried from Screen 2.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Meta label="Patient" value={bloodAdministrationEpisode.patientName} />
          <Meta label="MRN" value={bloodAdministrationEpisode.mrn} />
          <Meta label="Bag no." value={bloodAdministrationEpisode.bagNo} />
          <Meta label="Component" value={bloodAdministrationEpisode.componentType} />
          <Meta label="Blood group" value={bloodAdministrationEpisode.bloodGroup} />
          <Meta label="Start time" value={bloodAdministrationEpisode.startTime} />
          <Meta label="Ward/Bed" value={bloodAdministrationEpisode.wardBed} />
          <Meta label="Clock no." value={bloodAdministrationEpisode.clockNo} />
        </CardContent>
      </Card> */}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
          <div>
            <CardTitle>Required monitoring schedule</CardTitle>
            {/* <CardDescription>{schedule.map((item) => item.label).join(" • ")}</CardDescription> */}
          </div>
          {/* <Badge tone="info">Auto-generated</Badge> */}
        </CardHeader>
        <CardContent className="space-y-2">
          {schedule.map((item) => (
            <div key={item.label} className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
              <span className="text-sm">{item.label}</span>
              <span className="text-xs text-muted-foreground">{item.dueMinutes === null ? "Due at milestone" : `${item.dueMinutes} min`}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {reactionTriggered ? (
        <AlertBanner icon={AlertTriangle} tone="danger" title="STOP TRANSFUSION - follow compatibility form instructions">
          Reaction symptoms selected. Retain the bag, notify doctor and Blood Bank, keep IV line patent, and complete the reaction workflow.
        </AlertBanner>
      ) : null}

      <div className="grid gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vitals entry</CardTitle>
              {/* <CardDescription>Repeatable rows for transfusion monitoring.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
              {rows.map((row, index) => (
                <div key={row.id} className="rounded-xl border border-border bg-surface-muted/30 p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge tone="info">Entry {index + 1}</Badge>
                      <Badge tone="muted">{row.timepointLabel}</Badge>
                    </div>
                    <Button type="button" variant="ghost" onClick={() => setRows((current) => current.filter((item) => item.id !== row.id))} disabled={rows.length === 1}>
                      Remove
                    </Button>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    <Field label="Date" required>
                      <Input type="date" value={row.date} onChange={(event) => updateRow(row.id, { date: event.target.value })} />
                      <InlineError message={rowErrors[index]?.date ?? ""} />
                    </Field>
                    <Field label="Time" required>
                      <Input type="time" value={row.time} onChange={(event) => updateRow(row.id, { time: event.target.value })} />
                      <InlineError message={rowErrors[index]?.time ?? ""} />
                    </Field>
                    <Field label="Timepoint label" required>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={row.timepointLabel}
                        onChange={(event) => updateRow(row.id, { timepointLabel: event.target.value as VitalsRow["timepointLabel"] })}
                      >
                        {timepointOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      <InlineError message={rowErrors[index]?.timepointLabel ?? ""} />
                    </Field>
                    <Field label="Pulse/HR (/min)" required>
                      <Input type="number" value={row.pulse} onChange={(event) => updateRow(row.id, { pulse: event.target.value })} />
                      {/* <InlineError message={rowErrors[index]?.pulse ?? ""} /> */}
                    </Field>
                    <Field label="BP systolic" required>
                      <Input type="number" value={row.systolic} onChange={(event) => updateRow(row.id, { systolic: event.target.value })} />
                      {/* <InlineError message={rowErrors[index]?.systolic ?? ""} /> */}
                    </Field>
                    <Field label="BP diastolic" required>
                      <Input type="number" value={row.diastolic} onChange={(event) => updateRow(row.id, { diastolic: event.target.value })} />
                      {/* <InlineError message={rowErrors[index]?.diastolic ?? ""} /> */}
                    </Field>
                    <Field label="Temperature (C)" required>
                      <Input type="number" step="0.1" value={row.temperature} onChange={(event) => updateRow(row.id, { temperature: event.target.value })} />
                      {/* <InlineError message={rowErrors[index]?.temperature ?? ""} /> */}
                    </Field>
                    <Field label="Respiratory rate (/min)" required>
                      <Input type="number" value={row.respiratoryRate} onChange={(event) => updateRow(row.id, { respiratoryRate: event.target.value })} />
                      {/* <InlineError message={rowErrors[index]?.respiratoryRate ?? ""} /> */}
                    </Field>
                    <Field label="Sign / Name / Clock no." required>
                      <Input value={`${row.nurseName} / ${row.clockNo}`} readOnly />
                      {/* <InlineError message={rowErrors[index]?.nurseName ?? rowErrors[index]?.clockNo ?? ""} /> */}
                    </Field>
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" onClick={addRow}>
                  Add scheduled entry
                </Button>
                {/* <Button type="button" variant="outline" onClick={addAdhocRow}>
                  Add ad-hoc entry
                </Button> */}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reaction panel</CardTitle>
              {/* <CardDescription>Always visible and mandatory when any symptom is selected.</CardDescription> */}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 md:grid-cols-2">
                {reactionSymptoms.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    onClick={() => toggleSymptom(symptom)}
                    className={`rounded-lg border px-3 py-2 text-left text-sm ${symptoms[symptom] ? "border-danger bg-danger/5" : "border-border bg-background"}`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>

              {reactionTriggered ? (
                <div className="space-y-4 rounded-xl border border-danger/30 bg-danger/5 p-4">
                  <Field label="Reaction severity / description" required>
                    <textarea
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      value={reactionSeverity}
                      onChange={(event) => setReactionSeverity(event.target.value)}
                      placeholder="Describe symptoms, severity, onset time, and clinical concern."
                    />
                    <InlineError message={reactionSeverity.trim() ? "" : "Required when any reaction symptom is selected."} />
                  </Field>
                  <Field label="Action taken" required>
                    <textarea
                      className="min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/20"
                      value={actionTaken}
                      onChange={(event) => setActionTaken(event.target.value)}
                      placeholder="Transfusion stopped, doctor informed, blood bag retained, blood bank notified..."
                    />
                    <InlineError message={actionTaken.trim() ? "" : "Required when any reaction symptom is selected."} />
                  </Field>
                  <label className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                    <input type="checkbox" checked={complicationAcknowledged} onChange={(event) => setComplicationAcknowledged(event.target.checked)} />
                    Retain blood bag, send samples + compatibility form, keep IV line patent
                  </label>
                  <Button type="button" variant="outline" onClick={() => toast.info("Transfusion Reaction Report launch placeholder")}>
                    Open Reaction Report
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* <Card>
            <CardHeader>
              <CardTitle>Completion gate</CardTitle>
              <CardDescription>Completion requires final entry, and for PRC/Whole Blood one hour after completion is also expected.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">Final / completion entry</span>
                <Badge tone={rows.some((row) => row.timepointLabel === "At completion of each pack") ? "success" : "warning"}>
                  {rows.some((row) => row.timepointLabel === "At completion of each pack") ? "Done" : "Pending"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">1 hr post-completion</span>
                <Badge tone={requiresFinalObservation ? (rows.some((row) => row.timepointLabel === "One hour after completion") ? "success" : "warning") : "muted"}>
                  {requiresFinalObservation ? (rows.some((row) => row.timepointLabel === "One hour after completion") ? "Done" : "Pending") : "Not required"}
                </Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2">
                <span className="text-sm text-muted-foreground">Reaction workflow</span>
                <Badge tone={reactionTriggered ? "danger" : "success"}>{reactionTriggered ? "Triggered" : "Clear"}</Badge>
              </div>
            </CardContent>
          </Card> */}
          <div className="flex justify-end gap-2">
                      <Button type="button" disabled={!canComplete} onClick={() => setEpisodeCompleted(true)}>
                         Complete Transfusion
                      </Button>
                        {episodeCompleted ? <AlertBanner icon={ShieldAlert} tone="success" title="Flowsheet completed">Monitoring episode closed for {bloodAdministrationEpisode.patientName}.</AlertBanner> : null}
                    </div>  
          {/* <Card> */}
            {/* <CardHeader>
              <CardTitle>Episode actions</CardTitle>
              <CardDescription>Close only after required monitoring is completed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button type="button" className="w-full" disabled={!canComplete} onClick={() => setEpisodeCompleted(true)}>
                Mark episode completed
              </Button>
              <Button type="button" variant="outline" className="w-full" onClick={() => toast.info("Overdue reminder placeholder")}>
                Show overdue reminders
              </Button>
              {episodeCompleted ? <AlertBanner icon={ShieldAlert} tone="success" title="Flowsheet completed">Monitoring episode closed for {bloodAdministrationEpisode.patientName}.</AlertBanner> : null}
            </CardContent> */}
          {/* </Card> */}

          {/* <AlertBanner icon={Clock3} tone="warning" title="Overdue reminder">
            Missed or overdue timepoints should be flagged for the assigned nurse.
          </AlertBanner> */}
        </div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface-muted p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <div className="text-xs font-medium text-muted-foreground">
        {label}
        {required ? <span className="text-danger"> *</span> : null}
      </div>
      {children}
    </label>
  );
}

function InlineError({ message }: { message: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs font-medium text-danger">{message}</p>;
}
