import { prisma } from "@/lib/prisma";
import type { Lang } from "@/generated/prisma/client";
import {
  coreKnowledge,
  rankByQuery,
  renderKnowledge,
  retrieveKnowledge,
} from "@/lib/agent-knowledge";

// Builds the knowledge block injected into an agent's system prompt. Two layers:
//   1. A curated, multilingual knowledge base (src/lib/agent-knowledge) about
//      Lorenzo's projects, services, engagements, tools, pricing, bio and FAQ —
//      retrieved per user message (always-on core facts + query-relevant entries),
//      so the prompt stays small and on-topic ("RAG memory", no embeddings).
//   2. The live published Content catalog (articles & guides) from the DB,
//      projected to title + description only — NEVER body — so tier-gated paid
//      bodies are not paraphrased back to anonymous chat users. Rows are cached
//      per-language with a short TTL; retrieval/rendering happens per request.
// Projects are served from the curated KB (richer: stack, live demo, outcome),
// so DB rows with category "projects" are not duplicated into the catalog.

interface ContextRow {
  title: string;
  description: string;
  category: string;
}

interface CacheEntry {
  rows: ContextRow[];
  builtAt: number;
}

const TTL_MS = 5 * 60 * 1000;
const MAX_CHARS = 9000;
const MAX_KB = 8; // query-relevant KB entries to pull in
const MAX_CATALOG = 10; // live article/guide rows to list
const cache = new Map<Lang, CacheEntry>();

/** Drop the cache (call from content write paths so edits propagate at once). */
export function invalidateAgentContextCache(): void {
  cache.clear();
}

/** Render Content rows into a bounded markdown block (kept for the catalog layer). */
export function formatContext(rows: ContextRow[]): string {
  if (rows.length === 0) return "";
  const projects = rows.filter((r) => r.category === "projects");
  const articles = rows.filter((r) => r.category !== "projects");

  const sections: string[] = [];
  if (projects.length) {
    sections.push(
      "## Projects\n" + projects.map((p) => `- ${p.title}: ${p.description}`).join("\n"),
    );
  }
  if (articles.length) {
    sections.push(
      "## Articles & Guides\n" +
        articles.map((a) => `- [${a.category}] ${a.title}: ${a.description}`).join("\n"),
    );
  }

  let block = sections.join("\n\n");
  if (block.length > MAX_CHARS) block = block.slice(0, MAX_CHARS) + "\n…[truncated]";
  return block;
}

/** Fetch (and cache) the published, body-free Content rows for a language. */
async function getRows(lang: Lang): Promise<ContextRow[]> {
  const hit = cache.get(lang);
  if (hit && Date.now() - hit.builtAt < TTL_MS) return hit.rows;

  const rows = await prisma.content.findMany({
    where: { published: true, lang },
    orderBy: { createdAt: "desc" },
    select: { title: true, description: true, category: true },
  });
  cache.set(lang, { rows, builtAt: Date.now() });
  return rows;
}

/**
 * Build the context block for a language, optionally focused on the visitor's
 * latest message: always-on core facts + KB entries relevant to the query + a
 * (query-filtered) catalog of live articles & guides. Never throws on empty data.
 */
export async function buildAgentContext(lang: Lang, query?: string): Promise<string> {
  // Curated knowledge — core facts always, plus what's relevant to the message.
  const core = coreKnowledge();
  const retrieved = query ? retrieveKnowledge(query, lang, MAX_KB) : [];
  const seen = new Set(core.map((e) => e.id));
  const kbBlock = renderKnowledge([...core, ...retrieved.filter((e) => !seen.has(e.id))], lang);

  // Live article/guide catalog (projects come from the KB), query-filtered.
  const rows = await getRows(lang);
  const articles = rows.filter((r) => r.category !== "projects");
  const picked = query
    ? rankByQuery(query, articles, (r) => `${r.title} ${r.description}`, MAX_CATALOG)
    : articles.slice(0, MAX_CATALOG);
  const catalogBlock = formatContext(picked);

  let block = [kbBlock, catalogBlock].filter(Boolean).join("\n\n");
  if (block.length > MAX_CHARS) block = block.slice(0, MAX_CHARS) + "\n…[truncated]";
  return block;
}
