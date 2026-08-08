import { allSections, type KnowledgeSection } from '@/lib/knowledge';

/**
 * The seam where retrieval will live.
 *
 * v0.2 returns the entire knowledge base and ignores the query. That is the right call
 * at this corpus size (~3k tokens): the model sees every fact, so it cannot miss one,
 * and there's no embedding round-trip in the critical path. Groq has no embeddings
 * endpoint either, so RAG here would mean a second provider for no accuracy gain.
 *
 * v1: replace the body with a Qdrant top-k search over `KnowledgeSection.id`.
 * Nothing else in the codebase needs to change — the route handler already awaits this.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- the query becomes meaningful at v1
export async function retrieveContext(_query: string): Promise<KnowledgeSection[]> {
  return allSections();
}
