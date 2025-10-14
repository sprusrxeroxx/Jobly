// Helper for interacting with Gemini API and managing prompts

import fetchWithTimeout from './fetchWithTimeout.js';
import { RESUME_PARSER_SYSTEM_INSTRUCTION, RESUME_PARSER_SCHEMA } from './prompts.js';

// Gemini API Configuration

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-2.0-flash";


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


// --- Resume Parsing Logic --- Parses unstructured resume text into structured JSON

export async function parseResumeToStructuredData(resumeText) {
    console.log('Starting resume parsing...');
    
    const parserQuery = `RESUME TEXT TO PARSE:\n---\n${resumeText}\n---\n\nExtract all information exactly as presented. Do not infer missing data.`;
    
    try {
        const parsedDataJson = await callGeminiApi(
            RESUME_PARSER_SYSTEM_INSTRUCTION, 
            parserQuery, 
            RESUME_PARSER_SCHEMA
        );
        
        let parsedData;
        try {
            parsedData = JSON.parse(parsedDataJson);
        } catch (parseError) {
            console.error('Failed to parse resume parser JSON:', parseError);
            // Return a safe fallback structure
            return createEmptyResumeStructure();
        }
        
        console.log('Resume parsing completed successfully');
        return parsedData;
        
    } catch (error) {
        console.error('Resume parsing failed:', error);
        // Return empty structure on failure
        return createEmptyResumeStructure();
    }
}

function createEmptyResumeStructure() {
    return {
        contact_info: {
            name: null,
            surname: null,
            email: null,
            phone_numbers: [],
            linkedin: null,
            portfolio: null,
            location: null
        },
        summary: null,
        experience: [],
        skills: [],
        education: [],
        projects: [],
        certifications: [],
        languages: []
    };
}