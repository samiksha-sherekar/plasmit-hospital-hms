"use client";

import * as React from "react";
import { Download, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { diagnosisTypes } from "./data";
import type { LaboratoryResultBlock } from "./types";

function StatusPill({ status }: { status: string }) {
  const tone =
    status === "Pending"
      ? "bg-warning/10 text-warning"
      : status === "Received"
        ? "bg-success/10 text-success"
        : status === "Pending" || status === "Ordered"
          ? "bg-info/10 text-info"
          : "bg-surface-muted text-muted-foreground";
  return <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${tone}`}>{status}</span>;
}

type ReviewRow = {
  id: string;
  block: LaboratoryResultBlock;
  row: LaboratoryResultBlock["rows"][number];
  isFirstInBlock: boolean;
};

export function LaboratoryResultReviewTab({
  resultBlocks: blocks,
  diagnosisSearch,
  diagnosisType,
  diagnosisOpen,
  selectedDiagnosisLabel,
  onDiagnosisSearchChange,
  onDiagnosisTypeChange,
  onDiagnosisOpenChange,
  onAddDiagnosis,
  onEditResult,
  onDeleteResult,
  onReorderResult,
}: {
  resultBlocks: LaboratoryResultBlock[];
  diagnosisSearch: string;
  diagnosisType: string;
  diagnosisOpen: boolean;
  selectedDiagnosisLabel: string;
  onDiagnosisSearchChange: (value: string) => void;
  onDiagnosisTypeChange: (value: string) => void;
  onDiagnosisOpenChange: (value: boolean) => void;
  onAddDiagnosis: () => void;
  onEditResult: (name: string) => void;
  onDeleteResult: (id: string) => void;
  onReorderResult: (name: string) => void;
}) {
  const [detailRow, setDetailRow] = React.useState<ReviewRow | null>(null);
  const diagnosisOptions = React.useMemo(
    () => [
      { conclusion: "Thrombocytopenic disorder", code: "302215000", type: "Primary" },
      { conclusion: "Iron deficiency anemia", code: "271737000", type: "Secondary" },
      { conclusion: "Leukocytosis", code: "267038008", type: "Differential" },
      { conclusion: "Chronic kidney disease", code: "709044004", type: "Primary" },
      { conclusion: "Hypertension", code: "38341003", type: "Secondary" },
    ],
    [],
  );
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState<(typeof diagnosisOptions)[number] | null>(null);
  const [commentDraft, setCommentDraft] = React.useState(selectedDiagnosisLabel);
  const [confirmedDiagnoses, setConfirmedDiagnoses] = React.useState<Array<{ id: string; type: string; diagnosis: string; snomed: string; comments: string }>>([]);

  const visibleBlocks = React.useMemo(() => {
    const query = diagnosisSearch.trim().toLowerCase();
    if (!query) return blocks;
    return blocks.filter((block) => `${block.name} ${block.specialty}`.toLowerCase().includes(query));
  }, [blocks, diagnosisSearch]);

  const rows = React.useMemo<ReviewRow[]>(
    () =>
      visibleBlocks.flatMap((block) =>
        block.rows.map((row, rowIndex) => ({
          id: `${block.id}-${row.parameter}-${rowIndex}`,
          block,
          row,
          isFirstInBlock: rowIndex === 0,
        })),
      ),
    [visibleBlocks],
  );
  const selectedDetail = detailRow
    ? {
        loinc: detailRow.block.name.toLowerCase().includes("cbc") ? "11273-0" : "28515-7",
        test: detailRow.isFirstInBlock ? detailRow.block.name.replace(" - complete blood count", "").replace(" - kidney function test", "") : detailRow.row.parameter,
        department: detailRow.block.specialty,
        sample: detailRow.row.unit.toLowerCase().includes("10^3") ? "Blood" : "Blood",
        collectedOn: "12/05/2021",
        completedOn: detailRow.row.flag === "N" ? "Pending" : "14/05/2021",
        units: detailRow.row.unit,
        result: detailRow.row.result,
        range: detailRow.row.referenceRange,
        previousResult: detailRow.row.flag === "N" ? "NA" : "Previous result not linked",
        status: detailRow.row.flag === "N" ? "Pending" : "Received",
      }
    : null;

  const downloadReport = () => {
    const lines = [
      "Laboratory Result History",
      "",
      ...rows.map((item) =>
        [item.block.name, item.row.parameter, item.row.result, item.row.unit, item.row.referenceRange, item.row.flag].join(" | "),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Laboratory-result-history.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  const filteredDiagnosisOptions = React.useMemo(() => {
    const query = diagnosisSearch.trim().toLowerCase();
    return diagnosisOptions.filter((item) => {
      const searchMatch = !query || `${item.conclusion} ${item.code}`.toLowerCase().includes(query);
      const typeMatch = !diagnosisType || item.type === diagnosisType;
      return searchMatch && typeMatch;
    });
  }, [diagnosisOptions, diagnosisSearch, diagnosisType]);

  React.useEffect(() => {
    if (!selectedDiagnosis && filteredDiagnosisOptions.length) {
      setSelectedDiagnosis(filteredDiagnosisOptions[0]);
    }
  }, [filteredDiagnosisOptions, selectedDiagnosis]);

  const openDiagnosisDialog = () => {
    setSelectedDiagnosis(null);
    setCommentDraft("");
    onDiagnosisSearchChange("");
    onDiagnosisTypeChange("");
    onDiagnosisOpenChange(true);
  };

  const closeDiagnosisDialog = () => {
    onDiagnosisOpenChange(false);
    setSelectedDiagnosis(null);
    setCommentDraft("");
  };

  return (
    <div className="space-y-4">
      {/* <Card>
        <CardContent className="space-y-4 p-4"> */}
          <div className="flex flex-wrap items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button type="button" variant="outline" size="sm">
                <Eye className="h-4 w-4" />
                View report
              </Button>
          </div>

          <div className="overflow-auto rounded-md border border-border">
            <table className="w-full min-w-[980px] border-collapse text-left text-sm">
              <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-3 py-3">LOINC Code</th>
                  <th className="px-3 py-3">Test</th>
                  <th className="px-3 py-3">Units</th>
                  <th className="px-3 py-3">Results</th>
                  <th className="px-3 py-3">Range</th>
                  <th className="px-3 py-3">Order Date</th>
                  <th className="px-3 py-3">Order completion Date</th>
                  <th className="px-3 py-3">Result Status</th>
                  <th className="px-3 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ id, block, row, isFirstInBlock }) => (
                  <tr key={id} className="border-t border-border align-top">
                    <td className="px-3 py-3 text-xs text-muted-foreground">{isFirstInBlock ? (block.name.toLowerCase().includes("cbc") ? "11273-0" : "28515-7") : ""}</td>
                    <td className="px-3 py-3">
                      <div className="font-medium text-foreground">{isFirstInBlock ? block.name.replace(" - complete blood count", "").replace(" - kidney function test", "") : row.parameter}</div>
                      {isFirstInBlock ? <div className="text-xs text-muted-foreground">{block.specialty}</div> : null}
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{row.unit}</td>
                    <td className="px-3 py-3">
                      <div className={["font-semibold", row.flag === "H" ? "text-danger" : row.flag === "L" ? "text-warning" : "text-foreground"].join(" ")}>
                        {row.result}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground">{row.referenceRange}</td>
                    <td className="px-3 py-3 text-muted-foreground">12/05/2021</td>
                    <td className="px-3 py-3 text-muted-foreground">{row.flag === "N" ? "Pending" : "14/05/2021"}</td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <StatusPill status={row.flag === "N" ? "Pending" : row.flag === "H" ? "High" : "Low"} />
                        <div className="flex gap-3 text-xs">
                          <button
                            type="button"
                            className="text-primary underline-offset-4 hover:underline"
                            onClick={() => {
                              const content = [
                                `Test: ${block.name}`,
                                `Parameter: ${row.parameter}`,
                                `Result: ${row.result}`,
                                `Range: ${row.referenceRange}`,
                              ].join("\n");
                              const printWindow = window.open("", "_blank", "width=900,height=700");
                              if (printWindow) {
                                printWindow.document.write(`<pre style="font-family: Arial, sans-serif; padding: 24px;">${content}</pre>`);
                                printWindow.document.close();
                                printWindow.focus();
                                printWindow.print();
                              }
                            }}
                          >
                            Print
                          </button>
                          <button
                            type="button"
                            className="text-primary underline-offset-4 hover:underline"
                            onClick={() => setDetailRow({ id, block, row, isFirstInBlock })}
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <Button type="button" variant="outline" size="sm" onClick={() => onReorderResult(block.name)}>
                        REORDER
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-md border border-border bg-surface-muted/30 p-4">
            <div className="mb-3 text-sm font-semibold text-foreground">Selected Diagnosis</div>
            {confirmedDiagnoses.length ? (
              <div className="overflow-hidden rounded-md border border-border bg-white">
                <table className="w-full border-collapse text-sm">
                  <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-3 py-2 text-left">Type</th>
                      <th className="px-3 py-2 text-left">Diagnosis</th>
                      <th className="px-3 py-2 text-left">SNOMED CT</th>
                      <th className="px-3 py-2 text-left">Comments</th>
                    </tr>
                  </thead>
                  <tbody>
                    {confirmedDiagnoses.map((item) => (
                      <tr key={item.id} className="border-t border-border">
                        <td className="px-3 py-2 text-foreground">{item.type}</td>
                        <td className="px-3 py-2 text-foreground">{item.diagnosis}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.snomed}</td>
                        <td className="px-3 py-2 text-muted-foreground">{item.comments || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">No diagnosis selected yet.</div>
            )}
          </div>

          {/* <Card className="border-border bg-surface-muted">
            <CardContent className="space-y-3 p-4">
              <div className="text-sm font-semibold text-foreground">ADD DIAGNOSIS</div>
              <div className="flex flex-wrap items-end gap-2">
                <div className="relative min-w-[220px] flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search diagnosis..."
                    value={diagnosisSearch}
                    onFocus={() => onDiagnosisOpenChange(true)}
                    onChange={(event) => onDiagnosisSearchChange(event.target.value)}
                  />
                  {diagnosisOpen ? (
                    <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-white p-1 shadow-md">
                      {suggestions
                        .filter((item) => item.toLowerCase().includes(diagnosisSearch.trim().toLowerCase()))
                        .map((item) => (
                          <button
                            key={item}
                            type="button"
                            className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-surface-muted"
                            onClick={() => {
                              onDiagnosisSearchChange(item);
                              onDiagnosisOpenChange(false);
                            }}
                          >
                            {item}
                          </button>
                        ))}
                    </div>
                  ) : null}
                </div>
                <span className="inline-flex rounded-md border border-info/30 bg-info/10 px-3 py-2 text-xs font-medium text-info">SNOMED CT</span>
                <div className="min-w-[130px]">
                  <select className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-border focus:ring-0" value={diagnosisType} onChange={(event) => onDiagnosisTypeChange(event.target.value)}>
                    <option value="">Type</option>
                    {diagnosisTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="button" onClick={onAddDiagnosis}>
                  OK
                </Button>
              </div>
              <textarea
                className="min-h-[56px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border focus:ring-0"
                placeholder="Add conclusion or remarks..."
                value={selectedDiagnosisLabel}
                readOnly
              />
            </CardContent>
          </Card> */}

          <div className="flex justify-between gap-3">
            <Button type="button" variant="outline" onClick={openDiagnosisDialog}>
              Add Diagnosis
            </Button>
            <Button type="button" >
              Save
            </Button>
          </div>
        {/* </CardContent>
      </Card> */}

      {detailRow && selectedDetail ? (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div className="w-full max-w-2xl rounded-md border border-border bg-white shadow-xl">
                  <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Result Details</div>
                  <div className="space-y-4 p-4">
                    <div className="grid gap-3 md:grid-cols-2">
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Test:</span><span className="font-medium">{selectedDetail.test}</span></div></div>
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Department:</span><span className="font-medium">{selectedDetail.department}</span></div></div>
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Sample:</span><span className="font-medium">{selectedDetail.sample}</span></div></div>
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Collected On:</span><span className="font-medium">{selectedDetail.collectedOn}</span></div></div>
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">Completed On:</span><span className="font-medium">{selectedDetail.completedOn}</span></div></div>
                      <div className="rounded-md border border-border p-3"><div className="flex items-center gap-2 text-sm"><span className="text-muted-foreground">LOINC Code:</span><span className="font-medium">{selectedDetail.loinc}</span></div></div>
                    </div>
                    <div className="overflow-hidden rounded-md border border-border">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2">Parameter</th>
                            <th className="px-3 py-2">Result</th>
                            <th className="px-3 py-2">Unit</th>
                            <th className="px-3 py-2">Range</th>
                            <th className="px-3 py-2">Flag</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-t border-border">
                            <td className="px-3 py-2 font-medium text-foreground">{selectedDetail.test}</td>
                            <td className="px-3 py-2 text-foreground">{selectedDetail.result}</td>
                            <td className="px-3 py-2 text-muted-foreground">{selectedDetail.units}</td>
                            <td className="px-3 py-2 text-muted-foreground">{selectedDetail.range}</td>
                            <td className="px-3 py-2 text-muted-foreground">{selectedDetail.status === "Received" ? "H/L" : "-"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    {/* <div className="rounded-md border border-border p-3">
                      <div className="text-xs text-muted-foreground">Previous Result</div>
                      <div className="mt-1 text-sm font-medium text-foreground">{selectedDetail.previousResult}</div>
                    </div> */}
                  </div>
                  <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
                    <Button type="button" variant="outline" onClick={() => setDetailRow(null)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            ) : null}

      {diagnosisOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-3 sm:items-center sm:p-4">
          <div className="flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-md border border-border bg-white shadow-xl sm:max-h-[calc(100vh-2rem)]">
            {/* <div className="border-b border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Search SNOMED / Clinical Conclusion
            </div> */}
            <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Add Diagnosis</div>
              <div className="flex-1 space-y-4 overflow-y-auto p-4">
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px] md:items-end">
                  <div className="min-w-0">
                    <Input
                      value={diagnosisSearch}
                      onChange={(event) => onDiagnosisSearchChange(event.target.value)}
                      placeholder="Search by clinical conclusion or SNOMED code"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Diagnosis Type
                    </div>
                    <select
                      className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-border focus:ring-0"
                      value={diagnosisType}
                      onChange={(event) => onDiagnosisTypeChange(event.target.value)}
                    >
                      <option value="">All Types</option>
                      {diagnosisTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="overflow-hidden rounded-md border border-border">
                  <table className="hidden w-full border-collapse text-sm md:table">
                    <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <tr>
                        <th className="px-3 py-2 text-left">Select</th>
                        <th className="px-3 py-2 text-left">Clinical Conclusion</th>
                        <th className="px-3 py-2 text-left">SNOMED CT Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDiagnosisOptions.map((item) => {
                        const checked = selectedDiagnosis?.code === item.code;
                        return (
                          <tr key={item.code} className={checked ? "bg-primary/5" : "border-t border-border"}>
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 accent-primary"
                                checked={checked}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    setSelectedDiagnosis(item);
                                  } else if (selectedDiagnosis?.code === item.code) {
                                    setSelectedDiagnosis(null);
                                  }
                                }}
                              />
                            </td>
                            <td className="px-3 py-2 text-foreground">{item.conclusion}</td>
                            <td className="px-3 py-2 text-muted-foreground">{item.code}</td>
                          </tr>
                        );
                      })}
                      {!filteredDiagnosisOptions.length ? (
                        <tr>
                          <td colSpan={3} className="px-3 py-6 text-center text-muted-foreground">
                            No diagnosis found
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>

                  <div className="space-y-3 p-3 md:hidden">
                    {filteredDiagnosisOptions.map((item) => {
                      const checked = selectedDiagnosis?.code === item.code;
                      return (
                        <button
                          key={item.code}
                          type="button"
                          className={["w-full rounded-md border p-3 text-left", checked ? "border-primary bg-primary/5" : "border-border bg-white"].join(" ")}
                          onClick={() => setSelectedDiagnosis(item)}
                        >
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                              checked={checked}
                              onChange={(event) => {
                                if (event.target.checked) {
                                  setSelectedDiagnosis(item);
                                } else if (selectedDiagnosis?.code === item.code) {
                                  setSelectedDiagnosis(null);
                                }
                              }}
                            />
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-foreground">{item.conclusion}</div>
                              <div className="mt-1 text-xs text-muted-foreground">{item.code}</div>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                    {!filteredDiagnosisOptions.length ? <div className="py-6 text-center text-muted-foreground">No diagnosis found</div> : null}
                  </div>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {/* <label className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Selected Clinical Conclusion</div>
                    <Input value={selectedDiagnosis?.conclusion ?? ""} readOnly />
                  </label>
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">SNOMED CT Code</div>
                    <Input value={selectedDiagnosis?.code ?? ""} readOnly />
                  </label>
                  <label className="space-y-2">
                    <div className="text-xs font-medium text-muted-foreground">Type</div>
                    <Input value={selectedDiagnosis?.type ?? diagnosisType ?? ""} readOnly />
                  </label> */}
                  <label className="space-y-2 md:col-span-2">
                    <div className="text-xs font-medium text-muted-foreground">Comments</div>
                    <textarea
                      className="min-h-[72px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border focus:ring-0"
                      value={commentDraft}
                      onChange={(event) => setCommentDraft(event.target.value)}
                      placeholder="Enter comments"
                    />
                  </label>
                </div>
              </div>

            <div className="flex flex-col gap-2 border-t border-border px-4 py-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={closeDiagnosisDialog}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (selectedDiagnosis) {
                    setConfirmedDiagnoses((current) => [
                      {
                        id: `${selectedDiagnosis.code}-${Date.now()}`,
                        type: selectedDiagnosis.type,
                        diagnosis: selectedDiagnosis.conclusion,
                        snomed: selectedDiagnosis.code,
                        comments: commentDraft,
                      },
                      ...current,
                    ]);
                    onAddDiagnosis();
                    closeDiagnosisDialog();
                  }
                }}
              >
                Add Diagnosis
              </Button>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
