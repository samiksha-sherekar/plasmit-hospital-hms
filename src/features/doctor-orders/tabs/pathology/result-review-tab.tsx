"use client";

import * as React from "react";
import { Download, Eye, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { diagnosisTypes } from "./data";
import type { PathologyResultBlock } from "./types";

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
  block: PathologyResultBlock;
  row: PathologyResultBlock["rows"][number];
  isFirstInBlock: boolean;
};

export function PathologyResultReviewTab({
  resultMode,
  onResultModeChange,
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
  resultMode: "Result history" | "All results";
  onResultModeChange: (value: "Result history" | "All results") => void;
  resultBlocks: PathologyResultBlock[];
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
        units: detailRow.row.unit,
        result: detailRow.row.result,
        range: detailRow.row.referenceRange,
        status: detailRow.row.flag === "N" ? "Pending" : "Received",
        orderDate: "12/05/2021",
        completionDate: detailRow.row.flag === "N" ? "Pending" : "14/05/2021",
      }
    : null;

  const downloadReport = () => {
    const lines = [
      "Pathology Result History",
      "",
      ...rows.map((item) =>
        [item.block.name, item.row.parameter, item.row.result, item.row.unit, item.row.referenceRange, item.row.flag].join(" | "),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "pathology-result-history.txt";
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

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-foreground">Result History</div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={downloadReport}>
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button type="button" variant="outline" size="sm">
                <Eye className="h-4 w-4" />
                View report
              </Button>
            </div>
          </div>

          <div className="flex gap-2 border-b border-border">
            {(["Result history", "All results"] as const).map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  "border-b-2 px-3 py-2 text-xs font-medium transition",
                  resultMode === item ? "border-primary text-primary" : "border-transparent text-muted-foreground",
                ].join(" ")}
                onClick={() => onResultModeChange(item)}
              >
                {item}
              </button>
            ))}
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
                  <th className="px-3 py-3">Intent</th>
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
                        <StatusPill status={row.flag === "N" ? "Pending" : "Received"} />
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
            <Button type="button" variant="outline" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => onDiagnosisOpenChange(true)}>
              ADD DIAGNOSIS
            </Button>
            <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90">
              SAVE
            </Button>
          </div>
        </CardContent>
      </Card>

      {detailRow && selectedDetail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-md border border-border bg-white shadow-xl">
            <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Result Details</div>
            <div className="grid gap-3 p-4 md:grid-cols-2">
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">LOINC Code</div><div className="mt-1 text-sm font-medium">{selectedDetail.loinc}</div></div>
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">Test</div><div className="mt-1 text-sm font-medium">{selectedDetail.test}</div></div>
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">Units</div><div className="mt-1 text-sm font-medium">{selectedDetail.units}</div></div>
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">Result</div><div className="mt-1 text-sm font-medium">{selectedDetail.result}</div></div>
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">Range</div><div className="mt-1 text-sm font-medium">{selectedDetail.range}</div></div>
              <div className="rounded-md border border-border p-3"><div className="text-xs text-muted-foreground">Status</div><div className="mt-1 text-sm font-medium">{selectedDetail.status}</div></div>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-4xl rounded-md border border-border bg-white shadow-xl">
            {/* <div className="border-b border-border bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              Search SNOMED / Clinical Conclusion
            </div> */}
            <div className="border-b border-border px-4 py-3 text-sm font-semibold text-foreground">Add Diagnosis</div>
              <div className="space-y-4 p-4">
                <div className="flex items-end gap-3">
                  <div className="flex-1">
                    <Input
                      value={diagnosisSearch}
                      onChange={(event) => onDiagnosisSearchChange(event.target.value)}
                      placeholder="Search by clinical conclusion or SNOMED code"
                    />
                  </div>
                <div>
                    <div className="mb-1 text-xs font-medium text-muted-foreground">
                      Diagnosis Type
                    </div>
                  <select
                    className="h-9 w-44 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-border focus:ring-0"
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
                  <table className="w-full border-collapse text-sm">
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
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <label className="space-y-2">
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
                  </label>
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

            <div className="flex justify-end gap-2 border-t border-border px-4 py-3">
              <Button type="button" variant="outline" onClick={() => onDiagnosisOpenChange(false)}>
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  if (selectedDiagnosis) {
                    onDiagnosisSearchChange(selectedDiagnosis.conclusion);
                    onDiagnosisTypeChange(selectedDiagnosis.type);
                    onAddDiagnosis();
                    onDiagnosisOpenChange(false);
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
