/**
 * Structured profile data.
 *
 * This is the data the CV / recruiter view renders. The IDE view renders the
 * `code` strings in content.js instead - those are hand-written to look like
 * real source, so the two represent the same facts in different forms.
 *
 * Keep them in step when you change something.
 */

export const EXPERIENCE = [
  {
    title: 'Full Stack Developer',
    company: 'Jaid',
    location: 'London / Hybrid',
    period: 'Dec 2025 - Present',
    stack: ['NestJS', 'Node.js', 'MongoDB', 'Angular', 'Svelte'],
    highlights: [
      'Maintain and extend a production application built with NestJS, Node.js, MongoDB, Angular and Svelte.',
      'Work across several smaller interconnected applications in the wider system - resolving bugs, shipping incremental features, and ensuring stability across services.',
      'Collaborate closely with the team to prioritise and deliver maintenance work while keeping the platform reliable for end users.',
    ],
  },
  {
    title: 'Full Stack Developer',
    company: 'Firewood',
    location: 'London / Hybrid',
    period: 'Jun 2024 - Nov 2025',
    stack: ['FastAPI', 'React', 'Ruby on Rails', 'PostgreSQL', 'AWS'],
    highlights: [
      'Contributed to FAST, an enterprise-grade project assurance platform with a Ruby on Rails backend and a frontend built with HTML, CSS and JavaScript, deployed securely on AWS.',
      'Designed and developed Resonate from scratch - an AI-driven voice reporting application built with FastAPI, React and PostgreSQL, integrating Twilio for voice automation and Deepgram for transcription.',
      'Built Lumina, a data analytics platform for capability assessments that processed survey data into interactive graphs, using a TypeScript-based Express.js backend, a React frontend and a PostgreSQL database.',
      'Managed end-to-end deployment pipelines, integrated AWS Bedrock for AI-driven functionality, and collaborated with cross-functional teams to enhance usability, performance and scalability.',
    ],
  },
];

export const PROJECTS = [
  {
    name: 'Jaid Platform',
    company: 'Jaid',
    summary:
      'A production application plus several interconnected services - ongoing bug resolution, incremental features and cross-service stability.',
    stack: ['NestJS', 'Node.js', 'MongoDB', 'Angular', 'Svelte'],
    role: 'Full stack developer',
    status: 'Ongoing',
  },
  {
    name: 'FAST',
    company: 'Firewood',
    summary:
      'An enterprise-grade project assurance platform, deployed securely on AWS.',
    stack: ['Ruby on Rails', 'HTML', 'CSS', 'JavaScript', 'AWS'],
    role: 'Full stack feature work',
    status: 'Shipped',
  },
  {
    name: 'Resonate',
    company: 'Firewood',
    summary:
      'An AI-driven, voice-driven reporting application built from scratch: users speak, and the transcript becomes structured reports.',
    stack: ['FastAPI', 'React', 'PostgreSQL', 'Twilio', 'Deepgram', 'AWS Bedrock'],
    role: 'Designed and built end to end',
    status: 'MVP',
  },
  {
    name: 'Lumina',
    company: 'Firewood',
    summary:
      'A data analytics platform for capability assessments - turns raw survey data into interactive graphs that non-technical users can explore.',
    stack: ['TypeScript', 'Express.js', 'React', 'PostgreSQL'],
    role: 'Built the analytics pipeline and the interface',
    status: 'MVP',
  },
];

export const EDUCATION = [
  {
    school: 'University of Cambridge',
    qualification: 'MSci / BA Astrophysics',
    period: 'Sep 2019 - Jun 2023',
    grade: 'Upper Second-Class',
    detail:
      'Computational astrophysics research in Python and C++ - simulating particle dynamics and collision behaviour in astrophysical systems such as the Beta Pictoris debris disk.',
  },
  {
    school: 'Newham Collegiate Sixth Form Centre',
    qualification: 'A Levels',
    period: 'Sep 2017 - Jul 2019',
    grade: 'Mathematics (A*), Further Mathematics (A*), Physics (A*), Chemistry (A*)',
    detail: 'AEA Mathematics: Distinction',
  },
];
