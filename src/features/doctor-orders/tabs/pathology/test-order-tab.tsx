"use client";

import * as React from "react";
import { Search, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { groupedTests, priorities, specimenSources, testList, visitProblems } from "./data";
import type { PathologyIndicationType, PathologyPriority, PathologyOrderHistory, PathologyRequestType, PathologySex, PathologyTest } from "./types";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className="text-[11px] font-semibold uppercase tracking-[0.04em] text-muted-foreground">{children}</div>;
}

function CheckboxRow({ label, checked, indent = false, onToggle }: { label: string; checked?: boolean; indent?: boolean; onToggle?: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={["flex w-full items-center gap-2 border-b border-border/60 py-2 text-left text-sm last:border-0", indent ? "pl-5 text-xs text-muted-foreground" : "text-foreground"].join(" ")}
    >
      <span className={["flex h-4 w-4 shrink-0 items-center justify-center rounded-[3px] border", checked ? "border-primary bg-primary" : "border-border bg-white"].join(" ")}>
        {checked ? <span className="h-1.5 w-1.5 rounded-[1px] bg-white" /> : null}
      </span>
      <span className="min-w-0 truncate">{label}</span>
    </button>
  );
}

function SelectField({ value, onChange, options }: { value: PathologyPriority; onChange: (value: PathologyPriority) => void; options: PathologyPriority[] }) {
  return (
    <select
      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-border focus:ring-0"
      value={value}
      onChange={(event) => onChange(event.target.value as PathologyPriority)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

export function PathologyTestOrderTab({
  search,
  onSearchChange,
  filteredTests,
  selectedTestIds,
  selectedGroupIds,
  patientName = "",
  onPatientNameChange = () => {},
  uhid = "",
  onUhidChange = () => {},
  admissionNo = "",
  onAdmissionNoChange = () => {},
  age = "",
  onAgeChange = () => {},
  sex = "Female",
  onSexChange = () => {},
  wardBedNo = "",
  onWardBedNoChange = () => {},
  consultant = "",
  onConsultantChange = () => {},
  requestingDoctor = "",
  onRequestingDoctorChange = () => {},
  clinicalDiagnosis = "",
  onClinicalDiagnosisChange = () => {},
  indicationType = "Therapeutic",
  onIndicationTypeChange = () => {},
  surgicalProcedure = "",
  onSurgicalProcedureChange = () => {},
  previousTransfusion = "No",
  onPreviousTransfusionChange = () => {},
  previousTransfusionDetails = "",
  onPreviousTransfusionDetailsChange = () => {},
  previousReaction = "No",
  onPreviousReactionChange = () => {},
  previousReactionDetails = "",
  onPreviousReactionDetailsChange = () => {},
  pregnancies = "N/A",
  onPregnanciesChange = () => {},
  miscarriage = "",
  onMiscarriageChange = () => {},
  stillBirth = "",
  onStillBirthChange = () => {},
  erythroblastosis = "",
  onErythroblastosisChange = () => {},
  antibodiesDetected = "No",
  onAntibodiesDetectedChange = () => {},
  antibodyNames = "",
  onAntibodyNamesChange = () => {},
  patientBloodGroup = "",
  onPatientBloodGroupChange = () => {},
  patientRh = "",
  onPatientRhChange = () => {},
  groupScreenDate = "",
  onGroupScreenDateChange = () => {},
  wbc = "",
  onWbcChange = () => {},
  rbc = "",
  onRbcChange = () => {},
  hb = "",
  onHbChange = () => {},
  pcv = "",
  onPcvChange = () => {},
  platelets = "",
  onPlateletsChange = () => {},
  pt = "",
  onPtChange = () => {},
  ptt = "",
  onPttChange = () => {},
  otherLabs = "",
  onOtherLabsChange = () => {},
  requestType = "Routine",
  onRequestTypeChange = () => {},
  requiredDate = "",
  onRequiredDateChange = () => {},
  requiredTime = "",
  onRequiredTimeChange = () => {},
  natureOfEmergency = "",
  onNatureOfEmergencyChange = () => {},
  consentExplained = true,
  onConsentExplainedChange = () => {},
  doctorSignature = "",
  onDoctorSignatureChange = () => {},
  consentText = "",
  onConsentTextChange = () => {},
  errors = [],
  problems,
  newProblem,
  onNewProblemChange,
  problemListVisible,
  activeProblemView,
  onProblemListVisibleChange,
  onActiveProblemViewChange,
  onAddProblem,
  onToggleTest,
  onToggleGroup,
  specimenSourceById,
  onSpecimenSourceChange,
  priority,
  onPriorityChange,
  fasting,
  onFastingChange,
  clinicalNotes,
  onClinicalNotesChange,
  instructionsForLab,
  onInstructionsForLabChange,
  collectionDate,
  onCollectionDateChange,
  collectionTime,
  onCollectionTimeChange,
  onOpenSummary,
  onSave,
  onSaveAndBill,
  onAddToBill,
  onReorderPrevious,
  onDownloadAllReports,
}: {
  search: string;
  onSearchChange: (value: string) => void;
  filteredTests: PathologyTest[];
  selectedTestIds: string[];
  selectedGroupIds: string[];
   patientName?: string;
   onPatientNameChange?: (value: string) => void;
   uhid?: string;
   onUhidChange?: (value: string) => void;
   admissionNo?: string;
   onAdmissionNoChange?: (value: string) => void;
   age?: string;
   onAgeChange?: (value: string) => void;
   sex?: PathologySex;
   onSexChange?: (value: PathologySex) => void;
   wardBedNo?: string;
   onWardBedNoChange?: (value: string) => void;
   consultant?: string;
   onConsultantChange?: (value: string) => void;
   requestingDoctor?: string;
   onRequestingDoctorChange?: (value: string) => void;
   clinicalDiagnosis?: string;
   onClinicalDiagnosisChange?: (value: string) => void;
   indicationType?: PathologyIndicationType;
   onIndicationTypeChange?: (value: PathologyIndicationType) => void;
   surgicalProcedure?: string;
   onSurgicalProcedureChange?: (value: string) => void;
   previousTransfusion?: string;
   onPreviousTransfusionChange?: (value: string) => void;
   previousTransfusionDetails?: string;
   onPreviousTransfusionDetailsChange?: (value: string) => void;
   previousReaction?: string;
   onPreviousReactionChange?: (value: string) => void;
   previousReactionDetails?: string;
   onPreviousReactionDetailsChange?: (value: string) => void;
   pregnancies?: string;
   onPregnanciesChange?: (value: string) => void;
   miscarriage?: string;
   onMiscarriageChange?: (value: string) => void;
   stillBirth?: string;
   onStillBirthChange?: (value: string) => void;
   erythroblastosis?: string;
   onErythroblastosisChange?: (value: string) => void;
   antibodiesDetected?: string;
   onAntibodiesDetectedChange?: (value: string) => void;
   antibodyNames?: string;
   onAntibodyNamesChange?: (value: string) => void;
   patientBloodGroup?: string;
   onPatientBloodGroupChange?: (value: string) => void;
   patientRh?: string;
   onPatientRhChange?: (value: string) => void;
   groupScreenDate?: string;
   onGroupScreenDateChange?: (value: string) => void;
   wbc?: string;
   onWbcChange?: (value: string) => void;
   rbc?: string;
   onRbcChange?: (value: string) => void;
   hb?: string;
   onHbChange?: (value: string) => void;
   pcv?: string;
   onPcvChange?: (value: string) => void;
   platelets?: string;
   onPlateletsChange?: (value: string) => void;
   pt?: string;
   onPtChange?: (value: string) => void;
   ptt?: string;
   onPttChange?: (value: string) => void;
   otherLabs?: string;
   onOtherLabsChange?: (value: string) => void;
   requestType?: PathologyRequestType;
   onRequestTypeChange?: (value: PathologyRequestType) => void;
   requiredDate?: string;
   onRequiredDateChange?: (value: string) => void;
   requiredTime?: string;
   onRequiredTimeChange?: (value: string) => void;
   natureOfEmergency?: string;
   onNatureOfEmergencyChange?: (value: string) => void;
   consentExplained?: boolean;
   onConsentExplainedChange?: (value: boolean) => void;
   doctorSignature?: string;
   onDoctorSignatureChange?: (value: string) => void;
   consentText?: string;
   onConsentTextChange?: (value: string) => void;
  errors?: string[];
  problems?: string[];
  newProblem?: string;
  onNewProblemChange?: (value: string) => void;
  problemListVisible?: boolean;
  activeProblemView?: "Active" | "Find";
  onProblemListVisibleChange?: (value: boolean) => void;
  onActiveProblemViewChange?: (value: "Active" | "Find") => void;
  onAddProblem?: () => void;
  onToggleTest?: (id: string) => void;
  onToggleGroup?: (id: string) => void;
  specimenSourceById?: Record<string, string>;
  onSpecimenSourceChange?: (id: string, value: string) => void;
  priority?: PathologyPriority;
  onPriorityChange?: (value: PathologyPriority) => void;
  fasting?: boolean;
  onFastingChange?: (value: boolean) => void;
  clinicalNotes?: string;
  onClinicalNotesChange?: (value: string) => void;
  instructionsForLab?: string;
  onInstructionsForLabChange?: (value: string) => void;
  collectionDate?: string;
  onCollectionDateChange?: (value: string) => void;
  collectionTime?: string;
  onCollectionTimeChange?: (value: string) => void;
  onOpenSummary?: () => void;
  onSave?: () => void;
  onSaveAndBill?: () => void;
  onAddToBill?: () => void;
  onReorderPrevious?: (historyId: string) => void;
  onDownloadAllReports?: () => void;
}) {
  const historyOptions: PathologyOrderHistory[] = [
    { id: "hist-cbc", label: "CBC (12 Apr 2026)", selectedTestIds: ["cbc"], selectedGroupIds: [] },
    { id: "hist-lft", label: "LFT (02 Mar 2025)", selectedTestIds: ["lft"], selectedGroupIds: ["liver"] },
    { id: "hist-kft", label: "KFT (02 Mar 2025)", selectedTestIds: ["kft"], selectedGroupIds: ["renal"] },
  ];
  const doctorSuggestions = ["Dr. Kavita Rao", "Dr. Aman Verma", "Dr. Priya Singh", "Dr. Rohit Mehta", "Dr. Neha Sharma", "Dr. Sandeep Yadav"];
  const safeProblems = problems ?? [];
  const selectedTests = filteredTests.filter((test) => selectedTestIds.includes(test.id));
  const selectedGroups = groupedTests.filter((group) => selectedGroupIds.includes(group.id));
  const getSpecimenSource = (id: string) => specimenSourceById?.[id] ?? "Blood";
  const departmentOptions = [
    "All",
    "Hematology",
    "Biochemistry",
    "Microbiology",
    "Serology",
    "Clinical Pathology",
    "Histopathology",
    "Cytology",
    "Immunology",
    "Molecular Biology",
    "Toxicology",
    "Blood Bank / Transfusion Medicine",
    "Genetics",
  ];

  return (
    <div className="space-y-4">
      {errors.length ? (
        <Card className="border-danger/30 bg-danger/10">
          <CardContent className="space-y-1 p-4">
            <div className="text-sm font-semibold text-foreground">Please fix these validation errors</div>
            <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
              {errors.map((error) => <li key={error}>{error}</li>)}
            </ul>
          </CardContent>
        </Card>
      ) : null}
      {/* <Card>
        <CardContent className="space-y-4 p-4"> */}
          <div className="min-w-0 space-y-4">
              {/* <Card className="min-w-0 overflow-hidden">
                <CardContent className="space-y-3 p-4"> */}
                  <div className="flex flex-wrap items-center gap-3">
                    {/* <SectionTitle>Find</SectionTitle> */}
                    <div className="relative flex-1">
                      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input className="pl-9" value={search} onChange={(event) => onSearchChange(event.target.value)} placeholder="Search by entering few characters." />
                    </div>
                  </div>

                  <div className="grid min-w-0 gap-4 xl:grid-cols-[220px_minmax(0,1fr)]">
                    <div className="min-w-0 overflow-hidden rounded-md border border-border bg-surface-muted">
                      <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select grouped tests</div>
                      <div className="max-h-[360px] overflow-auto px-3">
                        {groupedTests.map((group) => (
                          <CheckboxRow key={group.id} label={group.name} checked={selectedGroupIds.includes(group.id)} onToggle={() => onToggleGroup?.(group.id)} />
                        ))}
                      </div>
                    </div>

                    <div className="min-w-0 overflow-hidden rounded-md border border-border bg-surface-muted">
                      <div className="border-b border-border px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Select tests</div>
                      <div className="max-h-[360px] overflow-auto px-3">
                        {filteredTests.map((test) => (
                          <CheckboxRow key={test.id} label={`${test.name} - ${test.description}`} checked={selectedTestIds.includes(test.id)} onToggle={() => onToggleTest?.(test.id)} />
                        ))}
                        {filteredTests.some((test) => test.children?.length) ? (
                          <div className="pl-5">
                            {filteredTests.flatMap((test) => (test.children ?? []).map((child) => <CheckboxRow key={`${test.id}-${child}`} label={child} indent />))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                {/* </CardContent>
              </Card> */}

              {/* <Card className="min-w-0">
                <CardContent className="space-y-4 p-4"> */}
                  <div className="min-w-0 max-w-full overflow-x-auto rounded-md border border-border">
                    <table className="min-w-[960px] w-full text-sm">
                      <thead className="bg-surface-muted text-xs text-muted-foreground">
                        <tr>
                          <th className="px-3 py-2 text-left">Selected Tests</th>
                          <th className="px-3 py-2 text-left">LOINC Code</th>
                          {/* <th className="px-3 py-2 text-left">Department</th> */}
                          <th className="px-3 py-2 text-left">Choose Specimen Source</th>
                          <th className="px-3 py-2 text-left">Choose Fasting Status</th>
                          <th className="px-3 py-2 text-left">Choose Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedTests.length || selectedGroups.length) ? (
                          <>
                            {selectedTests.map((test) => (
                              <tr key={test.id} className="border-t">
                                <td className="px-3 py-2 font-medium text-foreground">{test.name}</td>
                                <td className="px-3 py-2 text-muted-foreground">{test.code || "-"}</td>
                                {/* <td className="px-3 py-2 text-muted-foreground">{test.department}</td> */}
                                <td className="px-3 py-2">
                                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={getSpecimenSource(test.id)} onChange={(event) => onSpecimenSourceChange?.(test.id, event.target.value)}>
                                    {specimenSources.map((source) => <option key={source} value={source}>{source}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-2">
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={fasting} onChange={(event) => onFastingChange?.(event.target.checked)} />
                                    <span className="text-sm">No</span>
                                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={!fasting} onChange={(event) => onFastingChange?.(!event.target.checked)} />
                                    <span className="text-sm">Yes</span>
                                  </label>
                                </td>
                                <td className="px-3 py-2">
                                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={priority} onChange={(event) => onPriorityChange?.(event.target.value as PathologyPriority)}>
                                    {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                                  </select>
                                </td>
                              </tr>
                            ))}
                            {selectedGroups.map((group) => (
                              <tr key={group.id} className="border-t bg-surface-muted/40">
                                <td className="px-3 py-2 font-medium text-foreground">{group.name}</td>
                                <td className="px-3 py-2 text-muted-foreground">-</td>
                                <td className="px-3 py-2">
                                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={getSpecimenSource(group.id)} onChange={(event) => onSpecimenSourceChange?.(group.id, event.target.value)}>
                                    {specimenSources.map((source) => <option key={source} value={source}>{source}</option>)}
                                  </select>
                                </td>
                                <td className="px-3 py-2">
                                  <label className="flex items-center gap-2">
                                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={fasting} onChange={(event) => onFastingChange?.(event.target.checked)} />
                                    <span className="text-sm">No</span>
                                    <input type="checkbox" className="h-4 w-4 accent-primary" checked={!fasting} onChange={(event) => onFastingChange?.(!event.target.checked)} />
                                    <span className="text-sm">Yes</span>
                                  </label>
                                </td>
                                <td className="px-3 py-2">
                                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm" value={priority} onChange={(event) => onPriorityChange?.(event.target.value as PathologyPriority)}>
                                    {priorities.map((item) => <option key={item} value={item}>{item}</option>)}
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </>
                        ) : (
                          <tr>
                            <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No tests selected yet</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                {/* </CardContent>
              </Card> */}
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
           
            <label className="space-y-2">
              <SectionTitle>Instructions</SectionTitle>
              <textarea
                className="min-h-[92px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-border focus:ring-0"
                placeholder="Free text instructions for the lab"
                value={instructionsForLab}
                onChange={(event) => onInstructionsForLabChange?.(event.target.value)}
              />
            </label>
          </div>


          <div className="flex min-w-0 flex-wrap items-center gap-2 rounded-xl border border-border bg-white p-4">
            <div className="text-sm text-muted-foreground">{selectedTestIds.length + selectedGroupIds.length} tests selected</div>
            
            <div className="ml-auto flex flex-wrap gap-2">
              {/* <Button type="button" variant="outline" onClick={() => onDownloadAllReports?.()}>
                Download All Reports
              </Button> */}
              <Button type="button" variant="outline" onClick={() => onOpenSummary?.()}>
                View 
              </Button>
              <Button type="button"  onClick={() => onSave?.()}>
                Save
              </Button>
              {/* <Button type="button" variant="outline" onClick={onAddToBill}>
                Add to bill
              </Button>
              <Button type="button" onClick={onSaveAndBill}>
                Save & add to bill
              </Button> */}
            </div>
          </div>
        {/* </CardContent>
      </Card> */}
      </div>
    </div>
  );
}
