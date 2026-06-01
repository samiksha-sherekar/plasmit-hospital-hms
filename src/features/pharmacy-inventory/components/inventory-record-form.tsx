"use client";

import { FormGrid, SelectField, TextareaField, TextField } from "@/features/pharmacy-master/components/master-fields";

export type InventoryField<TRecord> = {
  key: keyof TRecord;
  label: string;
  type?: "text" | "number" | "date" | "textarea" | "select";
  options?: string[];
  required?: boolean;
};

export function InventoryRecordForm<TRecord extends object>({
  value,
  fields,
  readOnly,
  onChange,
}: {
  value: TRecord;
  fields: InventoryField<TRecord>[];
  readOnly?: boolean;
  onChange: (value: TRecord) => void;
}) {
  return (
    <fieldset disabled={readOnly} className="space-y-4 disabled:opacity-75">
      <FormGrid>
        {fields.map((field) => {
          const current = value[field.key] as string | number;
          const update = (nextValue: string) => {
            const parsedValue = field.type === "number" ? Number(nextValue) : nextValue;
            onChange({ ...value, [field.key]: parsedValue });
          };

          if (field.type === "textarea") {
            return <TextareaField key={String(field.key)} label={field.label} value={String(current ?? "")} onChange={update} />;
          }

          if (field.type === "select" && field.options) {
            return (
              <SelectField
                key={String(field.key)}
                label={field.label}
                required={field.required}
                value={String(current ?? "")}
                options={field.options.map((option) => ({ label: option, value: option }))}
                onChange={update}
              />
            );
          }

          return (
            <TextField
              key={String(field.key)}
              label={field.label}
              required={field.required}
              type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
              value={current ?? ""}
              onChange={update}
            />
          );
        })}
      </FormGrid>
    </fieldset>
  );
}
