import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export type PdfResultRow = {
  testName: string;
  parameter: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag: "N" | "H" | "L";
};

export type PdfResultBlock = {
  testName: string;
  department: string;
  sampleCollectedOn: string;
  completedOn: string;
  reportStatus: string;
  barcodeNo: string;
  sampleType: string;
  reportDate: string;
  interpretation?: string;
  rows: PdfResultRow[];
};

type PdfPatient = {
  patientName: string;
  ageGender: string;
  mrn: string;
  doctorName: string;
  sampleCollectionDate: string;
  reportStatus: string;
  reportDate: string;
};

const LOGO_SRC = "/plasmit-sidebar-logo.webp";

function normalizeGroup(parameter: string) {
  const p = parameter.toLowerCase();

  if (["hemoglobin", "rbc", "hematocrit", "pcv", "mcv", "mch", "mchc", "rdw"].some((k) => p.includes(k))) {
    return "RBC Parameters";
  }

  if (["wbc", "tlc", "neutrophil", "lymphocyte", "monocyte", "eosinophil", "basophil"].some((k) => p.includes(k))) {
    return "WBC Parameters";
  }

  if (["platelet", "mpv", "pdw", "pct"].some((k) => p.includes(k))) {
    return "Platelet Parameters";
  }

  return "Other Parameters";
}

function isAbnormal(row: PdfResultRow) {
  return row.flag === "H" || row.flag === "L";
}

function rowTone(row: PdfResultRow) {
  if (row.flag === "H") return [180, 40, 40] as const;
  if (row.flag === "L") return [30, 90, 180] as const;
  return [28, 44, 74] as const;
}

function groupRows(rows: PdfResultRow[]) {
  const grouped = new Map<string, PdfResultRow[]>();
  rows.forEach((row) => {
    const group = normalizeGroup(row.parameter);
    grouped.set(group, [...(grouped.get(group) ?? []), row]);
  });
  return grouped;
}

function renderResultTable(doc: jsPDF, rows: PdfResultRow[], startY: number, contentWidth: number, groupName?: string) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 28;
  autoTable(doc, {
    startY,
    margin: { left: margin, right: margin, bottom: 118 },
    tableWidth: pageWidth - margin * 2,
    head: [[groupName ?? "Parameter", "Value", "Unit", "Reference Range"]],
    body: rows.map((row) => [
      row.parameter || "-",
      row.value || "-",
      row.unit || "-",
      row.referenceRange || "-",
    ]),
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 4,
      textColor: 20,
      lineColor: 210,
      lineWidth: 0.3,
      overflow: "linebreak",
      valign: "middle",
    },
    headStyles: {
      fillColor: [235, 238, 242],
      textColor: 20,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fillColor: [255, 255, 255],
    },
    alternateRowStyles: {
      fillColor: [250, 250, 250],
    },
    columnStyles: {
       0: { cellWidth: 235 },
      1: { cellWidth: 90, halign: "center" },
      2: { cellWidth: 85, halign: "center" },
      3: { cellWidth: 130, halign: "center" },
    },
    didParseCell: (data) => {
      if (data.section === "body") {
        const row = rows[data.row.index];
        if (row && isAbnormal(row)) {
          data.cell.styles.fontStyle = "bold";
          data.cell.styles.textColor = rowTone(row);
        }
      }
    },
    pageBreak: "auto",
    rowPageBreak: "auto",
  });
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
      const shouldFill = inFinder || bit === 1;
      if (!shouldFill) continue;

      doc.setFillColor(inFinder ? 20 : 40, inFinder ? 20 : 40, inFinder ? 20 : 40);
      doc.rect(x + col * cellSize, y + row * cellSize, cellSize + 0.01, cellSize + 0.01, "F");
    }
  }

  doc.setFillColor(255, 255, 255);
  doc.rect(x + cellSize * 8, y + cellSize * 8, cellSize * 5, cellSize * 5, "F");
}

function getPatientData(): PdfPatient {
  return {
    patientName: "Meera Joshi",
    ageGender: "42 Years / Female",
    mrn: "UHID-45821",
    doctorName: "Dr. Kavita Rao",
    sampleCollectionDate: "12/05/2021 09:30 AM",
    reportStatus: "Final",
    reportDate: "14/05/2021",
  };
}

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

function addHeader(doc: jsPDF, reportStatus: string, logoBase64?: string | null, reportTitle = "LABORATORY REPORT") {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  const headerTop = 18;
  const headerHeight = 46;
  const headerBottom = headerTop + headerHeight;

  // doc.setFillColor(245, 248, 252);
  // doc.rect(0, 0, pageWidth, 20, "F");
  // doc.setDrawColor(210);
  // doc.setFillColor(248, 250, 252);
  // doc.roundedRect(margin, headerTop, contentWidth, headerHeight, 4, 4, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(30, 64, 175);
  doc.text(reportTitle, margin + 12, headerTop + 25);
  if (reportTitle.toUpperCase().includes("PATHOLOGY")) {
    doc.setFontSize(9);
    doc.setTextColor(70, 85, 105);
    // doc.text("Pathology section", margin + 12, headerTop + 35);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  // doc.text(`Status : ${reportStatus}`, margin + 12, headerTop + 40);

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

  doc.setDrawColor(220);
  // doc.line(margin, headerBottom + 4, pageWidth - margin, headerBottom + 4);

  doc.setTextColor(20);
}

function addPatientSection(doc: jsPDF, patient: PdfPatient) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 28;
  const contentWidth = pageWidth - margin * 2;
  const startY = 74;

  doc.setDrawColor(210);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(margin, startY, contentWidth, 78, 3, 3, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(20);
  doc.text("Patient Information", margin + 10, startY + 15);

  doc.setDrawColor(230);
  doc.line(margin, startY + 22, pageWidth - margin, startY + 22);

  const leftX = margin + 10;
  const rightX = margin + contentWidth / 2 + 10;
  const labelW = 88;

  const left: Array<[string, string]> = [
    ["Patient Name", patient.patientName],
    ["MRN", patient.mrn],
    ["Age / Gender", patient.ageGender],
    ["Doctor Name", patient.doctorName],
  ];

  const right: Array<[string, string]> = [
    ["Sample Collection", patient.sampleCollectionDate],
    ["Report Date", patient.reportDate],
    ["Report Status", patient.reportStatus],
    ["", ""],
  ];

  doc.setFontSize(8);

  left.forEach(([label, value], index) => {
    const y = startY + 35 + index * 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(`${label}:`, leftX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20);
    doc.text(String(value || "-"), leftX + labelW, y);
  });

  right.forEach(([label, value], index) => {
    if (!label) return;
    const y = startY + 35 + index * 10;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(50);
    doc.text(`${label}:`, rightX, y);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(20);
    doc.text(String(value || "-"), rightX + labelW, y);
  });
}

function addFooter(doc: jsPDF, pageNumber: number, totalPages: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 28;
  const footerTop = pageHeight - 104;
  const footerWidth = pageWidth - margin * 2;
  const footerPadding = 18;
  const footerRightPanelX = pageWidth - margin - 150 - footerPadding;

  doc.setFillColor(245, 249, 255);
  doc.roundedRect(margin, footerTop - 8, footerWidth, 82, 4, 4, "F");
  doc.setDrawColor(190, 205, 230);
  doc.roundedRect(margin, footerTop - 8, footerWidth, 82, 4, 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(28, 44, 74);

  doc.text("Booking Centre : Plasmit Hospital", margin + footerPadding, footerTop + 14);
  doc.text("Processing Lab : Central Laboratory, Plasmit Hospital", margin + footerPadding, footerTop + 24);
  doc.text("Reporting Consultant : Dr. Kavita Rao", margin + footerPadding, footerTop + 34);
  doc.text("Department : Pathology / Laboratory / Radiology", margin + footerPadding, footerTop + 44);

  doc.setFontSize(6.5);
  doc.setTextColor(70, 87, 110);
  

  drawPseudoQr(doc, footerRightPanelX, footerTop + 6, 40, `PLASMIT-${pageNumber}-${totalPages}`);
  doc.setFontSize(6);
  doc.setTextColor(40, 60, 95);
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
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth / 2 - 20, pageHeight - 8);
}

function addPageFrame(doc: jsPDF, patient: PdfPatient, reportStatus: string, logoBase64?: string | null, reportTitle?: string) {
  addHeader(doc, reportStatus, logoBase64, reportTitle ?? "LABORATORY REPORT");
    addPatientSection(doc, patient);
  }

export async function downloadLaboratoryPdf(blocks: PdfResultBlock[], filename: string, reportTitle?: string) {
  const patient = getPatientData();
  const logoBase64 = await loadImageAsPngBase64(LOGO_SRC);
  const inferredTitle = filename.toLowerCase().includes("pathology") ? "PATHOLOGY REPORT" : reportTitle ?? "LABORATORY REPORT";
  const isPathologyLike = inferredTitle.toUpperCase().includes("PATHOLOGY") || inferredTitle.toUpperCase().includes("LABORATORY");

  console.log("[PDF] blocks data received", blocks);
  console.log("[PDF] patient data", patient);

  if (!blocks?.length) {
    console.warn("[PDF] download skipped: blocks array is empty");
    return;
  }

  const doc = new jsPDF({ unit: "pt", format: "a4" });

  blocks.forEach((block, index) => {
    if (index > 0) doc.addPage();

    addPageFrame(doc, patient, block.reportStatus || "Final", logoBase64, inferredTitle);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(block.testName, 28, 182);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.text(`Department: ${block.department || "-"}`, 28, 196);
    // doc.text(`Sample Collected: ${block.sampleCollectedOn || "-"}`, 170, 196);
    doc.text(`Sample Type: ${block.sampleType || "-"}`, 330, 196);
    // doc.text(`Report Date: ${block.reportDate || "-"}`, 450, 196);

    if (isPathologyLike && block.rows.some((row) => normalizeGroup(row.parameter) !== "Other Parameters")) {
      const grouped = groupRows(block.rows);
      let startY = 208;
      const contentWidth = doc.internal.pageSize.getWidth() - 56;

      grouped.forEach((rows, groupName) => {
        renderResultTable(doc, rows, startY, contentWidth, groupName);
        startY = (doc as any).lastAutoTable.finalY + 10;
      });
    } else {
      renderResultTable(doc, block.rows, 208, doc.internal.pageSize.getWidth() - 56);
    }

    const interpretation = block.interpretation?.trim();

    if (interpretation) {
      const pageHeight = doc.internal.pageSize.getHeight();
      let y = Math.max(((doc as any).lastAutoTable?.finalY ?? 212) + 10, 212);

      if (y > pageHeight - 140) {
        doc.addPage();
        addPageFrame(doc, patient, block.reportStatus || "Final", logoBase64, inferredTitle);
        y = 182;
      }

      const lines = doc.splitTextToSize(interpretation, 520);
      const boxHeight = Math.min(70, lines.length * 9 + 26);

      doc.setDrawColor(215);
      doc.setFillColor(248, 248, 248);
      doc.roundedRect(28, y, doc.internal.pageSize.getWidth() - 56, boxHeight, 3, 3, "FD");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8.5);
      doc.setTextColor(20);
      doc.text("Interpretation", 36, y + 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(lines.slice(0, 5), 36, y + 28);
    }
  });

  const totalPages = doc.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  console.log("[PDF] total pages generated", totalPages);

  const blob = doc.output("blob");
  console.log("[PDF] final PDF blob size", blob.size);

  doc.save(filename);
}
