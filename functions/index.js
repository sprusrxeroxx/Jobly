import { https } from 'firebase-functions';
import { PDFParse } from 'pdf-parse';
import admin from "firebase-admin";
import generateHTMLResume from './helpers/generateHTML.js';
import { callGeminiApi, parseResumeToStructuredData } from './helpers/Callbacks.js';
import { 
  GENERATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SCHEMA,
  GENERATOR_REVISION_INSTRUCTION
} from './helpers/prompts.js';

admin.initializeApp();

const MAX_ITERATIONS = 1;

// Main adversarial optimization function
async function runAdversarialOptimization(resume, job_description) {
    let currentResume = resume;
    console.log(`Original Resume: ${resume}`);
    
    console.log(`Job Description: ${job_description}`);
    const feedbackHistory = [];
    let status = 'FAIL';
    
    // 1. GENERATOR: Create the initial optimized draft with original grounding
    const initialQuery = `ORIGINAL USER RESUME:\n---\n${resume}\n---\nJOB DESCRIPTION:\n---\n${job_description}\n---\n\nRemember: Only work with the skills and experiences from the ORIGINAL RESUME above.`;
    try {
        currentResume = await callGeminiApi(GENERATOR_SYSTEM_INSTRUCTION, initialQuery);
    } catch (e) {
        return { success: false, error: `Initial generation failed: ${e.message}`, finalResume: currentResume };
    }
    
    // 2. ADVERSARIAL LOOP
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // DISCRIMINATOR: Critique the current resume
        const critiqueQuery = `CURRENT RESUME DRAFT:\n---\n${currentResume}\n---`;
        const discriminatorSystem = DISCRIMINATOR_SYSTEM_INSTRUCTION(job_description);
        
        let critiqueJsonText;
        try {
            critiqueJsonText = await callGeminiApi(discriminatorSystem, critiqueQuery, DISCRIMINATOR_SCHEMA);
        } catch (e) {
            feedbackHistory.push({ iteration: i + 1, status: "ERROR", message: `Discriminator failed: ${e.message}` });
            break; 
        }
        
        let critique;
        try {
            critique = JSON.parse(critiqueJsonText);
        } catch (e) {
            feedbackHistory.push({ iteration: i + 1, status: "ERROR", message: "Failed to parse critique JSON." });
            break;
        }
        
        status = (critique.status || 'FAIL').toUpperCase();
        feedbackHistory.push({ iteration: i + 1, status: status, critique: critique });
        
        if (status === 'PASS') {
            break;
        }
        
        // GENERATOR: Update the resume based on critique WITH ORIGINAL RESUME FOR GROUNDING
        const revisionQuery = (
            `ORIGINAL USER RESUME (GROUND TRUTH):\n---\n${resume}\n---\n` +
            `PREVIOUS RESUME DRAFT:\n---\n${currentResume}\n---\n` +
            `DISCRIMINATOR CRITIQUE:\n` +
            `Reasons for rejection: ${critique.reasons.join(', ')}\n` +
            `Suggested Rewrite: ${critique.suggested_rewrite}\n\n` +
            `REMEMBER: Only use skills and experiences from the ORIGINAL USER RESUME above.`
        );
        
        try {
            currentResume = await callGeminiApi(GENERATOR_REVISION_INSTRUCTION, revisionQuery);
            console.log(`Reasons for rejection: ${critique.reasons}`);
            console.log(`Iteration ${i+1} complete.`);
        } catch (e) {
            break;
        }
    }
    
    // 3. PARSE THE FINAL RESUME INTO STRUCTURED DATA
    console.log('Optimization complete, starting resume parsing...');
    const structuredData = await parseResumeToStructuredData(currentResume);
    
    return {
        success: true,
        structuredData: structuredData,
        htmlResume: generateHTMLResume(structuredData),
        feedbackHistory: feedbackHistory,
        originalResume: resume,
        jobDescription: job_description,
    };
}

// Helper function to extract text from PDF buffer
async function extractTextFromPdf(pdfBuffer) {
    try {
        const parser = new PDFParse({ data: pdfBuffer });
        const data = await parser.getText();

        return data.text;
    } catch (error) {
        console.error('PDF text extraction failed:', error);
        throw new Error('Failed to extract text from PDF');
        }
    }

// Cloud Function to optimize resume recieved via text using adversarial loop
export const optimizeResume = https.onRequest(async (req, res) => {
    // 1. CORS Setup
    res.set('Access-Control-Allow-Origin', '*');
    if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Methods', 'POST');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        return res.status(204).send('');
    }
    
    // 2. Input Validation
    if (req.method !== 'POST') {
        return res.status(405).send({ error: 'Method Not Allowed. Use POST.' });
    }
    
    const { resume, job_description } = req.body;
    
    if (!resume || !job_description) {
        return res.status(400).send({ error: 'Missing required fields: resume and job_description.' });
    }
    
    // 3. Run Optimization
    try {
        const result = await runAdversarialOptimization(resume, job_description);
        
        if (result.success) {
            return res.status(200).json(result);
        } else {
            return res.status(500).json(result);
        }
    } catch (e) {
        console.error("Internal Server Error:", e);
        return res.status(500).json({ error: "An internal error occurred during optimization.", details: e.message });
    }
});

// Cloud Function to optimize resume recieved via PDF using adversarial loop
export const processPdfResume = https.onRequest(async (req, res) => {
  // CORS setup
  res.set('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    return res.status(204).send('');
  }

  const { pdfBase64, job_description } = req.body;

  if (!pdfBase64 || !job_description) {
    return res.status(400).json({ 
      success: false, 
      error: 'Missing required fields: pdfBase64 and job_description' 
    });
  }

  try {
    // 1. Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');
    
    // 2. Extract text from PDF
    const resumeText = await extractTextFromPdf(pdfBuffer);
    
    console.log('Extracted text length:', resumeText.length);
    
    // 3. Call optimization function
    const optimizationResult = await runAdversarialOptimization(resumeText, job_description);
    
    // 4. Return the structure as optimizeResume
    return res.status(200).json(optimizationResult);

  } catch (error) {
    console.error('PDF processing error:', error);
    return res.status(500).json({
      success: false,
      error: 'PDF processing failed',
      details: error.message
    });
  }
});


export { generatePdfFromHtml } from './generatePdfFromHtml.js';