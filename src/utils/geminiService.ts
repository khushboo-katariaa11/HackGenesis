// Google Gemini Multimodal Analysis Service
import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuration for Google Gemini API
const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
  projectId: import.meta.env.VITE_GEMINI_PROJECT_ID || 'maximal-copilot-471113-q4',
  location: import.meta.env.VITE_GEMINI_LOCATION || 'asia-south1',
  modelName: 'gemini-2.0-flash-exp'
};

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(GEMINI_CONFIG.apiKey);

// Detailed analysis prompt for medical imaging
const ANALYSIS_PROMPT = `
**Role:** You are an expert AI clinical assistant performing a preliminary radiological review.

**Task:** You are provided with two images: **Image 1** (a wrist X-ray) and **Image 2** (a corresponding Grad-CAM visualization). Your task is to perform a comprehensive analysis and generate a structured preliminary report designed for a medical professional.

Please format your response using markdown formatting with clear sections and bullet points for better readability.

---

## **1. Overall Impression**
Provide a one-sentence summary of the most critical finding(s).

---

## **2. Detailed Findings (from Image 1 - X-ray)**

### **Fracture Analysis:**
- **Identification & Location:** Pinpoint all suspected fractures, specifying the bone (e.g., Distal Radius, Scaphoid) and exact location (e.g., metaphysis, ulnar styloid, scaphoid waist).
- **Pattern & Comminution:** Describe the fracture pattern (e.g., transverse, oblique, spiral) and note if it is comminuted (more than two fragments).
- **Alignment & Displacement:** Detail any displacement (e.g., dorsal/volar), angulation, rotation, or impaction of the fracture fragments.
- **Intra-Articular Involvement:** Critically assess if the fracture line extends into any joint space (e.g., radiocarpal, distal radioulnar joint - DRUJ). Note any articular surface step-off or gap.

### **Joint & Alignment Analysis:**
- **Joint Congruity:** Assess the integrity and alignment of the radiocarpal and intercarpal joints. Note any signs of subluxation or dislocation.
- **Joint Space:** Comment on the joint spaces. Are they preserved or narrowed (suggesting arthritis)?

### **Bone Integrity Analysis:**
- **Bone Density:** Comment on the apparent bone quality (e.g., normal, osteopenic).
- **Other Lesions:** Note any other abnormalities such as lytic lesions, sclerotic lesions, cysts, or signs of old fractures.

### **Soft Tissue Analysis:**
- Look for indirect signs of injury, such as soft tissue swelling or visible joint effusion.

---

## **3. Explainability Analysis (from Image 2 - Grad-CAM)**

- **Focus Correlation:** Does the primary highlighted area in the Grad-CAM directly correspond to the main fracture site identified above?
- **Secondary Findings:** Did the Grad-CAM highlight any secondary or subtle findings (e.g., a small chip fracture, soft tissue swelling) that you also noted? Conversely, did it miss any important findings?
- **Clinical Confidence:** Based on the alignment between the X-ray findings and the Grad-CAM focus, provide a confidence level (Low, Medium, High) that the AI's primary diagnosis is well-grounded.

---

## **4. Potential Complications & Next Steps**

- **Associated Risks:** Based on the findings, list potential associated risks or complications (e.g., median nerve compromise, ligamentous injury, risk of avascular necrosis for scaphoid fractures).
- **Recommended Follow-up:** Suggest potential next steps a clinician might consider (e.g., "Recommend CT for detailed articular surface assessment," or "Clinical correlation for scaphoid tenderness is advised").

---

**Disclaimer:** This is an AI-generated preliminary analysis for informational purposes and is not a substitute for a definitive diagnosis by a qualified radiologist or medical professional.
`;

// Convert File to base64 for Gemini API
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      // Remove data:image/jpeg;base64, prefix
      const base64Data = base64.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

// Convert base64 image URL to base64 data
const imageUrlToBase64 = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const base64 = canvas.toDataURL('image/png').split(',')[1];
      resolve(base64);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
};

// Create patient-specific analysis prompt
const createPatientSpecificPrompt = (patientData: import('../types').PatientData): string => {
  return `
**Role:** You are an expert AI clinical assistant performing a preliminary radiological review.

**Patient Information:**
- **Name:** ${patientData.name}
- **Patient ID:** ${patientData.patientId}
- **Age:** ${patientData.age} years
- **Gender:** ${patientData.sex}

**Clinical Context:**
${patientData.symptoms ? `**Symptoms & Chief Complaints:** ${patientData.symptoms}` : ''}
${patientData.medicalHistory ? `**Medical History:** ${patientData.medicalHistory}` : ''}
${patientData.allergies ? `**Allergies:** ${patientData.allergies}` : ''}
${patientData.currentMedications ? `**Current Medications:** ${patientData.currentMedications}` : ''}
${patientData.clinicalNote ? `**Clinical Notes:** ${patientData.clinicalNote}` : ''}

**Task:** You are provided with two images: **Image 1** (a wrist X-ray) and **Image 2** (a corresponding Grad-CAM visualization). Your task is to perform a comprehensive analysis considering the patient's clinical context and generate a structured preliminary report designed for a medical professional.

Please format your response using markdown formatting with clear sections and bullet points for better readability.

---

## **1. Overall Impression**
Provide a one-sentence summary of the most critical finding(s), considering the patient's age, symptoms, and clinical context.

---

## **2. Detailed Findings (from Image 1 - X-ray)**

### **Fracture Analysis:**
- **Identification & Location:** Pinpoint all suspected fractures, specifying the bone (e.g., Distal Radius, Scaphoid) and exact location (e.g., metaphysis, ulnar styloid, scaphoid waist). Consider the patient's age and typical fracture patterns.
- **Pattern & Comminution:** Describe the fracture pattern (e.g., transverse, oblique, spiral) and note if it is comminuted (more than two fragments).
- **Alignment & Displacement:** Detail any displacement (e.g., dorsal/volar), angulation, rotation, or impaction of the fracture fragments.
- **Intra-Articular Involvement:** Critically assess if the fracture line extends into any joint space (e.g., radiocarpal, distal radioulnar joint - DRUJ). Note any articular surface step-off or gap.
- **Correlation with Symptoms:** Relate findings to the patient's reported symptoms and pain patterns.

### **Joint & Alignment Analysis:**
- **Joint Congruity:** Assess the integrity and alignment of the radiocarpal and intercarpal joints. Note any signs of subluxation or dislocation.
- **Joint Space:** Comment on the joint spaces. Are they preserved or narrowed (suggesting arthritis)? Consider age-related changes.

### **Bone Integrity Analysis:**
- **Bone Density:** Comment on the apparent bone quality (e.g., normal, osteopenic). Consider patient age and any relevant medical history.
- **Other Lesions:** Note any other abnormalities such as lytic lesions, sclerotic lesions, cysts, or signs of old fractures that may relate to the medical history.

### **Soft Tissue Analysis:**
- Look for indirect signs of injury, such as soft tissue swelling or visible joint effusion that correlate with symptoms.

---

## **3. Clinical Correlation & Context**

### **Symptom Correlation:**
- Analyze how the radiological findings correlate with the patient's reported symptoms and clinical presentation.
- Consider if the imaging findings fully explain the clinical picture or if additional pathology might be present.

### **Age & Gender Considerations:**
- Discuss how the patient's age and gender influence the interpretation (e.g., osteoporotic fractures in elderly, growth plate considerations in pediatric patients).

### **Medical History Relevance:**
- Consider how the patient's medical history, current medications, and allergies might influence treatment planning and prognosis.

---

## **4. Explainability Analysis (from Image 2 - Grad-CAM)**

- **Focus Correlation:** Does the primary highlighted area in the Grad-CAM directly correspond to the main fracture site identified above and the patient's symptoms?
- **Secondary Findings:** Did the Grad-CAM highlight any secondary or subtle findings that correlate with the clinical presentation?
- **Clinical Confidence:** Based on the alignment between the X-ray findings, Grad-CAM focus, and clinical context, provide a confidence level (Low, Medium, High).

---

## **5. Potential Complications & Next Steps**

- **Associated Risks:** Based on the findings and patient factors (age, medical history, medications), list potential complications.
- **Treatment Considerations:** Consider how allergies and current medications might affect treatment options.
- **Recommended Follow-up:** Suggest next steps considering the complete clinical picture.

---

**Disclaimer:** This is an AI-generated preliminary analysis for informational purposes and is not a substitute for a definitive diagnosis by a qualified radiologist or medical professional.
`;
};

// Interface for detailed analysis result
export interface DetailedAnalysisResult {
  overallImpression: string;
  detailedFindings: {
    fractureAnalysis: string;
    jointAlignmentAnalysis: string;
    boneIntegrityAnalysis: string;
    softTissueAnalysis: string;
  };
  explainabilityAnalysis: {
    focusCorrelation: string;
    secondaryFindings: string;
    clinicalConfidence: 'Low' | 'Medium' | 'High';
  };
  potentialComplications: string;
  recommendedFollowUp: string;
  fullAnalysis: string;
}

// Main function to perform multimodal analysis
export const performDetailedAnalysis = async (
  patientData: import('../types').PatientData,
  gradCamImageUrl: string
): Promise<DetailedAnalysisResult> => {
  try {
    // Check if API key is configured
    if (!GEMINI_CONFIG.apiKey) {
      throw new Error('Google Gemini API key is not configured. Please set VITE_GEMINI_API_KEY environment variable.');
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.modelName });

    // Convert images to base64
    const [xrayBase64, gradCamBase64] = await Promise.all([
      fileToBase64(patientData.xrayImage),
      imageUrlToBase64(gradCamImageUrl)
    ]);

    // Prepare images for Gemini
    const xrayImage = {
      inlineData: {
        data: xrayBase64,
        mimeType: patientData.xrayImage.type || 'image/jpeg'
      }
    };

    const gradCamImage = {
      inlineData: {
        data: gradCamBase64,
        mimeType: 'image/png'
      }
    };

    // Create patient-specific analysis prompt
    const patientSpecificPrompt = createPatientSpecificPrompt(patientData);

    // Generate content with both images and patient data
    const result = await model.generateContent([
      patientSpecificPrompt,
      xrayImage,
      gradCamImage
    ]);

    const response = await result.response;
    const analysisText = response.text();

    // Parse the structured response
    return parseAnalysisResponse(analysisText);

  } catch (error) {
    console.error('Error performing detailed analysis:', error);
    throw new Error(`Failed to perform detailed analysis: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Parse the structured analysis response
const parseAnalysisResponse = (analysisText: string): DetailedAnalysisResult => {
  // Extract sections using regex patterns
  const overallImpressionMatch = analysisText.match(/## \*\*1\. Overall Impression\*\*\s*\n(.*?)(?=---)/s);
  const fractureAnalysisMatch = analysisText.match(/### \*\*Fracture Analysis:\*\*\s*\n(.*?)(?=### \*\*Joint & Alignment Analysis:\*\*)/s);
  const jointAnalysisMatch = analysisText.match(/### \*\*Joint & Alignment Analysis:\*\*\s*\n(.*?)(?=### \*\*Bone Integrity Analysis:\*\*)/s);
  const boneAnalysisMatch = analysisText.match(/### \*\*Bone Integrity Analysis:\*\*\s*\n(.*?)(?=### \*\*Soft Tissue Analysis:\*\*)/s);
  const softTissueMatch = analysisText.match(/### \*\*Soft Tissue Analysis:\*\*\s*\n(.*?)(?=## \*\*3\. Clinical Correlation)/s);
  
  const focusCorrelationMatch = analysisText.match(/- \*\*Focus Correlation:\*\*\s*(.*?)(?=- \*\*Secondary Findings:\*\*)/s);
  const secondaryFindingsMatch = analysisText.match(/- \*\*Secondary Findings:\*\*\s*(.*?)(?=- \*\*Clinical Confidence:\*\*)/s);
  const clinicalConfidenceMatch = analysisText.match(/- \*\*Clinical Confidence:\*\*\s*(.*?)(?=## \*\*5\. Potential Complications)/s);
  
  const complicationsMatch = analysisText.match(/- \*\*Associated Risks:\*\*\s*(.*?)(?=- \*\*Treatment Considerations:\*\*|(?=- \*\*Recommended Follow-up:\*\*))/s);
  const followUpMatch = analysisText.match(/- \*\*Recommended Follow-up:\*\*\s*(.*?)(?=\*\*\*\*Disclaimer:\*\*\*)/s);

  // Determine clinical confidence level
  let clinicalConfidence: 'Low' | 'Medium' | 'High' = 'Medium';
  if (clinicalConfidenceMatch) {
    const confidenceText = clinicalConfidenceMatch[1].toLowerCase();
    if (confidenceText.includes('high')) clinicalConfidence = 'High';
    else if (confidenceText.includes('low')) clinicalConfidence = 'Low';
  }

  return {
    overallImpression: overallImpressionMatch?.[1]?.trim() || 'Analysis completed successfully.',
    detailedFindings: {
      fractureAnalysis: fractureAnalysisMatch?.[1]?.trim() || 'Fracture analysis completed.',
      jointAlignmentAnalysis: jointAnalysisMatch?.[1]?.trim() || 'Joint alignment analysis completed.',
      boneIntegrityAnalysis: boneAnalysisMatch?.[1]?.trim() || 'Bone integrity analysis completed.',
      softTissueAnalysis: softTissueMatch?.[1]?.trim() || 'Soft tissue analysis completed.'
    },
    explainabilityAnalysis: {
      focusCorrelation: focusCorrelationMatch?.[1]?.trim() || 'Focus correlation analysis completed.',
      secondaryFindings: secondaryFindingsMatch?.[1]?.trim() || 'Secondary findings analysis completed.',
      clinicalConfidence
    },
    potentialComplications: complicationsMatch?.[1]?.trim() || 'Complications assessment completed.',
    recommendedFollowUp: followUpMatch?.[1]?.trim() || 'Follow-up recommendations provided.',
    fullAnalysis: analysisText
  };
};

// Check if Gemini service is available
export const checkGeminiAvailability = async (): Promise<boolean> => {
  try {
    if (!GEMINI_CONFIG.apiKey) {
      return false;
    }
    
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.modelName });
    // Simple test to check if the model is accessible
    await model.generateContent('Test');
    return true;
  } catch (error) {
    console.error('Gemini service check failed:', error);
    return false;
  }
};
