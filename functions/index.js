import { https } from 'firebase-functions';
import { callGeminiApi, parseResumeToStructuredData } from './helpers/Callbacks.js';
import { 
  GENERATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SCHEMA,
  GENERATOR_REVISION_INSTRUCTION
} from './helpers/prompts.js';
import generateHTMLResume from './helpers/generateHTML.js';
import { generatePdfFromHtml } from './generatePdfFromHtml.js';


const MAX_ITERATIONS = 2;


// --- Generative Adversarial Network Logic ---
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

export { generatePdfFromHtml };
