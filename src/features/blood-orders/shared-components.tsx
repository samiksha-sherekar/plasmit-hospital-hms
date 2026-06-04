"use client";

import * as React from "react";
import { type LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SearchInput } from "@/components/ui/search-input";
import { mockPatients } from "@/data/patients";
import { PatientSearchSelect } from "@/features/patients/patient-search-select";
import type { StatusTone } from "@/types";

export function DetailItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-border bg-surface-muted p-3">
      <div className="text-xs font-medium text-muted-foreground">{label}:</div>
      <div className="text-sm font-semibold text-foreground">{value}</div>
    </div>
  );
}

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground">{children}</span>;
}

export function Textarea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={[
        "w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}

export function PatientSummaryCard() {
  const [patientId, setPatientId] = React.useState(mockPatients[0]?.id ?? "");
  const patient = mockPatients.find((item) => item.id === patientId) ?? mockPatients[0];

  return (
    <Card>
      <CardContent className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-4">
        <PatientSearchSelect patientId={patient.id} onPatientChange={setPatientId} />
        <DetailItem label="Age/Gender" value={`${patient.age} / ${patient.gender}`} />
        <DetailItem label="Blood Group" value={patient.bloodGroup} />
      </CardContent>
    </Card>
  );
}

export function SearchTableCard({
  searchId,
  searchValue,
  searchPlaceholder,
  badge,
  children,
  onSearchChange,
}: {
  searchId: string;
  searchValue: string;
  searchPlaceholder: string;
  badge: { label: string; tone: StatusTone };
  children: React.ReactNode;
  onSearchChange: (value: string) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="w-full max-w-md space-y-2">
          <SearchInput id={searchId} value={searchValue} onChange={(event) => onSearchChange(event.target.value)} placeholder={searchPlaceholder} />
        </div>
        <Badge tone={badge.tone}>{badge.label}</Badge>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function RequestMetricCard({
  label,
  value,
  icon: Icon,
  iconClassName = "text-warning",
}: {
  label: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconClassName?: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-muted-foreground">{label}:</div>
          <div className="text-2xl font-semibold text-foreground">{value}</div>
        </div>
        <Icon className={`h-5 w-5 ${iconClassName}`} />
      </CardContent>
    </Card>
  );
}
