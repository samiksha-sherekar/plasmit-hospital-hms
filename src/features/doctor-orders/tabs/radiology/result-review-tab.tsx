"use client";

import * as React from "react";
import { ArrowUpDown, Download, Eye, ChevronsLeft, ChevronsRight } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";

import type { RadiologyResultBlock } from "./types";

type SortKey = "selectedTests" | "loincCode" | "category" | "specification" | "priority";
type SortDirection = "asc" | "desc";

const PAGE_SIZE_OPTIONS = [5, 10, 20];
const LOGO_SRC = "/plasmit-sidebar-logo.webp";

async function loadImageAsPngBase64(src: string): Promise<string | null> {
  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("Logo image failed to load"));
    });

    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL("image/png");
  } catch (error) {
    console.warn("[PDF] logo load failed", error);
    return null;
  }
}

async function downloadRadiologyPdf(blocks: RadiologyResultBlock[], filename: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 32;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const logoBase64 = await loadImageAsPngBase64(LOGO_SRC);

  blocks.forEach((block, index) => {
    if (index > 0) doc.addPage();

    doc.setDrawColor(210);
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, 18, contentWidth, 52, 4, 4, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(37, 99, 235);
    doc.text("RADIOLOGY REPORT", margin + 12, 48);

    const logoWidth = 100;
    const logoHeight = 34;
    const logoX = pageWidth - margin - logoWidth - 8;
    const logoY = 27;

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", logoX, logoY, logoWidth, logoHeight);
    } else {
      doc.setDrawColor(180);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(logoX, logoY, logoWidth, logoHeight, 3, 3, "FD");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(20);
      doc.text("PLASMIT", logoX + 28, logoY + 16);
      doc.text("LOGO", logoX + 35, logoY + 28);
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20);
    doc.text(`Selected Test: ${block.selectedTests}`, margin, 92);
    doc.text(`Code: ${block.loincCode}`, margin, 108);
    doc.text(`Category: ${block.category}`, margin, 124);
    doc.text(`Specification: ${block.specification}`, margin, 140);
    doc.text(`Priority: ${block.priority}`, margin, 156);

    doc.setDrawColor(210);
    doc.line(margin, 170, margin + contentWidth, 170);

    const rows = block.rows.map((row) => [row.parameter, row.result, row.unit, row.referenceRange]);
    autoTable(doc, {
      startY: 188,
      margin: { left: margin, right: margin },
      head: [["Parameter", "Result", "Unit", "Range"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
      headStyles: { fillColor: [235, 238, 242], textColor: 20 },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 166;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Interpretation", margin, finalY + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(
      `Selected test ${block.selectedTests} with specification ${block.specification} and priority ${block.priority}.`,
      margin,
      finalY + 38,
      { maxWidth: contentWidth }
    );
  });

  doc.save(filename);
}

export function RadiologyResultReviewTab({
  resultBlocks,
  onReorderResult,
}: {
  resultBlocks: RadiologyResultBlock[];
  onReorderResult: (name: string) => void;
}) {
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [pageIndex, setPageIndex] = React.useState(0);
  const [sortKey, setSortKey] = React.useState<SortKey>("selectedTests");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const pageSize = 5;

  const sortedBlocks = React.useMemo(() => {
    const items = [...resultBlocks];
    items.sort((left, right) => {
      const leftValue = String(left[sortKey]);
      const rightValue = String(right[sortKey]);
      const comparison = leftValue.localeCompare(rightValue, undefined, { numeric: true, sensitivity: "base" });
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return items;
  }, [resultBlocks, sortDirection, sortKey]);

  const pageCount = Math.max(1, Math.ceil(sortedBlocks.length / pageSize));
  const currentPage = Math.min(pageIndex, pageCount - 1);
  const paged = React.useMemo(() => sortedBlocks.slice(currentPage * pageSize, currentPage * pageSize + pageSize), [currentPage, pageSize, sortedBlocks]);

  const requestSort = (nextKey: SortKey) => {
    setPageIndex(0);
    if (sortKey === nextKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(nextKey);
    setSortDirection("asc");
  };

  const handleDownload = (block: RadiologyResultBlock) => {
    void downloadRadiologyPdf([block], "radiology-report.pdf");
  };

  const handleDownloadAll = () => {
    void downloadRadiologyPdf(sortedBlocks, "radiology-reports.pdf");
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-md border border-border">
        <table className="min-w-[1100px] w-full border-collapse text-left text-sm">
          <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <tr>
              {[
                ["selectedTests", "Selected Test"],
                ["loincCode", "Code"],
                ["category", "Category"],
                ["specification", "Specification"],
                ["priority", "Priority"],
              ].map(([key, label]) => (
                <th key={key} className="px-3 py-3">
                  <button className="inline-flex items-center gap-1.5" type="button" onClick={() => requestSort(key as SortKey)}>
                    {label}
                    {sortKey === key ? <ArrowUpDown className="h-3.5 w-3.5" /> : null}
                  </button>
                </th>
              ))}
              <th className="px-3 py-3">Action</th>
              <th className="px-3 py-3">Download</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((block) => (
              <React.Fragment key={block.id}>
                <tr className="border-t border-border">
                  <td className="px-3 py-3 font-medium text-foreground">{block.selectedTests}</td>
                  <td className="px-3 py-3 text-muted-foreground">{block.loincCode}</td>
                  <td className="px-3 py-3 text-muted-foreground">{block.category}</td>
                  <td className="px-3 py-3 text-muted-foreground">{block.specification}</td>
                  <td className="px-3 py-3 text-muted-foreground">{block.priority}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => onReorderResult(block.selectedTests)}>
                        <ArrowUpDown className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => setExpanded((current) => ({ ...current, [block.id]: !current[block.id] }))}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(block)}>
                      <Download className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                {expanded[block.id] ? (
                  <tr className="border-t border-border bg-surface-muted/20">
                    <td colSpan={7} className="px-3 py-3">
                      <div className="overflow-hidden rounded-md border border-border bg-white p-3">
                        <div className="mb-3 flex flex-wrap gap-3 text-sm">
                          <span className="font-semibold text-foreground">{block.selectedTests}</span>
                          <span className="text-muted-foreground">{block.category}</span>
                          <span className="text-muted-foreground">Spec: {block.specification}</span>
                          <span className="text-muted-foreground">Priority: {block.priority}</span>
                        </div>
                        <div className="overflow-hidden rounded-md border border-border">
                          <table className="w-full border-collapse text-left text-sm">
                            <thead className="bg-surface-muted text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                              <tr>
                                <th className="px-3 py-2">Parameter</th>
                                <th className="px-3 py-2">Result</th>
                                <th className="px-3 py-2">Unit</th>
                                <th className="px-3 py-2">Range</th>
                              </tr>
                            </thead>
                            <tbody>
                              {block.rows.map((row) => (
                                <tr key={row.parameter} className="border-t border-border">
                                  <td className="px-3 py-2 font-medium text-foreground">{row.parameter}</td>
                                  <td className="px-3 py-2 text-foreground">{row.result}</td>
                                  <td className="px-3 py-2 text-muted-foreground">{row.unit}</td>
                                  <td className="px-3 py-2 text-muted-foreground">{row.referenceRange}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-2 border-t border-border bg-white px-3 py-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span>
            {sortedBlocks.length} records - Page {currentPage + 1} of {pageCount}
          </span>
          <label className="flex items-center gap-2">
            <span>Rows</span>
            <select
              className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground outline-none"
              value={pageSize}
              onChange={(event) => {
                setPageIndex(0);
                void event;
              }}
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="outline" onClick={() => setPageIndex(0)} disabled={currentPage === 0} aria-label="First page">
            <ChevronsLeft className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPageIndex((current) => Math.max(0, current - 1))} disabled={currentPage === 0}>
            Previous
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPageIndex((current) => Math.min(pageCount - 1, current + 1))} disabled={currentPage >= pageCount - 1}>
            Next
          </Button>
          <Button size="sm" variant="outline" onClick={() => setPageIndex(pageCount - 1)} disabled={currentPage >= pageCount - 1} aria-label="Last page">
            <ChevronsRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={handleDownloadAll}>
            <Download className="h-3.5 w-3.5" />
            Download All Reports
          </Button>
        </div>
      </div>
    </div>
  );
}
