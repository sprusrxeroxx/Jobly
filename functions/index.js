import { https } from 'firebase-functions';

// 1. Initialize API Configuration and Prompts

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.5-flash-preview-05-20";
const MAX_ITERATIONS = 3;

// Helper function to add timeout to fetch calls :: FIX SOCKET HANGING ISSUE
async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (err) {
    clearTimeout(id);
    // normalize AbortError message
    if (err.name === 'AbortError') {
      throw new Error(`Request timed out after ${timeoutMs}ms`);
    }
    throw err;
  }
}

// --- System Instructions and Prompts ---

// 1a. Generator's primary role and initial instruction
const GENERATOR_SYSTEM_INSTRUCTION = "You are a world-class resume writer and optimizer. Your goal is to create the best resume possible, perfectly matching the job description. Do NOT include any commentary, analysis, or introductory text. Output ONLY the raw, complete, optimized resume text.";

const DISCRIMINATOR_SYSTEM_INSTRUCTION = (jobDescription) => 
    `ACT AS A STRICT APPLICANT TRACKING SYSTEM (ATS). Your goal is to find reasons to reject the resume and suggest technical, actionable improvements. Analyze the resume against this job description: '${jobDescription}'. Output ONLY a JSON object.`;

const DISCRIMINATOR_SCHEMA = {
    type: "OBJECT",
    properties: {
        status: { type: "STRING", description: "Must be 'PASS' if the resume is flawless, or 'FAIL' otherwise." },
        reasons: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "If status is 'FAIL', list 3 specific, actionable technical reasons for rejection."
        },
        suggested_rewrite: {
            type: "STRING",
            description: "If status is 'FAIL', provide a brief paragraph of text that should be incorporated into the resume to fix the issues, or a rephrased section. Only include raw text intended for the resume."
        }
    },
    required: ["status", "reasons", "suggested_rewrite"]
};

const GENERATOR_REVISION_INSTRUCTION = "You are the Generator. The previous draft was rejected by the ATS (Discriminator). You MUST incorporate the 'suggested_rewrite' text and address all 'reasons' for rejection to create a new, improved resume draft. Output ONLY the complete, new, optimized resume text (no commentary).";


// --- Core API Interaction Logic ---

async function callGeminiApi(systemInstruction, userQuery, structureSchema = null) {
  if (!GEMINI_API_KEY) {
    throw new Error("Gemini API Key not configured. Set GEMINI_API_KEY env variable before starting emulator.");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: userQuery }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }, // Generator or Discriminator role
    temperature: 0.2,
    maxOutputTokens: 1024,
  };

  if (structureSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: structureSchema
    };
  }

  // Simple exponential backoff (3 tries)
  for (let i = 0; i < 3; i++) {
    try {
      console.log(`Calling Gemini (attempt ${i+1}) url=${url}`);
      // use fetchWithTimeout to fix hanging issue
      const response = await fetchWithTimeout(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }, 20000); // 20s per-call timeout

      // Helpful API Status logging
      console.log(`Gemini response status: ${response.status}`);

      if (response.ok) {
        const result = await response.json();
        // safe defensive checks
        if (result?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return result.candidates[0].content.parts[0].text;
        } else {
          // unexpected shape
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
      // small backoff before retry
      await new Promise(r => setTimeout(r, 500 * (i + 1)));
    }
  }
  throw new Error("Gemini API call failed after multiple retries.");
}


async function runAdversarialOptimization(resumeText, jobDescription) {
    let currentResume = resumeText;
    const feedbackHistory = [];
    let status = 'FAIL';

    // 1. GENERATOR: Create the initial optimized draft
    const initialQuery = `USER RESUME:\n---\n${resumeText}\n---\nJOB DESCRIPTION:\n---\n${jobDescription}\n---`;
    try {
        currentResume = await callGeminiApi(GENERATOR_SYSTEM_INSTRUCTION, initialQuery);
    } catch (e) {
        return { success: false, error: `Initial generation failed: ${e.message}`, finalResume: currentResume };
    }

    // 2. ADVERSARIAL LOOP
    for (let i = 0; i < MAX_ITERATIONS; i++) {
        // DISCRIMINATOR: Critique the current resume
        const critiqueQuery = `CURRENT RESUME DRAFT:\n---\n${currentResume}\n---`;
        const discriminatorSystem = DISCRIMINATOR_SYSTEM_INSTRUCTION(jobDescription);

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

        // GENERATOR: Update the resume based on critique
        const revisionQuery = (
            `PREVIOUS RESUME DRAFT:\n---\n${currentResume}\n---\n` +
            `DISCRIMINATOR CRITIQUE:\n` +
            `Reasons for rejection: ${critique.reasons.join(', ')}\n` +
            `Suggested Rewrite: ${critique.suggested_rewrite}`
        );

        try {
            currentResume = await callGeminiApi(GENERATOR_REVISION_INSTRUCTION, revisionQuery);
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