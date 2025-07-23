class PromptService {
  static buildResumeAnalysisPrompt(resumeText) {
    return `
      You are an expert resume analyst. Analyze the following resume text and provide a comprehensive analysis in EXACT JSON format.

      CRITICAL: Your response must be ONLY valid JSON without any additional text, explanations, or markdown formatting.

      Required JSON structure:
      {
        "overallScore": <integer between 60-100 based on resume quality>,
        "summary": "<2-3 sentence professional summary of strengths and improvement areas>",
        "strengths": [
          "<specific strength based on resume content>",
          "<specific strength based on resume content>",
          "<specific strength based on resume content>",
          "<specific strength based on resume content>"
        ],
        "improvements": [
          "<actionable improvement suggestion>",
          "<actionable improvement suggestion>",
          "<actionable improvement suggestion>",
          "<actionable improvement suggestion>"
        ],
        "missingSkills": [
          "<relevant missing skill for their field>",
          "<relevant missing skill for their field>",
          "<relevant missing skill for their field>",
          "<relevant missing skill for their field>",
          "<relevant missing skill for their field>",
          "<relevant missing skill for their field>"
        ],
        "sections": [
          {
            "name": "Professional Summary",
            "score": <integer 60-100>,
            "feedback": "<specific feedback about their summary/objective section>",
            "suggestions": [
              "<specific suggestion>",
              "<specific suggestion>",
              "<specific suggestion>"
            ]
          },
          {
            "name": "Work Experience",
            "score": <integer 60-100>,
            "feedback": "<specific feedback about their work experience section>",
            "suggestions": [
              "<specific suggestion>",
              "<specific suggestion>"
            ]
          },
          {
            "name": "Education",
            "score": <integer 60-100>,
            "feedback": "<specific feedback about their education section>",
            "suggestions": [
              "<specific suggestion>",
              "<specific suggestion>"
            ]
          },
          {
            "name": "Skills",
            "score": <integer 60-100>,
            "feedback": "<specific feedback about their skills section>",
            "suggestions": [
              "<specific suggestion>",
              "<specific suggestion>",
              "<specific suggestion>"
            ]
          }
        ]
      }

      Analysis Guidelines:
      1. Base overallScore on content quality, formatting, achievements, and completeness
      2. Identify actual strengths from the resume content
      3. Provide specific, actionable improvements
      4. Suggest missing skills relevant to their career field/industry
      5. Score each section based on presence, quality, and effectiveness
      6. Give constructive, specific feedback for each section
      7. Ensure all suggestions are practical and implementable

      Resume Content:
      ${resumeText}
    `;
  }
}

export default PromptService;
