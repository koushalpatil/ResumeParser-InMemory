import jsPDF from "jspdf";
import { FileData } from "../interfaces/PdfGeneratorInterfaces";
import { AnalysisData } from "../interfaces/ResultInterfaces";

export const generatePDFReport = async (
  analysisData: AnalysisData,
  fileData: FileData
) => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize: number = 10
  ) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + lines.length * fontSize * 0.35;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Header
  pdf.setFillColor(59, 130, 246); // Blue color
  pdf.rect(0, 0, pageWidth, 30, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("SmartResumeAI", margin, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Resume Analysis Report", margin, 26);

  yPosition = 45;

  // File Information
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("File Information", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  pdf.text(`File Name: ${fileData.fileName}`, margin, yPosition);
  yPosition += 6;
  pdf.text(
    `File Size: ${(fileData.fileSize / 1024 / 1024).toFixed(2)} MB`,
    margin,
    yPosition
  );
  yPosition += 6;
  pdf.text(
    `Analysis Date: ${new Date().toLocaleDateString()}`,
    margin,
    yPosition
  );
  yPosition += 15;

  // Overall Score
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Overall Resume Score", margin, yPosition);
  yPosition += 10;

  // Score circle background
  pdf.setFillColor(34, 197, 94); // Green color
  pdf.circle(margin + 15, yPosition + 10, 12, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(analysisData.overallScore.toString(), margin + 10, yPosition + 13);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text("Good Resume", margin + 35, yPosition + 8);

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  yPosition = addWrappedText(
    analysisData.summary,
    margin + 35,
    yPosition + 15,
    pageWidth - margin - 50
  );
  yPosition += 15;

  // Strengths
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("✓ Strengths", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  analysisData.strengths.forEach((strength, index) => {
    checkNewPage(8);
    yPosition = addWrappedText(
      `• ${strength}`,
      margin + 5,
      yPosition,
      pageWidth - margin - 10
    );
    yPosition += 3;
  });
  yPosition += 10;

  // Areas for Improvement
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("⚠ Areas for Improvement", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  analysisData.improvements.forEach((improvement, index) => {
    checkNewPage(8);
    yPosition = addWrappedText(
      `• ${improvement}`,
      margin + 5,
      yPosition,
      pageWidth - margin - 10
    );
    yPosition += 3;
  });
  yPosition += 10;

  // Missing Skills
  checkNewPage(30);
  pdf.setFontSize(14);
  pdf.setFont("helvetica", "bold");
  pdf.text("Missing Skills", margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  const skillsText = analysisData.missingSkills.join(", ");
  yPosition = addWrappedText(
    skillsText,
    margin,
    yPosition,
    pageWidth - margin * 2
  );
  yPosition += 15;

  // Section-wise Analysis
  checkNewPage(40);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Section-wise Analysis", margin, yPosition);
  yPosition += 15;

  analysisData.sections.forEach((section, index) => {
    checkNewPage(35);

    // Section header
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(`${section.name} (Score: ${section.score})`, margin, yPosition);
    yPosition += 8;

    // Feedback
    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    yPosition = addWrappedText(
      section.feedback,
      margin,
      yPosition,
      pageWidth - margin * 2
    );
    yPosition += 5;

    // Suggestions
    pdf.setFont("helvetica", "bold");
    pdf.text("Suggestions:", margin, yPosition);
    yPosition += 5;

    pdf.setFont("helvetica", "normal");
    section.suggestions.forEach((suggestion) => {
      checkNewPage(6);
      yPosition = addWrappedText(
        `• ${suggestion}`,
        margin + 5,
        yPosition,
        pageWidth - margin - 10
      );
      yPosition += 2;
    });
    yPosition += 10;
  });

  // Footer
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(8);
    pdf.setTextColor(128, 128, 128);
    pdf.text(
      `Generated by SmartResumeAI - Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // Save the PDF
  const fileName = `resume-analysis-${fileData.fileName.replace(
    /\.[^/.]+$/,
    ""
  )}-${new Date().toISOString().split("T")[0]}.pdf`;
  pdf.save(fileName);
};

export const downloadSimpleReport = (
  analysisData: AnalysisData,
  fileData: FileData
) => {
  const reportContent = `
SMARTRESUMEAI - RESUME ANALYSIS REPORT
=====================================

File Information:
- File Name: ${fileData.fileName}
- File Size: ${(fileData.fileSize / 1024 / 1024).toFixed(2)} MB
- Analysis Date: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${analysisData.overallScore}/100
${analysisData.summary}

STRENGTHS:
${analysisData.strengths.map((strength) => `• ${strength}`).join("\n")}

AREAS FOR IMPROVEMENT:
${analysisData.improvements.map((improvement) => `• ${improvement}`).join("\n")}

MISSING SKILLS:
${analysisData.missingSkills.join(", ")}

SECTION-WISE ANALYSIS:
${analysisData.sections
  .map(
    (section) => `
${section.name.toUpperCase()} (Score: ${section.score}/100)
${section.feedback}

Suggestions:
${section.suggestions.map((suggestion) => `• ${suggestion}`).join("\n")}
`
  )
  .join("\n")}

---
Generated by SmartResumeAI
Powered by AI Technology
  `.trim();

  const blob = new Blob([reportContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `resume-analysis-${fileData.fileName.replace(
    /\.[^/.]+$/,
    ""
  )}-${new Date().toISOString().split("T")[0]}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
