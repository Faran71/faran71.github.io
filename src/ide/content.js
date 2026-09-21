/**
 * ============================================================================
 *  EDIT ME — this is the single source of truth for everything on the site.
 * ============================================================================
 *
 *  Every entry in FILES becomes a tab in the editor. The `code` string is the
 *  literal text shown, syntax-highlighted. Change it and the site changes.
 *
 *  Content sourced from Faran's CV. Phone number deliberately omitted from the
 *  public site — add it to CONTACT if you want it shown.
 */

/* ---------------------------------------------------------------------------
 * Contact + identity
 * ------------------------------------------------------------------------ */

export const IDENTITY = {
  name: 'Muhammad Faran Sarwar',
  shortName: 'Faran Sarwar',
  handle: 'faran71',
  role: 'Full Stack Developer',
  location: 'London, United Kingdom',
  email: 'muhammadfaran01.mfs@gmail.com',
  links: [
    { label: 'github', url: 'https://github.com/Faran71' },
    {
      label: 'linkedin',
      url: 'https://www.linkedin.com/in/muhammad-faran-sarwar-3747651b1/',
    },
  ],
};

/* ---------------------------------------------------------------------------
 * The stack — the headline of the site.
 *
 * `icon` keys must exist in SKILL_ICONS (src/ide/skills.js).
 * `level` drives the proficiency bar. Levels follow the CV's own split:
 * "Proficient" sits in the 85–95 band, "Intermediate" in the 55–72 band.
 * ------------------------------------------------------------------------ */

export const STACK = [
  {
    group: 'Languages',
    blurb: 'What I think in',
    items: [
      { name: 'TypeScript', icon: 'typescript', color: '#3178c6', level: 92 },
      { name: 'JavaScript', icon: 'javascript', color: '#f7df1e', level: 92 },
      { name: 'Python', icon: 'python', color: '#ffd845', level: 70 },
      { name: 'Java', icon: 'java', color: '#e76f00', level: 62 },
      { name: 'C++', icon: 'cpp', color: '#00599c', level: 60 },
      { name: 'MATLAB', icon: 'matlab', color: '#e16737', level: 55 },
    ],
  },
  {
    group: 'Frontend',
    blurb: 'What I build interfaces with',
    items: [
      { name: 'React', icon: 'react', color: '#61dafb', level: 92 },
      { name: 'Angular', icon: 'angular', color: '#dd0031', level: 88 },
      { name: 'Svelte', icon: 'svelte', color: '#ff3e00', level: 82 },
      { name: 'HTML5', icon: 'html', color: '#e34f26', level: 90 },
      { name: 'CSS3', icon: 'css', color: '#2965f1', level: 88 },
    ],
  },
  {
    group: 'Backend',
    blurb: 'What I serve APIs with',
    items: [
      { name: 'NestJS', icon: 'nestjs', color: '#e0234e', level: 90 },
      { name: 'FastAPI', icon: 'fastapi', color: '#05998b', level: 90 },
      { name: 'Express.js', icon: 'express', color: '#ffffff', level: 88 },
      { name: 'Ruby on Rails', icon: 'rails', color: '#cc0000', level: 82 },
    ],
  },
  {
    group: 'Data & Cloud',
    blurb: 'What I store and ship it on',
    items: [
      { name: 'PostgreSQL', icon: 'postgres', color: '#4169e1', level: 88 },
      { name: 'MongoDB', icon: 'mongodb', color: '#47a248', level: 85 },
      { name: 'AWS', icon: 'aws', color: '#ff9900', level: 80 },
      { name: 'Twilio', icon: 'twilio', color: '#f22f46', level: 78 },
      { name: 'Deepgram', icon: 'deepgram', color: '#13ef93', level: 75 },
    ],
  },
];

/* ---------------------------------------------------------------------------
 * Editor tabs
 * ------------------------------------------------------------------------ */

const PROFILE = `// profile.ts — the short version of me
import type { Engineer } from './types';

export const me: Engineer = {
  name: 'Muhammad Faran Sarwar',
  handle: 'faran71',
  role: 'Full Stack Developer',
  location: 'London, United Kingdom',

  // I came to software from astrophysics, which is where I learned
  // to model messy systems and to trust the numbers over the intuition.
  origin: 'MSci Astrophysics, University of Cambridge',

  // End to end: schema, API, interface, deploy.
  scope: ['frontend', 'backend', 'databases', 'deployment'],

  focus: [
    'Scalable API design',
    'Enterprise-grade applications',
    'AI-integrated products',
    'Performance and reliability',
  ],

  proficient: [
    'TypeScript', 'JavaScript', 'React', 'Angular', 'Svelte',
    'NestJS', 'FastAPI', 'Express.js', 'Ruby on Rails',
    'PostgreSQL', 'MongoDB', 'AWS',
  ],

  intermediate: ['Python', 'Java', 'HTML', 'CSS', 'MATLAB'],

  currently: 'Full Stack Developer at Jaid, London',
  openTo: 'Full stack and backend engineering roles',
};
`;

const SKILLS = `/**
 * skills.ts
 * ------------------------------------------------------------------
 * Levels mirror the CV. "Proficient" is what I ship production work
 * in; "Intermediate" is what I reach for confidently but would not
 * call myself an expert in.
 */
import type { Skill } from './types';

export const skills: Skill[] = [
  // ── Languages ────────────────────────────────────────────────────
  { name: 'TypeScript',  category: 'language', level: 92, band: 'proficient' },
  { name: 'JavaScript',  category: 'language', level: 92, band: 'proficient' },
  { name: 'Python',      category: 'language', level: 70, band: 'intermediate' },
  { name: 'Java',        category: 'language', level: 62, band: 'intermediate' },
  { name: 'C++',         category: 'language', level: 60, band: 'intermediate',
    note: 'used for computational astrophysics simulation' },
  { name: 'MATLAB',      category: 'language', level: 55, band: 'intermediate' },

  // ── Frontend ─────────────────────────────────────────────────────
  { name: 'React',       category: 'frontend', level: 92, band: 'proficient' },
  { name: 'Angular',     category: 'frontend', level: 88, band: 'proficient' },
  { name: 'Svelte',      category: 'frontend', level: 82, band: 'proficient' },
  { name: 'HTML',        category: 'frontend', level: 90, band: 'proficient' },
  { name: 'CSS',         category: 'frontend', level: 88, band: 'proficient' },

  // ── Backend ──────────────────────────────────────────────────────
  { name: 'NestJS',      category: 'backend',  level: 90, band: 'proficient',
    note: 'current production stack at Jaid' },
  { name: 'FastAPI',     category: 'backend',  level: 90, band: 'proficient' },
  { name: 'Express.js',  category: 'backend',  level: 88, band: 'proficient' },
  { name: 'Ruby on Rails', category: 'backend', level: 82, band: 'proficient' },
  { name: 'Node.js',     category: 'backend',  level: 90, band: 'proficient' },

  // ── Data & Cloud ─────────────────────────────────────────────────
  { name: 'PostgreSQL',  category: 'data',     level: 88, band: 'proficient' },
  { name: 'MongoDB',     category: 'data',     level: 85, band: 'proficient' },
  { name: 'AWS',         category: 'cloud',    level: 80, band: 'proficient',
    note: 'AWS Certified Cloud Practitioner' },
  { name: 'Twilio',      category: 'data',     level: 78, band: 'proficient' },
  { name: 'Deepgram',    category: 'data',     level: 75, band: 'proficient' },
];
`;

const PROJECTS = `/**
 * projects.ts
 * ------------------------------------------------------------------
 * Production work, from the CV. Everything here shipped.
 */
export const projects: Project[] = [
  {
    name: 'Resonate',
    company: 'Firewood',
    summary:
      'An AI-driven, voice-driven reporting application built from scratch: ' +
      'users speak, the transcript becomes structured reports.',
    stack: ['FastAPI', 'React', 'PostgreSQL', 'Twilio', 'Deepgram', 'AWS Bedrock'],
    role: 'Designed and built end to end',
    status: 'shipped',
  },
  {
    name: 'Lumina',
    company: 'Firewood',
    summary:
      'A data analytics platform for capability assessments — turns raw survey ' +
      'data into interactive graphs that non-technical users can explore.',
    stack: ['TypeScript', 'Express.js', 'React', 'PostgreSQL'],
    role: 'Built the analytics pipeline and the interface',
    status: 'shipped',
  },
  {
    name: 'FAST',
    company: 'Firewood',
    summary:
      'An enterprise-grade project assurance platform, deployed securely on AWS.',
    stack: ['Ruby on Rails', 'HTML', 'CSS', 'JavaScript', 'AWS'],
    role: 'Full stack feature work',
    status: 'shipped',
  },
  {
    name: 'Jaid Platform',
    company: 'Jaid',
    summary:
      'A production application plus several interconnected services — ' +
      'ongoing bug resolution, incremental features, and cross-service stability.',
    stack: ['NestJS', 'Node.js', 'MongoDB', 'Angular', 'Svelte'],
    role: 'Full stack developer',
    status: 'in progress',
  },
];
`;

const EXPERIENCE = `// experience.ts
export const timeline: Role[] = [
  {
    title: 'Full Stack Developer',
    company: 'Jaid',
    location: 'London / Hybrid',
    period: 'Dec 2025 — Present',
    stack: ['NestJS', 'Node.js', 'MongoDB', 'Angular', 'Svelte'],
    highlights: [
      'Maintain and extend a production application built with NestJS, Node.js, MongoDB, Angular and Svelte.',
      'Work across several smaller interconnected applications in the wider system — resolving bugs, shipping incremental features, keeping services stable.',
      'Collaborate closely with the team to prioritise and deliver maintenance work without disrupting end users.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Firewood',
    location: 'London / Hybrid',
    period: 'Jun 2024 — Nov 2025',
    stack: ['FastAPI', 'React', 'Rails', 'PostgreSQL', 'AWS'],
    highlights: [
      'Contributed to FAST, an enterprise-grade project assurance platform with a Ruby on Rails backend, deployed securely on AWS.',
      'Designed and developed Resonate from scratch — an AI-driven voice reporting app using FastAPI, React and PostgreSQL, with Twilio for voice automation and Deepgram for transcription.',
      'Built Lumina, a capability-assessment analytics platform turning survey data into interactive graphs, on an Express.js / React / PostgreSQL stack.',
      'Managed end-to-end deployment pipelines and integrated AWS Bedrock for AI-driven functionality.',
    ],
  },
];

export const education: Education[] = [
  {
    school: 'University of Cambridge',
    qualification: 'MSci / BA Astrophysics',
    period: 'Sep 2019 — Jun 2023',
    grade: 'Upper Second-Class',
    detail:
      'Computational astrophysics research in Python and C++ — simulating ' +
      'particle dynamics and collision behaviour in systems such as the ' +
      'Beta Pictoris debris disk.',
  },
  {
    school: 'Newham Collegiate Sixth Form Centre',
    qualification: 'A Levels',
    period: 'Sep 2017 — Jul 2019',
    grade: 'Mathematics (A*), Further Mathematics (A*), Physics (A*), Chemistry (A*)',
    detail: 'AEA Mathematics: Distinction',
  },
];
`;

const ABOUT = `// about.ts
// Beyond the stack.

export const about = {
  // An astrophysicist who writes production software. That is not a
  // common path, and it shapes how I work.
  story: \`I trained as an astrophysicist at Cambridge, modelling particle
dynamics and collision behaviour in systems like the Beta Pictoris debris
disk. That work was computational: Python and C++, messy data, and results
you cannot eyeball — you have to build the model, run it, and trust the
numbers.

I moved into software engineering and brought that with me. I care about
systems that hold up under real data, and I like owning a problem end to
end: schema, API, interface, deployment. Since then I have built
enterprise-grade platforms, an AI voice-reporting application from
scratch, and a data analytics product — mostly in TypeScript, Python and
Ruby, across React, Angular, Svelte, NestJS, FastAPI, Express and Rails.\`,

  values: [
    'Correctness before cleverness',
    'Own the problem end to end',
    'Scalability is a design decision, not a later fix',
    'User-centric means the interface explains itself',
  ],

  certifications: [
    {
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: 'Feb 2024',
      detail: 'Core AWS services, cloud architecture principles, cost optimisation.',
    },
    {
      name: 'TOGAF Enterprise Architecture Foundation & Practitioner',
      issuer: 'The Open Group',
      date: 'Jan 2025',
      detail: 'Open Group Architecture Framework, foundation and advanced levels.',
    },
  ],
};
`;

const CONTACT = `# contact.md

- **Email**    →  muhammadfaran01.mfs@gmail.com
- **GitHub**   →  https://github.com/Faran71
- **LinkedIn** →  linkedin.com/in/muhammad-faran-sarwar-3747651b1

## Currently

- **Role**      Full Stack Developer at Jaid
- **Based in**  London, United Kingdom
- **Open to**   full stack and backend engineering roles

## What I work in

TypeScript, JavaScript, Python, Java, C++, MATLAB.
React, Angular, Svelte, NestJS, FastAPI, Express.js, Ruby on Rails.
PostgreSQL, MongoDB, AWS, Twilio, Deepgram.

## Replies

I answer everything. If you are hiring, tell me what the problem is and
I will tell you honestly whether I am the right person for it.
`;

/* ---------------------------------------------------------------------------
 * Tab registry — add/remove/reorder freely.
 * ------------------------------------------------------------------------ */

export const FILES = [
  { id: 'profile', name: 'profile.ts', ext: 'ts', icon: 'typescript', code: PROFILE },
  { id: 'skills', name: 'skills.ts', ext: 'ts', icon: 'typescript', code: SKILLS },
  { id: 'projects', name: 'projects.ts', ext: 'ts', icon: 'typescript', code: PROJECTS },
  { id: 'experience', name: 'experience.ts', ext: 'ts', icon: 'typescript', code: EXPERIENCE },
  { id: 'about', name: 'about.ts', ext: 'ts', icon: 'typescript', code: ABOUT },
  { id: 'contact', name: 'contact.md', ext: 'md', icon: 'markdown', code: CONTACT },
];

/* ---------------------------------------------------------------------------
 * Hero metrics
 * ------------------------------------------------------------------------ */

export const STATS = [
  { value: '2+', label: 'years shipping' },
  { value: '20', label: 'technologies' },
  { value: '4', label: 'production platforms' },
  { value: '2', label: 'cloud certifications' },
];
