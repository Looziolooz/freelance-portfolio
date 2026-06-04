import { prisma } from "@/lib/prisma";
import type { Lang } from "@/generated/prisma/client";

// Builds the knowledge block injected into an agent's system prompt from the
// published Content model. Mirrors the projection of /api/agent-context: only
// title + description + category — NEVER body — so tier-gated paid article
// bodies are not paraphrased back to anonymous chat users, and the prompt stays
// small. Cached per-language in-process with a short TTL (warm-instance only;
// a shared store would be the multi-instance upgrade).

interface ContextRow {
  title: string;
  description: string;
  category: string;
}

interface CacheEntry {
  block: string;
  builtAt: number;
}

const TTL_MS = 5 * 60 * 1000;
const MAX_CHARS = 8000;
const cache = new Map<Lang, CacheEntry>();

/** Drop the cache (call from content write paths so edits propagate at once). */
export function invalidateAgentContextCache(): void {
  cache.clear();
}

/** Render published Content for `lang` into a bounded markdown context block. */
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

/** Get the (cached) context block for a language. Never throws on empty data. */
export async function buildAgentContext(lang: Lang): Promise<string> {
  const hit = cache.get(lang);
  if (hit && Date.now() - hit.builtAt < TTL_MS) return hit.block;

  const rows = await prisma.content.findMany({
    where: { published: true, lang },
    orderBy: { createdAt: "desc" },
    select: { title: true, description: true, category: true },
  });

  const block = formatContext(rows);
  cache.set(lang, { block, builtAt: Date.now() });
  return block;
}
