"use client";

import * as React from "react";
import { Droplet, Info, StickyNote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground">{children}</span>;
}

function FieldSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-9 w-full appearance-none rounded-md border border-input bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-border focus:ring-0"
    >
      {children}
    </select>
  );
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const bloodProducts = ["Packed RBC", "Whole Blood", "FFP", "Platelets", "SDP", "Cryoprecipitate"];
const priorities = ["Routine", "Urgent", "Emergency"] as const;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function currentTimeValue() {
  return new Date().toTimeString().slice(0, 5);
}

export function BloodRequestTab() {
  const [submitted, setSubmitted] = React.useState(false);
  const [form, setForm] = React.useState({
    patientName: "Ramesh Kumar",
    mrn: "UHID-45821",
    bloodGroup: "A+",
    bloodProduct: "Packed RBC",
    bloodProductText: "",
    units: "1",
    priority: "Routine",
    requiredDate: todayIso(),
    requiredTime: currentTimeValue(),
    reason: "",
    instructions: "",
    emergencyRequest: false,
    crossMatchRequired: true,
    diagnosis: "",
    hemoglobin: "",
  });

  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div>
            <CardTitle className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-danger" />
              Blood Request
            </CardTitle>
            <CardDescription>Capture blood request details for blood bank approval.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="space-y-2">
              <FieldLabel>Patient Name</FieldLabel>
              <Input value={form.patientName} readOnly />
            </label>

            <label className="space-y-2">
              <FieldLabel>MRN / UHID</FieldLabel>
              <Input value={form.mrn} readOnly />
            </label>

            <label className="space-y-2">
              <FieldLabel>Blood Group</FieldLabel>
              <Input value={form.bloodGroup} readOnly />
            </label>

            {/* <label className="space-y-2">
              <FieldLabel>Blood Product</FieldLabel>
              <FieldSelect value={form.bloodProduct} onChange={(bloodProduct) => setForm((current) => ({ ...current, bloodProduct }))}>
                {bloodProducts.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FieldSelect>
            </label> */}

            <label className="space-y-2">
              <FieldLabel>Blood Product </FieldLabel>
              <Input value={form.bloodProduct} onChange={(event) => setForm((current) => ({ ...current, bloodProductText: event.target.value }))} placeholder="Blood Product" />
            </label>

            <label className="space-y-2">
              <FieldLabel>No. Of Units</FieldLabel>
              <Input
                min={1}
                type="number"
                value={form.units}
                onChange={(event) => setForm((current) => ({ ...current, units: event.target.value.replace(/[^0-9]/g, "") || "1" }))}
                onKeyDown={(event) => {
                  if (event.key === "-" || event.key === "e" || event.key === ".") event.preventDefault();
                }}
              />
            </label>

            <label className="space-y-2">
              <FieldLabel>Priority</FieldLabel>
              <FieldSelect value={form.priority} onChange={(priority) => setForm((current) => ({ ...current, priority }))}>
                {priorities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </FieldSelect>
            </label>

            <label className="space-y-2">
              <FieldLabel>Required Date</FieldLabel>
              <Input type="date" value={form.requiredDate} onChange={(event) => setForm((current) => ({ ...current, requiredDate: event.target.value }))} />
            </label>

            <label className="space-y-2">
              <FieldLabel>Required Time</FieldLabel>
              <Input type="time" value={form.requiredTime} onChange={(event) => setForm((current) => ({ ...current, requiredTime: event.target.value }))} />
            </label>

            <label className="space-y-2">
              <FieldLabel>Hemoglobin (Hb)</FieldLabel>
              <Input
                type="number"
                step="0.1"
                value={form.hemoglobin}
                onChange={(event) => setForm((current) => ({ ...current, hemoglobin: event.target.value }))}
                placeholder="g/dL"
              />
            </label>
            <label className="space-y-2">
              <FieldLabel>Reason</FieldLabel>
              <Input value={form.reason} onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))} placeholder="Enter reason" />
            </label>
          </div>


          <label className="block space-y-2 mt-2">
            <FieldLabel>Instructions</FieldLabel>
            <div className="relative">
              <textarea
                rows={3}
                value={form.instructions}
                onChange={(event) => setForm((current) => ({ ...current, instructions: event.target.value }))}
                className="min-h-24 w-full rounded-md border border-input bg-background py-3 pl-10 pr-3 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20"
                placeholder="Free text instructions"
              />
              <StickyNote className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex items-center gap-3 rounded-md border border-border bg-surface-muted px-3 py-2">
              <input
                type="checkbox"
                checked={form.emergencyRequest}
                onChange={(event) => setForm((current) => ({ ...current, emergencyRequest: event.target.checked }))}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Emergency Request</span>
            </label>

            <label className="flex items-center gap-3 rounded-md border border-border bg-surface-muted px-3 py-2">
              <input
                type="checkbox"
                checked={form.crossMatchRequired}
                onChange={(event) => setForm((current) => ({ ...current, crossMatchRequired: event.target.checked }))}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              <span className="text-sm font-medium text-foreground">Cross Match Required</span>
            </label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="button" onClick={onSubmit}>
          Submit Request
        </Button>
      </div>

      {submitted ? (
        <Card className="mt-4 border-warning/30 bg-warning/10">
          <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Info className="h-4 w-4 text-warning" />
                Current Blood Request Status
              </div>
              <p className="text-sm text-muted-foreground">Request submitted successfully for Blood Bank approval.</p>
            </div>
            <Badge tone="warning" className="px-3 py-1">
              Pending Approval
            </Badge>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
