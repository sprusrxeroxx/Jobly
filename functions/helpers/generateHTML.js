// --- HTML Resume Template Generator ---

export default function generateHTMLResume(structuredData) {
    const { contact_info, summary, experience, skills, education, projects, certifications, languages } = structuredData;
    
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${contact_info.name || 'Candidate'}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
        }
        .header { 
            text-align: center; 
            margin-bottom: 30px;
            border-bottom: 2px solid #2c5aa0;
            padding-bottom: 20px;
        }
        .name { 
            font-size: 2.2em; 
            font-weight: 700; 
            color: #2c5aa0;
            margin-bottom: 8px;
        }
        .contact-info { 
            display: flex; 
            flex-wrap: wrap; 
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
        }
        .contact-item { 
            color: #666; 
            text-decoration: none;
        }
        .section { 
            margin-bottom: 25px; 
        }
        .section-title { 
            font-size: 1.3em; 
            font-weight: 600; 
            color: #2c5aa0;
            margin-bottom: 12px;
            padding-bottom: 5px;
            border-bottom: 1px solid #eaeaea;
        }
        .experience-item, .education-item, .project-item { 
            margin-bottom: 18px; 
        }
        .item-header { 
            display: flex; 
            justify-content: between; 
            margin-bottom: 5px;
        }
        .item-title { 
            font-weight: 600; 
            flex: 1;
        }
        .item-subtitle { 
            color: #666; 
            font-style: italic;
        }
        .item-dates { 
            color: #888; 
            white-space: nowrap;
        }
        .item-description { 
            margin-top: 5px; 
            color: #444;
        }
        .skills-list { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 8px; 
        }
        .skill-tag { 
            background: #f0f4ff; 
            padding: 4px 12px; 
            border-radius: 15px; 
            font-size: 0.9em;
            border: 1px solid #d0d8f0;
        }
        .certification-item, .language-item { 
            margin-bottom: 8px; 
        }
        .summary { 
            background: #f8f9fa; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #2c5aa0;
        }
        @media (max-width: 600px) {
            body { padding: 15px; }
            .contact-info { flex-direction: column; align-items: center; gap: 5px; }
            .item-header { flex-direction: column; }
            .item-dates { margin-top: 2px; }
        }
    </style>
</head>
<body>
    ${generateHeader(contact_info)}
    ${generateSummary(summary)}
    ${generateExperience(experience)}
    ${generateSkills(skills)}
    ${generateEducation(education)}
    ${generateProjects(projects)}
    ${generateCertifications(certifications)}
    ${generateLanguages(languages)}
</body>
</html>`;
}

// Helper functions for each section
function generateHeader(contact_info) {
    if (!contact_info) return '';
    
    const contactItems = [];
    if (contact_info.email) contactItems.push(`<span class="contact-item">${contact_info.email}</span>`);
    if (contact_info.phone_numbers?.length > 0) contactItems.push(`<span class="contact-item">${contact_info.phone_numbers[0]}</span>`);
    if (contact_info.location) contactItems.push(`<span class="contact-item">${contact_info.location}</span>`);
    if (contact_info.linkedin) contactItems.push(`<a href="${contact_info.linkedin}" class="contact-item">LinkedIn</a>`);
    if (contact_info.portfolio) contactItems.push(`<a href="${contact_info.portfolio}" class="contact-item">Portfolio</a>`);
    
    return `
    <div class="header">
        ${contact_info.name ? `<h1 class="name">${contact_info.name}</h1>` : ''}
        ${contactItems.length > 0 ? `<div class="contact-info">${contactItems.join('')}</div>` : ''}
    </div>`;
}

function generateSummary(summary) {
    if (!summary) return '';
    return `
    <div class="section">
        <div class="summary">${summary}</div>
    </div>`;
}

function generateExperience(experience) {
    if (!experience || experience.length === 0) return '';
    
    const experienceItems = experience.map(exp => `
        <div class="experience-item">
            <div class="item-header">
                <div class="item-title">${exp.role}</div>
                <div class="item-dates">${exp.start_date || ''} ${exp.end_date ? ' - ' + exp.end_date : ''}</div>
            </div>
            <div class="item-subtitle">${exp.company_name}${exp.location ? ' • ' + exp.location : ''}</div>
            ${exp.description ? `<div class="item-description">${exp.description}</div>` : ''}
        </div>
    `).join('');
    
    return `
    <div class="section">
        <h2 class="section-title">Experience</h2>
        ${experienceItems}
    </div>`;
}

function generateSkills(skills) {
    if (!skills || skills.length === 0) return '';
    
    const skillTags = skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
    
    return `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-list">${skillTags}</div>
    </div>`;
}

function generateEducation(education) {
    if (!education || education.length === 0) return '';
    
    const educationItems = education.map(edu => `
        <div class="education-item">
            <div class="item-header">
                <div class="item-title">${edu.degree}${edu.field_of_study ? ' in ' + edu.field_of_study : ''}</div>
                <div class="item-dates">${edu.end_date || ''}</div>
            </div>
            <div class="item-subtitle">${edu.institution}${edu.location ? ' • ' + edu.location : ''}${edu.gpa ? ' • GPA: ' + edu.gpa : ''}</div>
        </div>
    `).join('');
    
    return `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${educationItems}
    </div>`;
}

function generateProjects(projects) {
    if (!projects || projects.length === 0) return '';
    
    const projectItems = projects.map(project => `
        <div class="project-item">
            <div class="item-header">
                <div class="item-title">${project.name}</div>
                ${project.start_date ? `<div class="item-dates">${project.start_date}${project.end_date ? ' - ' + project.end_date : ''}</div>` : ''}
            </div>
            ${project.description ? `<div class="item-description">${project.description}</div>` : ''}
            ${project.technologies?.length > 0 ? `<div class="skills-list" style="margin-top: 8px;">${project.technologies.map(tech => `<span class="skill-tag">${tech}</span>`).join('')}</div>` : ''}
        </div>
    `).join('');
    
    return `
    <div class="section">
        <h2 class="section-title">Projects</h2>
        ${projectItems}
    </div>`;
}

function generateCertifications(certifications) {
    if (!certifications || certifications.length === 0) return '';
    
    const certItems = certifications.map(cert => `
        <div class="certification-item">
            <strong>${cert.name}</strong> - ${cert.issuer}${cert.date_obtained ? ` (${cert.date_obtained})` : ''}
        </div>
    `).join('');
    
    return `
    <div class="section">
        <h2 class="section-title">Certifications</h2>
        ${certItems}
    </div>`;
}

function generateLanguages(languages) {
    if (!languages || languages.length === 0) return '';
    
    return `
    <div class="section">
        <h2 class="section-title">Languages</h2>
        <div class="skills-list">${languages.map(lang => `<span class="skill-tag">${lang}</span>`).join('')}</div>
    </div>`;
}