
import React, { useRef, useEffect, useState } from 'react';
import { MasterResume, Experience, Project, Education, Skills } from '../types';

/**
 * A specialized rich text editor for a single resume bullet point.
 */
const BulletEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  placeholder?: string;
}> = ({ value, onChange, onRemove, placeholder }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string) => {
    document.execCommand(command, false);
    handleInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'b' || e.key.toLowerCase() === 'i')) {
      e.preventDefault();
      const command = e.key.toLowerCase() === 'b' ? 'bold' : 'italic';
      execCommand(command);
    }
  };

  return (
    <div className="group relative flex flex-col mb-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-500/50">
      <div className="flex items-center gap-1 p-1 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <button onMouseDown={(e) => { e.preventDefault(); execCommand('bold'); }} className="p-1 px-2 text-[10px] font-bold rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">B</button>
        <button onMouseDown={(e) => { e.preventDefault(); execCommand('italic'); }} className="p-1 px-2 text-[10px] italic rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300">I</button>
        <div className="flex-grow" />
        <button onClick={onRemove} className="p-1 text-slate-400 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
      </div>
      {/* Fix: Replaced 'placeholder' with 'data-placeholder' because 'div' does not natively support the 'placeholder' attribute. */}
      <div ref={editorRef} contentEditable onInput={handleInput} onKeyDown={handleKeyDown} className="p-2 md:p-3 text-sm min-h-[50px] outline-none text-slate-700 dark:text-slate-300 overflow-auto" data-placeholder={placeholder} />
    </div>
  );
};

interface STARHelperProps {
  jobDescription: string;
}

const STARHelper: React.FC<STARHelperProps> = ({ jobDescription }) => {
  const [isOpen, setIsOpen] = useState(false);
  const jdLower = jobDescription.toLowerCase();

  const getTailoredSuggestion = () => {
    if (jdLower.includes('react') || jdLower.includes('frontend')) {
      return {
        skill: 'Frontend',
        s: 'Faced slow page loads on a dashboard.',
        t: 'Optimize performance for speed.',
        a: 'Implemented code-splitting and memoization.',
        r: 'Achieved 50% faster TTI.'
      };
    }
    if (jdLower.includes('sql') || jdLower.includes('database')) {
      return {
        skill: 'Database',
        s: 'API latency spiked under load.',
        t: 'Reduce query execution time.',
        a: 'Indexed critical tables and refactored SQL.',
        r: 'Decreased response time by 40%.'
      };
    }
    return null;
  };

  const suggestion = getTailoredSuggestion();

  return (
    <div className="mt-2 mb-2">
      <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-all">
        <span className={`p-1 rounded-md ${isOpen ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
        </span>
        STAR Helper
      </button>
      {isOpen && (
        <div className="mt-2 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px]">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <p className="font-bold text-blue-600 mb-1">Framework:</p>
              <p className="text-slate-500"><strong>S/T:</strong> Problem/Goal | <strong>A:</strong> Your tools/steps | <strong>R:</strong> Metric/Impact</p>
            </div>
            {suggestion && (
              <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                <p className="font-bold text-blue-600 mb-1">Tailored Suggestion:</p>
                <p className="italic text-slate-500">{suggestion.a} &rarr; {suggestion.r}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ValidationError: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex items-center gap-1 mt-1"><p className="text-[9px] text-red-500 font-bold uppercase tracking-tight">{message}</p></div>
);

interface ResumeFormProps {
  data: MasterResume;
  onChange: (newData: MasterResume) => void;
  jobDescription: string;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ data, onChange, jobDescription }) => {
  const updatePersonalInfo = (field: keyof MasterResume['personalInfo'], value: string) => {
    onChange({ ...data, personalInfo: { ...data.personalInfo, [field]: value } });
  };

  const updateArrayField = <T extends any>(key: 'experience' | 'projects' | 'education', index: number, field: keyof T, value: any) => {
    const newArray = [...data[key]] as any[];
    newArray[index] = { ...newArray[index], [field]: value };
    onChange({ ...data, [key]: newArray });
  };

  const addArrayItem = (key: 'experience' | 'projects' | 'education') => {
    const templates = {
      experience: { company: '', role: '', location: '', dateRange: '', bullets: [''] },
      projects: { name: '', technologies: [], bullets: [''], link: '' },
      education: { institution: '', degree: '', location: '', dateRange: '' }
    };
    onChange({ ...data, [key]: [...data[key], templates[key]] });
  };

  const removeArrayItem = (key: 'experience' | 'projects' | 'education', index: number) => {
    onChange({ ...data, [key]: data[key].filter((_, i) => i !== index) } as any);
  };

  const updateBullets = (key: 'experience' | 'projects', itemIndex: number, bulletIndex: number, value: string) => {
    const newArray = [...data[key]] as any[];
    const newBullets = [...newArray[itemIndex].bullets];
    newBullets[bulletIndex] = value;
    newArray[itemIndex] = { ...newArray[itemIndex], bullets: newBullets };
    onChange({ ...data, [key]: newArray });
  };

  const addBullet = (key: 'experience' | 'projects', itemIndex: number) => {
    const newArray = [...data[key]] as any[];
    newArray[itemIndex] = { ...newArray[itemIndex], bullets: [...newArray[itemIndex].bullets, ''] };
    onChange({ ...data, [key]: newArray });
  };

  const removeBullet = (key: 'experience' | 'projects', itemIndex: number, bulletIndex: number) => {
    const newArray = [...data[key]] as any[];
    newArray[itemIndex] = { ...newArray[itemIndex], bullets: newArray[itemIndex].bullets.filter((_: any, i: number) => i !== bulletIndex) };
    onChange({ ...data, [key]: newArray });
  };

  const updateIndividualSkill = (category: keyof Skills, index: number, value: string) => {
    const newSkillsArray = [...data.skills[category]];
    newSkillsArray[index] = value;
    onChange({ ...data, skills: { ...data.skills, [category]: newSkillsArray } });
  };

  const addSkill = (category: keyof Skills) => {
    onChange({ ...data, skills: { ...data.skills, [category]: [...data.skills[category], ''] } });
  };

  const removeSkill = (category: keyof Skills, index: number) => {
    onChange({ ...data, skills: { ...data.skills, [category]: data.skills[category].filter((_, i) => i !== index) } });
  };

  const getInputClasses = (value: string, isRequired: boolean = false) => {
    const base = "w-full p-2 border rounded-lg focus:ring-2 focus:outline-none transition-all text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 ";
    const hasError = isRequired && (!value || !value.trim());
    return base + (hasError ? "border-red-400 dark:border-red-800" : "border-slate-200 dark:border-slate-800 focus:ring-blue-500");
  };

  const sectionClasses = "bg-white dark:bg-slate-900 p-4 md:p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm";
  const labelClasses = "block text-[10px] font-bold text-slate-500 uppercase mb-1";
  const itemContainerClasses = "mb-4 p-3 md:p-4 border border-slate-100 dark:border-slate-800 rounded-lg relative bg-slate-50/30 dark:bg-slate-950/30";

  const renderSkillSection = (category: keyof Skills, title: string) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center"><label className={labelClasses}>{title}</label><button onClick={() => addSkill(category)} className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">+ Add</button></div>
      <div className="flex flex-wrap gap-1.5">
        {data.skills[category].map((skill, idx) => (
          <div key={idx} className="flex items-center gap-1">
            <input type="text" value={skill} onChange={(e) => updateIndividualSkill(category, idx, e.target.value)} className="w-24 md:w-32 p-1 text-xs border border-slate-200 dark:border-slate-800 rounded bg-white dark:bg-slate-900" placeholder="Skill..." />
            <button onClick={() => removeSkill(category, idx)} className="text-slate-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 md:space-y-8">
      <section className={sectionClasses}>
        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mb-4">Contact</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div><label className={labelClasses}>Full Name *</label><input type="text" value={data.personalInfo.fullName} onChange={(e) => updatePersonalInfo('fullName', e.target.value)} className={getInputClasses(data.personalInfo.fullName, true)} /></div>
          <div><label className={labelClasses}>Email *</label><input type="email" value={data.personalInfo.email} onChange={(e) => updatePersonalInfo('email', e.target.value)} className={getInputClasses(data.personalInfo.email, true)} /></div>
          <div><label className={labelClasses}>Phone</label><input type="text" value={data.personalInfo.phone} onChange={(e) => updatePersonalInfo('phone', e.target.value)} className={getInputClasses(data.personalInfo.phone)} /></div>
          <div><label className={labelClasses}>LinkedIn</label><input type="text" value={data.personalInfo.linkedin} onChange={(e) => updatePersonalInfo('linkedin', e.target.value)} className={getInputClasses(data.personalInfo.linkedin)} /></div>
        </div>
      </section>

      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4"><h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Education</h3><button onClick={() => addArrayItem('education')} className="text-blue-600 text-xs font-bold uppercase tracking-wider">+ Add</button></div>
        {data.education.map((edu, idx) => (
          <div key={idx} className={itemContainerClasses}>
            <button onClick={() => removeArrayItem('education', idx)} className="absolute top-1 right-1 text-slate-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Institution" className={getInputClasses(edu.institution, true)} value={edu.institution} onChange={(e) => updateArrayField('education', idx, 'institution', e.target.value)} />
              <input placeholder="Degree" className={getInputClasses(edu.degree, true)} value={edu.degree} onChange={(e) => updateArrayField('education', idx, 'degree', e.target.value)} />
            </div>
          </div>
        ))}
      </section>

      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4"><h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Experience</h3><button onClick={() => addArrayItem('experience')} className="text-blue-600 text-xs font-bold uppercase tracking-wider">+ Add</button></div>
        {data.experience.map((exp, expIdx) => (
          <div key={expIdx} className={itemContainerClasses}>
            <button onClick={() => removeArrayItem('experience', expIdx)} className="absolute top-1 right-1 text-slate-300 hover:text-red-500"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg></button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input placeholder="Role" className={getInputClasses(exp.role, true)} value={exp.role} onChange={(e) => updateArrayField('experience', expIdx, 'role', e.target.value)} />
              <input placeholder="Company" className={getInputClasses(exp.company, true)} value={exp.company} onChange={(e) => updateArrayField('experience', expIdx, 'company', e.target.value)} />
            </div>
            <div className="space-y-2">
              {exp.bullets.map((bullet, bIdx) => (
                <BulletEditor key={bIdx} value={bullet} onChange={(val) => updateBullets('experience', expIdx, bIdx, val)} onRemove={() => removeBullet('experience', expIdx, bIdx)} placeholder="Impact bullet..." />
              ))}
              <button onClick={() => addBullet('experience', expIdx)} className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">+ Add Bullet</button>
              <STARHelper jobDescription={jobDescription} />
            </div>
          </div>
        ))}
      </section>

      <section className={sectionClasses}>
        <div className="flex justify-between items-center mb-4"><h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Skills</h3></div>
        <div className="grid grid-cols-1 gap-4">
          {renderSkillSection('languages', 'Languages')}
          {renderSkillSection('frameworks', 'Frameworks')}
          {renderSkillSection('tools', 'Tools')}
        </div>
      </section>
    </div>
  );
};

export default ResumeForm;
