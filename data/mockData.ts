// Mock data for Arya Jawarkar's Portfolio

export const personalInfo = {
  name: "Arya Jawarkar",
  role: ['Software Engineer', 'Frontend Developer', 'Problem Solver'],
  tagline: "Frontend Engineer specializing in React, TypeScript, and building polished, performant user experiences",
  location: "Pune, Maharashtra",
  email: "aryajawarkar7@gmail.com",
  phone: "8788652743",
  linkedin: "linkedin.com/in/aryajawarkar",
  github: "github.com/AryaJawarkar",
  resumeUrl: "https://aryajawarkar.github.io/Arya-Resume/Arya-Resume-1.pdf"
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
  frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Web Performance Optimization"],
  styling: ["Tailwind CSS", "ShadcnUI", "Material-UI", "Responsive Design", "Vite", "ESLint", "Prettier"],
  tooling: ["Git", "GitHub", "Figma", "Linux", "Jira", "Zoho", "Cursor"],
  apis: ["REST APIs", "GeminiAPI", "Open Router", "Axios", "JWT Authentication"],
  fundamentals: ["Data Structures", "Algorithms", "DBMS", "Computer Networks", "Operating Systems"]
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
];

export const experience = [
  {
    id: 1,
    title: "Software Engineer",
    company: "Ignite Solutions",
    project: "Chaturji.ai",
    location: "Pune, Maharashtra",
    duration: "January 2025 - Present",
    type: "Remote",
    responsibilities: [
      "Working on the Chaturji.ai platform to develop and maintain scalable, modular frontend applications using React (TypeScript) and Jotai for state management",
      "Collaborated closely with product managers and designers to convert Figma wireframes into high-performance, production-ready interfaces for Chaturji.ai",
      "Optimized application performance by improving React render cycles, implementing lazy loading, and reducing unnecessary re-renders",
      "Designed and implemented a Room Templates feature in Chaturji.ai that allows users to create rooms from predefined templates while preserving existing room information",
      "Enhanced the Room Templates workflow by enabling users to enrich rooms with additional context from attached files without overwriting existing content",
      "Refactored frontend components to improve type safety, reduce runtime bugs, and ensure long-term maintainability",
      "Single-handedly implemented key product flows including user onboarding, login UI, and the core home chat screen interface",
      "Improved overall user experience by enhancing load times and responsiveness across multiple devices",
      "Used GitHub for version control, participated in code reviews, and maintained high code quality standards"
    ],
    technologies: [
      "React.js",
      "TypeScript",
      "Jotai",
      "Next.js",
      "MUI",
      "Git",
      "GitHub"
    ]
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
