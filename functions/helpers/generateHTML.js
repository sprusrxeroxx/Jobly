// --- HTML Resume Template Generator ---
export default function generateHTMLResume(structuredData) {
  const { contact_info, summary, experience, skills, education, projects, certifications, languages } = structuredData || {};

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Resume - ${escapeHtml((contact_info && contact_info.name) || 'Candidate')}</title>
  <style>
    /* Basic reset */
    *{box-sizing:border-box;margin:0;padding:0}
    body{
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial;
      color:#333; line-height:1.5;
      max-width:800px;margin:0 auto;padding:20px;background:#fff;
    }
    .header{ text-align:center;margin-bottom:28px;border-bottom:2px solid #2c5aa0;padding-bottom:18px }
    .name{ font-size:2em; font-weight:700; color:#2c5aa0; margin-bottom:6px }
    .contact-info{ display:flex; flex-wrap:wrap; justify-content:center; gap:12px; margin-bottom:8px }
    .contact-item{ color:#666; text-decoration:none; font-size:0.95rem }
    .section{ margin-bottom:20px }
    .section-title{ font-size:1.15rem; font-weight:600; color:#2c5aa0; margin-bottom:10px; padding-bottom:4px; border-bottom:1px solid #eaeaea }
    .experience-item, .education-item, .project-item { margin-bottom:12px; page-break-inside:avoid; -webkit-column-break-inside:avoid }
    .item-header{ display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:6px; gap:8px }
    .item-title{ font-weight:600; flex:1 }
    .item-subtitle{ color:#666; font-style:italic; font-size:0.95rem }
    .item-dates{ color:#888; white-space:nowrap; font-size:0.9rem }
    .item-description{ margin-top:6px; color:#444; font-size:0.95rem }
    .skills-list{ display:flex; flex-wrap:wrap; gap:8px }
    .skill-tag{ background:#f0f4ff; padding:4px 10px; border-radius:14px; font-size:0.9rem; border:1px solid #d0d8f0 }
    .summary{ background:#f8f9fa; padding:14px; border-radius:8px; border-left:4px solid #2c5aa0 }
    @media print {
      body { width: 100%; max-width: none; padding: 12mm; }
      .contact-info { page-break-inside: avoid; }
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

// helpers (update: escape content when interpolating)
function escapeHtml(s) {
  if (!s && s !== 0) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateHeader(contact_info) {
  if (!contact_info) return '';
  const items = [];
  if (contact_info.email) items.push(`<span class="contact-item">${escapeHtml(contact_info.email)}</span>`);
  if (contact_info.phone_numbers?.length) items.push(`<span class="contact-item">${escapeHtml(contact_info.phone_numbers[0])}</span>`);
  if (contact_info.location) items.push(`<span class="contact-item">${escapeHtml(contact_info.location)}</span>`);
  if (contact_info.linkedin) items.push(`<a class="contact-item" href="${escapeHtml(contact_info.linkedin)}">LinkedIn</a>`);
  if (contact_info.portfolio) items.push(`<a class="contact-item" href="${escapeHtml(contact_info.portfolio)}">Portfolio</a>`);

  return `<div class="header">
    ${contact_info.name ? `<div class="name">${escapeHtml(contact_info.name)}</div>` : ''}
    ${items.length ? `<div class="contact-info">${items.join('')}</div>` : ''}
  </div>`;
}

function generateSummary(summary) {
  if (!summary) return '';
  return `<div class="section"><div class="summary">${escapeHtml(summary)}</div></div>`;
}

function generateExperience(experience) {
  if (!experience || !experience.length) return '';
  const items = experience.map(exp => `
    <div class="experience-item">
      <div class="item-header">
        <div class="item-title">${escapeHtml(exp.role || '')}</div>
        <div class="item-dates">${escapeHtml(exp.start_date || '')}${exp.end_date ? ' - ' + escapeHtml(exp.end_date) : ''}</div>
      </div>
      <div class="item-subtitle">${escapeHtml(exp.company_name || '')}${exp.location ? ' • ' + escapeHtml(exp.location) : ''}</div>
      ${exp.description ? `<div class="item-description">${escapeHtml(exp.description)}</div>` : ''}
    </div>
  `).join('');
  return `<div class="section"><h2 class="section-title">Experience</h2>${items}</div>`;
}

function generateSkills(skills) {
  if (!skills || !skills.length) return '';
  return `<div class="section"><h2 class="section-title">Skills</h2><div class="skills-list">${skills.map(s => `<span class="skill-tag">${escapeHtml(s)}</span>`).join('')}</div></div>`;
}

function generateEducation(education) {
  if (!education || !education.length) return '';
  const items = education.map(edu => `
    <div class="education-item">
      <div class="item-header">
        <div class="item-title">${escapeHtml(edu.degree || '')}${edu.field_of_study ? ' in ' + escapeHtml(edu.field_of_study) : ''}</div>
        <div class="item-dates">${escapeHtml(edu.end_date || '')}</div>
      </div>
      <div class="item-subtitle">${escapeHtml(edu.institution || '')}${edu.location ? ' • ' + escapeHtml(edu.location) : ''}${edu.gpa ? ' • GPA: ' + escapeHtml(edu.gpa) : ''}</div>
    </div>
  `).join('');
  return `<div class="section"><h2 class="section-title">Education</h2>${items}</div>`;
}

function generateProjects(projects) {
  if (!projects || !projects.length) return '';
  const items = projects.map(p => `
    <div class="project-item">
      <div class="item-header">
        <div class="item-title">${escapeHtml(p.name || '')}</div>
        ${p.start_date ? `<div class="item-dates">${escapeHtml(p.start_date)}${p.end_date ? ' - ' + escapeHtml(p.end_date) : ''}</div>` : ''}
      </div>
      ${p.description ? `<div class="item-description">${escapeHtml(p.description)}</div>` : ''}
      ${p.technologies?.length ? `<div class="skills-list" style="margin-top:8px;">${p.technologies.map(t => `<span class="skill-tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
    </div>
  `).join('');
  return `<div class="section"><h2 class="section-title">Projects</h2>${items}</div>`;
}

function generateCertifications(certifications) {
  if (!certifications || !certifications.length) return '';
  return `<div class="section"><h2 class="section-title">Certifications</h2>${certifications.map(c => `<div class="certification-item"><strong>${escapeHtml(c.name)}</strong> - ${escapeHtml(c.issuer || '')}${c.date_obtained ? ` (${escapeHtml(c.date_obtained)})` : ''}</div>`).join('')}</div>`;
}

function generateLanguages(languages) {
  if (!languages || !languages.length) return '';
  return `<div class="section"><h2 class="section-title">Languages</h2><div class="skills-list">${languages.map(l => `<span class="skill-tag">${escapeHtml(l)}</span>`).join('')}</div></div>`;
}
