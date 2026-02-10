
export interface Experience {
  company: string;
  role: string;
  location: string;
  dateRange: string;
  bullets: string[];
}

export interface Project {
  name: string;
  technologies: string[];
  link?: string;
  bullets: string[];
}

export interface Education {
  institution: string;
  degree: string;
  location: string;
  dateRange: string;
}

export interface Skills {
  languages: string[];
  frameworks: string[];
  tools: string[];
  libraries: string[];
}

export interface MasterResume {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
  };
  education: Education[];
  experience: Experience[];
  projects: Project[];
  skills: Skills;
}

export interface OptimizationResult {
  latex: string;
  keywordsExtracted: string[];
  explanation: string;
}

export type OptimizationStage = 
  | 'idle'
  | 'analyzing'
  | 'selecting'
  | 'refining'
  | 'formatting'
  | 'complete';
