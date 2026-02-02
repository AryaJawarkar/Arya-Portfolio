// Mock data for Arya Jawarkar's Portfolio

export const personalInfo = {
  name: "Arya Jawarkar",
  role: ['Software Engineer', 'Full Stack Developer', 'Problem Solver'],
  tagline: "Frontend Engineer specializing in React, TypeScript, and building polished, performant user experiences",
  location: "Pune, Maharashtra",
  email: "aryajawarkar7@gmail.com",
  phone: "8788652743",
  linkedin: "linkedin.com/in/aryajawarkar",
  github: "github.com/AryaJawarkar",
  resumeUrl: "https://customer-assets.emergentagent.com/job_829eb5de-0d2a-477e-87d3-708d83348829/artifacts/qmu9b9t8_Arya-Jawarkar-resume.pdf"
};

export const about = {
  title: "About Me",
  description: [
    "I'm a Software Engineer with a passion for crafting elegant, high-performance frontend applications. Currently at Ignite Solutions, I specialize in React, TypeScript, and modern web technologies.",
    "My approach combines technical excellence with a keen eye for design. I believe great software isn't just functional—it's intuitive, accessible, and delightful to use.",
    "I thrive on solving complex problems, optimizing performance, and translating ambitious designs into production-ready code that users love."
  ],
  highlights: [
    "Frontend-focused engineer with strong UI/UX sensibility",
    "Builder mindset: clean architecture meets real-world usability",
    "Performance-obsessed: every millisecond matters"
  ]
};

export const skills = {
  frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3"],
  stateManagement: ["Jotai", "Context API", "React Query"],
  styling: ["Tailwind CSS", "ShadcnUI", "Material-UI", "Responsive Design"],
  tooling: ["Git", "GitHub", "Figma", "Linux", "Webpack"],
  apis: ["REST APIs", "GeminiAPI", "Open Router"],
  fundamentals: ["Data Structures", "Algorithms", "DBMS", "Computer Networks"]
};

export const projects = [
  {
    id: 1,
    title: "Floor Vision Pro",
    description: "AI-powered flooring visualizer enabling users to preview different flooring options in their rooms through photo uploads. Helps homeowners and designers make confident aesthetic decisions without physical installation.",
    tech: ["Next.js", "TypeScript", "GeminiAPI", "Open Router", "ShadcnUI"],
    impact: ["Eliminates guesswork in flooring decisions", "Saves time and money on physical samples", "Enables side-by-side material comparisons"],
    github: null,
    live: null,
    type: "real"
  },
  {
    id: 2,
    title: "Custom File System",
    description: "Built from scratch file system supporting core operations: add, retrieve, delete, and list files. Features include recovery mechanism for deleted files, metadata encoding, and an intelligent defragmentation process for optimized storage management.",
    tech: ["C", "Data Structures", "System Design", "Storage Optimization"],
    impact: ["Efficient space utilization through defragmentation", "Data recovery capabilities", "Optimized file access patterns"],
    github: "https://github.com/AryaJawarkar/File-System/tree/master/file-system",
    live: null,
    type: "real"
  },
//   {
//     id: 3,
//     title: "Component Forge",
//     description: "Design system builder for rapidly prototyping and documenting React component libraries. Features live preview, code generation, and accessibility testing built-in.",
//     tech: ["React", "TypeScript", "Storybook", "Tailwind CSS", "Framer Motion"],
//     impact: ["Accelerates component development by 40%", "Ensures design consistency", "Built-in accessibility auditing"],
//     github: null,
//     live: null,
//     type: "conceptual"
//   },
//   {
//     id: 4,
//     title: "DevMetrics Dashboard",
//     description: "Analytics platform for developers tracking code quality metrics, performance benchmarks, and project health indicators. Real-time insights into build times, bundle sizes, and code coverage.",
//     tech: ["React", "TypeScript", "D3.js", "Node.js", "MongoDB"],
//     impact: ["Identifies performance bottlenecks", "Tracks code quality trends", "Improves team productivity"],
//     github: null,
//     live: null,
//     type: "conceptual"
//   }
];

export const experience = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Ignite Solutions",
    location: "Pune, Maharashtra",
    duration: "January 2025 - Present",
    type: "Remote",
    responsibilities: [
      "Architected and maintained scalable, modular frontend applications using React (TypeScript) and Jotai for state management",
      "Built responsive and accessible UI components following modern design systems and best practices",
      "Collaborated cross-functionally with product and design teams to translate Figma wireframes into production-ready interfaces",
      "Improved application performance through React render optimization, code splitting, and lazy loading strategies",
      "Maintained high code quality through rigorous code reviews, testing, and version control with GitHub"
    ],
    technologies: ["React.js", "TypeScript", "Jotai", "MUI", "Next.js", "GitHub"]
  }
];

export const education = [
  {
    id: 1,
    degree: "Master of Computer Applications (MCA)",
    institution: "Savitribai Phule Pune University (PUCSD)",
    duration: "August 2023 - August 2025",
    cgpa: "8.3",
    coursework: ["Data Structures and Algorithms", "Operating Systems", "Computer Networks"]
  },
  {
    id: 2,
    degree: "Bachelor's Degree in Computer Science",
    institution: "Rashtrasant Tukadoji Maharaj Nagpur University",
    duration: "2019 - 2022",
    coursework: []
  }
];

export const contact = {
  title: "Let's Build Something Great",
  description: "I'm always interested in hearing about new opportunities, challenging projects, or just connecting with fellow developers. Feel free to reach out!",
  cta: "Get In Touch"
};
