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

  const checkNewPage = (requiredHeight: number) => {
    if (yPosition + requiredHeight > pageHeight - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  const getScoreColor = (score: number): [number, number, number] => {
    if (score >= 85) return [34, 197, 94];
    if (score >= 70) return [245, 158, 11];
    return [239, 68, 68];
  };

  const getScoreStatus = (score: number): string => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  pdf.setFillColor(59, 130, 246);
  pdf.rect(0, 0, pageWidth, 30, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont("helvetica", "bold");
  pdf.text("SmartResumeAI", margin, 20);

  pdf.setFontSize(12);
  pdf.setFont("helvetica", "normal");
  pdf.text("Resume Analysis Report", margin, 26);

  yPosition = 45;

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

  checkNewPage(60);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text("Resume Analysis Scores", margin, yPosition);
  yPosition += 15;

  const overallColor = getScoreColor(analysisData.overallScore);
  pdf.setFillColor(overallColor[0], overallColor[1], overallColor[2]);
  pdf.circle(margin + 15, yPosition + 10, 12, "F");

  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(16);
  pdf.setFont("helvetica", "bold");
  pdf.text(analysisData.overallScore.toString(), margin + 10, yPosition + 13);

  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(12);
  pdf.setFont("helvetica", "bold");
  pdf.text(
    `Overall Score - ${getScoreStatus(analysisData.overallScore)}`,
    margin + 35,
    yPosition + 8
  );

  if (analysisData.jobMatchScore !== undefined) {
    const jobMatchColor = getScoreColor(analysisData.jobMatchScore);
    pdf.setFillColor(jobMatchColor[0], jobMatchColor[1], jobMatchColor[2]);
    pdf.circle(margin + 15, yPosition + 35, 12, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      analysisData.jobMatchScore.toString(),
      margin + 10,
      yPosition + 38
    );

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(
      `Job Match Score - ${getScoreStatus(analysisData.jobMatchScore)}`,
      margin + 35,
      yPosition + 33
    );
    yPosition += 25;
  }

  yPosition += 25;

  pdf.setFontSize(10);
  pdf.setFont("helvetica", "normal");
  yPosition = addWrappedText(
    `Summary: ${analysisData.summary}`,
    margin,
    yPosition,
    pageWidth - margin * 2
  );
  yPosition += 15;

  if (analysisData.jobDescriptionAlignment) {
    checkNewPage(50);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Job Match Overview", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Target Role: ${analysisData.jobDescriptionAlignment.roleType}`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Experience Match: ${analysisData.jobDescriptionAlignment.matchStatus}`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Required Experience: ${analysisData.jobDescriptionAlignment.experienceRequirement}`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Candidate Experience: ${analysisData.jobDescriptionAlignment.candidateExperience}`,
      margin,
      yPosition
    );
    yPosition += 15;
  }

  if (analysisData.strengths && analysisData.strengths.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("✓ Strengths", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    analysisData.strengths.forEach((strength) => {
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
  }

  if (analysisData.improvements && analysisData.improvements.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("⚠ Areas for Improvement", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    analysisData.improvements.forEach((category) => {
      checkNewPage(15);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${category.category} (${category.priority} Priority)`,
        margin + 5,
        yPosition
      );
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      category.items.forEach((item) => {
        checkNewPage(6);
        yPosition = addWrappedText(
          `  • ${item}`,
          margin + 10,
          yPosition,
          pageWidth - margin - 15
        );
        yPosition += 2;
      });
      yPosition += 5;
    });
    yPosition += 10;
  }

  if (analysisData.missingSkills && analysisData.missingSkills.length > 0) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Missing Skills Analysis", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    analysisData.missingSkills.forEach((skillDetail) => {
      checkNewPage(15);
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `${skillDetail.skill} (${skillDetail.impact} Impact)`,
        margin + 5,
        yPosition
      );
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Importance: ${skillDetail.jdImportance} • Frequency: ${skillDetail.frequency}`,
        margin + 5,
        yPosition
      );
      yPosition += 5;

      yPosition = addWrappedText(
        `Suggestion: ${skillDetail.suggestion}`,
        margin + 5,
        yPosition,
        pageWidth - margin - 10
      );
      yPosition += 8;
    });
    yPosition += 10;
  }

  if (analysisData.keywordMatch) {
    checkNewPage(40);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Keyword Analysis", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Current Density: ${analysisData.keywordMatch.keywordDensity}`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Target Density: ${analysisData.keywordMatch.recommendedDensity}`,
      margin,
      yPosition
    );
    yPosition += 10;

    if (
      analysisData.keywordMatch.matchedKeywords &&
      analysisData.keywordMatch.matchedKeywords.length > 0
    ) {
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Matched Keywords (${analysisData.keywordMatch.matchedKeywords.length}):`,
        margin,
        yPosition
      );
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      const matchedKeywords = analysisData.keywordMatch.matchedKeywords
        .map((k) => k.keyword)
        .join(", ");
      yPosition = addWrappedText(
        matchedKeywords,
        margin + 5,
        yPosition,
        pageWidth - margin - 10
      );
      yPosition += 8;
    }

    if (
      analysisData.keywordMatch.missingKeywords &&
      analysisData.keywordMatch.missingKeywords.length > 0
    ) {
      pdf.setFont("helvetica", "bold");
      pdf.text(
        `Missing Keywords (${analysisData.keywordMatch.missingKeywords.length}):`,
        margin,
        yPosition
      );
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      analysisData.keywordMatch.missingKeywords.forEach((keyword) => {
        checkNewPage(8);
        pdf.text(
          `• ${keyword.keyword} (${keyword.criticality} priority)`,
          margin + 5,
          yPosition
        );
        yPosition += 5;
      });
      yPosition += 5;
    }
    yPosition += 10;
  }

  if (analysisData.atsOptimization) {
    checkNewPage(30);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("ATS Optimization", margin, yPosition);
    yPosition += 10;

    pdf.setFontSize(10);
    pdf.setFont("helvetica", "normal");
    pdf.text(
      `Current Score: ${analysisData.atsOptimization.currentKeywordScore}`,
      margin,
      yPosition
    );
    yPosition += 6;
    pdf.text(
      `Target Score: ${analysisData.atsOptimization.targetKeywordScore}`,
      margin,
      yPosition
    );
    yPosition += 10;

    if (analysisData.atsOptimization.missingCriticalTerms.length > 0) {
      pdf.setFont("helvetica", "bold");
      pdf.text("Critical Missing Terms:", margin, yPosition);
      yPosition += 6;

      pdf.setFont("helvetica", "normal");
      const criticalTerms =
        analysisData.atsOptimization.missingCriticalTerms.join(", ");
      yPosition = addWrappedText(
        criticalTerms,
        margin + 5,
        yPosition,
        pageWidth - margin - 10
      );
      yPosition += 10;
    }
  }

  if (analysisData.specificJobRequirements) {
    checkNewPage(50);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Job Requirements Analysis", margin, yPosition);
    yPosition += 15;

    const requirements = [
      {
        name: "Education",
        data: analysisData.specificJobRequirements.education,
      },
      {
        name: "Experience",
        data: analysisData.specificJobRequirements.experience,
      },
      {
        name: "Technical Leadership",
        data: analysisData.specificJobRequirements.technicalLeadership,
      },
      {
        name: "Industry Experience",
        data: analysisData.specificJobRequirements.industryExperience,
      },
    ];

    requirements.forEach((req) => {
      checkNewPage(20);
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      pdf.text(`${req.name}: ${req.data.status}`, margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Required: ${req.data.required}`, margin + 5, yPosition);
      yPosition += 5;
      pdf.text(`Candidate: ${req.data.candidate}`, margin + 5, yPosition);
      yPosition += 5;

      if (req.data.note) {
        yPosition = addWrappedText(
          `Note: ${req.data.note}`,
          margin + 5,
          yPosition,
          pageWidth - margin - 10
        );
        yPosition += 3;
      }

      if (req.data.improvement) {
        yPosition = addWrappedText(
          `Improvement: ${req.data.improvement}`,
          margin + 5,
          yPosition,
          pageWidth - margin - 10
        );
        yPosition += 3;
      }
      yPosition += 8;
    });
  }

  if (analysisData.recommendedChanges) {
    checkNewPage(60);
    pdf.setFontSize(14);
    pdf.setFont("helvetica", "bold");
    pdf.text("Recommended Action Plan", margin, yPosition);
    yPosition += 15;

    const phases = [
      {
        name: "Immediate (Week 1)",
        items: analysisData.recommendedChanges.immediate,
      },
      {
        name: "Phase 2 (Month 1)",
        items: analysisData.recommendedChanges.phase2,
      },
      {
        name: "Phase 3 (Long-term)",
        items: analysisData.recommendedChanges.phase3,
      },
    ];

    phases.forEach((phase) => {
      if (phase.items.length > 0) {
        checkNewPage(15);
        pdf.setFontSize(12);
        pdf.setFont("helvetica", "bold");
        pdf.text(phase.name, margin, yPosition);
        yPosition += 8;

        pdf.setFontSize(10);
        pdf.setFont("helvetica", "normal");
        phase.items.forEach((item) => {
          checkNewPage(6);
          yPosition = addWrappedText(
            `• ${item}`,
            margin + 5,
            yPosition,
            pageWidth - margin - 10
          );
          yPosition += 2;
        });
        yPosition += 8;
      }
    });
  }

  if (analysisData.sections && analysisData.sections.length > 0) {
    checkNewPage(40);
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Section-wise Analysis", margin, yPosition);
    yPosition += 15;

    analysisData.sections.forEach((section) => {
      checkNewPage(40);

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "bold");
      const sectionTitle = `${section.name} (Overall: ${section.score}/100${
        section.jdAlignment ? `, JD Match: ${section.jdAlignment}/100` : ""
      })`;
      pdf.text(sectionTitle, margin, yPosition);
      yPosition += 8;

      pdf.setFontSize(10);
      pdf.setFont("helvetica", "normal");
      yPosition = addWrappedText(
        section.feedback,
        margin,
        yPosition,
        pageWidth - margin * 2
      );
      yPosition += 8;

      if (section.jdSpecificIssues && section.jdSpecificIssues.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Job Description Alignment Issues:", margin, yPosition);
        yPosition += 6;

        pdf.setFont("helvetica", "normal");
        section.jdSpecificIssues.forEach((issue) => {
          checkNewPage(6);
          yPosition = addWrappedText(
            `• ${issue}`,
            margin + 5,
            yPosition,
            pageWidth - margin - 10
          );
          yPosition += 2;
        });
        yPosition += 5;
      }

      if (section.suggestions && section.suggestions.length > 0) {
        pdf.setFont("helvetica", "bold");
        pdf.text("Improvement Suggestions:", margin, yPosition);
        yPosition += 6;

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
      }
    });
  }

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
  let reportContent = `
SMARTRESUMEAI - RESUME ANALYSIS REPORT
=====================================

File Information:
- File Name: ${fileData.fileName}
- File Size: ${(fileData.fileSize / 1024 / 1024).toFixed(2)} MB
- Analysis Date: ${new Date().toLocaleDateString()}

OVERALL SCORE: ${analysisData.overallScore}/100`;

  if (analysisData.jobMatchScore !== undefined) {
    reportContent += `\nJOB MATCH SCORE: ${analysisData.jobMatchScore}/100`;
  }

  reportContent += `\n\nSUMMARY:\n${analysisData.summary}`;

  if (analysisData.jobDescriptionAlignment) {
    reportContent += `\n\nJOB MATCH OVERVIEW:
- Target Role: ${analysisData.jobDescriptionAlignment.roleType}
- Experience Match: ${analysisData.jobDescriptionAlignment.matchStatus}
- Required Experience: ${analysisData.jobDescriptionAlignment.experienceRequirement}
- Candidate Experience: ${analysisData.jobDescriptionAlignment.candidateExperience}`;
  }

  if (analysisData.strengths && analysisData.strengths.length > 0) {
    reportContent += `\n\nSTRENGTHS:
${analysisData.strengths.map((strength) => `• ${strength}`).join("\n")}`;
  }

  if (analysisData.improvements && analysisData.improvements.length > 0) {
    reportContent += `\n\nAREAS FOR IMPROVEMENT:`;
    analysisData.improvements.forEach((category) => {
      reportContent += `\n\n${category.category} (${category.priority} Priority):`;
      category.items.forEach((item) => {
        reportContent += `\n  • ${item}`;
      });
    });
  }

  if (analysisData.missingSkills && analysisData.missingSkills.length > 0) {
    reportContent += `\n\nMISSING SKILLS ANALYSIS:`;
    analysisData.missingSkills.forEach((skill) => {
      reportContent += `\n\n${skill.skill} (${skill.impact} Impact)
  Importance: ${skill.jdImportance} • Frequency: ${skill.frequency}
  Suggestion: ${skill.suggestion}`;
    });
  }

  if (analysisData.keywordMatch) {
    reportContent += `\n\nKEYWORD ANALYSIS:
- Current Density: ${analysisData.keywordMatch.keywordDensity}
- Target Density: ${analysisData.keywordMatch.recommendedDensity}`;

    if (
      analysisData.keywordMatch.matchedKeywords &&
      analysisData.keywordMatch.matchedKeywords.length > 0
    ) {
      reportContent += `\n- Matched Keywords (${
        analysisData.keywordMatch.matchedKeywords.length
      }): ${analysisData.keywordMatch.matchedKeywords
        .map((k) => k.keyword)
        .join(", ")}`;
    }

    if (
      analysisData.keywordMatch.missingKeywords &&
      analysisData.keywordMatch.missingKeywords.length > 0
    ) {
      reportContent += `\n- Missing Keywords (${analysisData.keywordMatch.missingKeywords.length}):`;
      analysisData.keywordMatch.missingKeywords.forEach((keyword) => {
        reportContent += `\n  • ${keyword.keyword} (${keyword.criticality} priority)`;
      });
    }
  }

  if (analysisData.atsOptimization) {
    reportContent += `\n\nATS OPTIMIZATION:
- Current Score: ${analysisData.atsOptimization.currentKeywordScore}
- Target Score: ${analysisData.atsOptimization.targetKeywordScore}`;

    if (analysisData.atsOptimization.missingCriticalTerms.length > 0) {
      reportContent += `\n- Critical Missing Terms: ${analysisData.atsOptimization.missingCriticalTerms.join(
        ", "
      )}`;
    }
  }

  if (analysisData.specificJobRequirements) {
    reportContent += `\n\nJOB REQUIREMENTS ANALYSIS:
- Education: ${analysisData.specificJobRequirements.education.status}
  Required: ${analysisData.specificJobRequirements.education.required}
  Candidate: ${analysisData.specificJobRequirements.education.candidate}`;

    reportContent += `\n- Experience: ${analysisData.specificJobRequirements.experience.status}
  Required: ${analysisData.specificJobRequirements.experience.required}
  Candidate: ${analysisData.specificJobRequirements.experience.candidate}`;

    reportContent += `\n- Technical Leadership: ${analysisData.specificJobRequirements.technicalLeadership.status}
  Required: ${analysisData.specificJobRequirements.technicalLeadership.required}
  Candidate: ${analysisData.specificJobRequirements.technicalLeadership.candidate}`;

    reportContent += `\n- Industry Experience: ${analysisData.specificJobRequirements.industryExperience.status}
  Required: ${analysisData.specificJobRequirements.industryExperience.required}
  Candidate: ${analysisData.specificJobRequirements.industryExperience.candidate}`;
  }

  if (analysisData.recommendedChanges) {
    reportContent += `\n\nRECOMMENDED ACTION PLAN:`;

    if (analysisData.recommendedChanges.immediate.length > 0) {
      reportContent += `\n\nImmediate (Week 1):
${analysisData.recommendedChanges.immediate
  .map((item) => `• ${item}`)
  .join("\n")}`;
    }

    if (analysisData.recommendedChanges.phase2.length > 0) {
      reportContent += `\n\nPhase 2 (Month 1):
${analysisData.recommendedChanges.phase2
  .map((item) => `• ${item}`)
  .join("\n")}`;
    }

    if (analysisData.recommendedChanges.phase3.length > 0) {
      reportContent += `\n\nPhase 3 (Long-term):
${analysisData.recommendedChanges.phase3
  .map((item) => `• ${item}`)
  .join("\n")}`;
    }
  }

  if (analysisData.sections && analysisData.sections.length > 0) {
    reportContent += `\n\nSECTION-WISE ANALYSIS:`;
    analysisData.sections.forEach((section) => {
      reportContent += `\n\n${section.name.toUpperCase()} (Overall: ${
        section.score
      }/100${
        section.jdAlignment ? `, JD Match: ${section.jdAlignment}/100` : ""
      })
${section.feedback}`;

      if (section.jdSpecificIssues && section.jdSpecificIssues.length > 0) {
        reportContent += `\n\nJob Description Alignment Issues:
${section.jdSpecificIssues.map((issue) => `• ${issue}`).join("\n")}`;
      }

      if (section.suggestions && section.suggestions.length > 0) {
        reportContent += `\n\nImprovement Suggestions:
${section.suggestions.map((suggestion) => `• ${suggestion}`).join("\n")}`;
      }
    });
  }

  reportContent += `\n\n---
Generated by SmartResumeAI
Powered by AI Technology`;

  const blob = new Blob([reportContent.trim()], { type: "text/plain" });
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
