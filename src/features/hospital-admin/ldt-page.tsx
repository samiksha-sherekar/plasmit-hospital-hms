"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { ListChecks, Pencil, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { AdminSection, FilterBar, ProtectedAdmin } from "@/features/admin/admin-shared";
import { MasterDialog } from "@/features/pharmacy-master/components/master-dialog";
import { getLdtTypeConfig } from "@/features/doctor-orders/tabs/ldt/config";
import type { LdtFieldType } from "@/features/doctor-orders/tabs/ldt/config";
import { LdtDetailsDrawer } from "./ldt-details-drawer";
import {
  assessmentTypes,
  dateFormats,
  emptyAssessmentForm,
  emptyPropertyForm,
  initialLdtRecords,
  ldtTypeOptions,
  ldtTypeToConfigId,
  propertyTypes,
  selectionModes,
  timeFormats,
  buildFieldConfig,
  // buildTableRows,
  defaultFieldRow,
  emptyForm,
  getFieldRows,
  sectionFieldName,
  sectionLabel,
  toFieldRows,
  type AssessmentFieldType,
  type AssessmentFormValues,
  type AssessmentRowValues,
  type ConfigField,
  type FieldRow,
  type FormErrors,
  type LdtDrawerState,
  type LdtDetailsDrawerState,
  type LdtFormValues,
  type LdtRecord,
  type LdtSection,
  type PropertyFormValues,
  type PropertyRowValues,
  type PropertyType,
  type SelectionMode,
  type TableRow,
  // type LdtFieldType,
} from "./ldt-data";

function ldtFieldTypeToFormType(type: LdtFieldType): PropertyType {
  if (type === "date") return "Date";
  if (type === "time") return "Time";
  if (type === "number") return "Number";
  if (type === "select" || type === "multiselect") return "Dropdown";
  return "Free text";
}

function buildTableRows(rows: Record<string, string> | undefined, fields: ConfigField[]): TableRow[] {
  return Object.entries(rows ?? {}).map(([field, value], index) => {
    const configField = fields.find((item) => item.label === field || item.id === field);
    return {
      key: `${field}-${index}`,
      field,
      type: configField?.type ?? "text",
      value: value || "-",
    };
  });
}

function FieldShell({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="space-y-1 text-sm">
      <span className="font-medium text-foreground">{label}</span>
      {children}
      {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
    </label>
  );
}

function SelectField<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: T[];
  onChange: (value: T) => void;
}) {
  return (
    <FieldShell label={label}>
      <select
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
        value={value}
        onChange={(event) => onChange(event.target.value as T)}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

function DropdownOptionsField({
  values,
  error,
  onChange,
}: {
  values: PropertyFormValues;
  error?: string;
  onChange: (values: Partial<PropertyFormValues>) => void;
}) {
  const updateOption = (index: number, value: string) => {
    onChange({ options: values.options.map((option, optionIndex) => (optionIndex === index ? value : option)) });
  };

  const deleteOption = (index: number) => {
    onChange({ options: values.options.filter((_, optionIndex) => optionIndex !== index) });
  };

  return (
    <div className="space-y-4">
      <SelectField label="Select mode" value={values.selectionMode} options={selectionModes} onChange={(selectionMode) => onChange({ selectionMode })} />
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">Options</span>
          <Button type="button" size="sm" variant="outline" onClick={() => onChange({ options: [...values.options, ""] })}>
            <Plus className="h-3.5 w-3.5" />
            Add Option
          </Button>
        </div>
        <div className="space-y-2">
          {values.options.map((option, index) => (
            <div className="flex gap-2" key={index}>
              <Input value={option} onChange={(event) => updateOption(index, event.target.value)} placeholder={`Option ${index + 1}`} />
              <Button type="button" size="icon" variant="outline" onClick={() => deleteOption(index)} disabled={values.options.length === 1} aria-label="Delete option">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        {error ? <span className="text-xs font-medium text-danger">{error}</span> : null}
      </div>
    </div>
  );
}

function CheckboxPropertyFields({
  values,
  onChange,
}: {
  values: PropertyFormValues;
  onChange: (values: Partial<PropertyFormValues>) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldShell label="Checkbox label">
        <Input value={values.checkboxLabel} onChange={(event) => onChange({ checkboxLabel: event.target.value })} placeholder="Visible checkbox label" />
      </FieldShell>
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          checked={values.checkboxDefault}
          onChange={(event) => onChange({ checkboxDefault: event.target.checked })}
        />
        Default value
      </label>
    </div>
  );
}

function TrackingCheckboxes({
  values,
  onChange,
}: {
  values: AssessmentFormValues;
  onChange: (values: Partial<AssessmentFormValues>) => void;
}) {
  return (
    <div className="rounded-md border border-border bg-surface-muted p-3">
      <div className="mb-3 text-sm font-medium text-foreground">Intake / Output tracking</div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            checked={values.trackInIntake}
            onChange={(event) => onChange({ trackInIntake: event.target.checked })}
          />
          Track in Intake?
        </label>
        <label className="flex items-center gap-2 text-sm font-medium text-foreground">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
            checked={values.trackInOutput}
            onChange={(event) => onChange({ trackInOutput: event.target.checked })}
          />
          Track in Output?
        </label>
      </div>
    </div>
  );
}

function NumberAssessmentFields({
  values,
  onChange,
}: {
  values: AssessmentFormValues;
  onChange: (values: Partial<AssessmentFormValues>) => void;
}) {
  return <TrackingCheckboxes values={values} onChange={onChange} />;
}

function DropdownAssessmentOptionsField({
  values,
  error,
  onChange,
}: {
  values: AssessmentFormValues;
  error?: string;
  onChange: (values: Partial<AssessmentFormValues>) => void;
}) {
  return <DropdownOptionsField values={values} error={error} onChange={onChange} />;
}

function CheckboxAssessmentFields({
  values,
  onChange,
}: {
  values: AssessmentFormValues;
  onChange: (values: Partial<AssessmentFormValues>) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldShell label="Checkbox label">
        <Input value={values.checkboxLabel} onChange={(event) => onChange({ checkboxLabel: event.target.value })} placeholder="Visible checkbox label" />
      </FieldShell>
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
          checked={values.checkboxDefault}
          onChange={(event) => onChange({ checkboxDefault: event.target.checked })}
        />
        Default value
      </label>
    </div>
  );
}

function DynamicAssessmentFields({
  values,
  errors,
  onChange,
}: {
  values: AssessmentFormValues;
  errors: FormErrors;
  onChange: (values: Partial<AssessmentFormValues>) => void;
}) {
  if (values.type === "Date") {
    return <SelectField label="Date format" value={values.dateFormat} options={dateFormats} onChange={(dateFormat) => onChange({ dateFormat })} />;
  }
  if (values.type === "Time") {
    return <SelectField label="Time format" value={values.timeFormat} options={timeFormats} onChange={(timeFormat) => onChange({ timeFormat })} />;
  }
  if (values.type === "Number") {
    return <NumberAssessmentFields values={values} onChange={onChange} />;
  }
  if (values.type === "Dropdown") {
    return <DropdownAssessmentOptionsField values={values} error={errors.options} onChange={onChange} />;
  }
  if (values.type === "Checkbox") {
    return <CheckboxAssessmentFields values={values} onChange={onChange} />;
  }
  return null;
}

function DynamicPropertyFields({
  values,
  errors,
  onChange,
}: {
  values: PropertyFormValues;
  errors: FormErrors;
  onChange: (values: Partial<PropertyFormValues>) => void;
}) {
  if (values.type === "Date") {
    return <SelectField label="Date format" value={values.dateFormat} options={dateFormats} onChange={(dateFormat) => onChange({ dateFormat })} />;
  }
  if (values.type === "Time") {
    return <SelectField label="Time format" value={values.timeFormat} options={timeFormats} onChange={(timeFormat) => onChange({ timeFormat })} />;
  }
  if (values.type === "Number") {
    return null;
  }
  if (values.type === "Dropdown") {
    return <DropdownOptionsField values={values} error={errors.options} onChange={onChange} />;
  }
  if (values.type === "Checkbox") {
    return <CheckboxPropertyFields values={values} onChange={onChange} />;
  }
  return null;
}

function LdtFormDrawer({
  state,
  records,
  onClose,
  onSave,
}: {
  state: LdtDrawerState | null;
  records: LdtRecord[];
  onClose: () => void;
  onSave: (values: LdtFormValues, editingId?: string) => void;
}) {
  const editingRecord = state?.type === "edit" ? state.record : null;
  const [activeSection, setActiveSection] = React.useState<LdtSection>(state?.activeSection ?? "properties");
  const [ldtName, setLdtName] = React.useState("");
  const [ldtFormType, setLdtFormType] = React.useState(ldtTypeOptions[0]);
  const [propertyRows, setPropertyRows] = React.useState<PropertyRowValues[]>([{ ...emptyPropertyForm, key: `property-${Date.now()}`, value: "" }]);
  const [assessmentRows, setAssessmentRows] = React.useState<AssessmentRowValues[]>([{ ...emptyAssessmentForm, key: `assessment-${Date.now()}`, value: "" }]);
  const [errors, setErrors] = React.useState<Partial<Record<"name" | "type" | "options", string>>>({});

  React.useEffect(() => {
    if (!state) return;

    const timeoutId = window.setTimeout(() => {
      setActiveSection(state.activeSection);

      if (editingRecord) {
        setLdtName(editingRecord.name);
        setLdtFormType(editingRecord.type || ldtTypeOptions[0]);

        const config = getLdtTypeConfig(ldtTypeToConfigId(editingRecord.type));

        setPropertyRows(
          toFieldRows(
            "properties",
            { name: editingRecord.name, type: editingRecord.type, properties: editingRecord.properties ?? {}, assessment: editingRecord.assessment ?? {}, nurseLocked: editingRecord.nurseLocked },
            config?.fields.filter((field) => field.group === "property") ?? [],
          ).map((row, index) => ({
            ...emptyPropertyForm,
            key: `property-${editingRecord.id}-${index}`,
            name: row.label,
            type: ldtFieldTypeToFormType(row.type),
            value: row.value,
          })),
        );

        setAssessmentRows(
          toFieldRows(
            "assessment",
            { name: editingRecord.name, type: editingRecord.type, properties: editingRecord.properties ?? {}, assessment: editingRecord.assessment ?? {}, nurseLocked: editingRecord.nurseLocked },
            config?.fields.filter((field) => field.group === "assessment") ?? [],
          ).map((row, index) => ({
            ...emptyAssessmentForm,
            key: `assessment-${editingRecord.id}-${index}`,
            name: row.label,
            type: ldtFieldTypeToFormType(row.type),
            value: row.value,
          })),
        );
      } else {
        setLdtName("");
        setLdtFormType(ldtTypeOptions[0]);
        setPropertyRows([{ ...emptyPropertyForm, key: `property-${Date.now()}`, value: "" }]);
        setAssessmentRows([{ ...emptyAssessmentForm, key: `assessment-${Date.now()}`, value: "" }]);
      }

      setErrors({});
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [editingRecord, state]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors: Partial<Record<"name" | "type" | "options", string>> = {};
    const name = ldtName.trim();

    if (!name) nextErrors.name = "Name is required.";
    if (records.some((record) => record.name.toLowerCase() === name.toLowerCase() && record.id !== editingRecord?.id)) {
      nextErrors.name = "LDT name already exists.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    onSave(
      {
        name,
        type: ldtFormType,
        properties: Object.fromEntries(propertyRows.map((row) => [row.name.trim(), row.value]).filter(([key]) => Boolean(key))),
        assessment: Object.fromEntries(assessmentRows.map((row) => [row.name.trim(), row.value]).filter(([key]) => Boolean(key))),
        nurseLocked: false,
      },
      editingRecord?.id,
    );
  };

  return (
    <MasterDialog
      open={Boolean(state)}
      onOpenChange={(open) => !open && onClose()}
      title={editingRecord ? "Edit LDT" : "Add LDT"}
      submitLabel={editingRecord ? "Save LDT" : "Add LDT"}
      onSubmit={() => {
        const form = document.getElementById("ldt-form") as HTMLFormElement | null;
        form?.requestSubmit();
      }}
    >
      <form id="ldt-form" className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm">
            <span className="font-medium text-foreground">LDT Name</span>
            <Input value={ldtName} onChange={(event) => setLdtName(event.target.value)} placeholder="Enter LDT Name" />
            {errors.name ? <span className="text-xs font-medium text-danger">{errors.name}</span> : null}
          </label>

          <label className="space-y-1 text-sm">
            <span className="font-medium text-foreground">LDT Type</span>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
              value={ldtFormType}
              onChange={(event) => setLdtFormType(event.target.value)}
            >
              {ldtTypeOptions.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant={activeSection === "properties" ? "default" : "outline"} onClick={() => setActiveSection("properties")} className="flex-1">
            <SlidersHorizontal className="h-4 w-4" />
            Properties
          </Button>
          <Button type="button" variant={activeSection === "assessment" ? "default" : "outline"} onClick={() => setActiveSection("assessment")} className="flex-1">
            <ListChecks className="h-4 w-4" />
            Assessment
          </Button>
        </div>

        {activeSection === "properties" ? (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setPropertyRows((current) => [...current, { ...emptyPropertyForm, key: `property-${Date.now()}-${current.length}`, value: "" }])}>
                <Plus className="h-4 w-4" />
                Add Property
              </Button>
            </div>

            <div className="space-y-3">
              {propertyRows.map((row, index) => (
                <div key={row.key} className="rounded-lg border border-border bg-background p-3">
                  <div className="grid gap-3 sm:grid-cols-[1.1fr_0.8fr_1.4fr_auto]">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-foreground">Property Name</span>
                      <Input value={row.name} onChange={(event) => setPropertyRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))} placeholder="Enter property name" />
                    </label>

                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-foreground">Type</span>
                      <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20" value={row.type} onChange={(event) => setPropertyRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, type: event.target.value as PropertyType } : item)))}>
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="min-w-0">
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Dynamic Field</span>
                      <DynamicPropertyFields values={row} errors={{}} onChange={(next) => setPropertyRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)))} />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button type="button" variant="outline" size="icon" onClick={() => setPropertyRows((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={propertyRows.length === 1} aria-label="Delete row">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAssessmentRows((current) => [...current, { ...emptyAssessmentForm, key: `assessment-${Date.now()}-${current.length}`, value: "" }])}>
                <Plus className="h-4 w-4" />
                Add Assessment
              </Button>
            </div>

            <div className="space-y-3">
              {assessmentRows.map((row, index) => (
                <div key={row.key} className="rounded-lg border border-border bg-background p-3">
                  <div className="grid gap-3 sm:grid-cols-[1.1fr_0.8fr_1.4fr_auto]">
                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-foreground">Assessment Field Name</span>
                      <Input value={row.name} onChange={(event) => setAssessmentRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, name: event.target.value } : item)))} placeholder="Enter assessment field name" />
                    </label>

                    <label className="space-y-1 text-sm">
                      <span className="font-medium text-foreground">Type</span>
                      <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20" value={row.type} onChange={(event) => setAssessmentRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, type: event.target.value as AssessmentFieldType } : item)))}>
                        {assessmentTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="min-w-0">
                      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">Dynamic Field</span>
                      <DynamicAssessmentFields values={row} errors={errors} onChange={(next) => setAssessmentRows((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...next } : item)))} />
                    </div>

                    <div className="flex items-end justify-end">
                      <Button type="button" variant="outline" size="icon" onClick={() => setAssessmentRows((current) => current.filter((_, itemIndex) => itemIndex !== index))} disabled={assessmentRows.length === 1} aria-label="Delete row">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </MasterDialog>
  );
}

export function LdtPage() {
  const [records, setRecords] = React.useState<LdtRecord[]>(initialLdtRecords);
  const [search, setSearch] = React.useState("");
  const [ldtType, setLdtType] = React.useState("All types");
  const [drawerState, setDrawerState] = React.useState<LdtDrawerState | null>(null);
  const [detailsState, setDetailsState] = React.useState<LdtDetailsDrawerState>(null);

  const filteredRecords = records.filter((record) => {
    const matchesSearch = `${record.name} ${record.type}`.toLowerCase().includes(search.trim().toLowerCase());
    const matchesType = ldtType === "All types" || record.type === ldtType;
    return matchesSearch && matchesType;
  });

  const handleSave = React.useCallback((values: LdtFormValues, editingId?: string) => {
    if (editingId) {
      setRecords((current) => current.map((record) => (record.id === editingId ? { ...record, ...values } : record)));
      toast.success("LDT updated");
    } else {
      setRecords((current) => [...current, { ...values, id: `ldt-${Date.now()}`, nurseLocked: false }]);
      toast.success("LDT added");
    }
    setDrawerState(null);
  }, []);

  const handleDelete = React.useCallback((record: LdtRecord, section: LdtSection, fieldKey: string) => {
    if (record.nurseLocked) {
      toast.error("This LDT was inserted from Nurse side and cannot be deleted.");
      return;
    }

    setRecords((current) =>
      current.map((item) => {
        if (item.id !== record.id) return item;
        const source = section === "properties" ? item.properties ?? {} : item.assessment ?? {};
        const nextSource = { ...source };
        delete nextSource[fieldKey];
        return section === "properties" ? { ...item, properties: nextSource } : { ...item, assessment: nextSource };
      }),
    );
    toast.success(`${fieldKey} deleted`);
  }, []);

  const handleRecordDelete = React.useCallback((record: LdtRecord) => {
    if (record.nurseLocked) {
      toast.error("This LDT was inserted from Nurse side and cannot be deleted.");
      return;
    }

    setRecords((current) => current.filter((item) => item.id !== record.id));
    toast.success(`${record.name} deleted`);
    setDetailsState((current) => (current?.record.id === record.id ? null : current));
  }, []);

  const columns = React.useMemo<ColumnDef<LdtRecord>[]>(
    () => [
      { header: "LDT Name", accessorKey: "name" },
      {
        header: "LDT Type",
        cell: ({ row }) => <span className="text-sm text-foreground">{row.original.type || "-"}</span>,
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const record = row.original;
          return (
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" type="button" onClick={() => setDetailsState({ type: "properties", record })}>
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Properties
              </Button>
              <Button size="sm" variant="outline" type="button" onClick={() => setDetailsState({ type: "assessment", record })}>
                <ListChecks className="h-3.5 w-3.5" />
                Assessment
              </Button>
              <Button size="sm" variant="outline" onClick={() => setDrawerState({ type: "edit", record, activeSection: "properties" })}>
                <Pencil className="h-3.5 w-3.5" />
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleRecordDelete(record)} disabled={record.nurseLocked} title={record.nurseLocked ? "This LDT was inserted from Nurse side and cannot be deleted." : "Delete"}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          );
        },
      },
    ],
    [handleRecordDelete],
  );

  return (
    <ProtectedAdmin allowed={["Hospital Admin", "Super Admin"]}>
      {({ readOnly }) => (
        <>
          <PageHeader title="LDT" className="static mx-0 border-b bg-transparent px-0 py-2" actions={null} />
          <AdminSection title="LDT">
            <div className="space-y-4">
              <FilterBar search={search} onSearch={setSearch} placeholder="Search LDT name or type...">
                <label className="flex min-w-[160px] items-center gap-2 text-xs text-muted-foreground">
                  <span className="sr-only">LDT Type</span>
                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20" value={ldtType} onChange={(event) => setLdtType(event.target.value)}>
                    <option value="All types">All types</option>
                    {ldtTypeOptions.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
                <Button disabled={readOnly} onClick={() => setDrawerState({ type: "add", activeSection: "properties" })}>
                  <Plus className="h-4 w-4" />
                  Add LDT
                </Button>
              </FilterBar>
              <DataTable data={filteredRecords} columns={columns} />
            </div>
          </AdminSection>

          <LdtFormDrawer state={drawerState} records={records} onClose={() => setDrawerState(null)} onSave={handleSave} />
          <LdtDetailsDrawer state={detailsState} onClose={() => setDetailsState(null)} onDelete={handleDelete} />
        </>
      )}
    </ProtectedAdmin>
  );
}
