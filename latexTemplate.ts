
import { MasterResume, Project, Experience } from './types';

const escapeLatex = (str: string) => {
  return str
    .replace(/\\/g, '\\textbackslash ')
    .replace(/&/g, '\\&')
    .replace(/%/g, '\\%')
    .replace(/\$/g, '\\$')
    .replace(/#/g, '\\#')
    .replace(/_/g, '\\_')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/~/g, '\\textasciitilde ')
    .replace(/\^/g, '\\textasciicircum ');
};

/**
 * Converts rich text HTML (from contenteditable) into LaTeX commands.
 * Supports <b>, <strong>, <i>, <em>.
 */
const convertRichTextToLatex = (html: string) => {
  if (!html) return '';

  // 1. Replace HTML tags with unique placeholders that won't be escaped
  let processed = html
    .replace(/<(b|strong)>/gi, '[[B_START]]')
    .replace(/<\/(b|strong)>/gi, '[[B_END]]')
    .replace(/<(i|em)>/gi, '[[I_START]]')
    .replace(/<\/(i|em)>/gi, '[[I_END]]');

  // 2. Escape all standard LaTeX special characters
  processed = escapeLatex(processed);

  // 3. Swap placeholders for real LaTeX commands
  processed = processed
    .replace(/\[\[B_START\]\]/g, '\\textbf{')
    .replace(/\[\[B_END\]\]/g, '}')
    .replace(/\[\[I_START\]\]/g, '\\textit{')
    .replace(/\[\[I_END\]\]/g, '}');

  // 4. Clean up any residual HTML entities or extra spaces from contenteditable
  return processed.replace(/&nbsp;/g, ' ').replace(/&amp;/g, '\\&');
};

export const generateJakesLatex = (
  personalInfo: MasterResume['personalInfo'],
  education: MasterResume['education'],
  experience: Experience[],
  projects: Project[],
  skills: MasterResume['skills']
): string => {
  const header = `
\\documentclass[letterpaper,11pt]{article}

\\usepackage{latexsym}
\\usepackage[empty]{fullpage}
\\usepackage{titlesec}
\\usepackage{marvosym}
\\usepackage[usenames,dvipsnames]{color}
\\usepackage{verbatim}
\\usepackage{enumitem}
\\usepackage[hidelinks]{hyperref}
\\usepackage{fancyhdr}
\\usepackage[english]{babel}
\\usepackage{tabularx}
\\input{glyphtounicode}

\\pagestyle{fancy}
\\fancyhf{} 
\\fancyfoot{}
\\renewcommand{\\headrulewidth}{0pt}
\\renewcommand{\\footrulewidth}{0pt}

\\addtolength{\\oddsidemargin}{-0.5in}
\\addtolength{\\evensidemargin}{-0.5in}
\\addtolength{\\textwidth}{1in}
\\addtolength{\\topmargin}{-.5in}
\\addtolength{\\textheight}{1.0in}

\\urlstyle{same}

\\raggedbottom
\\raggedright
\\setlength{\\tabcolsep}{0in}

\\titleformat{\\section}{
  \\vspace{-4pt}\\scshape\\raggedright\\large
}{}{0em}{}[\\color{black}\\titlerule \\vspace{-5pt}]

\\pdfgentounicode=1

\\newcommand{\\resumeItem}[1]{
  \\item\\small{
    {#1 \\vspace{-2pt}}
  }
}

\\newcommand{\\resumeSubheading}[4]{
  \\vspace{-2pt}\\item
    \\begin{tabular*}{0.97\\textwidth}[t]{l@{\\extracolsep{\\fill}}r}
      \\textbf{#1} & #2 \\\\
      \\textit{\\small#3} & \\textit{\\small #4} \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeProjectHeading}[2]{
    \\item
    \\begin{tabular*}{0.97\\textwidth}{l@{\\extracolsep{\\fill}}r}
      \\small#1 & #2 \\\\
    \\end{tabular*}\\vspace{-7pt}
}

\\newcommand{\\resumeSubItem}[1]{\\resumeItem{#1}\\vspace{-4pt}}

\\renewcommand\\labelitemii{$\\vcenter{\\hbox{\\tiny$\\bullet$}}$}

\\newcommand{\\resumeSubHeadingListStart}{\\begin{itemize}[leftmargin=0.15in, label={}]}
\\newcommand{\\resumeSubHeadingListEnd}{\\end{itemize}}
\\newcommand{\\resumeItemListStart}{\\begin{itemize}}
\\newcommand{\\resumeItemListEnd}{\\end{itemize}\\vspace{-5pt}}

\\begin{document}

\\begin{center}
    \\textbf{\\Huge \\scshape ${escapeLatex(personalInfo.fullName)}} \\\\ \\vspace{1pt}
    \\small ${escapeLatex(personalInfo.phone)} $|$ \\href{mailto:${personalInfo.email}}{\\underline{${escapeLatex(personalInfo.email)}}} $|$ 
    \\href{https://${personalInfo.linkedin}}{\\underline{${escapeLatex(personalInfo.linkedin)}}} $|$
    \\href{https://${personalInfo.github}}{\\underline{${escapeLatex(personalInfo.github)}}}
\\end{center}

\\section{Education}
  \\resumeSubHeadingListStart
    ${education.map(edu => `
    \\resumeSubheading{${escapeLatex(edu.institution)}}{${escapeLatex(edu.location)}}
      {${escapeLatex(edu.degree)}}{${escapeLatex(edu.dateRange)}}
    `).join('')}
  \\resumeSubHeadingListEnd

\\section{Experience}
  \\resumeSubHeadingListStart
    ${experience.map(exp => `
    \\resumeSubheading
      {${escapeLatex(exp.role)}}{${escapeLatex(exp.dateRange)}}
      {${escapeLatex(exp.company)}}{${escapeLatex(exp.location)}}
      \\resumeItemListStart
        ${exp.bullets.map(b => `\\resumeItem{${convertRichTextToLatex(b)}}`).join('\n        ')}
      \\resumeItemListEnd
    `).join('')}
  \\resumeSubHeadingListEnd

\\section{Projects}
    \\resumeSubHeadingListStart
      ${projects.map(proj => `
      \\resumeProjectHeading
          {\\textbf{${escapeLatex(proj.name)}} $|$ \\emph{${escapeLatex(proj.technologies.join(', '))}}}{${proj.link ? escapeLatex(proj.link) : ''}}
          \\resumeItemListStart
            ${proj.bullets.map(b => `\\resumeItem{${convertRichTextToLatex(b)}}`).join('\n            ')}
          \\resumeItemListEnd
      `).join('')}
    \\resumeSubHeadingListEnd

\\section{Technical Skills}
 \\begin{itemize}[leftmargin=0.15in, label={}]
    \\small{\\item{
     \\textbf{Languages}{: ${escapeLatex(skills.languages.join(', '))}} \\\\
     \\textbf{Frameworks}{: ${escapeLatex(skills.frameworks.join(', '))}} \\\\
     \\textbf{Developer Tools}{: ${escapeLatex(skills.tools.join(', '))}} \\\\
     \\textbf{Libraries}{: ${escapeLatex(skills.libraries.join(', '))}}
    }}
 \\end{itemize}

\\end{document}
  `;
  return header.trim();
};
