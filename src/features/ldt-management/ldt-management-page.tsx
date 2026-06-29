"use client";

import * as React from "react";
import Link from "next/link";
import { ClipboardList, Search, ScanLine, SlidersHorizontal, Trash2, UserRound } from "lucide-react";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";

import { useRole } from "@/components/providers/role-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Drawer } from "@/components/ui/drawer";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { DataTable } from "@/components/ui/data-table";
import type { Role } from "@/types";



type LdtType = "Line" | "Tube" | "Drain";
type FieldType = "Free text" | "Date" | "Time" | "Number" | "Dropdown" | "Checkbox";
type SelectionMode = "Single" | "Multi";

type FieldConfig = {
  dateFormat?: string;
  timeFormat?: string;
  decimalPlaces?: number;
  min?: number;
  max?: number;
  unit?: string;
  options?: string[];
  selectionMode?: SelectionMode;
  checkboxLabel?: string;
  checkboxDefault?: boolean;
};

type LdtOption = {
  id: string;
  name: string;
  type: LdtType;
};

type LdtField = {
  id: string;
  name: string;
  type: FieldType;
  config: FieldConfig;
};

type AddedLdt = LdtOption;
type FieldValue = string | boolean;
type PropertyValuesByLdt = Record<string, Record<string, FieldValue>>;
type ScannableLdtItem = {
  barcode: string;
  ldtId: string;
  itemName: string;
  propertyValues: Record<string, FieldValue>;
};

type LdtRow = AddedLdt & {
  priority: string;
  orderedBy: string;
  status: "Active" | "Pending" | "On Hold";
};

const nurseRoles: Role[] = ["Nurse", "Super Admin", "Hospital Admin"];

const ldtOptions: LdtOption[] = [
  { id: "ldt-001", name: "PICC double lumen", type: "Line" },
  { id: "ldt-002", name: "Naso gastric tube", type: "Tube" },
  { id: "ldt-003", name: "Intercoastal drain", type: "Drain" },
];

const scannableLdtItems: ScannableLdtItem[] = [
  {
    barcode: "LDT-PICC-1001",
    ldtId: "ldt-001",
    itemName: "PICC double lumen kit",
    propertyValues: {
      "prop-001": "PICC-1001",
      "prop-002": "2026-05-26",
      "prop-003": "Basilic",
    },
  },
  {
    barcode: "LDT-NGT-2001",
    ldtId: "ldt-002",
    itemName: "Naso gastric tube 12 Fr",
    propertyValues: {
      "prop-004": "12",
      "prop-005": "10:30",
      "prop-006": true,
    },
  },
  {
    barcode: "LDT-ICD-3001",
    ldtId: "ldt-003",
    itemName: "Intercoastal drain 28 Fr",
    propertyValues: {
      "prop-007": "Right chest",
      "prop-008": "28",
      "prop-009": true,
    },
  },
];

const propertyFieldsByLdt: Record<string, LdtField[]> = {
  "ldt-001": [
    { id: "prop-001", name: "LDT Number", type: "Free text", config: {} },
    { id: "prop-002", name: "Placement date", type: "Date", config: { dateFormat: "DD/MM/YYYY" } },
    { id: "prop-003", name: "Location of insertion", type: "Dropdown", config: { options: ["Basilic", "Brachial", "Femoral"], selectionMode: "Single" } },
  ],
  "ldt-002": [
    { id: "prop-004", name: "Tube Size", type: "Number", config: { decimalPlaces: 0, min: 6, max: 18, unit: "Fr" } },
    { id: "prop-005", name: "Insertion Time", type: "Time", config: { timeFormat: "24 hour" } },
    { id: "prop-006", name: "Secured", type: "Checkbox", config: { checkboxLabel: "Tube secured", checkboxDefault: true } },
  ],
  "ldt-003": [
    { id: "prop-007", name: "Drain Site", type: "Dropdown", config: { options: ["Left chest", "Right chest"], selectionMode: "Single" } },
    { id: "prop-008", name: "Drain Size", type: "Number", config: { decimalPlaces: 0, min: 8, max: 36, unit: "Fr" } },
    { id: "prop-009", name: "Underwater Seal", type: "Checkbox", config: { checkboxLabel: "Seal attached", checkboxDefault: false } },
  ],
};

function DynamicInput({ field, value, onChange }: { field: LdtField; value?: FieldValue; onChange: (value: FieldValue) => void }) {
  if (field.type === "Date") return <Input type="date" value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === "Time") return <Input type="time" value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />;
  if (field.type === "Number") {
    return (
      <div className="flex gap-2">
        <Input
          type="number"
          min={field.config.min}
          max={field.config.max}
          step={field.config.decimalPlaces ? 1 / 10 ** field.config.decimalPlaces : 1}
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
        />
        {field.config.unit ? <div className="flex h-9 min-w-12 items-center justify-center rounded-md border border-border bg-surface-muted px-3 text-sm font-medium text-muted-foreground">{field.config.unit}</div> : null}
      </div>
    );
  }
  if (field.type === "Dropdown") {
    return (
      <select
        multiple={field.config.selectionMode === "Multi"}
        className="min-h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20"
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">Select</option>
        {field.config.options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }
  if (field.type === "Checkbox") {
    return (
      <label className="flex h-9 items-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-medium text-foreground">
        <input
          type="checkbox"
          checked={typeof value === "boolean" ? value : Boolean(field.config.checkboxDefault)}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 rounded border-input text-primary focus:ring-ring"
        />
        {field.config.checkboxLabel ?? field.name}
      </label>
    );
  }
  return <Input placeholder={`Enter ${field.name.toLowerCase()}`} value={typeof value === "string" ? value : ""} onChange={(event) => onChange(event.target.value)} />;
}

function PropertiesDrawer({
  ldt,
  open,
  onOpenChange,
  values,
  barcode,
  onBarcodeChange,
  onBarcodeScan,
  onValuesChange,
}: {
  ldt: AddedLdt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  values: Record<string, FieldValue>;
  barcode: string;
  onBarcodeChange: (value: string) => void;
  onBarcodeScan: () => void;
  onValuesChange: (ldtId: string, fieldId: string, value: FieldValue) => void;
}) {
  const fields = ldt ? propertyFieldsByLdt[ldt.id] ?? [] : [];

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      title={ldt ? `${ldt.name} Properties` : "LDT Properties"}
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast.success("LDT properties saved");
              onOpenChange(false);
            }}
          >
            Save Properties
          </Button>
        </div>
      }
    >
      <div className="grid gap-4">
        <form
          className="rounded-md border border-border bg-surface-muted p-3"
          onSubmit={(event) => {
            event.preventDefault();
            onBarcodeScan();
          }}
        >
          <div className="mb-2 text-sm font-semibold text-foreground">Scan Barcode</div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <ScanLine className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" value={barcode} onChange={(event) => onBarcodeChange(event.target.value)} placeholder="Scan or enter barcode" aria-label="Scan or enter barcode" />
            </div>
            <Button type="submit" variant="outline" className="sm:w-auto">
              <ScanLine className="h-4 w-4" />
              Scan
            </Button>
          </div>

        </form>
        {fields.map((field) => (
          <label key={field.id} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-muted-foreground">{field.name}</span>
              {/* <Badge tone="muted">{field.type}</Badge> */}
            </div>
            <DynamicInput field={field} value={values[field.id]} onChange={(value) => ldt && onValuesChange(ldt.id, field.id, value)} />
          </label>
        ))}
      </div>
    </Drawer>
  );
}

function LdtManagementWorkspace() {
  const [deletedLdtIds, setDeletedLdtIds] = React.useState<string[]>([]);
  const [propertiesLdt, setPropertiesLdt] = React.useState<AddedLdt | null>(null);
  const [barcode, setBarcode] = React.useState("");
  const [propertyValuesByLdt, setPropertyValuesByLdt] = React.useState<PropertyValuesByLdt>({});
  const [search, setSearch] = React.useState("");

  const visibleLdts = React.useMemo<LdtRow[]>(() => {
    const query = search.trim().toLowerCase();
    return ldtOptions
      .filter((ldt) => !deletedLdtIds.includes(ldt.id))
      .map((ldt) => ({
        ...ldt,
        priority: ldt.type === "Drain" ? "High" : ldt.type === "Tube" ? "Medium" : "Low",
        orderedBy: ldt.type === "Line" ? "Dr. Sharma" : ldt.type === "Tube" ? "Dr. Patel" : "Dr. Khan",
        status: ldt.type === "Line" ? "Active" : ldt.type === "Tube" ? "Pending" : "On Hold",
      }))
      .filter((ldt) => {
        if (!query) return true;
        return [ldt.name, ldt.type, ldt.priority, ldt.orderedBy, ldt.status].some((value) => value.toLowerCase().includes(query));
      });
  }, [deletedLdtIds, search]);

  const handleDelete = React.useCallback((ldt: AddedLdt) => {
    setDeletedLdtIds((current) => (current.includes(ldt.id) ? current : [...current, ldt.id]));
    setPropertiesLdt((current) => (current?.id === ldt.id ? null : current));
    setPropertyValuesByLdt((current) => {
      const remaining = { ...current };
      delete remaining[ldt.id];
      return remaining;
    });
    toast.success(`${ldt.name} deleted`);
  }, []);

  const columns = React.useMemo<ColumnDef<LdtRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "LDT Type",
        cell: ({ row }) => <div className="font-medium text-foreground">{row.original.name}</div>,
      },
      {
        accessorKey: "type",
        header: "LDT Type",
        cell: ({ row }) => <Badge tone={row.original.type === "Line" ? "success" : row.original.type === "Drain" ? "warning" : "info"}>{row.original.type}</Badge>,
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => <Badge tone={row.original.priority === "High" ? "danger" : row.original.priority === "Medium" ? "warning" : "muted"}>{row.original.priority}</Badge>,
      },
      {
        accessorKey: "orderedBy",
        header: "Ordered By",
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <Badge tone={row.original.status === "Active" ? "success" : row.original.status === "Pending" ? "warning" : "muted"}>{row.original.status}</Badge>,
      },
      {
        id: "actions",
        header: "Action",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={() => setPropertiesLdt(row.original)}>
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Properties
            </Button>
            <Button size="sm" variant="outline" asChild>
              <Link href={`/nurse/ldt-management/assessment?ldtId=${row.original.id}`}>
                <ClipboardList className="h-3.5 w-3.5" />
                Assessment
              </Link>
            </Button>
            {/* <Button size="sm" variant="danger" onClick={() => handleDelete(row.original)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button> */}
          </div>
        ),
      },
    ],
    [handleDelete],
  );

  const handleBarcodeScan = () => {
    const normalizedBarcode = barcode.trim().toUpperCase();
    const scannedItem = scannableLdtItems.find((item) => item.barcode.toUpperCase() === normalizedBarcode);

    if (!propertiesLdt) {
      toast.error("Open Properties first");
      return;
    }
    if (!normalizedBarcode) {
      toast.error("Scan or enter barcode first");
      return;
    }
    if (!scannedItem) {
      toast.error("No LDT item found for this barcode");
      return;
    }
    if (scannedItem.ldtId !== propertiesLdt.id) {
      const matchedLdt = ldtOptions.find((option) => option.id === scannedItem.ldtId);
      toast.error(`This barcode belongs to ${matchedLdt?.name ?? "another LDT"}`);
      return;
    }

    setPropertyValuesByLdt((current) => ({
      ...current,
      [propertiesLdt.id]: {
        ...current[propertiesLdt.id],
        ...scannedItem.propertyValues,
      },
    }));
    setBarcode("");
    toast.success(`${scannedItem.itemName} scanned and properties loaded`);
  };

  const handlePropertyValueChange = (ldtId: string, fieldId: string, value: FieldValue) => {
    setPropertyValuesByLdt((current) => ({
      ...current,
      [ldtId]: {
        ...current[ldtId],
        [fieldId]: value,
      },
    }));
  };

  return (
    <>
      <Card>
       
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search LDT records" value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
          </div>
          <DataTable columns={columns} data={visibleLdts} />
        </CardContent>
      </Card>

      <PropertiesDrawer
        ldt={propertiesLdt}
        open={Boolean(propertiesLdt)}
        onOpenChange={(open) => !open && setPropertiesLdt(null)}
        values={propertiesLdt ? propertyValuesByLdt[propertiesLdt.id] ?? {} : {}}
        barcode={barcode}
        onBarcodeChange={setBarcode}
        onBarcodeScan={handleBarcodeScan}
        onValuesChange={handlePropertyValueChange}
      />
    </>
  );
}

export function LdtManagementPage() {
  const { role } = useRole();
  const allowed = nurseRoles.includes(role);

  if (!allowed) {
    return <EmptyState icon={UserRound} title="Nurse access required" description="Switch to Nurse role to open LDT management." />;
  }

  return (
    <div className="space-y-6">
      <LdtManagementWorkspace />
    </div>
  );
}








