/**
 * ReportDownload - Generates and downloads a PDF report of the analysis.
 * Uses jsPDF library to create a formatted PDF document.
 */

import { jsPDF } from "jspdf";
import type { AnalysisResult } from "@/lib/ethicsAnalyzer";
import { getScoreLabel } from "@/lib/ethicsAnalyzer";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ReportDownloadProps {
  result: AnalysisResult;
  text: string;
}

const ReportDownload = ({ result, text }: ReportDownloadProps) => {
  const handleDownload = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;

    // Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("EthicsCheck AI Report", pageWidth / 2, y, { align: "center" });
    y += 12;

    // Date
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, y, { align: "center" });
    y += 15;

    // Overall Score
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`Overall Ethics Score: ${result.overallScore}/100 (${getScoreLabel(result.overallScore)})`, 20, y);
    y += 12;

    // Breakdown
    doc.setFontSize(14);
    doc.text("Category Breakdown", 20, y);
    y += 8;

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    for (const cat of result.breakdown) {
      doc.setFont("helvetica", "bold");
      doc.text(`${cat.name}: ${cat.score}/100`, 25, y);
      y += 6;
      doc.setFont("helvetica", "normal");
      const lines = doc.splitTextToSize(cat.details, pageWidth - 50);
      doc.text(lines, 25, y);
      y += lines.length * 5 + 4;
    }

    // Warnings
    if (result.warnings.length > 0) {
      y += 4;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Warnings", 20, y);
      y += 8;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      for (const w of result.warnings) {
        const lines = doc.splitTextToSize(w, pageWidth - 50);
        doc.text(lines, 25, y);
        y += lines.length * 5 + 3;
      }
    }

    // Suggestions
    y += 4;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Suggestions", 20, y);
    y += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    for (const s of result.suggestions) {
      const lines = doc.splitTextToSize(`• ${s}`, pageWidth - 50);
      doc.text(lines, 25, y);
      y += lines.length * 5 + 3;
    }

    // Analyzed text (truncated)
    if (y < 240) {
      y += 8;
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text("Analyzed Text (Preview)", 20, y);
      y += 8;
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      const preview = text.length > 500 ? text.slice(0, 500) + "..." : text;
      const lines = doc.splitTextToSize(preview, pageWidth - 40);
      doc.text(lines, 20, y);
    }

    doc.save("ethicscheck-report.pdf");
  };

  return (
    <Button onClick={handleDownload} variant="outline" className="gap-2">
      <Download className="w-4 h-4" />
      Download Report
    </Button>
  );
};

export default ReportDownload;
