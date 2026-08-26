import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, it, expect } from "vitest";

import { renderAgentMarkdown } from "@/lib/agent-md";

// I file di discovery per gli agenti (ARD, agent-skills, DID) sono statici in
// public/: nessun compilatore li controlla, e un digest sbagliato o un campo
// mancante si scoprirebbero solo da uno scanner esterno. Questi test sono il
// loro type-checker.

const WK = join(process.cwd(), "public", ".well-known");
const readJson = (p: string) => JSON.parse(readFileSync(join(WK, p), "utf8"));

describe("i file di discovery per gli agenti", () => {
  it("pubblica un ai-catalog ARD valido", () => {
    const cat = readJson("ai-catalog.json");
    expect(cat.specVersion).toBe("1.0");
    expect(cat.host.identifier).toBe("did:web:looz.design");
    expect(cat.host.displayName).toBeTruthy();
    expect(cat.entries.length).toBeGreaterThan(0);
    for (const e of cat.entries) {
      expect(e.identifier, e.displayName).toMatch(/^urn:air:looz\.design:/);
      expect(e.displayName).toBeTruthy();
      expect(e.type).toBeTruthy();
      // Esattamente uno tra url e data, come chiede la spec.
      expect(Boolean(e.url) !== Boolean(e.data), e.identifier).toBe(true);
      expect(e.trustManifest?.identity).toBe("did:web:looz.design");
    }
  });

  it("tiene il digest dell'indice agent-skills allineato alla SKILL.md", () => {
    const index = readJson("agent-skills/index.json");
    expect(index.skills.length).toBeGreaterThan(0);
    for (const s of index.skills) {
      expect(s.name).toBeTruthy();
      expect(s.description).toBeTruthy();
      const body = readFileSync(join(WK, s.url.replace("/.well-known/", "")));
      const digest = "sha256:" + createHash("sha256").update(body).digest("hex");
      expect(digest, `${s.name}: rigenera il digest dopo aver toccato la SKILL.md`).toBe(s.digest);
    }
  });

  it("risolve il did:web dichiarato nel catalogo", () => {
    const did = readJson("did.json");
    expect(did.id).toBe("did:web:looz.design");
  });

  it("serve il gemello markdown anche sugli alias inglesi", () => {
    expect(renderAgentMarkdown("/about")).toContain("Lorenzo Dastoli");
    expect(renderAgentMarkdown("/contact")).toBeTruthy();
    expect(renderAgentMarkdown("/pricing")).toBeTruthy();
  });

  it("apre ogni gemello con un blocco frontmatter completo", () => {
    const md = renderAgentMarkdown("/chi-sono")!;
    expect(md.startsWith("---\n")).toBe(true);
    for (const campo of ["title:", "description:", "canonical: https://", "last-updated: "]) {
      expect(md, campo).toContain(campo);
    }
    // Il corpo resta un documento vero: H1 subito dopo il frontmatter.
    expect(md.split("---\n")[2]?.trimStart().startsWith("# ")).toBe(true);
  });
});
