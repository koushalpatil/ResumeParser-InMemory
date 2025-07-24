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
  Search,
  Shield,
  Users,
  Building,
  BookOpen,
  Zap,
  TrendingDown,
  AlertCircle,
} from "lucide-react";
import { LocationState } from "../interfaces/ResultInterfaces";

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
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    return "Needs Improvement";
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "Medium":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <TrendingDown className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColorClass = (priority: string): string => {
    switch (priority) {
      case "High":
        return "bg-red-50 border-red-200 text-red-700";
      case "Medium":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "Low":
        return "bg-green-50 border-green-200 text-green-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const hasJobMatchScore = analysisData.jobMatchScore !== undefined;
  const hasJobAlignment = analysisData.jobDescriptionAlignment !== undefined;

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
                Resume Analysis Scores
              </h2>

              <div
                className={`grid ${
                  hasJobMatchScore ? "grid-cols-2" : "grid-cols-1"
                } gap-8 mb-6`}
              >
                <div className="text-center">
                  <div className="relative mx-auto w-32 h-32 mb-4">
                    <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                      <div
                        className={`w-24 h-24 rounded-full border-8 flex items-center justify-center ${getScoreColorClass(
                          analysisData.overallScore
                        )}`}
                      >
                        <span className="text-2xl font-bold">
                          {analysisData.overallScore}
                        </span>
                      </div>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    Overall Score
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getScoreStatus(analysisData.overallScore)} Resume
                  </p>
                </div>

                {hasJobMatchScore && (
                  <div className="text-center">
                    <div className="relative mx-auto w-32 h-32 mb-4">
                      <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                        <div
                          className={`w-24 h-24 rounded-full border-8 flex items-center justify-center ${getScoreColorClass(
                            analysisData.jobMatchScore ?? 0
                          )}`}
                        >
                          <span className="text-2xl font-bold">
                            {analysisData.jobMatchScore}
                          </span>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      Job Match Score
                    </h3>
                    <p className="text-sm text-gray-600">
                      {getScoreStatus(analysisData.jobMatchScore ?? 0)} Match
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Analysis Summary
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {analysisData.summary}
                </p>
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
            {hasJobAlignment && analysisData.jobDescriptionAlignment && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>Job Match Overview</span>
                </h3>

                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Target Role:
                    </span>
                    <p className="text-gray-900">
                      {analysisData.jobDescriptionAlignment.roleType}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Experience Match:
                    </span>
                    <p
                      className={`text-sm font-medium ${
                        analysisData.jobDescriptionAlignment.matchStatus ===
                        "Exceeds requirement"
                          ? "text-green-600"
                          : analysisData.jobDescriptionAlignment.matchStatus ===
                            "Meets requirement"
                          ? "text-blue-600"
                          : "text-red-600"
                      }`}
                    >
                      {analysisData.jobDescriptionAlignment.matchStatus}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-medium text-gray-500">
                      Required vs Candidate:
                    </span>
                    <p className="text-gray-900 text-sm">
                      {
                        analysisData.jobDescriptionAlignment
                          .experienceRequirement
                      }{" "}
                      required,
                      {
                        analysisData.jobDescriptionAlignment.candidateExperience
                      }{" "}
                      candidate
                    </p>
                  </div>
                </div>
              </div>
            )}

            {analysisData.missingSkills &&
              analysisData.missingSkills.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <Target className="h-5 w-5 text-red-500" />
                    <span>Missing Skills</span>
                  </h3>
                  <div className="space-y-3">
                    {analysisData.missingSkills.map((skillDetail, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-red-200 pl-3"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900">
                            {skillDetail.skill}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              skillDetail.impact === "High"
                                ? "bg-red-100 text-red-700"
                                : skillDetail.impact === "Medium"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {skillDetail.impact} Impact
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 mb-1">
                          <span className="font-medium">
                            {skillDetail.jdImportance}
                          </span>{" "}
                          • {skillDetail.frequency}
                        </p>
                        <p className="text-xs text-gray-500">
                          {skillDetail.suggestion}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {analysisData.keywordMatch && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Search className="h-5 w-5 text-green-500" />
                  <span>Keyword Analysis</span>
                </h3>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">
                      Current Density:
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {analysisData.keywordMatch.keywordDensity}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">
                      Target:
                    </span>
                    <span className="text-sm text-gray-500">
                      {analysisData.keywordMatch.recommendedDensity}
                    </span>
                  </div>
                </div>

                {analysisData.keywordMatch.matchedKeywords &&
                  analysisData.keywordMatch.matchedKeywords.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Matched Keywords (
                        {analysisData.keywordMatch.matchedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {analysisData.keywordMatch.matchedKeywords.map(
                          (keyword, index) => (
                            <span
                              key={index}
                              className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium border border-green-200"
                              title={`JD: ${keyword.jdFrequency}x, Resume: ${
                                keyword.resumeFrequency || 0
                              }x`}
                            >
                              {keyword.keyword}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {analysisData.keywordMatch.missingKeywords &&
                  analysisData.keywordMatch.missingKeywords.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Missing Keywords (
                        {analysisData.keywordMatch.missingKeywords.length})
                      </h4>
                      <div className="space-y-2">
                        {analysisData.keywordMatch.missingKeywords.map(
                          (keyword, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between text-xs"
                            >
                              <span className="bg-red-50 text-red-700 px-2 py-1 rounded font-medium border border-red-200">
                                {keyword.keyword}
                              </span>
                              <span
                                className={`px-2 py-1 rounded ${
                                  keyword.criticality === "High"
                                    ? "bg-red-100 text-red-600"
                                    : keyword.criticality === "Medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {keyword.criticality}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {analysisData.atsOptimization && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <span>ATS Optimization</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Current Score:
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {analysisData.atsOptimization.currentKeywordScore}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Target Score:
                    </span>
                    <span className="text-sm text-gray-500">
                      {analysisData.atsOptimization.targetKeywordScore}
                    </span>
                  </div>

                  {analysisData.atsOptimization.missingCriticalTerms.length >
                    0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Critical Missing Terms:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {analysisData.atsOptimization.missingCriticalTerms.map(
                          (term, index) => (
                            <span
                              key={index}
                              className="bg-red-50 text-red-700 px-2 py-1 rounded text-xs font-medium border border-red-200"
                            >
                              {term}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl p-6">
              <Award className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Pro Tip</h3>
              <p className="text-blue-100">
                {hasJobMatchScore
                  ? "Focus on adding missing keywords and skills to improve your job match score."
                  : "Adding relevant skills could increase your match rate by up to 40% for your target roles."}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {analysisData.strengths && analysisData.strengths.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span>Strengths</span>
              </h2>

              <div className="space-y-4">
                {analysisData.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl"
                  >
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{strength}</p>
                  </div>
                ))}
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

                <div className="space-y-6">
                  {analysisData.improvements.map((category, categoryIndex) => (
                    <div
                      key={categoryIndex}
                      className="border border-gray-200 rounded-xl p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                          {getPriorityIcon(category.priority)}
                          <span>{category.category}</span>
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColorClass(
                            category.priority
                          )}`}
                        >
                          {category.priority} Priority
                        </span>
                      </div>

                      <div className="space-y-2">
                        {category.items.map((item, itemIndex) => (
                          <div
                            key={itemIndex}
                            className="flex items-start space-x-2 p-2 bg-gray-50 rounded-lg"
                          >
                            <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                            <p className="text-gray-700 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {hasJobAlignment && analysisData.jobDescriptionAlignment && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Job Description Alignment Details
            </h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Zap className="h-5 w-5 text-red-500" />
                <span>Must-Have Skills Analysis</span>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {analysisData.jobDescriptionAlignment.mustHaveSkills.matched
                  .length > 0 && (
                  <div>
                    <h4 className="font-semibold text-green-700 mb-3">
                      ✅ Matched Skills
                    </h4>
                    <div className="space-y-3">
                      {analysisData.jobDescriptionAlignment.mustHaveSkills.matched.map(
                        (skill, index) => (
                          <div
                            key={index}
                            className="border border-green-200 rounded-lg p-3 bg-green-50"
                          >
                            <div className="flex justify-between items-start mb-1">
                              <span className="font-medium text-gray-900">
                                {skill.skill}
                              </span>
                              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                                {skill.status}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">Your Level:</span>{" "}
                              {skill.candidateLevel} |
                              <span className="font-medium"> Required:</span>{" "}
                              {skill.required}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {analysisData.jobDescriptionAlignment.mustHaveSkills.missing
                  .length > 0 && (
                  <div>
                    <h4 className="font-semibold text-red-700 mb-3">
                      ❌ Missing Critical Skills
                    </h4>
                    <div className="space-y-3">
                      {analysisData.jobDescriptionAlignment.mustHaveSkills.missing.map(
                        (skill, index) => (
                          <div
                            key={index}
                            className="border border-red-200 rounded-lg p-3 bg-red-50"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-900">
                                {skill.skill}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 rounded ${
                                  skill.impact === "High"
                                    ? "bg-red-100 text-red-700"
                                    : skill.impact === "Medium"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                                }`}
                              >
                                {skill.impact} Impact
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 mb-2">
                              <span className="font-medium">
                                Required Level:
                              </span>{" "}
                              {skill.required}
                            </div>
                            <div className="text-sm text-gray-700 bg-white p-2 rounded border-l-2 border-blue-300">
                              <span className="font-medium text-blue-700">
                                Workaround:
                              </span>{" "}
                              {skill.workaround}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {analysisData.jobDescriptionAlignment.responsibilityAlignment
              .length > 0 && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Responsibility Alignment</span>
                </h3>

                <div className="space-y-4">
                  {analysisData.jobDescriptionAlignment.responsibilityAlignment.map(
                    (resp, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900">
                              Job Requirement:
                            </span>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                resp.matchStrength === "High"
                                  ? "bg-green-100 text-green-700"
                                  : resp.matchStrength === "Medium"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : resp.matchStrength === "Low"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {resp.matchStrength} Match
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm bg-gray-50 p-2 rounded">
                            {resp.jdRequirement}
                          </p>
                        </div>

                        <div className="mb-3">
                          <span className="font-medium text-gray-900">
                            Your Evidence:
                          </span>
                          <p className="text-gray-700 text-sm bg-blue-50 p-2 rounded mt-1">
                            {resp.resumeEvidence}
                          </p>
                        </div>

                        {resp.improvement && (
                          <div>
                            <span className="font-medium text-gray-900">
                              Improvement Suggestion:
                            </span>
                            <p className="text-gray-700 text-sm bg-yellow-50 p-2 rounded mt-1 border-l-2 border-yellow-300">
                              {resp.improvement}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {analysisData.specificJobRequirements && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Specific Job Requirements Analysis
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <GraduationCap className="h-5 w-5 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">Education</h3>
                  <span className="text-lg">
                    {analysisData.specificJobRequirements.education.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Required:</span>
                    <p className="text-gray-700">
                      {analysisData.specificJobRequirements.education.required}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Your Background:
                    </span>
                    <p className="text-gray-700">
                      {analysisData.specificJobRequirements.education.candidate}
                    </p>
                  </div>
                  {analysisData.specificJobRequirements.education.note && (
                    <div>
                      <span className="font-medium text-gray-600">Note:</span>
                      <p className="text-gray-700">
                        {analysisData.specificJobRequirements.education.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Briefcase className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-gray-900">Experience</h3>
                  <span className="text-lg">
                    {analysisData.specificJobRequirements.experience.status}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Required:</span>
                    <p className="text-gray-700">
                      {analysisData.specificJobRequirements.experience.required}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Your Experience:
                    </span>
                    <p className="text-gray-700">
                      {
                        analysisData.specificJobRequirements.experience
                          .candidate
                      }
                    </p>
                  </div>
                  {analysisData.specificJobRequirements.experience.note && (
                    <div>
                      <span className="font-medium text-gray-600">Note:</span>
                      <p className="text-gray-700">
                        {analysisData.specificJobRequirements.experience.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Users className="h-5 w-5 text-purple-500" />
                  <h3 className="font-semibold text-gray-900">
                    Technical Leadership
                  </h3>
                  <span className="text-lg">
                    {
                      analysisData.specificJobRequirements.technicalLeadership
                        .status
                    }
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Required:</span>
                    <p className="text-gray-700">
                      {
                        analysisData.specificJobRequirements.technicalLeadership
                          .required
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Your Experience:
                    </span>
                    <p className="text-gray-700">
                      {
                        analysisData.specificJobRequirements.technicalLeadership
                          .candidate
                      }
                    </p>
                  </div>
                  {analysisData.specificJobRequirements.technicalLeadership
                    .improvement && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Improvement:
                      </span>
                      <p className="text-gray-700">
                        {
                          analysisData.specificJobRequirements
                            .technicalLeadership.improvement
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Building className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold text-gray-900">
                    Industry Experience
                  </h3>
                  <span className="text-lg">
                    {
                      analysisData.specificJobRequirements.industryExperience
                        .status
                    }
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Required:</span>
                    <p className="text-gray-700">
                      {
                        analysisData.specificJobRequirements.industryExperience
                          .required
                      }
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">
                      Your Background:
                    </span>
                    <p className="text-gray-700">
                      {
                        analysisData.specificJobRequirements.industryExperience
                          .candidate
                      }
                    </p>
                  </div>
                  {analysisData.specificJobRequirements.industryExperience
                    .improvement && (
                    <div>
                      <span className="font-medium text-gray-600">
                        Improvement:
                      </span>
                      <p className="text-gray-700">
                        {
                          analysisData.specificJobRequirements
                            .industryExperience.improvement
                        }
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisData.recommendedChanges && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Recommended Action Plan
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center space-x-2 mb-4">
                  <Zap className="h-5 w-5 text-red-500" />
                  <h3 className="font-semibold text-red-700">
                    Immediate (Week 1)
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysisData.recommendedChanges.immediate.map(
                    (change, index) => (
                      <div key={index} className="p-3 bg-red-50 rounded-lg">
                        <p className="text-gray-700 text-sm">{change}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center space-x-2 mb-4">
                  <TrendingUp className="h-5 w-5 text-yellow-500" />
                  <h3 className="font-semibold text-yellow-700">
                    Phase 2 (Month 1)
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysisData.recommendedChanges.phase2.map(
                    (change, index) => (
                      <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                        <p className="text-gray-700 text-sm">{change}</p>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center space-x-2 mb-4">
                  <BookOpen className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-green-700">
                    Phase 3 (Long-term)
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysisData.recommendedChanges.phase3.map(
                    (change, index) => (
                      <div key={index} className="p-3 bg-green-50 rounded-lg">
                        <p className="text-gray-700 text-sm">{change}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {analysisData.sections && analysisData.sections.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Section-wise Analysis
            </h2>

            <div className="space-y-8">
              {analysisData.sections.map((section, index) => {
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

                      <div className="flex items-center space-x-4">
                        <div className="text-center">
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
                          <span className="text-xs text-gray-500">Overall</span>
                        </div>

                        {hasJobAlignment && (
                          <div className="text-center">
                            <div
                              className={`w-16 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                section.jdAlignment >= 85
                                  ? "bg-green-100 text-green-700"
                                  : section.jdAlignment >= 70
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {section.jdAlignment}
                            </div>
                            <span className="text-xs text-gray-500">
                              JD Match
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="text-gray-600 mb-4">{section.feedback}</p>

                    {section.jdSpecificIssues &&
                      section.jdSpecificIssues.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-red-700 mb-2 flex items-center space-x-1">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Job Description Alignment Issues:</span>
                          </h4>
                          <ul className="list-disc list-inside space-y-1 text-red-600 bg-red-50 p-3 rounded-lg">
                            {section.jdSpecificIssues.map(
                              (issue, issueIndex) => (
                                <li key={issueIndex} className="text-sm">
                                  {issue}
                                </li>
                              )
                            )}
                          </ul>
                        </div>
                      )}

                    {section.suggestions && section.suggestions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2 flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>Specific Improvement Suggestions:</span>
                        </h4>
                        <ul className="list-disc list-inside space-y-1 text-green-700 bg-green-50 p-3 rounded-lg">
                          {section.suggestions.map(
                            (suggestion, suggestionIndex) => (
                              <li key={suggestionIndex} className="text-sm">
                                {suggestion}
                              </li>
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

        <div className="text-center">
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
