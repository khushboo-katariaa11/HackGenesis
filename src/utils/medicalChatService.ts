// Medical Chat Service with Gemini, OpenRouter OSS, and Hugging Face Model Support
import { PatientData, AnalysisResult } from '../types';

// API Configuration
const API_CONFIG = {
  openRouter: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    model: 'openai/gpt-oss-20b',
    maxTokens: 2000,
    temperature: 0.7
  },
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    maxTokens: 2000,
    temperature: 0.7
  },
  huggingface: {
    url: 'https://router.huggingface.co/v1/chat/completions',
    models: {
      '20b': 'openai/gpt-oss-20b:together',   // Uses :together provider
      '120b': 'openai/gpt-oss-120b:cerebras'  // Uses :cerebras provider
    },
    maxTokens: 2000,
    temperature: 0.7
  }
};

// Build medical prompt with patient data and analysis
const buildMedicalPrompt = (patientData: PatientData, analysisResult: AnalysisResult, userQuestion: string): string => {
  const prompt = `You are a highly skilled musculoskeletal radiologist and medical consultant.
You have access to a patient's complete diagnostic report and imaging analysis.
Your role is to provide professional medical consultation based ONLY on the provided data.

=== CRITICAL SYSTEM INSTRUCTIONS ===
1. You MUST ONLY discuss the specific medical case provided below
2. You MUST NOT provide general medical advice or information unrelated to this case
3. You MUST NOT diagnose or treat conditions not mentioned in the provided data
4. You MUST NOT provide medical advice for other patients or hypothetical scenarios
5. You MUST NOT discuss medications, treatments, or procedures not related to this specific case
6. If asked about topics unrelated to this case, politely redirect to this specific case
7. Always emphasize that this consultation is specific to the provided diagnostic data only
8. If the question cannot be answered from the provided data, clearly state this limitation
9. Maintain professional medical standards and patient confidentiality
10. Always recommend consulting with healthcare providers for any medical decisions

=== Patient Case Data ===
Patient Information:
- Name: ${patientData.name}
- Patient ID: ${patientData.patientId}
- Age: ${patientData.age} years
- Sex: ${patientData.sex}
- Clinical History: ${patientData.clinicalNote || 'Not provided'}

AI Analysis Results:
- Diagnosis: ${analysisResult.diagnosis}
- Confidence: ${(analysisResult.confidence * 100).toFixed(1)}%
- Processing Time: ${analysisResult.processingTime.toFixed(2)} seconds
- Analysis Date: ${new Date(analysisResult.timestamp).toLocaleString()}

${analysisResult.detailedAnalysis ? `
Detailed Analysis:
- Overall Impression: ${analysisResult.detailedAnalysis.overallImpression}

Fracture Analysis:
${analysisResult.detailedAnalysis.detailedFindings.fractureAnalysis}

Joint & Alignment Analysis:
${analysisResult.detailedAnalysis.detailedFindings.jointAlignmentAnalysis}

Bone Integrity Analysis:
${analysisResult.detailedAnalysis.detailedFindings.boneIntegrityAnalysis}

Soft Tissue Analysis:
${analysisResult.detailedAnalysis.detailedFindings.softTissueAnalysis}

Explainability Analysis:
- Focus Correlation: ${analysisResult.detailedAnalysis.explainabilityAnalysis.focusCorrelation}
- Clinical Confidence: ${analysisResult.detailedAnalysis.explainabilityAnalysis.clinicalConfidence}

Potential Complications:
${analysisResult.detailedAnalysis.potentialComplications}

Recommended Follow-up:
${analysisResult.detailedAnalysis.recommendedFollowUp}
` : `
Basic Analysis:
The AI model has classified this case as ${analysisResult.diagnosis} with ${(analysisResult.confidence * 100).toFixed(1)}% confidence.
Grad-CAM visualization shows ${analysisResult.diagnosis === 'Fracture' ? 'focal areas of attention corresponding to suspected fracture regions' : 'distributed attention across normal anatomical structures'}.
`}

${analysisResult.shapExplanation ? `
SHAP Explainability Analysis:
- SHAP Available: ${analysisResult.shapExplanation.available}
- Description: ${analysisResult.shapExplanation.description}
${analysisResult.shapExplanation.topFeatures.length > 0 ? `
- Top Contributing Regions: ${analysisResult.shapExplanation.topFeatures.slice(0, 3).map((feature, idx) => 
  `\n  ${idx + 1}. Position (${feature.position.row}, ${feature.position.col}) - Importance: ${(feature.importance * 100).toFixed(1)}%`
).join('')}
` : '- No specific regions identified'}
` : ''}

=== Consultation Instructions ===
1. You are responding to a specific patient question about THEIR medical case ONLY.
2. Base your response strictly on the provided diagnostic data for THIS SPECIFIC CASE.
3. Provide clear, professional medical explanations appropriate for THIS patient's consultation.
4. Use structured, evidence-based responses specific to THIS case's findings.
5. If the question cannot be answered from the provided data, clearly state this limitation.
6. Always maintain a professional, compassionate tone appropriate for medical consultation.
7. Include relevant medical context specific to THIS case and explain technical terms in patient-friendly language.
8. Provide actionable guidance when appropriate, but always emphasize the need for professional medical follow-up.
9. If asked about unrelated medical topics, respond: "I can only discuss your specific case based on the provided diagnostic data. For general medical questions, please consult with your healthcare provider."
10. Always begin responses with context about this specific case to reinforce scope limitations.

=== Patient Question ===
${userQuestion}

=== Your Medical Response ===
Please provide a comprehensive, professional medical response to the patient's question about THEIR SPECIFIC CASE ONLY. 
Begin your response by acknowledging this is about their specific diagnostic case, and ensure all advice is directly related to the provided data.

IMPORTANT: Use markdown formatting for better readability:
- Use **bold text** for important medical terms and findings
- Use *italic text* for emphasis
- Use bullet points (-) for lists of symptoms, treatments, or recommendations
- Use numbered lists (1., 2., 3.) for step-by-step instructions
- Use ### for section headings when appropriate
- Use > for important notes or warnings`;

  return prompt;
};

// Call OpenRouter API (OSS Model)
const callOpenRouterAPI = async (prompt: string, apiKey: string): Promise<string> => {
  const response = await fetch(API_CONFIG.openRouter.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: API_CONFIG.openRouter.model,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: API_CONFIG.openRouter.maxTokens,
      temperature: API_CONFIG.openRouter.temperature
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

// Call Gemini API
const callGeminiAPI = async (prompt: string, apiKey: string): Promise<string> => {
  const url = `${API_CONFIG.gemini.url}?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        maxOutputTokens: API_CONFIG.gemini.maxTokens,
        temperature: API_CONFIG.gemini.temperature
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini API request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

// Call Hugging Face API - Routes to specific model based on selection
const callHuggingFaceAPI = async (prompt: string, apiKey: string, modelSize: '20b' | '120b'): Promise<string> => {
  const model = API_CONFIG.huggingface.models[modelSize];
  const provider = modelSize === '20b' ? 'together' : 'cerebras';
  
  console.log(`🤗 Hugging Face: Using ${modelSize.toUpperCase()} model on ${provider} (${model})`);
  
  const response = await fetch(API_CONFIG.huggingface.url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: [{ role: 'user', content: prompt }],
      model: model,
      max_tokens: API_CONFIG.huggingface.maxTokens,
      temperature: API_CONFIG.huggingface.temperature,
      stream: false // Set to false for non-streaming (can be enhanced later)
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Hugging Face API request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  
  // Handle response format
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content;
  } else {
    throw new Error('Invalid response format from Hugging Face API');
  }
};

// Main chat function
export const getMedicalChatResponse = async (
  patientData: PatientData,
  analysisResult: AnalysisResult,
  userQuestion: string,
  modelChoice: 'gemini' | 'oss' | 'hf-20b' | 'hf-120b'
): Promise<string> => {
  try {
    // Get API keys from environment
    const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
    const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

    if (!openRouterApiKey && !geminiApiKey && !huggingFaceApiKey) {
      throw new Error('No API keys configured. Please set VITE_OPENROUTER_API_KEY, VITE_GEMINI_API_KEY, or VITE_HUGGINGFACE_API_KEY');
    }

    // Build the medical prompt
    const prompt = buildMedicalPrompt(patientData, analysisResult, userQuestion);

    // Call the appropriate API based on model selection
    console.log(`🎯 Selected model: ${modelChoice}`);
    
    if (modelChoice === 'oss') {
      if (!openRouterApiKey) {
        throw new Error('OpenRouter API key not configured');
      }
      console.log('🔄 Using OpenRouter GPT-OSS');
      return await callOpenRouterAPI(prompt, openRouterApiKey);
    } else if (modelChoice === 'hf-20b') {
      if (!huggingFaceApiKey) {
        throw new Error('Hugging Face API key not configured');
      }
      console.log('🤗 Using Hugging Face GPT-OSS 20B');
      return await callHuggingFaceAPI(prompt, huggingFaceApiKey, '20b');
    } else if (modelChoice === 'hf-120b') {
      if (!huggingFaceApiKey) {
        throw new Error('Hugging Face API key not configured');
      }
      console.log('🤗 Using Hugging Face GPT-OSS 120B');
      return await callHuggingFaceAPI(prompt, huggingFaceApiKey, '120b');
    } else {
      if (!geminiApiKey) {
        throw new Error('Gemini API key not configured');
      }
      console.log('🧠 Using Google Gemini');
      return await callGeminiAPI(prompt, geminiApiKey);
    }
  } catch (error) {
    console.error('Medical chat error:', error);
    throw new Error(`Failed to get medical consultation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Check if chat service is available
export const checkChatAvailability = async (): Promise<{ oss: boolean; gemini: boolean; huggingface: boolean }> => {
  const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const huggingFaceApiKey = import.meta.env.VITE_HUGGINGFACE_API_KEY;

  return {
    oss: !!openRouterApiKey,
    gemini: !!geminiApiKey,
    huggingface: !!huggingFaceApiKey
  };
};
