import { describe, it, expect } from "vitest";
import {
  KNOWLEDGE,
  CORE_CATEGORIES,
  coreKnowledge,
  retrieveKnowledge,
  rankByQuery,
  renderKnowledge,
} from "@/lib/agent-knowledge";
import { PROJECTS } from "@/lib/projects";

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
    expect(block).toContain("hello@looz.design");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Coverage guard. The assistant serves projects ONLY from this KB — the live DB
// catalog deliberately drops category "projects" (see agent-context.ts) — so a
// case that ships on the site without a KB entry is invisible to the assistant.
// That silently happened to 12 of 28 cases, including every automation demo.
// ─────────────────────────────────────────────────────────────────────────────
describe("KB covers the whole site portfolio", () => {
  it("has an entry for every project shipped on the site", () => {
    const kbIds = new Set(KNOWLEDGE.map((e) => e.id));
    const missing = PROJECTS.filter((p) => !kbIds.has(`project-${p.slug}`)).map((p) => p.slug);
    expect(missing).toEqual([]);
  });

  it("keeps every live demo URL reachable from the assistant's answer", () => {
    const withDemo = PROJECTS.filter((p) => p.demo);
    for (const p of withDemo) {
      const entry = KNOWLEDGE.find((e) => e.id === `project-${p.slug}`);
      if (!entry) continue;
      expect(entry.text.IT).toContain(p.demo as string);
    }
  });
});

describe("retrieves the cases that were previously invisible", () => {
  const cases: Array<[string, "IT" | "EN" | "SV", string]> = [
    ["mi serve un sito per il fotovoltaico con calcolatore", "IT", "project-helios"],
    ["cerco un catalogo immobiliare con filtri", "IT", "project-meridia"],
    ["potete automatizzare i solleciti delle fatture scadute?", "IT", "project-solleciti-pagamento"],
    ["vorrei un assistente whatsapp per i clienti", "IT", "project-assistente-whatsapp"],
    ["automazione per le risposte email in gmail", "IT", "project-risposte-email"],
    ["chi sono i miei concorrenti in zona?", "IT", "project-mappa-mercato"],
    ["can you audit my site visibility and structured data?", "EN", "project-audit-visibilita"],
    ["I need social content generated for several channels", "EN", "project-contenuti-social"],
    ["har ni gjort en webbplats for ett bageri?", "SV", "project-nordbageriet"],
  ];

  for (const [query, lang, expected] of cases) {
    it(`"${query}" → ${expected}`, () => {
      const ids = retrieveKnowledge(query, lang).map((e) => e.id);
      expect(ids).toContain(expected);
    });
  }
});
