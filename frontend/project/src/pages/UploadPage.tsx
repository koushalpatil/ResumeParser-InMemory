import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  FileText,
  CheckCircle,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";

const UploadPage = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setError("");

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = (uploadedFile: File) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(uploadedFile.type)) {
      setError("Please upload a PDF or DOCX file only.");
      return;
    }

    if (uploadedFile.size > maxSize) {
      setError("File size must be less than 5MB.");
      return;
    }

    setFile(uploadedFile);
    setError("");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleJobDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setJobDescription(e.target.value);
  };

  const analyzeResume = async () => {
    if (!file) return;

    if (!jobDescription.trim()) {
      setError("Please provide a job description for better analysis.");
      return;
    }

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch("http://localhost:3000/api/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const { extractedText, analysis } = result;

      console.log("Extracted feedback - ", analysis);

      navigate("/results", {
        state: {
          fileName: file.name,
          fileSize: file.size,
          analysisTime: new Date().toISOString(),
          extractedText,
          analysisFeedback: analysis,
          jobDescription,
          success: true,
        },
      });
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setError(
        error instanceof Error
          ? `Failed to analyze resume: ${error.message}`
          : "Failed to analyze resume. Please try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Upload Your Resume
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Upload your resume and provide a job description to get tailored
            AI-powered feedback
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-12">
          {!file ? (
            <div
              className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
                dragActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload
                className={`mx-auto h-16 w-16 mb-6 ${
                  dragActive ? "text-blue-500" : "text-gray-400"
                }`}
              />

              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                Drop your resume here
              </h3>
              <p className="text-gray-600 mb-6">
                Or click to browse and select your file
              </p>

              <label className="cursor-pointer">
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx"
                  onChange={handleFileSelect}
                />
                <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 inline-block">
                  Browse Files
                </span>
              </label>

              <div className="mt-6 text-sm text-gray-500">
                Supported formats: PDF, DOCX • Max size: 5MB
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8">
                  <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    File Uploaded Successfully
                  </h3>
                  <div className="flex items-center justify-center space-x-2 text-gray-600 mb-4">
                    <FileText className="h-5 w-5" />
                    <span>{file.name}</span>
                    <span>•</span>
                    <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8">
                <div className="flex items-center space-x-3 mb-4">
                  <Briefcase className="h-6 w-6 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Job Description
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Paste the job description to get tailored feedback on how well
                  your resume matches the role.
                </p>
                <textarea
                  value={jobDescription}
                  onChange={handleJobDescriptionChange}
                  placeholder="Paste the job description here..."
                  className="w-full h-48 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                  disabled={isAnalyzing}
                />
                <div className="mt-2 text-sm text-gray-500">
                  {jobDescription.length} characters
                </div>
              </div>

              <div className="text-center space-y-4">
                <button
                  onClick={analyzeResume}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Analyzing Resume...</span>
                    </>
                  ) : (
                    <>
                      <span>Analyze Resume Against Job</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => {
                    setFile(null);
                    setJobDescription("");
                    setError("");
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Upload Different File
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700">{error}</p>
            </div>
          )}
        </div>

        {isAnalyzing && (
          <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-500 animate-spin" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Analyzing Your Resume Against Job Requirements
              </h3>
              <p className="text-gray-600 mb-6">
                Our AI is extracting text from your resume and comparing it with
                the job description...
              </p>

              <div className="max-w-md mx-auto">
                <div className="bg-gray-200 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full animate-pulse"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Text Extraction</span>
                  <span>Job Matching</span>
                  <span>Analysis</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadPage;
