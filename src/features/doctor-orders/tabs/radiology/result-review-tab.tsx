"use client";

import * as React from "react";
import { ArrowUpDown, Download, Eye, ChevronsLeft, ChevronsRight } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";

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

function drawPseudoQr(doc: jsPDF, x: number, y: number, size: number, seed: string) {
  const cells = 21;
  const cellSize = size / cells;
  let hash = 0;

  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const isFinder = (row: number, col: number) =>
    ((row < 7 && col < 7) || (row < 7 && col >= cells - 7) || (row >= cells - 7 && col < 7)) &&
    (row === 0 || row === 6 || col === 0 || col === 6 || (row >= 2 && row <= 4 && col >= 2 && col <= 4));

  doc.setFillColor(255, 255, 255);
  doc.rect(x, y, size, size, "F");
  doc.setDrawColor(20);
  doc.rect(x, y, size, size);

  for (let row = 0; row < cells; row += 1) {
    for (let col = 0; col < cells; col += 1) {
      const inFinder = isFinder(row, col);
      const bit = ((hash >> ((row * cells + col) % 24)) ^ (row * 13 + col * 7)) & 1;
      if (!(inFinder || bit === 1)) continue;
      doc.setFillColor(inFinder ? 20 : 40, inFinder ? 20 : 40, inFinder ? 20 : 40);
      doc.rect(x + col * cellSize, y + row * cellSize, cellSize + 0.01, cellSize + 0.01, "F");
    }
  }

  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize * 8, y + cellSize * 8, cellSize * 5, cellSize * 5, "F");
}

async function downloadRadiologyPdf(blocks: RadiologyResultBlock[], filename: string) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 28;
  const pageWidth = doc.internal.pageSize.getWidth();
  const contentWidth = pageWidth - margin * 2;
  const logoBase64 = await loadImageAsPngBase64(LOGO_SRC);

  blocks.forEach((block, index) => {
    if (index > 0) doc.addPage();

    const headerTop = 18;
    const headerHeight = 46;
    const headerBottom = headerTop + headerHeight;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(17);
    doc.setTextColor(30, 64, 175);
    doc.text("RADIOLOGY REPORT", margin + 2, headerTop + 25);
    
    const logoWidth = 100;
    const logoHeight = 34;
    const logoX = pageWidth - margin - logoWidth - 8;
    const logoY = headerTop + Math.max(0, (headerHeight - logoHeight) / 2);

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

    // doc.setDrawColor(220);
    // doc.line(margin, headerBottom + 4, pageWidth - margin, headerBottom + 4);

    doc.setDrawColor(210);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(margin, 84, contentWidth, 78, 3, 3, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(20);
    doc.text("Patient Information", margin + 10, 99);
    doc.setDrawColor(230);
    doc.line(margin, 106, pageWidth - margin, 106);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(20);
    const leftX = margin + 10;
    const rightX = margin + contentWidth / 2 + 10;
    const labelW = 88;
    const left: Array<[string, string]> = [
      ["Patient Name", "Meera Joshi"],
      ["MRN", "UHID-45821"],
      ["Age / Gender", "42 Years / Female"],
      ["Doctor Name", "Dr. Kavita Rao"],
    ];
    const right: Array<[string, string]> = [
      ["Sample Collection", "12/05/2021 09:30 AM"],
      ["Report Date", block.reportDate || "14/05/2021"],
      ["Report Status", "Final"],
      ["Body Part / Specification", block.specification],
    ];
    left.forEach(([label, value], rowIndex) => {
      const y = 119 + rowIndex * 10;
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, leftX, y);
      doc.setFont("helvetica", "normal");
      doc.text(value || "-", leftX + labelW, y);
    });
    right.forEach(([label, value], rowIndex) => {
      const y = 119 + rowIndex * 10;
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, rightX, y);
      doc.setFont("helvetica", "normal");
      doc.text(value || "-", rightX + labelW, y);
    });

    const rows = block.rows.map((row) => [row.parameter, row.result, row.unit, row.referenceRange]);
    autoTable(doc, {
      startY: 172,
      margin: { left: margin, right: margin },
      head: [["Parameter", "Result", "Unit", "Reference Range"]],
      body: rows,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak", lineColor: 210, lineWidth: 0.3 },
      headStyles: { fillColor: [235, 238, 242], textColor: 20, fontStyle: "bold", halign: "center" },
      bodyStyles: { fillColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      columnStyles: {
        0: { cellWidth: 190 },
        1: { cellWidth: 95, halign: "center" },
        2: { cellWidth: 95, halign: "center" },
        3: { cellWidth: 155, halign: "center" },
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY ?? 172;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Interpretation", margin, finalY + 22);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Selected test ${block.selectedTests} with specification ${block.specification} and priority ${block.priority}.`, margin, finalY + 38, { maxWidth: contentWidth });

    const pageHeight = doc.internal.pageSize.getHeight();
    const footerTop = pageHeight - 104;
    const footerPadding = 18;
    const footerRightPanelX = pageWidth - margin - 150 - footerPadding;
    doc.setFillColor(245, 249, 255);
    doc.roundedRect(margin, footerTop - 8, pageWidth - margin * 2, 82, 4, 4, "F");
    doc.setDrawColor(190, 205, 230);
    doc.roundedRect(margin, footerTop - 8, pageWidth - margin * 2, 82, 4, 4);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(28, 44, 74);
    doc.text("Booking Centre : Plasmit Hospital", margin + footerPadding, footerTop + 14);
    doc.text("Processing Lab : Central Laboratory, Plasmit Hospital", margin + footerPadding, footerTop + 24);
    doc.text("Reporting Consultant : Dr. Kavita Rao", margin + footerPadding, footerTop + 34);
    doc.text("Department : Pathology / Laboratory / Radiology", margin + footerPadding, footerTop + 44);
    doc.setFontSize(6.5);
    doc.setTextColor(70, 87, 110);
    drawPseudoQr(doc, footerRightPanelX, footerTop + 6, 40, `PLASMIT-RAD-${index + 1}`);
    doc.setFontSize(6);
    doc.text("Scan to verify", footerRightPanelX, footerTop + 51);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(28, 44, 74);
    doc.text("Authorized Signatory", pageWidth - margin - 105 - footerPadding, footerTop + 14);
    doc.setFont("helvetica", "normal");
    doc.text("_____________________", pageWidth - margin - 120 - footerPadding, footerTop + 26);
    doc.text("Dr. Kavita Rao", pageWidth - margin - 105 - footerPadding, footerTop + 38);
    doc.text("MD Pathology", pageWidth - margin - 105 - footerPadding, footerTop + 48);
    doc.text("Reg. No: MMC12345", pageWidth - margin - 105 - footerPadding, footerTop + 58);
    doc.setFontSize(7);
    doc.setTextColor(90, 105, 130);
    doc.text(`Page ${index + 1} of ${blocks.length}`, pageWidth / 2 - 10, pageHeight - 8);
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
  const [pageIndex, setPageIndex] = React.useState(0);
  const [sortKey, setSortKey] = React.useState<SortKey>("selectedTests");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const pageSize = 5;
  const [selectedBlock, setSelectedBlock] = React.useState<RadiologyResultBlock | null>(null);

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

  const openBlockView = (block: RadiologyResultBlock) => setSelectedBlock(block);
  const closeBlockView = () => setSelectedBlock(null);

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
              <th className="px-3 py-3"><Button size="sm" variant="outline" onClick={handleDownloadAll}>
            <Download className="h-3.5 w-3.5" />
            Download All Reports
          </Button></th>
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
                      <Button type="button" variant="outline" size="sm" onClick={() => openBlockView(block)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleDownload(block)}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                  
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Drawer
        open={Boolean(selectedBlock)}
        onOpenChange={(open) => {
          if (!open) closeBlockView();
        }}
        title={selectedBlock?.selectedTests ?? "Result preview"}
        description={selectedBlock ? `${selectedBlock.category} - ${selectedBlock.specification}` : "Static result preview"}
      >
        {selectedBlock ? (
          <div className="space-y-4">
            <div className="grid gap-2 rounded-md border border-border bg-surface-muted/30 p-3 text-sm">
              <div><span className="font-medium text-foreground">Test Name:</span> <span className="text-muted-foreground">{selectedBlock.selectedTests}</span></div>
              <div><span className="font-medium text-foreground">Modality:</span> <span className="text-muted-foreground">{selectedBlock.category}</span></div>
              <div><span className="font-medium text-foreground">Body Part / Specification:</span> <span className="text-muted-foreground">{selectedBlock.specification}</span></div>
              <div><span className="font-medium text-foreground">Report Status:</span> <span className="text-muted-foreground">Final</span></div>
              <div><span className="font-medium text-foreground">Radiologist:</span> <span className="text-muted-foreground">{selectedBlock.radiologist || "Dr. Kavita Rao"}</span></div>
              <div><span className="font-medium text-foreground">Report Date:</span> <span className="text-muted-foreground">{selectedBlock.reportDate || "14/05/2021"}</span></div>
            </div>
            <div className="grid gap-2 rounded-md border border-border bg-white p-3 text-sm">
              <div><span className="font-medium text-foreground">Findings:</span> <span className="text-muted-foreground">{selectedBlock.findings || "Findings not available"}</span></div>
              <div><span className="font-medium text-foreground">Impression:</span> <span className="text-muted-foreground">{selectedBlock.impression || "Impression not available"}</span></div>
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
                  {selectedBlock.rows.map((row) => (
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
        ) : null}
      </Drawer>

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
          
        </div>
      </div>
    </div>
  );
}
