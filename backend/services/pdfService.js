import pdf from "pdf-parse";

class PdfService {
  static async extractTextFromPdfBuffer(dataBuffer) {
    try {
      const data = await pdf(dataBuffer);

      if (!data.text || data.text.trim().length < 50) {
        throw new Error(
          "Unable to extract sufficient text from the PDF. Please ensure the file contains readable text content."
        );
      }

      return data.text;
    } catch (error) {
      throw new Error(`PDF extraction failed: ${error.message}`);
    }
  }
}

export default PdfService;
