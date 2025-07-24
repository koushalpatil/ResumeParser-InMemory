class PromptService {
  static buildResumeAnalysisPrompt(resumeText, jobDescription = null) {
    const basePrompt = `
      You are an expert resume analyst and ATS optimization specialist. Analyze the following resume text and provide a comprehensive analysis in EXACT JSON format.

      CRITICAL: Your response must be ONLY valid JSON without any additional text, explanations, or markdown formatting.

      Required JSON structure:
      {
        "overallScore": <integer between 60-100 based on resume quality and job fit>,
        "jobMatchScore": <integer between 60-100 based on how well resume matches job requirements>,
        "summary": "<2-3 sentence professional summary covering technical background, strengths, alignment with job requirements, and key improvement areas>",
        
        "jobDescriptionAlignment": {
          "roleType": "<target role from job description>",
          "experienceRequirement": "<years required from JD>",
          "candidateExperience": "<candidate's years of experience>",
          "matchStatus": "<Exceeds requirement/Meets requirement/Below requirement>",
          "mustHaveSkills": {
            "matched": [
              {"skill": "<skill name>", "candidateLevel": "<Expert/Advanced/Intermediate/Basic>", "required": "<Advanced/Intermediate/Basic>", "status": "<Strong Match/Perfect Match/Exceeds Requirement/Meets Requirement>"}
            ],
            "missing": [
              {"skill": "<missing skill>", "required": "<Advanced/Intermediate/Basic>", "impact": "<High/Medium/Low>", "workaround": "<suggestion to address this gap>"}
            ]
          },
          "preferredSkills": {
            "matched": ["<matched preferred skill>"],
            "missing": ["<missing preferred skill>"],
            "partialMatch": [
              {"skill": "<skill name>", "jdRequirement": "<what JD asks for>", "candidateEvidence": "<what candidate shows>"}
            ]
          },
          "responsibilityAlignment": [
            {
              "jdRequirement": "<responsibility from job description>",
              "resumeEvidence": "<evidence from resume>",
              "matchStrength": "<High/Medium/Low/Poor>",
              "improvement": "<specific suggestion to strengthen this match>"
            }
          ]
        },

        "strengths": [
          "<specific strength with direct relevance to job requirements - mention specific technologies, experience level, and job relevance>",
          "<leadership/management strength with quantification if possible>",
          "<educational or certification strength matching job requirements>",
          "<project delivery or technical achievement strength>"
        ],

        "improvements": [
          {
            "category": "<Missing Critical Skills/Quantification Gaps/Keyword Optimization/Experience Presentation>",
            "priority": "<High/Medium/Low>",
            "items": [
              "<specific actionable improvement with reasoning tied to job requirements>",
              "<specific actionable improvement with reasoning tied to job requirements>",
              "<specific actionable improvement with reasoning tied to job requirements>"
            ]
          }
        ],

        "missingSkills": [
          {
            "skill": "<missing technical skill>",
            "jdImportance": "<Required/Preferred/Nice to have>",
            "frequency": "<how often mentioned in JD>",
            "suggestion": "<specific way to acquire or demonstrate this skill>",
            "alternativeWording": "<how to present partial knowledge if any>"
          }
        ],

        "keywordMatch": {
          "matchedKeywords": [
            {"keyword": "<matched keyword>", "jdFrequency": <number>, "resumeFrequency": <number>, "context": "<Strong match/Good match/Adequate match/Minimal match>"}
          ],
          "missingKeywords": [
            {"keyword": "<missing keyword>", "jdFrequency": <number>, "criticality": "<High/Medium/Low>", "suggestion": "<where/how to add this keyword>"}
          ],
          "keywordDensity": "<current percentage>%",
          "recommendedDensity": "65-75%",
          "improvementNeeded": "<specific guidance on keyword optimization>"
        },

        "specificJobRequirements": {
          "education": {
            "required": "<education requirement from JD>",
            "candidate": "<candidate's education>",
            "status": "<✅ Meets Requirement/⚠️ Partially Meets/❌ Does Not Meet>",
            "note": "<additional context if needed>"
          },
          "experience": {
            "required": "<experience requirement from JD>",
            "candidate": "<candidate's experience>",
            "status": "<✅ Exceeds Requirement/✅ Meets Requirement/⚠️ Partially Meets/❌ Below Requirement>",
            "note": "<additional context if needed>"
          },
          "technicalLeadership": {
            "required": "<leadership requirement from JD>",
            "candidate": "<candidate's leadership experience>",
            "status": "<✅ Meets Requirement/⚠️ Partially Meets/❌ No Evidence>",
            "improvement": "<specific suggestion if not fully met>"
          },
          "industryExperience": {
            "required": "<industry/domain requirement>",
            "candidate": "<candidate's industry background>",
            "status": "<✅ Strong Match/⚠️ Unclear/❌ Different Industry>",
            "improvement": "<suggestion to address if needed>"
          }
        },

        "sections": [
          {
            "name": "Professional Summary",
            "score": <integer 60-100>,
            "jdAlignment": <integer 60-100>,
            "feedback": "<detailed feedback on current summary effectiveness and job alignment issues>",
            "jdSpecificIssues": [
              "<specific issue with job description alignment>",
              "<missing key terms from JD>",
              "<understated relevant experience>"
            ],
            "suggestions": [
              "<specific rewrite suggestion using JD language>",
              "<suggestion to highlight relevant achievements>",
              "<suggestion to include missing key terms>"
            ]
          },
          {
            "name": "Work Experience",
            "score": <integer 60-100>,
            "jdAlignment": <integer 60-100>,
            "feedback": "<detailed feedback on experience relevance and presentation for target job>",
            "jdSpecificIssues": [
              "<missing responsibility that JD emphasizes>",
              "<lack of quantification for achievements JD would value>",
              "<missing technical skills demonstration>"
            ],
            "suggestions": [
              "<specific bullet point addition with metrics>",
              "<suggestion to reframe existing experience for JD alignment>",
              "<suggestion to add missing responsibility examples>"
            ]
          },
          {
            "name": "Education",
            "score": <integer 60-100>,
            "jdAlignment": <integer 60-100>,
            "feedback": "<feedback on education relevance to job requirements>",
            "jdSpecificIssues": ["<specific alignment issues or 'None - strong match'>"],
            "suggestions": [
              "<suggestion to enhance education section if needed>",
              "<suggestion to add relevant coursework or projects>"
            ]
          },
          {
            "name": "Skills",
            "score": <integer 60-100>,
            "jdAlignment": <integer 60-100>,
            "feedback": "<detailed feedback on skills section job alignment and organization>",
            "jdSpecificIssues": [
              "<missing required technical skill from JD>",
              "<poor organization affecting ATS parsing>",
              "<missing soft skills mentioned in JD>"
            ],
            "suggestions": [
              "<specific skills to add with context from JD>",
              "<reorganization suggestion for better ATS performance>",
              "<suggestion to better present existing skills>"
            ]
          }
        ],

        "recommendedChanges": {
          "immediate": [
            "<quick win change that significantly improves JD alignment>",
            "<essential missing keyword to add>",
            "<simple quantification to add>",
            "<role title adjustment for better match>"
          ],
          "phase2": [
            "<more substantial experience section improvements>",
            "<skills section reorganization>",
            "<achievement quantification additions>",
            "<responsibility alignment improvements>"
          ],
          "phase3": [
            "<long-term skill development suggestions>",
            "<certification or training recommendations>",
            "<portfolio or project additions>",
            "<networking or reference improvements>"
          ]
        },

        "atsOptimization": {
          "currentKeywordScore": "<percentage>%",
          "targetKeywordScore": "70%",
          "missingCriticalTerms": ["<term1>", "<term2>", "<term3>"],
          "overusedTerms": ["<term if any>"],
          "recommendations": "<specific guidance on improving ATS score with keyword targets>"
        }
      }`;

    const jobSpecificAnalysis = jobDescription
      ? `

      IMPORTANT: This analysis should be specifically tailored to the following job description. Focus on:
      1. Deep analysis of job requirements vs resume content
      2. Specific skill gaps with impact assessment
      3. Keyword extraction and frequency analysis
      4. Responsibility alignment scoring
      5. ATS optimization recommendations
      6. Actionable improvements prioritized by impact
      7. Quantified achievements alignment with job expectations
      8. Technical leadership requirements vs demonstrated experience
      9. Industry/domain experience relevance
      10. Missing certifications or qualifications

      Job Description:
      ${jobDescription}

      Analysis Guidelines:
      1. Extract all technical skills, soft skills, and requirements from the job description
      2. Score skill matches as Expert/Advanced/Intermediate/Basic vs JD requirements
      3. Identify critical vs preferred skills and their impact on candidacy
      4. Analyze each major responsibility mentioned in JD for resume evidence
      5. Count keyword frequencies and calculate optimization opportunities
      6. Provide specific, actionable improvements with clear reasoning
      7. Prioritize improvements by impact on job match score
      8. Include workarounds for skill gaps (courses, projects, alternative experience)
      9. Suggest specific metrics and quantifications that would impress for this role
      10. Consider ATS parsing and keyword density optimization

      `
      : `

      Analysis Guidelines:
      1. Provide general industry-standard analysis
      2. Focus on resume quality, completeness, and professional presentation  
      3. Identify strengths based on demonstrated experience and skills
      4. Suggest improvements for overall resume effectiveness
      5. Include general missing skills relevant to the candidate's field
      6. Provide constructive feedback for each section
      7. Focus on quantification, achievement demonstration, and clarity
      8. Consider standard ATS optimization best practices

      `;

    return `${basePrompt}${jobSpecificAnalysis}

      Resume Content:
      ${resumeText}
    `;
  }

  static buildGeneralResumeAnalysisPrompt(resumeText) {
    return this.buildResumeAnalysisPrompt(resumeText, null);
  }
}
export default PromptService;
