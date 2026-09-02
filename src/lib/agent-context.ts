import { prisma } from "@/lib/prisma";
import type { Lang } from "@/generated/prisma/client";
import {
  coreKnowledge,
  rankByQuery,
  renderKnowledge,
  retrieveKnowledge,
} from "@/lib/agent-knowledge";
import { SOLUTIONS } from "@/lib/solutions";
import { dict } from "@/i18n";

// Builds the knowledge block injected into an agent's system prompt. Two layers:
//   1. A curated, multilingual knowledge base (src/lib/agent-knowledge) about
//      Lorenzo's projects, services, engagements, tools, pricing, bio and FAQ —
//      retrieved per user message (always-on core facts + query-relevant entries),
//      so the prompt stays small and on-topic ("RAG memory", no embeddings).
//   2. The published solutions catalogue (src/lib/solutions) projected to
//      title + lede, ranked against the message. This is the surface built to
//      answer the highest-intent question a visitor asks ("I run a driving
//      school, what exactly would you build me?"), and it was previously
//      invisible to the assistant even though llms.txt and agents.md list it.
//      Sourced from the catalogue itself, so publishing a solution reaches the
//      assistant without a second edit here.
//   3. The live published Content catalog (articles & guides) from the DB,
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
const MAX_SOLUTIONS = 6; // catalogue entries to surface per message
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

/**
 * Top solutions for the message, as a bounded markdown list with their paths so
 * the assistant can send the visitor to the actual page. Uses the same lexical
 * ranker as the rest of the retrieval, on title + lede only.
 */
function solutionsBlock(lang: Lang, query?: string): string {
  const t = dict[lang.toLowerCase() as keyof typeof dict];
  if (!t) return "";

  const rows = SOLUTIONS.map((sol) => ({
    slug: sol.slug,
    title: t[`sol.${sol.key}.title`] ?? "",
    lede: t[`sol.${sol.key}.lede`] ?? "",
  })).filter((r) => r.title);

  if (rows.length === 0) return "";

  // Without a query this would dump the whole catalogue into every prompt, so
  // the unfocused case stays quiet and lets the KB carry the answer.
  if (!query) return "";

  const picked = rankByQuery(query, rows, (r) => `${r.title} ${r.lede}`, MAX_SOLUTIONS);
  if (picked.length === 0) return "";

  return (
    "## Solutions (catalogue)\n" +
    picked.map((r) => `- ${r.title} (/soluzioni/${r.slug}): ${r.lede}`).join("\n")
  );
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

  let block = [kbBlock, solutionsBlock(lang, query), catalogBlock]
    .filter(Boolean)
    .join("\n\n");
  if (block.length > MAX_CHARS) block = block.slice(0, MAX_CHARS) + "\n…[truncated]";
  return block;
}
