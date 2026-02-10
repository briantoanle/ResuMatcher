
import { MasterResume } from './types';

export const INITIAL_MASTER_RESUME: MasterResume = {
  personalInfo: {
    fullName: "Jake R. Resume",
    email: "jake@example.com",
    phone: "123-456-7890",
    linkedin: "linkedin.com/in/jake",
    github: "github.com/jake"
  },
  education: [
    {
      institution: "Southwestern University",
      degree: "Bachelor of Science in Computer Science",
      location: "Georgetown, TX",
      dateRange: "Aug. 2018 -- May 2021"
    }
  ],
  experience: [
    {
      company: "Undergraduate Research Assistant",
      role: "Texas A&M University",
      location: "College Station, TX",
      dateRange: "June 2020 -- Present",
      bullets: [
        "Developed a REST API using FastAPI and PostgreSQL to store data from 100+ sensors",
        "Implemented a dashboard using React and D3.js to visualize real-time sensor data",
        "Optimized database queries resulting in a 40% reduction in API response time",
        "Wrote 20+ unit and integration tests using Pytest for backend logic"
      ]
    },
    {
      company: "Software Engineer Intern",
      role: "Tech Solutions Inc.",
      location: "Austin, TX",
      dateRange: "May 2019 -- Aug. 2019",
      bullets: [
        "Migrated a legacy PHP application to a modern React and Node.js stack",
        "Assisted in the development of a microservices architecture using Docker and Kubernetes",
        "Collaborated with UI/UX designers to implement responsive web designs"
      ]
    }
  ],
  projects: [
    {
      name: "Git-Notes",
      technologies: ["React", "Node.js", "MongoDB"],
      link: "gitnotes.com",
      bullets: [
        "Built a full-stack note-taking application with version control features",
        "Implemented user authentication using JWT and bcrypt for secure login",
        "Integrated AWS S3 for cloud storage of user-uploaded files"
      ]
    },
    {
      name: "Portfolio Website",
      technologies: ["Next.js", "Tailwind CSS"],
      bullets: [
        "Designed and developed a personal portfolio to showcase projects and skills",
        "Achieved 100/100 Lighthouse performance score through image optimization"
      ]
    }
  ],
  skills: {
    languages: ["Python", "JavaScript", "TypeScript", "SQL", "Java"],
    frameworks: ["React", "Node.js", "FastAPI", "Next.js", "Express"],
    tools: ["Git", "Docker", "AWS", "Google Cloud", "PostgreSQL"],
    libraries: ["D3.js", "Redux", "Tailwind CSS", "Jest"]
  }
};

export const INITIAL_JD = `We are looking for a Full-Stack Engineer with 2+ years of experience. 
Key requirements include:
- Proficiency in React and Node.js.
- Strong knowledge of PostgreSQL and database optimization.
- Experience with cloud platforms (AWS or GCP).
- Familiarity with CI/CD pipelines and Docker.
- Excellent problem-solving skills and ability to work in a collaborative environment.`;
