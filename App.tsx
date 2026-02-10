
import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { INITIAL_MASTER_RESUME, INITIAL_JD } from './constants';
import EditorSection from './components/EditorSection';
import LatexPreview from './components/LatexPreview';
import ResumeForm from './components/ResumeForm';
import { generateJakesLatex } from './latexTemplate';
import { MasterResume, OptimizationResult, OptimizationStage, Experience, Project, Skills } from './types';
import { TECH_KEYWORDS } from './techDictionary';

const STORAGE_KEY = 'latex_resume_master_json';
const THEME_KEY = 'latex_resume_theme';

const STOP_WORDS = new Set([
  'we', 'are', 'looking', 'for', 'with', 'years', 'of', 'experience', 'key', 'requirements', 
  'include', 'proficiency', 'in', 'strong', 'knowledge', 'and', 'platforms', 'familiarity', 
  'excellent', 'problem', 'solving', 'skills', 'ability', 'to', 'work', 'collaborative', 
  'environment', 'is', 'a', 'the', 'an', 'on', 'at', 'by', 'from', 'up', 'about', 'into', 
  'over', 'after', 'plus', 'preferred', 'required', 'must', 'have', 'stack', 'full', 'engineer',
  'developer', 'software', 'team', 'using', 'role', 'position', 'who', 'our', 'will', 'be', 
  'highly', 'motivated', 'seeking', 'passionate', 'successful', 'candidate', 'ideal', 'apply',
  'join', 'us', 'help', 'build', 'create', 'maintain', 'support', 'technical', 'professional',
  'design', 'develop', 'implement', 'manage', 'lead', 'excellent', 'communication', 'written',
  'verbal', 'degree', 'computer', 'science', 'field', 'related', 'equivalent', 'relevant'
]);

interface ExtendedOptimizationResult extends OptimizationResult {
  optimizedData: {
    experience: Experience[];
    projects: Project[];
    skills: Skills;
  };
}

const performLocalOptimization = (master: MasterResume, jd: string): ExtendedOptimizationResult => {
  const jdLower = jd.toLowerCase();
  const tokens = jdLower.split(/[^a-z0-9+#./-]+/).filter(t => t.length > 1);
  const termFrequencies = new Map<string, number>();
  
  for (let i = 0; i < tokens.length; i++) {
    const unigram = tokens[i];
    const bigram = i < tokens.length - 1 ? `${tokens[i]} ${tokens[i+1]}` : null;
    const trigram = i < tokens.length - 2 ? `${tokens[i]} ${tokens[i+1]} ${tokens[i+2]}` : null;

    [unigram, bigram, trigram].forEach(term => {
      if (term && (TECH_KEYWORDS.has(term) || (!STOP_WORDS.has(term) && term.length > 3))) {
        termFrequencies.set(term, (termFrequencies.get(term) || 0) + 1);
      }
    });
  }

  const termWeights = new Map<string, number>();
  termFrequencies.forEach((freq, term) => {
    const isTech = TECH_KEYWORDS.has(term);
    const baseWeight = isTech ? 15 : 1;
    const frequencyBoost = 1 + Math.log1p(freq);
    const phraseBoost = term.includes(' ') ? 1.4 : 1.0;
    termWeights.set(term, baseWeight * frequencyBoost * phraseBoost);
  });

  const calculateRelevanceScore = (content: string): number => {
    let score = 0;
    const lowerContent = content.toLowerCase();
    termWeights.forEach((weight, term) => {
      const pattern = term.includes(' ') 
        ? new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
        : new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      const matches = (lowerContent.match(pattern) || []).length;
      if (matches > 0) score += weight * (1 + Math.log10(matches));
    });
    return score;
  };

  const scoredProjects = master.projects.map(p => ({
    ...p,
    score: (calculateRelevanceScore(p.technologies.join(' ')) * 2.5) + calculateRelevanceScore(p.bullets.join(' '))
  })).sort((a, b) => b.score - a.score);

  const selectedProjects = scoredProjects.slice(0, 3).map(({ score, ...p }) => p as Project);

  const selectedExperience = master.experience.map(e => ({
    ...e,
    score: (calculateRelevanceScore(e.role) * 2.0) + (calculateRelevanceScore(e.company) * 0.5) + calculateRelevanceScore(e.bullets.join(' '))
  })).sort((a, b) => b.score - a.score).map(({ score, ...e }) => e as Experience);

  const filterSkills = (skills: string[]): string[] => {
    return skills.filter(s => {
      const sLow = s.toLowerCase();
      return termWeights.has(sLow) || jdLower.includes(sLow);
    });
  };

  const selectedSkills: Skills = {
    languages: filterSkills(master.skills.languages),
    frameworks: filterSkills(master.skills.frameworks),
    tools: filterSkills(master.skills.tools),
    libraries: filterSkills(master.skills.libraries)
  };

  const fillCategory = (cat: keyof Skills) => {
    const current = new Set(selectedSkills[cat]);
    if (current.size < 4) {
      master.skills[cat].forEach(s => {
        const sLow = s.toLowerCase();
        if (current.size < 6 && (TECH_KEYWORDS.has(sLow))) current.add(s);
      });
    }
    selectedSkills[cat] = Array.from(current);
  };
  (Object.keys(selectedSkills) as Array<keyof Skills>).forEach(fillCategory);

  const latex = generateJakesLatex(
    master.personalInfo,
    master.education,
    selectedExperience,
    selectedProjects,
    selectedSkills
  );

  const topKeywords = Array.from(termWeights.entries())
    .filter(([term]) => TECH_KEYWORDS.has(term))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([term]) => term);

  return {
    latex,
    keywordsExtracted: topKeywords,
    explanation: `Optimized for ${topKeywords.slice(0, 3).join(', ')}. Scored ${selectedExperience.length} roles and ${selectedProjects.length} projects based on relevance.`,
    optimizedData: {
      experience: selectedExperience,
      projects: selectedProjects,
      skills: selectedSkills
    }
  };
};

const App: React.FC = () => {
  const [viewMode, setViewMode] = useState<'form' | 'json'>('form');
  const [mobileTab, setMobileTab] = useState<'input' | 'result'>('input');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem(THEME_KEY);
    return saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const [masterResumeJson, setMasterResumeJson] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || JSON.stringify(INITIAL_MASTER_RESUME, null, 2);
  });
  
  const [jobDescription, setJobDescription] = useState(INITIAL_JD);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ExtendedOptimizationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const masterResumeObject = useMemo(() => {
    try {
      return JSON.parse(masterResumeJson) as MasterResume;
    } catch {
      return INITIAL_MASTER_RESUME;
    }
  }, [masterResumeJson]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, masterResumeJson);
  }, [masterResumeJson]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleBuild = useCallback(() => {
    try {
      setLoading(true);
      setError(null);
      const parsedResume = JSON.parse(masterResumeJson) as MasterResume;
      const optimized = performLocalOptimization(parsedResume, jobDescription);
      setResult(optimized);
      // Auto switch to result tab on mobile after build
      if (window.innerWidth < 768) {
        setMobileTab('result');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during build');
    } finally {
      setTimeout(() => setLoading(false), 400);
    }
  }, [masterResumeJson, jobDescription]);

  const handleReset = () => {
    if (window.confirm('Reset Master Resume to default?')) {
      setMasterResumeJson(JSON.stringify(INITIAL_MASTER_RESUME, null, 2));
    }
  };

  const handleFormChange = (newData: MasterResume) => {
    setMasterResumeJson(JSON.stringify(newData, null, 2));
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-300 overflow-hidden print:bg-white print:p-0">
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-6 py-3 flex items-center justify-between z-20 shadow-sm transition-colors duration-300 no-print">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-slate-800 dark:bg-slate-700 text-white p-2 rounded-xl flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="truncate">
              <h1 className="text-base md:text-xl font-bold tracking-tight truncate">LaTeX Resume</h1>
              <p className="hidden xs:block text-[9px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest opacity-80">TF-IDF Optimizer</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
            >
              {darkMode ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>}
            </button>
            <button
              onClick={handleBuild}
              disabled={loading}
              className={`px-4 md:px-8 py-2 md:py-3 rounded-xl font-black uppercase tracking-widest text-[10px] md:text-[11px] transition-all shadow-lg ${loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
            >
              {loading ? '...' : 'Build'}
            </button>
          </div>
        </header>

        {/* Mobile Tab Switcher */}
        <div className="md:hidden flex p-2 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 no-print">
           <button 
             onClick={() => setMobileTab('input')}
             className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mobileTab === 'input' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-400'}`}
           >
             1. Content
           </button>
           <button 
             onClick={() => setMobileTab('result')}
             className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${mobileTab === 'result' ? 'bg-slate-100 dark:bg-slate-800 text-blue-600' : 'text-slate-400'}`}
           >
             2. Result
           </button>
        </div>

        <main className="flex-grow flex flex-col md:flex-row p-4 md:p-6 gap-4 md:gap-6 overflow-hidden print:p-0 print:block">
          {/* Input Side */}
          <div className={`w-full md:w-1/2 flex flex-col h-full overflow-hidden space-y-4 no-print ${mobileTab === 'result' ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-grow flex flex-col min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-xl">
                  <button onClick={() => setViewMode('form')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase transition-all ${viewMode === 'form' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>Form</button>
                  <button onClick={() => setViewMode('json')} className={`px-4 py-1.5 text-[9px] font-black rounded-lg uppercase transition-all ${viewMode === 'json' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-sm' : 'text-slate-500'}`}>JSON</button>
                </div>
                <button onClick={handleReset} className="text-[9px] text-slate-400 hover:text-red-500 font-black uppercase tracking-widest">Reset</button>
              </div>
              <div className="flex-grow overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm">
                {viewMode === 'form' ? (
                  <div className="h-full overflow-y-auto p-2 custom-scrollbar"><ResumeForm data={masterResumeObject} onChange={handleFormChange} jobDescription={jobDescription} /></div>
                ) : (
                  <div className="h-full flex flex-col p-4"><EditorSection label="JSON Source" value={masterResumeJson} onChange={setMasterResumeJson} isJson /></div>
                )}
              </div>
            </div>
            <div className="h-[25%] md:h-[30%] min-h-[140px] flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 md:p-4 shadow-sm">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Job Description</label>
              <div className="flex-grow min-h-0"><EditorSection label="" value={jobDescription} onChange={setJobDescription} /></div>
            </div>
          </div>

          {/* Result Side */}
          <div className={`w-full md:w-1/2 flex flex-col space-y-4 md:space-y-6 h-full overflow-hidden print:w-full print:h-auto ${mobileTab === 'input' ? 'hidden md:flex' : 'flex'}`}>
            <div className="flex-grow min-h-0 overflow-hidden print:overflow-visible">
              <LatexPreview latex={result?.latex || ''} isLoading={loading} masterData={masterResumeObject} optimizedData={result?.optimizedData} />
            </div>

            {result && !loading && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-6 shadow-xl space-y-4 flex-shrink-0 no-print animate-in fade-in slide-in-from-bottom-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Technical Heatmap</h3>
                    <div className="flex flex-wrap gap-1">
                      {result.keywordsExtracted.map((kw, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[9px] font-black rounded-md border border-blue-100 dark:border-blue-800/50 uppercase">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex-1 border-t sm:border-t-0 sm:border-l border-slate-100 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-6">
                    <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Optimization Insight</h3>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400 leading-relaxed italic">{result.explanation}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>

        <footer className="hidden sm:flex bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-2 text-[9px] text-slate-400 font-bold uppercase tracking-widest justify-between items-center z-10 no-print">
          <div className="flex items-center gap-4"><span>Engine v2.5</span><span>Recruiter-Logic: Active</span></div>
          <div className="text-green-600 dark:text-green-400 flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            Optimized
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
