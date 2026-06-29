"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { NurseOrderDetailsModel } from "./types";

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      {children}
    </div>
  );
}

function FieldBlock({ label, value }: { label: string; value: string }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <Input value={value} readOnly className="bg-background font-semibold" />
    </label>
  );
}

function TextAreaField({ label, value, readOnly = false, onChange }: { label: string; value: string; readOnly?: boolean; onChange?: (value: string) => void }) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea
        className="min-h-[92px] w-full rounded-md border border-input px-3 py-2 text-sm outline-none focus:border-border focus:ring-0 disabled:cursor-not-allowed disabled:bg-surface-muted"
        value={value}
        readOnly={readOnly}
        disabled={readOnly}
        onChange={(event) => onChange?.(event.target.value)}
      />
    </label>
  );
}

export function NotesTab({ order }: { order: NurseOrderDetailsModel }) {
  const editable = order.administrationCondition !== "Administered";
  const notesReadOnly = order.administrationInstructions || "-";
  const [doctorNotified, setDoctorNotified] = React.useState(order.doctorNotified);
  const [notificationDateTime, setNotificationDateTime] = React.useState(order.notificationDateTime);
  const [communicationDetails, setCommunicationDetails] = React.useState(order.communicationDetails);
  const [generalRemarks, setGeneralRemarks] = React.useState(order.generalRemarks);
  const [nurseNotes, setNurseNotes] = React.useState(order.nurseNotes);
  const [patientResponse, setPatientResponse] = React.useState(order.patientResponse);
  const [observation, setObservation] = React.useState(order.observation);
  const [followUpNotes, setFollowUpNotes] = React.useState(order.followUpNotes);

  const readOnlyMode = !editable;
  const showCommunicationFields = doctorNotified === "Yes";

  return (
    <div className="space-y-4">
      <SectionCard title="Doctor Notes">
        <TextAreaField label="Instructions" value={notesReadOnly} readOnly />
      </SectionCard>

      <SectionCard title="Nurse Notes">
        <div className="grid gap-3 lg:grid-cols-2">
          <TextAreaField label="Administration Notes" value={nurseNotes} readOnly={readOnlyMode} onChange={setNurseNotes} />
          <TextAreaField label="Patient Response" value={patientResponse} readOnly={readOnlyMode} onChange={setPatientResponse} />
          <TextAreaField label="Observation" value={observation} readOnly={readOnlyMode} onChange={setObservation} />
          <TextAreaField label="Follow-up Notes" value={followUpNotes} readOnly={readOnlyMode} onChange={setFollowUpNotes} />
        </div>
      </SectionCard>

      <SectionCard title="Communication">
        <div className="space-y-3">
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">Doctor Notified</span>
            <div className="flex gap-4 rounded-md border border-border bg-surface px-3 py-2">
              {(["Yes", "No"] as const).map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="radio"
                    name="doctor-notified"
                    value={option}
                    checked={doctorNotified === option}
                    disabled={readOnlyMode}
                    onChange={() => setDoctorNotified(option)}
                    className="h-4 w-4 accent-primary"
                  />
                  {option}
                </label>
              ))}
            </div>
          </div>

          {showCommunicationFields ? (
            <>
              <label className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground">Notification Date & Time</span>
                <Input
                  type="datetime-local"
                  value={notificationDateTime}
                  readOnly={readOnlyMode}
                  disabled={readOnlyMode}
                  onChange={(event) => setNotificationDateTime(event.target.value)}
                  className="bg-background font-semibold"
                />
              </label>
              <TextAreaField label="Communication Details" value={communicationDetails} readOnly={readOnlyMode} onChange={setCommunicationDetails} />
            </>
          ) : null}
        </div>
      </SectionCard>

      <SectionCard title="Additional Remarks">
        <TextAreaField label="General Remarks" value={generalRemarks} readOnly={readOnlyMode} onChange={setGeneralRemarks} />
        <div className="mt-4 flex justify-end">
          <Button type="button" disabled={readOnlyMode}>
            Save Notes
          </Button>
        </div>
      </SectionCard>
    </div>
  );
}
