
import React from 'react';
import { MasterResume, Experience, Project, Skills } from '../types';

interface VisualPreviewProps {
  data: MasterResume;
  experience: Experience[];
  projects: Project[];
  skills: Skills;
  scale?: number;
}

const VisualPreview: React.FC<VisualPreviewProps> = ({ data, experience, projects, skills, scale = 1 }) => {
  // Standard US Letter dimensions (8.5 x 11 inches)
  const PAGE_WIDTH_IN = 8.5;
  const PAGE_HEIGHT_IN = 11;

  return (
    <div 
      className="resume-paper-wrapper flex items-center justify-center transition-all duration-200"
      style={{ 
        width: `${PAGE_WIDTH_IN * scale}in`,
        height: `${PAGE_HEIGHT_IN * scale}in`,
      }}
    >
      <div 
        className="bg-white text-black p-[0.45in] shadow-2xl resume-preview-container text-[11pt] flex flex-col resume-paper transition-transform duration-200"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          width: `${PAGE_WIDTH_IN}in`,
          height: `${PAGE_HEIGHT_IN}in`,
          flexShrink: 0
        }}
      >
        {/* Header - Professional Typography */}
        <div className="text-center mb-4">
          <h1 className="text-[20pt] font-bold mb-1 uppercase tracking-tight leading-none">{data.personalInfo.fullName}</h1>
          <div className="text-[8.5pt] flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 mt-2">
            <span>{data.personalInfo.phone}</span>
            <span className="opacity-30">|</span>
            <span className="underline decoration-slate-300">{data.personalInfo.email}</span>
            <span className="opacity-30">|</span>
            <span className="underline decoration-slate-300">{data.personalInfo.linkedin}</span>
            <span className="opacity-30">|</span>
            <span className="underline decoration-slate-300">{data.personalInfo.github}</span>
          </div>
        </div>

        <div className="flex-grow flex flex-col space-y-4">
          {/* Education */}
          {data.education.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-black mb-1.5 uppercase text-[10.5pt]">Education</h2>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-1.5 text-[10pt]">
                  <div className="flex justify-between font-bold">
                    <span>{edu.institution}</span>
                    <span>{edu.location}</span>
                  </div>
                  <div className="flex justify-between italic text-[9.5pt]">
                    <span>{edu.degree}</span>
                    <span>{edu.dateRange}</span>
                  </div>
                </div>
              ))}
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-black mb-1.5 uppercase text-[10.5pt]">Experience</h2>
              {experience.map((exp, i) => (
                <div key={i} className="mb-3">
                  <div className="flex justify-between font-bold text-[10.5pt]">
                    <span>{exp.role}</span>
                    <span>{exp.dateRange}</span>
                  </div>
                  <div className="flex justify-between italic text-[9.5pt] mb-1">
                    <span>{exp.company}</span>
                    <span>{exp.location}</span>
                  </div>
                  <ul className="list-disc ml-5 text-[9pt] space-y-0.5 leading-snug">
                    {exp.bullets.map((bullet, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: bullet }} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 className="font-bold border-b border-black mb-1.5 uppercase text-[10.5pt]">Projects</h2>
              {projects.map((proj, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10pt]">
                      <span className="font-bold">{proj.name}</span> <span className="opacity-50 mx-1">|</span> <span className="italic text-[9pt]">{proj.technologies.join(', ')}</span>
                    </span>
                    {proj.link && <span className="text-[8.5pt] underline decoration-slate-300 opacity-70">{proj.link}</span>}
                  </div>
                  <ul className="list-disc ml-5 text-[9pt] space-y-0.5 leading-snug">
                    {proj.bullets.map((bullet, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: bullet }} />
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {/* Skills */}
          <section className="mt-auto pt-2">
            <h2 className="font-bold border-b border-black mb-1.5 uppercase text-[10.5pt]">Technical Skills</h2>
            <div className="text-[9pt] space-y-1 leading-tight">
              <p><span className="font-bold">Languages:</span> {skills.languages.join(', ')}</p>
              <p><span className="font-bold">Frameworks:</span> {skills.frameworks.join(', ')}</p>
              <p><span className="font-bold">Developer Tools:</span> {skills.tools.join(', ')}</p>
              <p><span className="font-bold">Libraries:</span> {skills.libraries.join(', ')}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default VisualPreview;
