import path from "path";
import PdfService from "../services/pdfService.js";
import AiService from "../services/aiService.js";
import { cleanupFile } from "../utils/fileUtils.js";

class ResumeController {
  constructor() {
    this.aiService = new AiService();
  }

  async extractText(req, res) {
    try {
      const file = req.file;
      const jobDescription = req.body.jobDescription;

      if (!file) {
        return res.status(400).json({
          error: "No file uploaded.",
        });
      }

      if (!jobDescription || jobDescription.trim() === "") {
        return res.status(400).json({
          error: "Job description is required for analysis.",
        });
      }

      const extractedText = await PdfService.extractTextFromPdfBuffer(
        file.buffer
      );

      const analysis = await this.aiService.analyzeResume(
        extractedText,
        jobDescription
      );

      res.status(200).json({
        success: true,
        fileName: file.originalname,
        fileSize: file.size,
        extractedText,
        analysis,
        jobDescription,
      });
    } catch (error) {
      console.error("Error processing resume analysis:", error);

      res.status(500).json({
        error: error.message || "Failed to process resume analysis.",
        timestamp: new Date().toISOString(),
      });
    }
  }
}

export default new ResumeController();
