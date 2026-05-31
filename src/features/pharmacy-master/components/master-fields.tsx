"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SelectOption = {
  label: string;
  value: string;
};

export function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 md:grid-cols-2">{children}</div>;
}

export function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5 text-sm">
      <span className="font-medium text-foreground">
        {label} {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {error ? <span className="block text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

export function TextField({
  label,
  required,
  error,
  value,
  placeholder,
  type = "text",
  onChange,
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string | number;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <Input value={value} type={type} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
    </Field>
  );
}

export function SelectField({
  label,
  required,
  error,
  value,
  options,
  onChange,
}: {
  label: string;
  required?: boolean;
  error?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
}) {
  return (
    <Field label={label} required={required} error={error}>
      <select
        className="h-[var(--density-control-height)] w-full rounded-lg border border-input bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/15"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function TextareaField({
  label,
  error,
  value,
  onChange,
  className,
}: {
  label: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <Field label={label} error={error}>
      <textarea
        className={cn("min-h-24 w-full rounded-lg border border-input bg-white px-3.5 py-2 text-sm font-medium text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground/75 focus:border-ring focus:ring-2 focus:ring-ring/15", className)}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}

