import { https } from 'firebase-functions';
import fetchWithTimeout from './helpers/fetchWithTimeout.js';
import { 
  GENERATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SYSTEM_INSTRUCTION, 
  DISCRIMINATOR_SCHEMA,
  GENERATOR_REVISION_INSTRUCTION
} from './helpers/prompts.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";
const MAX_ITERATIONS = 2;


// --- Core API Interaction Logic ---

async function callGeminiApi(systemInstruction, userQuery, structureSchema = null) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key not configured. Set GEMINI_API_KEY env variable before starting emulator.");
  }
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;
  
  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] },
    generationConfig: {
      temperature: 0.1,  // ↓ From 0.3 to 0.1 for strict adherence
      maxOutputTokens: 3000,
      topP: 0.3,         // ↓ More restrictive
      topK: 20           // ↓ More deterministic
    }
  };
  
  if (structureSchema) {
    payload.generationConfig = {
      ...payload.generationConfig,
      responseMimeType: "application/json",
      responseSchema: structureSchema
    };
  }
  
  // Simple exponential backoff (3 tries)
  for (let i = 0; i < 3; i++) {
    try {
      console.log(`Calling Gemini (attempt ${i+1}) url=${url}`);
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 20000);
      
      console.log(`Gemini response status: ${response.status}`);
      
      if (response.ok) {
        const result = await response.json();
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return result.candidates[0].content.parts[0].text;
        } else {
          console.log("Unexpected Gemini response shape:", JSON.stringify(result).slice(0, 2000));
          throw new Error("Unexpected Gemini response shape.");
        }
      } else if (response.status === 429 && i < 2) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`Rate limited. Backing off ${delay}ms`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      } else {
        const errorBody = await response.text();
        console.error("Non-ok response from Gemini:", response.status, errorBody);
        throw new Error(`API failed with status ${response.status}: ${errorBody}`);
      }
    } catch (e) {
      console.error(`Gemini call attempt ${i+1} failed:`, e.message);
      if (i === 2) {
        throw e;
      }
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error("Gemini API call failed after multiple retries.");
}

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
            console.log(`Iteration ${i+1} complete. New resume: ${currentResume}`);
        } catch (e) {
            break;
        }
    }

    return {
        success: true,
        finalResume: currentResume,
        feedbackHistory: feedbackHistory,
        finalStatus: status,
    };
}

export const optimizeResume = https.onRequest(async (req, res) => {
    // 1. CORS Setup (Crucial for FlutterFlow/Web)
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
    
    // Use req.body for POST requests
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