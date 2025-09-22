import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PatientData, AnalysisResult } from '../types';
import html2canvas from 'html2canvas';

// PDF Report Generation (adapted from your Streamlit make_pdf_report function)
export const generatePDFReport = async (
  patientData: PatientData,
  analysisResult: AnalysisResult,
  hospital: string = "Wonder Health Hospital",
  doctor: string = "Dr. FractureAI",
  examDesc: string = "Wrist radiograph; query for fracture."
): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Hospital header (matching your Streamlit title)
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text(hospital, pageWidth / 2, 25, { align: 'center' });
  
  pdf.setFontSize(16);
  pdf.text('AI Fracture Detection Report', pageWidth / 2, 35, { align: 'center' });
  
  // Report metadata (matching your Streamlit date/doctor info)
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  pdf.text(`Radiologist: ${doctor}`, 20, 50);
  pdf.text(`Date: ${currentDate}`, 20, 55);
  
  // Patient information table (matching your Streamlit table structure)
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Patient Information', 20, 70);
  
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  
  // Table data (matching your Streamlit data structure)
  const tableData = [
    ['Patient ID:', patientData.patientId, 'Name:', patientData.name],
    ['Sex:', patientData.sex, 'Age:', `${patientData.age} years`],
    ['Exam:', 'Wrist X-ray', 'Study Date:', new Date(analysisResult.timestamp).toLocaleDateString()]
  ];
  
  let yPos = 80;
  tableData.forEach(row => {
    pdf.setFont('helvetica', 'bold');
    pdf.text(row[0], 20, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(row[1], 50, yPos);
    pdf.setFont('helvetica', 'bold');
    pdf.text(row[2], 110, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(row[3], 140, yPos);
    yPos += 6;
  });
  
  // Clinical Information Section
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Clinical Information:', 20, yPos);
  yPos += 8;
  
  // Symptoms & Chief Complaints
  if (patientData.symptoms) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Symptoms & Chief Complaints:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const splitSymptoms = pdf.splitTextToSize(patientData.symptoms, pageWidth - 40);
    pdf.text(splitSymptoms, 20, yPos);
    yPos += splitSymptoms.length * 4 + 5;
  }
  
  // Medical History
  if (patientData.medicalHistory) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Medical History:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const splitHistory = pdf.splitTextToSize(patientData.medicalHistory, pageWidth - 40);
    pdf.text(splitHistory, 20, yPos);
    yPos += splitHistory.length * 4 + 5;
  }
  
  // Allergies
  if (patientData.allergies) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Allergies:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const splitAllergies = pdf.splitTextToSize(patientData.allergies, pageWidth - 40);
    pdf.text(splitAllergies, 20, yPos);
    yPos += splitAllergies.length * 4 + 5;
  }
  
  // Current Medications
  if (patientData.currentMedications) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Current Medications:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const splitMedications = pdf.splitTextToSize(patientData.currentMedications, pageWidth - 40);
    pdf.text(splitMedications, 20, yPos);
    yPos += splitMedications.length * 4 + 5;
  }
  
  // Clinical Notes
  if (patientData.clinicalNote) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('Clinical Notes:', 20, yPos);
    pdf.setFont('helvetica', 'normal');
    yPos += 5;
    const splitNotes = pdf.splitTextToSize(patientData.clinicalNote, pageWidth - 40);
    pdf.text(splitNotes, 20, yPos);
    yPos += splitNotes.length * 4 + 5;
  }
  
  // AI Model Assessment (matching your Streamlit prediction display)
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('AI Model Fracture Assessment:', 20, yPos);
  
  yPos += 8;
  const isDiagnosisPositive = analysisResult.diagnosis === 'Fracture';
  const diagnosisColor = isDiagnosisPositive ? [220, 53, 69] : [40, 167, 69];
  
  pdf.setTextColor(...diagnosisColor);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`Prediction: ${analysisResult.diagnosis.toUpperCase()} (${(analysisResult.confidence * 100).toFixed(1)}% confidence)`, 20, yPos);
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  yPos += 8;
  pdf.text(`Processing Time: ${analysisResult.processingTime.toFixed(2)} seconds`, 20, yPos);
  
  // Findings & Summary (matching your Streamlit summary logic)
  yPos += 15;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Findings & Summary:', 20, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  const findings = [
    `• ${analysisResult.diagnosis.toUpperCase()} detected by AI fracture model.`,
    '• If FRACTURE, recommend orthopedic consult.',
    '• If NORMAL, but clinical suspicion strong, follow-up imaging suggested.'
  ];
  
  findings.forEach(finding => {
    const splitFinding = pdf.splitTextToSize(finding, pageWidth - 40);
    pdf.text(splitFinding, 20, yPos);
    yPos += splitFinding.length * 5 + 2;
  });
  
  // Images section (matching your Streamlit image display)
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Imaging Studies:', 20, yPos);
  
  try {
    // Add original X-ray image
    yPos += 10;
    pdf.setFont('helvetica', 'normal');
    pdf.text('Original X-ray Image:', 20, yPos);
    
    const imgWidth = 60;
    const imgHeight = 60;
    
    // Convert base64 image to PDF (matching your image resize to 224x224)
    pdf.addImage(patientData.xrayImageUrl, 'JPEG', 20, yPos + 5, imgWidth, imgHeight);
    
    // Add Grad-CAM image (matching your cam_image display)
    pdf.text('Grad-CAM Activation:', 100, yPos);
    pdf.addImage(analysisResult.gradCamImageUrl, 'PNG', 100, yPos + 5, imgWidth, imgHeight);
    
    yPos += imgHeight + 15;
  } catch (error) {
    console.error('Error adding images to PDF:', error);
    yPos += 10;
    pdf.text('Images could not be embedded in this report.', 20, yPos);
  }
  
  // Clinical interpretation
  yPos += 10;
  pdf.setFont('helvetica', 'bold');
  pdf.text('Clinical Interpretation:', 20, yPos);
  
  yPos += 8;
  pdf.setFont('helvetica', 'normal');
  const interpretation = isDiagnosisPositive 
    ? 'AI model has detected features consistent with fracture patterns. The Grad-CAM visualization shows areas of high attention that influenced this diagnosis. Recommend orthopedic consultation and appropriate clinical correlation.'
    : 'No fracture patterns detected by AI analysis. The model shows high confidence in normal bone structure. If clinical suspicion remains high, consider additional imaging or specialist consultation.';
  
  const splitInterpretation = pdf.splitTextToSize(interpretation, pageWidth - 40);
  pdf.text(splitInterpretation, 20, yPos);
  yPos += splitInterpretation.length * 5;
  
  // Footer (matching your Streamlit end message)
  yPos = pageHeight - 30;
  pdf.setFontSize(8);
  pdf.setTextColor(128, 128, 128);
  pdf.text('End of report (auto-generated by AI FractureNet)', pageWidth / 2, yPos, { align: 'center' });
  pdf.text('© 2024 FractureAI Systems. All rights reserved.', pageWidth / 2, yPos + 5, { align: 'center' });
  pdf.text('This AI-generated report is for diagnostic assistance only. Clinical correlation required.', pageWidth / 2, yPos + 10, { align: 'center' });
  
  // Save the PDF (matching your Streamlit download functionality)
  const fileName = `fracture_report_${patientData.patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};

// Enhanced PDF with better formatting
export const generateAdvancedPDFReport = async (
  patientData: PatientData,
  analysisResult: AnalysisResult
): Promise<void> => {
  // Create a temporary div with report content for html2canvas
  const reportElement = document.createElement('div');
  reportElement.style.position = 'absolute';
  reportElement.style.left = '-9999px';
  reportElement.style.width = '210mm';
  reportElement.style.backgroundColor = 'white';
  reportElement.style.padding = '20mm';
  reportElement.style.fontFamily = 'Arial, sans-serif';
  reportElement.style.fontSize = '12px';
  reportElement.style.lineHeight = '1.4';
  
  const isDiagnosisPositive = analysisResult.diagnosis === 'Fracture';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  
  // Build HTML content matching your Streamlit report structure
  reportElement.innerHTML = `
    <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e5e7eb; padding-bottom: 20px;">
      <h1 style="font-size: 24px; font-weight: bold; color: #1f2937; margin: 0;">Wonder Health Hospital</h1>
      <h2 style="font-size: 18px; color: #4b5563; margin: 10px 0;">AI Fracture Detection Report</h2>
      <p style="font-size: 12px; color: #6b7280; margin: 0;">Generated on ${currentDate}</p>
      <p style="font-size: 10px; color: #6b7280; margin: 5px 0;">Radiologist: Dr. FractureAI</p>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">Patient Information</h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <tr style="background-color: #f3f4f6;">
          <td style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold;">Patient ID</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${patientData.patientId}</td>
          <td style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold;">Name</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${patientData.name}</td>
        </tr>
        <tr>
          <td style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold;">Sex</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${patientData.sex}</td>
          <td style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold;">Age</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;">${patientData.age} years</td>
        </tr>
        <tr style="background-color: #f3f4f6;">
          <td style="padding: 8px; border: 1px solid #d1d5db; font-weight: bold;">Exam</td>
          <td style="padding: 8px; border: 1px solid #d1d5db;" colspan="3">Wrist X-ray Fracture Detection</td>
        </tr>
      </table>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">AI Model Fracture Assessment</h3>
      <div style="border: 2px solid ${isDiagnosisPositive ? '#ef4444' : '#10b981'}; border-radius: 8px; padding: 15px; background-color: ${isDiagnosisPositive ? '#fef2f2' : '#f0fdf4'};">
        <p style="margin: 0; font-size: 14px;"><strong>Prediction:</strong> <span style="color: ${isDiagnosisPositive ? '#dc2626' : '#059669'}; font-weight: bold;">${analysisResult.diagnosis.toUpperCase()}</span></p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Confidence:</strong> ${(analysisResult.confidence * 100).toFixed(1)}%</p>
        <p style="margin: 5px 0 0 0; font-size: 12px; color: #6b7280;">Processing Time: ${analysisResult.processingTime.toFixed(2)} seconds</p>
      </div>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">Clinical Information</h3>
      
      ${patientData.symptoms ? `
      <div style="margin-bottom: 15px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px;">Symptoms & Chief Complaints</h4>
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
          <p style="margin: 0; font-size: 11px; line-height: 1.5;">${patientData.symptoms}</p>
        </div>
      </div>
      ` : ''}
      
      ${patientData.medicalHistory ? `
      <div style="margin-bottom: 15px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px;">Medical History</h4>
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
          <p style="margin: 0; font-size: 11px; line-height: 1.5;">${patientData.medicalHistory}</p>
        </div>
      </div>
      ` : ''}
      
      ${patientData.allergies ? `
      <div style="margin-bottom: 15px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px;">Allergies</h4>
        <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px;">
          <p style="margin: 0; font-size: 11px; line-height: 1.5;">${patientData.allergies}</p>
        </div>
      </div>
      ` : ''}
      
      ${patientData.currentMedications ? `
      <div style="margin-bottom: 15px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px;">Current Medications</h4>
        <div style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 6px; padding: 12px;">
          <p style="margin: 0; font-size: 11px; line-height: 1.5;">${patientData.currentMedications}</p>
        </div>
      </div>
      ` : ''}
      
      ${patientData.clinicalNote ? `
      <div style="margin-bottom: 15px;">
        <h4 style="font-size: 12px; font-weight: bold; color: #374151; margin-bottom: 8px;">Clinical Notes</h4>
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 12px;">
          <p style="margin: 0; font-size: 11px; line-height: 1.5;">${patientData.clinicalNote}</p>
        </div>
      </div>
      ` : ''}
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">Findings & Summary</h3>
      <ul style="margin: 0; padding-left: 20px; font-size: 11px; line-height: 1.6;">
        <li>${analysisResult.diagnosis.toUpperCase()} detected by AI fracture model.</li>
        <li>If FRACTURE, recommend orthopedic consult.</li>
        <li>If NORMAL, but clinical suspicion strong, follow-up imaging suggested.</li>
      </ul>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">Imaging Studies</h3>
      <div style="display: flex; gap: 20px; align-items: flex-start;">
        <div style="flex: 1;">
          <p style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">Original X-ray Image</p>
          <img src="${patientData.xrayImageUrl}" style="width: 150px; height: 150px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px;" />
        </div>
        <div style="flex: 1;">
          <p style="font-size: 12px; font-weight: bold; margin-bottom: 10px;">Grad-CAM Activation</p>
          <img src="${analysisResult.gradCamImageUrl}" style="width: 150px; height: 150px; object-fit: contain; border: 1px solid #e5e7eb; border-radius: 4px;" />
        </div>
      </div>
    </div>
    
    <div style="margin-bottom: 25px;">
      <h3 style="font-size: 16px; font-weight: bold; color: #1f2937; margin-bottom: 15px;">Clinical Interpretation</h3>
      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px;">
        <p style="margin: 0 0 10px 0; font-size: 11px; line-height: 1.5;">
          The AI model has analyzed the submitted X-ray image and determined a <strong style="color: ${isDiagnosisPositive ? '#dc2626' : '#059669'};">${analysisResult.diagnosis.toLowerCase()}</strong> 
          classification with ${(analysisResult.confidence * 100).toFixed(1)}% confidence.
          ${isDiagnosisPositive 
            ? ' The model has identified features consistent with fracture patterns in the analyzed region.'
            : ' No fracture patterns were detected in the analyzed X-ray image.'
          }
        </p>
        <p style="margin: 0; font-size: 11px; line-height: 1.5;">
          The Grad-CAM visualization highlights the regions that most influenced the AI's decision-making process, 
          providing transparency into the model's reasoning for clinical correlation.
        </p>
      </div>
    </div>
    
    <div style="border-top: 1px solid #e5e7eb; padding-top: 15px; text-align: center; font-size: 9px; color: #6b7280;">
      <p style="margin: 0;">End of report (auto-generated by AI FractureNet)</p>
      <p style="margin: 5px 0 0 0;">This AI-generated report is for diagnostic assistance only. Clinical correlation and professional interpretation required.</p>
    </div>
  `;
  
  document.body.appendChild(reportElement);
  
  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(reportElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // Convert canvas to PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
    // Save with filename matching your Streamlit pattern
    const fileName = `fracture_report_${patientData.patientId}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    // Fallback to simple PDF generation
    await generatePDFReport(patientData, analysisResult);
  } finally {
    // Clean up
    document.body.removeChild(reportElement);
  }
};