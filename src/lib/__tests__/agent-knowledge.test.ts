import { describe, it, expect } from "vitest";
import {
  KNOWLEDGE,
  CORE_CATEGORIES,
  coreKnowledge,
  retrieveKnowledge,
  rankByQuery,
  renderKnowledge,
} from "@/lib/agent-knowledge";

describe("knowledge base shape", () => {
  it("has entries, all trilingual and non-empty", () => {
    expect(KNOWLEDGE.length).toBeGreaterThan(40);
    for (const e of KNOWLEDGE) {
      expect(e.id).toBeTruthy();
      expect(e.keywords.length).toBeGreaterThan(0);
      expect(e.text.IT.trim()).not.toBe("");
      expect(e.text.EN.trim()).not.toBe("");
      expect(e.text.SV.trim()).not.toBe("");
    }
  });

  it("has unique ids", () => {
    const ids = KNOWLEDGE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("kept Italian/Swedish diacritics (no ASCII-folding)", () => {
    const it = KNOWLEDGE.map((e) => e.text.IT).join(" ");
    const sv = KNOWLEDGE.map((e) => e.text.SV).join(" ");
    expect(it).toMatch(/[àèéìòù]/);
    expect(sv).toMatch(/[åäö]/);
  });
});

describe("retrieveKnowledge", () => {
  it("finds the right project by name/sector", () => {
    const ids = retrieveKnowledge("avete fatto un sito per una vespa?", "IT").map((e) => e.id);
    expect(ids).toContain("project-vespa-heritage");
  });

  it("matches a barbershop query in English", () => {
    const ids = retrieveKnowledge("I need an online booking site for my barbershop", "EN").map((e) => e.id);
    expect(ids).toContain("project-barberia");
  });

  it("retrieves the frontend tool stack", () => {
    const ids = retrieveKnowledge("do you use react and next.js?", "EN").map((e) => e.id);
    expect(ids).toContain("stack-frontend");
  });

  it("never returns core-category entries (those are always injected separately)", () => {
    const entries = retrieveKnowledge("come ti contatto via email?", "IT");
    for (const e of entries) expect(CORE_CATEGORIES.has(e.category)).toBe(false);
  });

  it("returns nothing for an empty or signal-free query", () => {
    expect(retrieveKnowledge("", "IT")).toEqual([]);
    expect(retrieveKnowledge("???", "EN")).toEqual([]);
  });

  it("respects the k cap", () => {
    expect(retrieveKnowledge("sito web automazione agente ai dati design", "IT", 3).length).toBeLessThanOrEqual(3);
  });
});

describe("coreKnowledge", () => {
  it("returns only core-category entries", () => {
    const core = coreKnowledge();
    expect(core.length).toBeGreaterThan(0);
    for (const e of core) expect(CORE_CATEGORIES.has(e.category)).toBe(true);
    expect(core.map((e) => e.id)).toContain("contact-channels");
  });
});

describe("rankByQuery", () => {
  it("ranks items with matching text first", () => {
    const items = [
      { t: "guide to n8n automations" },
      { t: "react frontend tips" },
      { t: "wedding photography" },
    ];
    const out = rankByQuery("how do n8n automations work", items, (i) => i.t, 2);
    expect(out[0].t).toContain("n8n");
  });

  it("falls back to the first items when nothing matches", () => {
    const items = [{ t: "alpha" }, { t: "beta" }];
    const out = rankByQuery("zzz nomatch", items, (i) => i.t, 1);
    expect(out).toHaveLength(1);
  });
});

describe("renderKnowledge", () => {
  it("groups entries under category headings", () => {
    const block = renderKnowledge(coreKnowledge(), "EN");
    expect(block).toContain("## Contact & how to start");
    expect(block).toContain("hello@Lorenzo.studio");
  });
});
