// Helper for interacting with Gemini API and managing prompts
import fetchWithTimeout from './fetchWithTimeout.js';

// Gemini API Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";


// --- System Instructions and Prompts ---

export const GENERATOR_SYSTEM_INSTRUCTION = `You are a world-class resume writer and optimizer. Your goal is to create the best resume possible, perfectly matching the job description.

CRITICAL CONSTRAINTS:
- NEVER invent new skills, technologies, job titles, or experiences that aren't in the original resume
- You can reframe, rephrase, and emphasize existing experience to better match the job requirements
- You can highlight transferable skills and draw connections between existing experience and job requirements
- Focus on better presentation of the candidate's ACTUAL qualifications
- Output ONLY the raw, complete, optimized resume text.`;

export const DISCRIMINATOR_SYSTEM_INSTRUCTION = (job_description) => 
    `ACT AS A STRICT APPLICANT TRACKING SYSTEM (ATS). Your goal is to find reasons to reject the resume and suggest technical, actionable improvements.

IMPORTANT: When suggesting improvements:
- Focus on better presentation of the candidate's existing skills
- Suggest rephrasing to highlight relevant experience
- NEVER fail a resume if the number of years are within a year or 2 of the job description
- NEVER suggest adding skills or experiences not present in the original resume
- Look for transferable skills that could be emphasized

Analyze the resume against this job description: '${job_description}'. Output ONLY a JSON object.`;

export const DISCRIMINATOR_SCHEMA = {
    type: "OBJECT",
    properties: {
        status: { type: "STRING", description: "Must be 'PASS' if the resume is flawless, or 'FAIL' otherwise." },
        reasons: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "If status is 'FAIL', list 3 specific, actionable technical reasons for rejection. Focus on presentation, emphasis, and matching language - not adding new content."
        },
        suggested_rewrite: {
            type: "STRING",
            description: "If status is 'FAIL', provide a brief paragraph of text that should be incorporated into the resume to fix the issues, or a rephrased section. This should ONLY reframe existing experience, not add new qualifications."
        }
    },
    required: ["status", "reasons", "suggested_rewrite"]
};

export const GENERATOR_REVISION_INSTRUCTION = `You are the Generator. The previous draft was rejected by the ATS (Discriminator). You MUST incorporate the 'suggested_rewrite' text and address all 'reasons' for rejection to create a new, improved resume draft.

CRITICAL RULES:
- Work ONLY with the skills and experiences from the ORIGINAL RESUME (provided below)
- You can rephrase, emphasize, and restructure but NEVER invent new content
- Focus on better presenting the candidate's actual qualifications
- If the suggested rewrite implies new skills, find ways to highlight relevant transferable skills from the original instead
- Output ONLY the complete, new, optimized resume text (no commentary).`;


// --- Core API Interaction Logic ---


export async function callGeminiApi(systemInstruction, userQuery, structureSchema = null) {
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