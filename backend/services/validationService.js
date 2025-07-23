class ValidationService {
  static validateAnalysisData(analysisData) {
    const requiredFields = [
      "overallScore",
      "summary",
      "strengths",
      "improvements",
      "missingSkills",
      "sections",
    ];

    for (const field of requiredFields) {
      if (!analysisData.hasOwnProperty(field)) {
        throw new Error(
          `AI analysis missing required field: ${field}. Please try again.`
        );
      }
    }

    this.validateOverallScore(analysisData.overallScore);
    this.validateSummary(analysisData.summary);
    this.validateArrayFields(analysisData);
    this.validateSections(analysisData.sections);
  }

  static validateOverallScore(score) {
    if (typeof score !== "number" || score < 0 || score > 100) {
      throw new Error(
        "Invalid overall score from AI analysis. Please try again."
      );
    }
  }

  static validateSummary(summary) {
    if (typeof summary !== "string" || summary.length < 10) {
      throw new Error("Invalid summary from AI analysis. Please try again.");
    }
  }

  static validateArrayFields(analysisData) {
    const arrayFields = ["strengths", "improvements", "missingSkills"];
    for (const field of arrayFields) {
      if (
        !Array.isArray(analysisData[field]) ||
        analysisData[field].length === 0
      ) {
        throw new Error(
          `Invalid ${field} data from AI analysis. Please try again.`
        );
      }
    }
  }

  static validateSections(sections) {
    const requiredSectionFields = ["name", "score", "feedback", "suggestions"];

    for (const section of sections) {
      for (const field of requiredSectionFields) {
        if (!section.hasOwnProperty(field)) {
          throw new Error(
            `Section analysis missing required field: ${field}. Please try again.`
          );
        }
      }

      if (
        typeof section.score !== "number" ||
        section.score < 0 ||
        section.score > 100
      ) {
        throw new Error(
          `Invalid section score for ${section.name}. Please try again.`
        );
      }

      if (
        !Array.isArray(section.suggestions) ||
        section.suggestions.length === 0
      ) {
        throw new Error(
          `Invalid suggestions for section ${section.name}. Please try again.`
        );
      }
    }
  }
}

export default ValidationService;
