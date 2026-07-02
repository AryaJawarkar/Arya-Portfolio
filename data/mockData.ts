// Mock data for Arya Jawarkar's Portfolio

export const personalInfo = {
  name: "Arya Jawarkar",
  role: ['Software Engineer', 'FullStack Developer', 'Problem Solver'],
  tagline: "Software Engineer working across React frontends and Python Flask backends, with MongoDB, MongoDB Compass, and Postman in the development workflow",
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
    "I'm a Software Engineer building complete web products across frontend and backend. Alongside React and TypeScript interfaces, I am now actively working on Python Flask services and MongoDB-backed application flows.",
    "My current development workflow includes MongoDB Compass for database management and Postman for API testing, validation, and iterative backend development.",
    "I focus on shipping clean, reliable applications by connecting polished user interfaces with practical backend architecture, efficient APIs, and maintainable data models."
  ],
  highlights: [
    "Full-stack engineer with strength in modern frontend implementation",
    "Backend learning and delivery focused on Flask APIs and MongoDB integration",
    "Product-minded builder who values usability, structure, and reliability"
  ]
};

export const skills = {
  frontend: ["React.js", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Responsive Design"],
  styling: ["Tailwind CSS", "ShadcnUI", "Material-UI", "UI Development", "Vite", "ESLint", "Prettier"],
  tooling: ["Git", "GitHub", "Figma", "Linux", "Jira", "MongoDB Compass", "Postman"],
  backend: ["Python", "Flask", "REST APIs", "MongoDB", "Axios", "JWT Authentication"],
  fundamentals: ["Data Structures", "Algorithms", "DBMS", "Computer Networks", "Operating Systems"]
};

export const projects = [
  {
    id: 1,
    title: "Floor Vision Pro",
    description: "AI-powered flooring visualizer that lets users preview flooring options in room images through an interactive web interface. Built around a modern frontend workflow with API-driven behavior and scalable product thinking.",
    tech: ["Next.js", "TypeScript", "REST APIs", "ShadcnUI", "AI Integration"],
    impact: ["Improves product visualization before purchase", "Reduces dependence on physical flooring samples", "Creates a faster decision-making experience for users"],
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
      "Develop and maintain scalable application features with a strong focus on React, TypeScript, and clean frontend architecture",
      "Collaborate with product managers and designers to convert Figma wireframes into responsive, production-ready interfaces",
      "Optimize performance by improving render behavior, reducing unnecessary re-renders, and refining overall UI responsiveness",
      "Implement modular product flows and reusable components that support long-term maintainability and faster feature delivery",
      "Expand into backend development with Python Flask to better understand API design, integration workflows, and full-stack delivery",
      "Work with MongoDB for application data handling, using MongoDB Compass for inspection and management during development",
      "Use Postman to test, validate, and debug API endpoints as part of backend and integration work",
      "Contribute to code quality through version control, iterative refactoring, and practical debugging across the stack"
    ],
    technologies: [
      "React.js",
      "TypeScript",
      "Jotai",
      "Next.js",
      "MUI",
      "Python",
      "Flask",
      "MongoDB",
      "MongoDB Compass",
      "Postman",
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
  description: "I'm open to software engineering opportunities, frontend roles, and growing full-stack work involving Python Flask, MongoDB, and API-driven products. Feel free to reach out!",
  cta: "Get In Touch"
};
