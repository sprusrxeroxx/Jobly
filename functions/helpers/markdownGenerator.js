export function generateMarkdownResume(structuredData) {
    const { contact_info, summary, experience, skills, education, projects, certifications, languages } = structuredData;
    
    let markdown = '';
    
    // 1. Header with Contact Information
    if (contact_info.name) {
        markdown += `# ${contact_info.name}\n\n`;
    }
    
    if (contact_info.email || contact_info.phone_numbers.length > 0) {
        markdown += '**Contact Information**\n';
        if (contact_info?.email) markdown += `- Email: ${contact_info.email}\n`;
        if (contact_info.phone_numbers.length > 0) markdown += `- Phone: ${contact_info.phone_numbers[0]}\n`;
        if (contact_info?.location) markdown += `- Location: ${contact_info.location}\n`;
        if (contact_info?.linkedin) markdown += `- LinkedIn: ${contact_info.linkedin}\n`;
        if (contact_info?.portfolio) markdown += `- Portfolio: ${contact_info.portfolio}\n`;
        markdown += '\n';
    }
    
    // 2. Professional Summary (if exists)
    if (summary) {
        markdown += '## Professional Summary\n';
        markdown += `${summary}\n\n`;
    }
    
    // 3. Experience (most important for experienced candidates)
    if (experience && experience.length > 0) {
        markdown += '## Professional Experience\n';
        experience.forEach(exp => {
            markdown += `### ${exp.role}\n`;
            markdown += `**${exp.company_name}**`;
            if (exp?.location) markdown += ` | ${exp.location}`;
            if (exp?.start_date) {
                markdown += ` | ${exp.start_date} - ${exp.end_date || 'Present'}\n`;
            } else {
                markdown += '\n';
            }
            if (exp.description) markdown += `${exp.description}\n`;
            markdown += '\n';
        });
    }
    
    // 4. Skills (always important, position based on experience)
    if (skills && skills.length > 0) {
        markdown += '## Skills & Technologies\n';
        // Group skills if needed, or just list them
        markdown += `${skills.join(' • ')}\n\n`;
    }
    
    // 5. Education (more important for recent grads)
    if (education && education.length > 0) {
        markdown += '## Education\n';
        education.forEach(edu => {
            markdown += `### ${edu.degree}${edu.field_of_study ? ` in ${edu.field_of_study}` : ''}\n`;
            markdown += `**${edu.institution}**`;
            if (edu.location) markdown += ` | ${edu.location}`;
            if (edu.end_date) markdown += ` | ${edu.end_date}`;
            if (edu.gpa) markdown += ` | GPA: ${edu.gpa}`;
            markdown += '\n\n';
        });
    }
    
    // 6. Projects (important for tech/creative roles)
    if (projects && projects.length > 0) {
        markdown += '## Projects\n';
        projects.forEach(project => {
            markdown += `### ${project.name}\n`;
            if (project.start_date) markdown += `*${project.start_date} - ${project.end_date || 'Present'}*\n`;
            markdown += `${project.description}\n`;
            if (project.technologies && project.technologies.length > 0) {
                markdown += `**Technologies:** ${project.technologies.join(', ')}\n`;
            }
            markdown += '\n';
        });
    }
    
    // 7. Certifications (industry-specific)
    if (certifications && certifications.length > 0) {
        markdown += '## Certifications\n';
        certifications.forEach(cert => {
            markdown += `- **${cert.name}** - ${cert.issuer}`;
            if (cert.date_obtained) markdown += ` (${cert.date_obtained})`;
            markdown += '\n';
        });
        markdown += '\n';
    }
    
    // 8. Languages (bonus section)
    if (languages && languages.length > 0) {
        markdown += '## Languages\n';
        markdown += `${languages.join(' • ')}\n`;
    }
    
    return markdown.trim();
}