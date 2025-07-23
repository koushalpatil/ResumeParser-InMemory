import { Link, useLocation } from "react-router-dom";
import { generatePDFReport, downloadSimpleReport } from "../utils/pdfGenerator";
import {
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Star,
  ArrowLeft,
  Target,
  Award,
  Clock,
} from "lucide-react";

import { Section, LocationState } from "../interfaces/ResultInterfaces";

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const {
    fileName = "resume.pdf",
    fileSize = 1024 * 1024,
    analysisTime,

    analysisFeedback,
    success = false,
  } = (location.state as LocationState) || {};

  if (!success || !analysisFeedback) {
    return (
      <div className="py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              No Analysis Data Found
            </h1>
            <p className="text-gray-600 mb-8">
              Please upload and analyze a resume first.
            </p>
            <Link
              to="/upload"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Upload Resume
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const analysisData = analysisFeedback;
  const fileData = { fileName, fileSize };

  const handleDownloadPDF = async () => {
    try {
      await generatePDFReport(analysisData, fileData);
    } catch (error) {
      console.error("Error generating PDF:", error);

      downloadSimpleReport(analysisData, fileData);
    }
  };

  const handleDownloadSimple = () => {
    downloadSimpleReport(analysisData, fileData);
  };

  const formatAnalysisTime = (timeString?: string): string => {
    if (!timeString) return "Analyzed recently";

    try {
      const date = new Date(timeString);
      const now = new Date();
      const diffMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );

      if (diffMinutes < 1) return "Analyzed just now";
      if (diffMinutes < 60)
        return `Analyzed ${diffMinutes} minute${
          diffMinutes > 1 ? "s" : ""
        } ago`;

      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24)
        return `Analyzed ${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;

      return `Analyzed on ${date.toLocaleDateString()}`;
    } catch (error) {
      return "Analyzed recently";
    }
  };

  const getScoreColorClass = (score: number): string => {
    if (score >= 85) return "border-green-500 bg-green-50 text-green-600";
    if (score >= 70) return "border-yellow-500 bg-yellow-50 text-yellow-600";
    return "border-red-500 bg-red-50 text-red-600";
  };

  const getScoreStatus = (score: number): string => {
    if (score >= 85) return "Excellent Resume";
    if (score >= 70) return "Good Resume";
    return "Needs Improvement";
  };

  return (
    <div className="py-8 lg:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to="/upload"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Upload New Resume
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Resume Analysis Results
              </h1>
              <p className="text-gray-600 flex items-center space-x-4">
                <span className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatAnalysisTime(analysisTime)}</span>
                </span>
                <span>•</span>
                <span>{fileName}</span>
              </p>
            </div>

            <div className="mt-6 lg:mt-0">
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={handleDownloadPDF}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleDownloadSimple}
                  className="border-2 border-blue-500 text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>Download TXT</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Overall Resume Score
              </h2>

              <div className="flex items-center space-x-6 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <div
                      className={`w-20 h-20 rounded-full border-8 flex items-center justify-center ${getScoreColorClass(
                        analysisData.overallScore
                      )}`}
                    >
                      <span className="text-2xl font-bold">
                        {analysisData.overallScore}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {getScoreStatus(analysisData.overallScore)}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {analysisData.summary}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">
                    {analysisData.strengths?.length || 0}
                  </div>
                  <div className="text-green-700 font-medium">
                    Strengths Found
                  </div>
                </div>

                <div className="text-center p-4 bg-orange-50 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">
                    {analysisData.improvements?.length || 0}
                  </div>
                  <div className="text-orange-700 font-medium">
                    Areas to Improve
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {analysisData.missingSkills &&
              analysisData.missingSkills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-blue-500" />
                    <span>Missing Skills</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {analysisData.missingSkills.map(
                      (skill: string, index: number) => (
                        <span
                          key={index}
                          className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                </div>
              )}

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6">
              <Award className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
              <p className="text-blue-100">
                Adding the missing skills could increase your match rate by up
                to 40% for your target roles.
              </p>
            </div>
          </div>
        </div>

        {/* Strengths & Improvements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {analysisData.strengths && analysisData.strengths.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Strengths</span>
              </h2>

              <div className="space-y-4">
                {analysisData.strengths.map(
                  (strength: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl"
                    >
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{strength}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          {analysisData.improvements &&
            analysisData.improvements.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                  <AlertTriangle className="h-6 w-6 text-orange-500" />
                  <span>Areas for Improvement</span>
                </h2>

                <div className="space-y-4">
                  {analysisData.improvements.map(
                    (improvement: string, index: number) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-orange-50 rounded-xl"
                      >
                        <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                        <p className="text-gray-700">{improvement}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {analysisData.sections && analysisData.sections.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Section-wise Analysis
            </h2>

            <div className="space-y-8">
              {analysisData.sections.map((section: Section, index: number) => {
                const icons = [User, Briefcase, GraduationCap, Wrench];
                const IconComponent = icons[index] || Star;

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <IconComponent className="h-6 w-6 text-blue-500" />
                        <h3 className="text-xl font-semibold text-gray-900">
                          {section.name}
                        </h3>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-16 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            section.score >= 85
                              ? "bg-green-100 text-green-700"
                              : section.score >= 70
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {section.score}
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{section.feedback}</p>

                    {section.suggestions && section.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Suggestions:
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-gray-600">
                          {section.suggestions.map(
                            (suggestion: string, suggestionIndex: number) => (
                              <li key={suggestionIndex}>{suggestion}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              Ready to improve your resume?
            </h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Use these insights to update your resume and try our analyzer
              again to see your improved score.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link
                to="/upload"
                className="bg-white text-blue-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300"
              >
                Analyze Another Resume
              </Link>

              <button
                onClick={handleDownloadPDF}
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download Full Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
