import { describe, it, expect, vi, beforeEach } from "vitest";

const { findMany } = vi.hoisted(() => ({ findMany: vi.fn() }));
vi.mock("@/lib/prisma", () => ({ prisma: { content: { findMany } } }));

import {
  buildAgentContext,
  formatContext,
  invalidateAgentContextCache,
} from "@/lib/agent-context";

beforeEach(() => {
  findMany.mockReset();
  invalidateAgentContextCache();
});

describe("formatContext", () => {
  it("returns an empty string when there are no rows", () => {
    expect(formatContext([])).toBe("");
  });

  it("splits projects from articles and never includes body", () => {
    const block = formatContext([
      { title: "Lead Pipeline", description: "n8n to invoice", category: "projects" },
      { title: "n8n Guide", description: "how to", category: "tutorials" },
    ]);
    expect(block).toContain("## Projects");
    expect(block).toContain("- Lead Pipeline: n8n to invoice");
    expect(block).toContain("## Articles & Guides");
    expect(block).toContain("[tutorials] n8n Guide: how to");
  });
});

describe("buildAgentContext", () => {
  it("queries only published rows for the language with a body-free projection", async () => {
    // Articles surface in the live catalog (projects come from the curated KB).
    findMany.mockResolvedValue([
      { title: "P1", description: "d", category: "tutorials" },
    ]);

    const block = await buildAgentContext("EN");

    expect(findMany).toHaveBeenCalledWith({
      where: { published: true, lang: "EN" },
      orderBy: { createdAt: "desc" },
      select: { title: true, description: true, category: true },
    });
    expect(block).toContain("P1");
  });

  it("serves the second call from cache (no re-query within TTL)", async () => {
    findMany.mockResolvedValue([]);
    await buildAgentContext("IT");
    await buildAgentContext("IT");
    expect(findMany).toHaveBeenCalledTimes(1);
  });

  it("re-queries after the cache is invalidated", async () => {
    findMany.mockResolvedValue([]);
    await buildAgentContext("SV");
    invalidateAgentContextCache();
    await buildAgentContext("SV");
    expect(findMany).toHaveBeenCalledTimes(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// The solutions layer. /soluzioni is the site's long-tail traffic surface and
// the one page type that answers "I run X, what would you build me?" — but it
// lives in a static catalogue, not in the Content table, so the assistant could
// not see a single one of its entries. These lock the layer in.
// ─────────────────────────────────────────────────────────────────────────────
describe("solutions catalogue layer", () => {
  it("surfaces matching solutions with their path", async () => {
    findMany.mockResolvedValue([]);
    const block = await buildAgentContext("IT", "ho un ristorante, cosa mi costruisci?");
    expect(block).toContain("## Solutions (catalogue)");
    expect(block).toMatch(/\(\/soluzioni\/[a-z0-9-]+\)/);
  });

  it("stays quiet without a query, so the whole catalogue never floods a prompt", async () => {
    findMany.mockResolvedValue([]);
    const block = await buildAgentContext("IT");
    expect(block).not.toContain("## Solutions (catalogue)");
  });

  it("answers in the visitor's language", async () => {
    findMany.mockResolvedValue([]);
    const sv = await buildAgentContext("SV", "jag driver en restaurang, vad kan du bygga?");
    expect(sv).toContain("## Solutions (catalogue)");
  });

  it("keeps the whole block inside the prompt budget", async () => {
    findMany.mockResolvedValue([]);
    const block = await buildAgentContext("IT", "gestionale prenotazioni ristorante ecommerce sito");
    expect(block.length).toBeLessThanOrEqual(9000 + 20);
  });
});
