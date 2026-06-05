"use client";

import * as React from "react";
import { AlertTriangle, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  diluents,
  doseUnits,
  durationUnits,
  frequencies,
  infusionTimeUnits,
  instructions,
  pharmacies,
  sites,
  timeUnits,
} from "./data";
import type { DoseUnit, DraftCategory, OrderDraft, TaperDose } from "./types";
import { isContinuousFluid, isFormADrug, isInjectionForm, isIvRoute, routeOptionsForForm } from "./utils";

export function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-xs font-medium text-muted-foreground">{children}</span>;
}

export function SelectField<T extends string>({ value, options, onChange, disabled }: { value: T; options: T[]; onChange: (value: T) => void; disabled?: boolean }) {
  return (
    <select
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring/20 disabled:bg-surface-muted disabled:text-muted-foreground"
      value={value}
      disabled={disabled}
      onChange={(event) => onChange(event.target.value as T)}
    >
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function NumberInput(props: React.ComponentProps<typeof Input>) {
  return <Input {...props} inputMode="decimal" pattern="[0-9]*[.]?[0-9]*" />;
}

function ToggleButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className={[
        "h-9 rounded-md border px-3 text-sm font-medium transition",
        active ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground hover:bg-surface-muted",
      ].join(" ")}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function CategoryRadio({
  checked,
  label,
  name,
  onChange,
}: {
  checked: boolean;
  label: string;
  name: string;
  onChange: () => void;
}) {
  return (
    <label
      className={[
        "flex min-h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium transition",
        checked ? "border-primary bg-primary/10 text-foreground" : "border-border bg-background text-muted-foreground",
        "cursor-pointer hover:bg-surface-muted",
      ].join(" ")}
    >
      <input
        type="radio"
        name={name}
        className="h-4 w-4 rounded border-input accent-primary"
        checked={checked}
        onChange={onChange}
      />
      {label}
    </label>
  );
}

const createTaperDose = (frequency = "", unit: DoseUnit = ""): TaperDose => ({
  id: `taper-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  dose: "",
  unit,
  frequency,
  fromDate: "",
  toDate: "",
});

function useDraftWarnings(draft: OrderDraft) {
  const dose = Number(draft.dosage);
  const maxDose = Number(draft.maxDosage);
  const frequencyMultiplier = draft.frequency === "QID" ? 4 : draft.frequency === "TID" ? 3 : draft.frequency === "BID" ? 2 : 1;
  const exceedsMaxDose = draft.sos && Number.isFinite(dose) && Number.isFinite(maxDose) && maxDose > 0 && dose * frequencyMultiplier > maxDose;
  const needsDiluent = isIvRoute(draft.route) && !draft.diluent;
  const invalidTime = Boolean(draft.startDate && draft.endDate && draft.startTime && draft.endTime && `${draft.endDate}T${draft.endTime}` <= `${draft.startDate}T${draft.startTime}`);
  const needsWeight = draft.continuous && (draft.rateKg || draft.bolusKg);

  return { exceedsMaxDose, needsDiluent, invalidTime, needsWeight };
}

export function DrugDraftFields({
  draft,
  flash,
  onChange,
}: {
  draft: OrderDraft;
  flash: boolean;
  onChange: (values: Partial<OrderDraft>) => void;
}) {
  const today = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  }, []);
  const instructionListId = React.useId();
  const categoryRadioName = React.useId();
  const endDateMin = draft.startDate || today;
  const routeOptions = routeOptionsForForm(draft.form, draft.continuous, draft.intermittent);
  const ivRoute = isIvRoute(draft.route);
  const injection = isInjectionForm(draft.form);
  const infusion = ivRoute && (draft.intermittent || draft.continuous);
  const continuous = draft.continuous || isContinuousFluid(draft.form);
  const formA = isFormADrug(draft.form);
  const showStandaloneDosage = !infusion;
  const showFrequency = !continuous && !draft.stat && !draft.bolus;
  const showDays = !continuous && !draft.stat && !draft.bolus;
  const showSite = injection && !infusion;
  const showRate = infusion || continuous;
  const showDiluent = ivRoute || draft.category === "Diluent";
  const taperDoses = draft.taperDoses.length ? draft.taperDoses : [createTaperDose(draft.frequency, draft.doseUnit)];
  const warnings = useDraftWarnings(draft);
  const categoryOptions: DraftCategory[] = formA ? ["SOS", "STAT"] : ["SOS", "STAT", "Bolus", "Diluent", "Intermittent", "Continuous"];

  const selectCategory = (category: DraftCategory) => {
    if (category === "SOS") {
      onChange({ category: "SOS", sos: true, stat: false, bolus: false, intermittent: false, continuous: false });
      return;
    }
    if (category === "STAT") {
      onChange({ category: "STAT", stat: true, sos: false, bolus: false, intermittent: false, continuous: false });
      return;
    }
    if (category === "Bolus") {
      onChange({ category: "Bolus", bolus: true, sos: false, stat: false, intermittent: false, continuous: false });
      return;
    }
    if (category === "Intermittent") {
      onChange({ category: "Intermittent", intermittent: true, continuous: false, sos: false, stat: false, bolus: false });
      return;
    }
    if (category === "Continuous") {
      onChange({ category: "Continuous", continuous: true, intermittent: false, sos: false, stat: false, bolus: false });
      return;
    }

    onChange({ category, sos: false, stat: false, bolus: false, intermittent: false, continuous: false });
  };

  const updateTaperDose = (id: string, values: Partial<TaperDose>) => {
    const currentRows = draft.taperDoses.length ? draft.taperDoses : taperDoses;
    onChange({ taperDoses: currentRows.map((row) => (row.id === id ? { ...row, ...values } : row)) });
  };

  const addTaperDose = () => {
    onChange({ taperDoses: [...taperDoses, createTaperDose(draft.frequency, draft.doseUnit)] });
  };

  const removeTaperDose = (id: string) => {
    const nextRows = taperDoses.filter((row) => row.id !== id);
    onChange({ taperDoses: nextRows.length ? nextRows : [createTaperDose(draft.frequency, draft.doseUnit)] });
  };

  return (
    <div className="space-y-4">
      {draft.hasContraindication ? (
        <div className="flex items-center gap-2 rounded-md border border-danger bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
          <AlertTriangle className="h-4 w-4" />
          Contraindication alert acknowledged for this order.
        </div>
      ) : null}

      {/* <div className="rounded-md border border-border bg-surface-muted p-3">
        <div className="text-sm font-semibold text-foreground">{draft.name}</div>
        <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span>{draft.genericName}</span>
          <span>{order.name}</span>
          <span>{draft.form || order.form}</span>
          <span>Available: {order.availableQty}</span>
          <span>{order.pharmacy}</span>
        </div>
      </div> */}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_180px]">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <FieldLabel>Route</FieldLabel>
            <SelectField value={draft.route} options={routeOptions} disabled={infusion || continuous} onChange={(route) => onChange({ route })} />
          </label>
          {showFrequency ? (
            <label className="space-y-2">
              <FieldLabel>Frequency</FieldLabel>
              <SelectField value={draft.frequency} options={frequencies} onChange={(frequency) => onChange({ frequency })} />
            </label>
          ) : null}
          {showStandaloneDosage ? (
            <label className="space-y-2">
              <FieldLabel>Dosage</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-2">
                <NumberInput value={draft.dosage} onChange={(event) => onChange({ dosage: event.target.value })} />
                <SelectField value={draft.doseUnit} options={doseUnits} onChange={(doseUnit) => onChange({ doseUnit })} />
              </div>
            </label>
          ) : null}
          {showDays ? (
            <label className="space-y-2">
              <FieldLabel>No. of Days</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-2">
                <NumberInput type="number" min={0} value={draft.days} onChange={(event) => onChange({ days: event.target.value })} />
                <SelectField value={draft.dayUnit} options={durationUnits} onChange={(dayUnit) => onChange({ dayUnit })} />
              </div>
            </label>
          ) : null}
          {showSite ? (
            <label className="space-y-2">
              <FieldLabel>Site</FieldLabel>
              <SelectField value={draft.site} options={sites} onChange={(site) => onChange({ site })} />
            </label>
          ) : null}
          {showDiluent ? (
            <label className="space-y-2">
              <FieldLabel>Diluent</FieldLabel>
              <SelectField value={draft.diluent} options={diluents} onChange={(diluent) => onChange({ diluent })} />
              {warnings.needsDiluent ? <span className="text-xs font-medium text-danger">Diluent is required for IV route.</span> : null}
            </label>
          ) : null}
          <label className="space-y-2">
            <FieldLabel>Pharmacy</FieldLabel>
            <SelectField value={draft.pharmacy} options={pharmacies} onChange={(pharmacy) => onChange({ pharmacy })} />
          </label>
          {draft.sos ? (
            <label className="space-y-2">
              <FieldLabel>Max Dose/Day</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-2">
                <NumberInput value={draft.maxDosage} onChange={(event) => onChange({ maxDosage: event.target.value })} />
                <SelectField value={draft.maxDoseUnit} options={doseUnits} onChange={(maxDoseUnit) => onChange({ maxDoseUnit })} />
              </div>
              {warnings.exceedsMaxDose ? <span className="text-xs font-medium text-danger">Dose exceeds max dose/day.</span> : null}
            </label>
          ) : null}
          {showRate ? (
            <label className="space-y-2">
              <FieldLabel>Rate</FieldLabel>
              <div className="grid grid-cols-[minmax(0,1fr)_95px_95px] gap-2">
                <NumberInput value={draft.rateDose} onChange={(event) => onChange({ rateDose: event.target.value })} />
                <SelectField value={draft.rateUnit} options={doseUnits} onChange={(rateUnit) => onChange({ rateUnit })} />
                <SelectField value={draft.rateTimeUnit} options={infusionTimeUnits} onChange={(rateTimeUnit) => onChange({ rateTimeUnit })} />
              </div>
            </label>
          ) : null}
          {continuous ? (
            <div className="space-y-2">
              <FieldLabel>Rate /kg</FieldLabel>
              <ToggleButton active={draft.rateKg} label="/kg" onClick={() => onChange({ rateKg: !draft.rateKg })} />
            </div>
          ) : null}
          {showRate ? (
            <>
              <label className="space-y-2">
                <FieldLabel>Total Dose</FieldLabel>
                <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-2">
                  <NumberInput value={draft.totalDose} onChange={(event) => onChange({ totalDose: event.target.value })} />
                  <SelectField value={draft.totalDoseUnit} options={doseUnits} onChange={(totalDoseUnit) => onChange({ totalDoseUnit })} />
                </div>
              </label>
              <label className="space-y-2">
                <FieldLabel>Total Duration</FieldLabel>
                <div className="grid grid-cols-[minmax(0,1fr)_105px] gap-2">
                  <NumberInput value={draft.totalDuration} onChange={(event) => onChange({ totalDuration: event.target.value })} />
                  <SelectField value={draft.totalDurationUnit} options={timeUnits} onChange={(totalDurationUnit) => onChange({ totalDurationUnit })} />
                </div>
              </label>
            </>
          ) : null}
          <label className="space-y-2">
            <FieldLabel>Start Date</FieldLabel>
            <Input type="date" min={today} value={draft.startDate} onChange={(event) => onChange({ startDate: event.target.value })} />
          </label>
          {showRate ? (
            <label className="space-y-2">
              <FieldLabel>Start Time</FieldLabel>
              <Input type="time" value={draft.startTime} onChange={(event) => onChange({ startTime: event.target.value })} />
            </label>
          ) : null}
          <label className="space-y-2">
            <FieldLabel>End Date</FieldLabel>
            <Input type="date" min={endDateMin} value={draft.endDate} onChange={(event) => onChange({ endDate: event.target.value })} />
          </label>
          {showRate ? (
            <label className="space-y-2">
              <FieldLabel>End Time</FieldLabel>
              <Input type="time" value={draft.endTime} onChange={(event) => onChange({ endTime: event.target.value })} />
              {warnings.invalidTime ? <span className="text-xs font-medium text-danger">Start time must be before end time.</span> : null}
            </label>
          ) : null}
          <label className="space-y-2">
            <FieldLabel>Tot quantity</FieldLabel>
            <Input
              type="number"
              min={0}
              readOnly
              className={flash ? "border-success bg-success/10 font-semibold ring-2 ring-success/20 transition" : "bg-surface-muted font-semibold transition"}
              value={draft.orderedQty}
            />
          </label>
          <label className="space-y-2 sm:col-span-2">
            <FieldLabel>Instructions</FieldLabel>
            <Input list={instructionListId} value={draft.instructions} onChange={(event) => onChange({ instructions: event.target.value })} />
            <datalist id={instructionListId}>
              {instructions.map((instruction) => (
                <option key={instruction} value={instruction} />
              ))}
            </datalist>
          </label>
        </div>

        <div className="space-y-2">
          <FieldLabel>Category</FieldLabel>
          <div className="grid gap-2">
            {categoryOptions.map((category) => (
              <CategoryRadio
                key={category}
                checked={draft.category === category}
                label={category}
                name={categoryRadioName}
                onChange={() => selectCategory(category)}
              />
            ))}
          </div>
        </div>
      </div>

      {draft.bolus ? (
        <div className="grid gap-4 rounded-md border border-border bg-surface-muted p-3 md:grid-cols-3">
          <label className="space-y-2">
            <FieldLabel>Bolus Dose</FieldLabel>
            <div className="grid grid-cols-[1fr_120px] gap-2">
              <NumberInput value={draft.bolusDose} onChange={(event) => onChange({ bolusDose: event.target.value })} />
              <SelectField value={draft.bolusUnit} options={doseUnits} onChange={(bolusUnit) => onChange({ bolusUnit })} />
            </div>
          </label>
          {continuous ? (
            <div className="space-y-2">
              <FieldLabel>Bolus /kg</FieldLabel>
              <ToggleButton active={draft.bolusKg} label="/kg" onClick={() => onChange({ bolusKg: !draft.bolusKg })} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="grid gap-4 rounded-md border border-border bg-surface-muted p-3 md:grid-cols-4">
        <label className="space-y-2">
          <FieldLabel>Dosage Cal Dose</FieldLabel>
          <NumberInput value={draft.dosageCalcDose} onChange={(event) => onChange({ dosageCalcDose: event.target.value })} />
        </label>
        <label className="space-y-2">
          <FieldLabel>Unit</FieldLabel>
          <SelectField value={draft.dosageCalcUnit} options={doseUnits} onChange={(dosageCalcUnit) => onChange({ dosageCalcUnit })} />
        </label>
        <label className="space-y-2">
          <FieldLabel>Per Time Unit</FieldLabel>
          <SelectField value={draft.dosageCalcTimeUnit} options={timeUnits} onChange={(dosageCalcTimeUnit) => onChange({ dosageCalcTimeUnit })} />
        </label>
        <div className="space-y-2">
          <FieldLabel>Calculation</FieldLabel>
          <div className="flex gap-2">
            <ToggleButton active={draft.dosageCalcKg} label="/kg" onClick={() => onChange({ dosageCalcKg: !draft.dosageCalcKg })} />
            <ToggleButton active={draft.dosageCalcFreq} label="Freq" onClick={() => onChange({ dosageCalcFreq: !draft.dosageCalcFreq })} />
          </div>
          {warnings.needsWeight ? <span className="text-xs font-medium text-danger">Patient weight not recorded - please update vitals.</span> : null}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <FieldLabel>Taper Dose</FieldLabel>
          <Button type="button" size="icon" variant="outline" onClick={addTaperDose} aria-label="Add taper dose">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {taperDoses.map((row) => (
            <div key={row.id} className="grid gap-2 rounded-md border border-border bg-surface-muted p-2 sm:grid-cols-[1fr_110px_150px_1fr_1fr_40px]">
              <NumberInput value={row.dose} onChange={(event) => updateTaperDose(row.id, { dose: event.target.value })} placeholder="Dose" />
              <SelectField value={row.unit} options={doseUnits} onChange={(unit) => updateTaperDose(row.id, { unit })} />
              <SelectField value={row.frequency} options={frequencies} onChange={(frequency) => updateTaperDose(row.id, { frequency })} />
              <Input type="date" value={row.fromDate} min={today} onChange={(event) => updateTaperDose(row.id, { fromDate: event.target.value })} aria-label="From date" />
              <Input type="date" value={row.toDate} min={row.fromDate || today} onChange={(event) => updateTaperDose(row.id, { toDate: event.target.value })} aria-label="To date" />
              <Button type="button" size="icon" variant="ghost" onClick={() => removeTaperDose(row.id)} aria-label="Remove taper dose">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
