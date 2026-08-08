/**
 * Assembles the full knowledge base the "Ask Arya" assistant is grounded in:
 * the site-visible data from `data/mockData.ts` plus the chat-only sections in `./profile`.
 *
 * SERVER ONLY. This module is imported exclusively from `app/api/chat/route.ts`.
 * Do not import it from a client component — it would ship several KB of prompt text
 * to the browser for no reason. (The `server-only` package would enforce this at build
 * time if you ever want to add a dependency for it.)
 */

import {
  personalInfo,
  about,
  skills,
  projects,
  experience,
  education,
  contact,
} from '@/data/mockData';
import { extraSections, type KnowledgeSection } from './profile';

export type { KnowledgeSection };

/**
 * Note: `personalInfo.phone` is deliberately excluded. The assistant hands out whatever
 * it is given, and a phone number harvested from an LLM endpoint is a worse outcome than
 * one sitting in static HTML.
 */
function fromSiteData(): KnowledgeSection[] {
  return [
    {
      id: 'identity',
      title: 'Identity & Contact',
      body: [
        `Name: ${personalInfo.name}`,
        `Roles he presents as: ${personalInfo.role.join(', ')}`,
        `Location: ${personalInfo.location}`,
        `Email: ${personalInfo.email}`,
        `GitHub: ${personalInfo.github}`,
        `LinkedIn: ${personalInfo.linkedin}`,
        `Resume: ${personalInfo.resumeUrl}`,
        `Tagline: ${personalInfo.tagline}`,
      ].join('\n'),
    },
    {
      id: 'about',
      title: 'About',
      body: `${about.description.join('\n\n')}\n\nHighlights:\n${about.highlights
        .map((h) => `- ${h}`)
        .join('\n')}`,
    },
    {
      id: 'skills',
      title: 'Skills (as listed on the site)',
      body: Object.entries(skills)
        .map(([category, items]) => `${category}: ${items.join(', ')}`)
        .join('\n'),
    },
    {
      id: 'experience',
      title: 'Work Experience',
      body: experience
        .map((e) =>
          [
            `${e.title} at ${e.company} — ${e.duration} (${e.type}, ${e.location})`,
            `Product worked on: ${e.project}`,
            e.responsibilities.map((r) => `- ${r}`).join('\n'),
            `Technologies: ${e.technologies.join(', ')}`,
          ].join('\n'),
        )
        .join('\n\n'),
    },
    {
      id: 'projects',
      title: 'Projects',
      body: projects
        .map((p) =>
          [
            p.title,
            p.description,
            `Tech: ${p.tech.join(', ')}`,
            `Impact: ${p.impact.join('; ')}`,
            `GitHub: ${p.github ?? 'not public'}`,
            `Live demo: ${p.live ?? 'none available'}`,
          ].join('\n'),
        )
        .join('\n\n'),
    },
    {
      id: 'education',
      title: 'Education',
      body: education
        .map((e) => {
          const cgpa = 'cgpa' in e && e.cgpa ? `, CGPA ${e.cgpa}` : '';
          const course = e.coursework.length
            ? `\n  Coursework: ${e.coursework.join(', ')}`
            : '';
          return `${e.degree} — ${e.institution} (${e.duration})${cgpa}${course}`;
        })
        .join('\n'),
    },
    {
      id: 'contact-intent',
      title: 'What He Is Looking For',
      body: contact.description,
    },
  ];
}

/** Every section, in prompt order. Site data first, honest self-assessment after. */
export function allSections(): KnowledgeSection[] {
  return [...fromSiteData(), ...extraSections];
}

/** Serialize sections into the markdown block embedded in the system prompt. */
export function renderSections(sections: KnowledgeSection[]): string {
  return sections.map((s) => `## ${s.title}\n${s.body}`).join('\n\n');
}
