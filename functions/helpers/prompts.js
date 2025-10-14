// --- System Instructions and Prompts ---

// GENERATOR: Creates or revises resumes based on feedback

export const GENERATOR_SYSTEM_INSTRUCTION = `You are a world-class resume writer and optimizer. Your goal is to create the best resume possible, perfectly matching the job description.

CRITICAL CONSTRAINTS:
- NEVER invent new skills, technologies, job titles, or experiences that aren't in the original resume
- You can reframe, rephrase, and emphasize existing experience to better match the job requirements
- You can highlight transferable skills and draw connections between existing experience and job requirements
- Focus on better presentation of the candidate's ACTUAL qualifications
- Output ONLY the raw, complete, optimized resume text.`;

export const GENERATOR_REVISION_INSTRUCTION = `You are the Generator. The previous draft was rejected by the ATS (Discriminator). You MUST incorporate the 'suggested_rewrite' text and address all 'reasons' for rejection to create a new, improved resume draft.

CRITICAL RULES:
- Work ONLY with the skills and experiences from the ORIGINAL RESUME (provided below)
- You can rephrase, emphasize, and restructure but NEVER invent new content
- Focus on better presenting the candidate's actual qualifications
- If the suggested rewrite implies new skills, find ways to highlight relevant transferable skills from the original instead
- Output ONLY the complete, new, optimized resume text (no commentary)`;

// DISCRIMINATOR: Critiques resumes and suggests improvements

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

// PARSER: Parses unstructured resume text into structured JSON

export const RESUME_PARSER_SYSTEM_INSTRUCTION = `You are an expert resume parser. Extract structured information from the resume text into the specified JSON format.

CRITICAL RULES:
- Extract ONLY information explicitly present in the resume
- If a field is not present, set it to null
- Do not infer or invent any information
- Be precise with dates, names, and technical skills
- Preserve the exact wording for roles and company names`;

export const RESUME_PARSER_SCHEMA = {
    type: "OBJECT",
    properties: {
        contact_info: {
            type: "OBJECT",
            properties: {
                name: { type: "STRING", description: "Full name if present, otherwise null" },
                surname: { type: "STRING", description: "Surname if discernible, otherwise null" },
                email: { type: "STRING", description: "Email address if present, otherwise null" },
                phone_numbers: { 
                    type: "ARRAY", 
                    items: { type: "STRING" },
                    description: "Array of phone numbers found, empty array if none" 
                },
                linkedin: { type: "STRING", description: "LinkedIn profile URL if present, otherwise null" },
                portfolio: { type: "STRING", description: "Portfolio URL if present, otherwise null" },
                location: { type: "STRING", description: "Location if present, otherwise null" }
            },
            required: ["name", "surname", "email", "phone_numbers", "linkedin", "portfolio", "location"]
        },
        summary: { 
            type: "STRING", 
            description: "Professional summary/objective if present, otherwise null" 
        },
        experience: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    company_name: { type: "STRING", description: "Name of the company" },
                    role: { type: "STRING", description: "Job title/role" },
                    start_date: { type: "STRING", description: "Start date in any format present, otherwise null" },
                    end_date: { type: "STRING", description: "End date or 'Present' if current, otherwise null" },
                    description: { type: "STRING", description: "Job description/achievements, otherwise null" },
                    location: { type: "STRING", description: "Job location if present, otherwise null" }
                },
                required: ["company_name", "role", "start_date", "end_date", "description", "location"]
            },
            description: "Array of work experiences, empty array if none"
        },
        skills: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Array of skills and technologies mentioned, empty array if none"
        },
        education: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    institution: { type: "STRING", description: "Name of educational institution" },
                    degree: { type: "STRING", description: "Degree obtained or pursued" },
                    field_of_study: { type: "STRING", description: "Field of study if present, otherwise null" },
                    start_date: { type: "STRING", description: "Start date if present, otherwise null" },
                    end_date: { type: "STRING", description: "End date or graduation date if present, otherwise null" },
                    gpa: { type: "STRING", description: "GPA if mentioned, otherwise null" },
                    location: { type: "STRING", description: "Location if present, otherwise null" }
                },
                required: ["institution", "degree", "field_of_study", "start_date", "end_date", "gpa", "location"]
            },
            description: "Array of education history, empty array if none"
        },
        projects: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING", description: "Project name" },
                    description: { type: "STRING", description: "Project description and achievements" },
                    technologies: { 
                        type: "ARRAY", 
                        items: { type: "STRING" },
                        description: "Technologies used in project, empty array if none" 
                    },
                    start_date: { type: "STRING", description: "Start date if present, otherwise null" },
                    end_date: { type: "STRING", description: "End date if present, otherwise null" }
                },
                required: ["name", "description", "technologies", "start_date", "end_date"]
            },
            description: "Array of projects, empty array if none"
        },
        certifications: {
            type: "ARRAY",
            items: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING", description: "Certification name" },
                    issuer: { type: "STRING", description: "Issuing organization" },
                    date_obtained: { type: "STRING", description: "Date obtained if present, otherwise null" },
                    expiry_date: { type: "STRING", description: "Expiry date if present, otherwise null" }
                },
                required: ["name", "issuer", "date_obtained", "expiry_date"]
            },
            description: "Array of certifications, empty array if none"
        },
        languages: {
            type: "ARRAY",
            items: { type: "STRING" },
            description: "Array of languages mentioned, empty array if none"
        }
    },
    required: ["contact_info", "summary", "experience", "skills", "education", "projects", "certifications", "languages"]
};