import { describe, expect, it } from "vitest";

import {
  markdownRoutes,
  notFoundMarkdown,
  prefersMarkdown,
  renderAgentMarkdown,
} from "@/lib/agent-md";
import { LIVE_SECTORS, SOLUTIONS } from "@/lib/solutions";

// La promessa: ogni rotta pubblica ha un gemello markdown completo, e la
// negoziazione decide bene quando servirlo. Se una chiave sparisce dal
// dizionario o una rotta resta senza gemello, si rompe qui e non in faccia a
// un agente.

describe("il gemello markdown di ogni rotta", () => {
  it("copre home, catalogo, settori, servizi e pagine di fiducia", () => {
    const routes = markdownRoutes();
    expect(routes).toContain("/");
    expect(routes).toContain("/soluzioni");
    expect(routes).toContain("/chi-sono");
    expect(routes).toContain("/contatti");
    for (const s of SOLUTIONS) expect(routes).toContain(`/soluzioni/${s.slug}`);
    for (const s of LIVE_SECTORS) expect(routes).toContain(`/soluzioni/settore/${s.slug}`);
  });

  // Brand discoverability: il nome reale e' il segnale che lega la persona al
  // dominio, e la pagina di fiducia e' dove un agente va a cercarlo.
  it("la pagina di fiducia porta il nome completo", () => {
    expect(renderAgentMarkdown("/chi-sono")).toContain("Lorenzo Dastoli");
  });

  it("rende ogni rotta con un H1 e un corpo sostanzioso", () => {
    for (const r of markdownRoutes()) {
      const md = renderAgentMarkdown(r);
      expect(md, r).toBeTruthy();
      expect(md!.startsWith("# "), r).toBe(true);
      expect(md!.length, r).toBeGreaterThan(400);
    }
  });

  it("non lascia nel testo chiavi non tradotte o buchi", () => {
    for (const r of markdownRoutes()) {
      const md = renderAgentMarkdown(r)!;
      expect(md, r).not.toMatch(/undefined/);
      // una chiave grezza avrebbe la forma prefisso.puntato dentro il testo
      expect(md, r).not.toMatch(/\b(sol|sec|serv|trust|processo|prezzi|contatti|chisono|heroMotion)\.[a-z]/);
    }
  });

  it("porta in ogni pagina il piede con contatto, sitemap e llms.txt", () => {
    for (const r of markdownRoutes()) {
      const md = renderAgentMarkdown(r)!;
      expect(md, r).toContain("hello@looz.design");
      expect(md, r).toContain("/sitemap.xml");
      expect(md, r).toContain("/llms.txt");
    }
  });

  it("normalizza la barra finale e rifiuta le rotte inventate", () => {
    expect(renderAgentMarkdown("/soluzioni/")).toBe(renderAgentMarkdown("/soluzioni"));
    expect(renderAgentMarkdown("/non-esiste")).toBeNull();
    expect(renderAgentMarkdown("/soluzioni/non-esiste")).toBeNull();
  });
});

describe("il 404 per agenti", () => {
  it("dice dove guardare, non solo che non c'e'", () => {
    const md = notFoundMarkdown("/qualcosa");
    expect(md).toContain("404");
    expect(md).toContain("/sitemap.xml");
    expect(md).toContain("/llms.txt");
    expect(md).toContain("/soluzioni");
    expect(md).toContain("hello@looz.design");
  });
});

describe("la negoziazione (acceptmarkdown.com)", () => {
  it("riconosce text/markdown in ogni posizione e con parametri", () => {
    expect(prefersMarkdown("text/markdown")).toBe(true);
    expect(prefersMarkdown("text/html, text/markdown;q=0.9")).toBe(true);
    expect(prefersMarkdown("TEXT/MARKDOWN")).toBe(true);
    expect(prefersMarkdown("text/markdown; charset=utf-8")).toBe(true);
  });

  it("non scatta per i browser e per q=0", () => {
    expect(prefersMarkdown(null)).toBe(false);
    expect(prefersMarkdown(undefined)).toBe(false);
    expect(prefersMarkdown("text/html,application/xhtml+xml,*/*;q=0.8")).toBe(false);
    expect(prefersMarkdown("text/markdown;q=0")).toBe(false);
    expect(prefersMarkdown("text/x-markdown")).toBe(false);
  });
});
