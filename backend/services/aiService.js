import { GoogleGenerativeAI } from "@google/generative-ai";
import config from "../config/config.js";
import PromptService from "./promptService.js";
import ValidationService from "./validationService.js";

class AiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(config.ai.apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: config.ai.model,
    });
  }

  async analyzeResume(resumeText) {
    const prompt = PromptService.buildResumeAnalysisPrompt(resumeText);

    try {
      const result = await this.model.generateContent(prompt);
      const responseText = await result.response.text();

      if (!responseText) {
        throw new Error("No response received from AI service");
      }

      return this.parseAndValidateResponse(responseText);
    } catch (error) {
      throw new Error(`AI analysis failed: ${error.message}`);
    }
  }

  parseAndValidateResponse(responseText) {
    const cleanedResponse = this.cleanResponse(responseText);

    let analysisData;
    try {
      analysisData = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", parseError);
      console.error("Raw response:", responseText);
      throw new Error(
        "AI service returned invalid data format. Please try again."
      );
    }

    ValidationService.validateAnalysisData(analysisData);
    return analysisData;
  }

  cleanResponse(responseText) {
    let cleaned = responseText.trim();
    cleaned = cleaned.replace(/```json\s*/g, "");
    cleaned = cleaned.replace(/```\s*$/g, "");
    return cleaned.trim();
  }
}

export default AiService;
