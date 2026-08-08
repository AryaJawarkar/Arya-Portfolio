/**
 * Chat-only knowledge about Arya. Never rendered on the page — this exists purely to
 * ground the "Ask Arya" assistant.
 *
 * The point of this file is honesty. The system prompt tells the model not to sugarcoat,
 * but an instruction alone can't stop it inventing polished nonsense — it needs real,
 * specific, unflattering facts to draw on. That's what `weaknesses` is for.
 *
 * Arya: edit these freely. They are prose, not schema.
 */

export type KnowledgeSection = {
  /** Stable id. Becomes the Qdrant point id when retrieval lands in v1. */
  id: string;
  title: string;
  body: string;
};

/**
 * Sentinel for facts Arya hasn't published yet.
 *
 * Deliberately loud rather than an empty string: the system prompt has an explicit rule
 * for this exact token, and an empty value would just get silently glossed over by the
 * model (which then guesses). Replace a line's value with the real answer to fill it in.
 */
export const PLACEHOLDER = '[[NOT_PROVIDED]]';

export const backendStack: KnowledgeSection = {
  id: 'backend-stack',
  title: 'Backend & Cloud — Honest Depth',
  body: `This section describes how deep Arya actually goes on each item, not just that he has touched it.

- Python / Flask: solid working level. Builds and maintains REST endpoints in production at Ignite Solutions — routing, request validation, auth middleware, error handling, and integration with the React frontend.
- PostgreSQL: working level. Writes queries, joins, and schema definitions for application features. Comfortable with day-to-day relational modelling. Has not done heavy query-plan tuning, replication, or large-scale migration work.
- MongoDB: working level. Document modelling, CRUD, aggregation for application flows. Uses MongoDB Compass for inspection.
- REST API design: working level. Designs and consumes endpoints as routine feature work.
- AWS S3: working level. Object upload/download, bucket organisation, and signed access from application code.
- AWS Lambda: working level on event-driven functions. Writes and deploys handlers; has not architected large multi-function serverless systems.
- AWS IAM: functional level. Configures roles and policies for the services he works with. Not a security specialist.
- AWS CloudWatch: functional level. Reads logs and metrics to debug deployed services.
- JWT authentication: implemented in application code.

What he has NOT worked with (do not claim these): Kubernetes, Docker orchestration at scale, Terraform or infrastructure-as-code, CI/CD pipeline authoring from scratch, message queues (Kafka/RabbitMQ/SQS), Redis, GraphQL, microservice architecture at scale, and any cloud provider other than AWS.`,
};

export const workingStyle: KnowledgeSection = {
  id: 'working-style',
  title: 'Soft Skills & Working Style',
  body: `- Works remotely and has done so since January 2025. Comfortable with async communication and self-directed work.
- Collaborates directly with product managers and designers, translating Figma wireframes into production interfaces. Used to working from designs rather than being handed specs.
- Prefers building reusable, modular components over one-off solutions — his stated reason is long-term maintainability and faster follow-up features.
- Iterative by habit: ships, refactors, and debugs across the stack rather than trying to get it perfect first pass.
- Uses Jira for tracking and Git/GitHub for version control as normal practice.
- Deliberately expanded from frontend into backend and cloud rather than staying in his comfort zone. That transition is recent (during 2025) and ongoing.
- Product-minded: pays attention to usability and whether a feature actually helps the user, not only whether it works.`,
};

export const strengths: KnowledgeSection = {
  id: 'strengths',
  title: 'Honest Strengths',
  body: `- Frontend implementation is his strongest area by a clear margin. React, TypeScript, Next.js, and component architecture are where he is most confident and most productive.
- Performance work on the frontend: render behaviour, reducing unnecessary re-renders, UI responsiveness. This is concrete work he does at Ignite Solutions, not a generic claim.
- Turning designs into responsive production interfaces — a well-practised, repeatable skill for him.
- Genuine breadth for his experience level. One year in, he covers frontend, backend, two databases, and four AWS services. That range is unusual this early.
- Strong CS fundamentals: MCA with an 8.3 CGPA, plus a from-scratch file system in C with defragmentation and recovery — real systems-level work, not a tutorial project.
- Self-directed learning. The backend and cloud expansion was something he pushed for.`,
};

export const weaknesses: KnowledgeSection = {
  id: 'weaknesses',
  title: 'Honest Weaknesses & Gaps',
  body: `State these plainly when asked. Do not soften them into strengths.

- Experience level: roughly one year of professional experience (since January 2025). He is early-career. He is not a senior engineer and should not be pitched as one.
- Backend depth lags frontend depth. He ships real Flask APIs, but he has less time behind him on backend than on frontend, and it shows in areas like performance tuning and complex data modelling.
- No large-scale systems experience. He has not worked on high-traffic distributed systems, and has not made architecture decisions at that scale. System design at scale is a gap.
- No DevOps/infrastructure ownership. He uses AWS services from application code; he has not owned infrastructure, IaC, or deployment pipelines.
- Narrow employment history: one company (Ignite Solutions), one main product (Chaturji.ai). He has not yet worked across varied teams, codebases, or engineering cultures.
- Limited public portfolio of shipped side projects — two projects listed, one of which (Floor Vision Pro) has no public link.
- Testing is not represented anywhere in his listed experience or projects. If asked about automated testing, unit/integration test practice, or TDD, say it is not something he has documented, rather than assuming he does it.
- No open-source contributions, publications, certifications, or conference talks are listed.

If asked "why should we not hire him" or "what are the risks", the honest answer is: he is early-career with depth concentrated in frontend, so a role needing an experienced backend or infrastructure owner is not a fit. A role that wants a strong frontend engineer growing into full-stack is.`,
};

export const recruiterFaq: KnowledgeSection = {
  id: 'recruiter-faq',
  title: 'Recruiter FAQ',
  body: [
    'These are logistics questions recruiters ask. Any value below that is exactly the not-provided sentinel is genuinely unknown — say so and point to his email. Never estimate one.',
    '',
    `Notice period: ${PLACEHOLDER}`,
    `Work authorization / visa status: ${PLACEHOLDER}`,
    `Remote / hybrid / onsite preference: ${PLACEHOLDER}`,
    `Earliest availability to start: ${PLACEHOLDER}`,
    `Compensation expectations: ${PLACEHOLDER}`,
    `Willing to relocate: ${PLACEHOLDER}`,
    `Currently actively looking: ${PLACEHOLDER}`,
    '',
    'Known and safe to state: he is based in Pune, Maharashtra, India, and his current role at Ignite Solutions is remote.',
  ].join('\n'),
};

export const extraSections: KnowledgeSection[] = [
  backendStack,
  workingStyle,
  strengths,
  weaknesses,
  recruiterFaq,
];
