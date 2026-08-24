import { describe, it, expect } from "vitest";

import { PROJECTS } from "@/lib/projects";
import { DISCIPLINES } from "@/lib/disciplines";
import {
  ALL_SOLUTIONS,
  DRAFTS,
  FAMILIES,
  LIVE_FAMILIES,
  LIVE_SECTORS,
  SECTORS,
  SOLUTIONS,
  familyLabelKey,
  getSector,
  getSolution,
  isDemonstrated,
  relatedSolutions,
  sectorProof,
  solutionProof,
  solutionsBySector,
} from "@/lib/solutions";
import { dict, type Lang } from "@/i18n";

const LANGS: Lang[] = ["it", "en", "sv"];
const SLUGS = new Set(PROJECTS.map((p) => p.slug));

// Il catalogo vive di una promessa: ogni soluzione mostra lavori veri. Questi
// test sono il modo per non doverla ricontrollare a mano ogni volta che si
// rinomina uno slug in projects.ts.

describe("integrita' del catalogo", () => {
  it("ha slug e chiavi unici, bozze comprese", () => {
    const slugs = ALL_SOLUTIONS.map((s) => s.slug);
    const keys = ALL_SOLUTIONS.map((s) => s.key);
    expect(new Set(slugs).size, "slug duplicati").toBe(slugs.length);
    expect(new Set(keys).size, "chiavi i18n duplicate").toBe(keys.length);
  });

  it("cita solo progetti che esistono", () => {
    const orfani = ALL_SOLUTIONS.flatMap((s) =>
      [...(s.proof ?? []), ...(s.nearest ?? [])]
        .filter((p) => !SLUGS.has(p))
        .map((p) => `${s.slug} -> ${p}`),
    );
    expect(orfani).toEqual([]);
  });

  // La regola portante: una soluzione o mostra se stessa, o mostra la cosa piu'
  // vicina dichiarando che lo e'. Non esiste una terza possibilita', ed e' cio'
  // che tiene questa sezione onesta mentre cresce oltre le demo disponibili.
  it("da' a ogni soluzione o una demo propria o una prova vicina", () => {
    const nude = ALL_SOLUTIONS.filter(
      (s) => !s.proof?.length && !s.nearest?.length,
    ).map((s) => s.slug);
    expect(nude).toEqual([]);
  });

  it("non dichiara insieme demo propria e prova vicina", () => {
    const ambigue = ALL_SOLUTIONS.filter((s) => s.proof?.length && s.nearest?.length).map(
      (s) => s.slug,
    );
    expect(ambigue).toEqual([]);
  });

  it("mostra sempre qualcosa, e sa dire di che tipo di prova si tratta", () => {
    for (const s of SOLUTIONS) {
      const { items, nearest } = solutionProof(s);
      expect(items.length, s.slug).toBeGreaterThan(0);
      expect(nearest, s.slug).toBe(!isDemonstrated(s));
    }
  });

  it("usa solo settori dichiarati, e almeno uno per soluzione", () => {
    const ids = new Set(SECTORS.map((s) => s.id));
    for (const s of ALL_SOLUTIONS) {
      expect(s.sectors.length, s.slug).toBeGreaterThan(0);
      for (const id of s.sectors) expect(ids.has(id), `${s.slug} -> ${id}`).toBe(true);
    }
  });

  it("usa solo famiglie dichiarate", () => {
    const ids = new Set<string>(FAMILIES);
    for (const s of ALL_SOLUTIONS) expect(ids.has(s.family), s.slug).toBe(true);
  });

  it("tiene le famiglie allineate alla tassonomia del sito, tranne software", () => {
    const disc = new Set<string>(DISCIPLINES.map((d) => d.id));
    for (const f of FAMILIES) {
      if (f === "software") continue;
      expect(disc.has(f), `famiglia orfana: ${f}`).toBe(true);
    }
  });

  // Una bozza e' registrata ma non esiste per il sito: niente rotta, niente
  // sitemap, niente hub. Se una finisse in SOLUTIONS senza copy, il visitatore
  // troverebbe una pagina di chiavi i18n non tradotte.
  it("tiene le bozze fuori da tutto quello che il sito mostra", () => {
    const pubblicate = new Set(SOLUTIONS.map((s) => s.slug));
    for (const d of DRAFTS) {
      expect(pubblicate.has(d.slug), `bozza pubblicata: ${d.slug}`).toBe(false);
      expect(getSolution(d.slug), `bozza raggiungibile: ${d.slug}`).toBeUndefined();
    }
    expect(SOLUTIONS.length + DRAFTS.length).toBe(ALL_SOLUTIONS.length);
  });

  it("apre una pagina settore solo dove c'e' qualcosa da leggere", () => {
    expect(LIVE_SECTORS.length).toBeGreaterThan(0);
    for (const s of LIVE_SECTORS) {
      expect(solutionsBySector(s.id).length, s.id).toBeGreaterThan(0);
      expect(sectorProof(s.id).length, s.id).toBeGreaterThan(0);
    }
    // I settori non ancora vivi non devono essere raggiungibili per URL.
    const vivi = new Set(LIVE_SECTORS.map((s) => s.id));
    for (const s of SECTORS) {
      if (vivi.has(s.id)) continue;
      expect(getSector(s.slug), `settore vuoto raggiungibile: ${s.id}`).toBeUndefined();
    }
  });

  it("mostra solo le famiglie che hanno qualcosa dentro", () => {
    expect(LIVE_FAMILIES.length).toBeGreaterThan(0);
    for (const f of LIVE_FAMILIES) {
      expect(SOLUTIONS.some((s) => s.family === f), f).toBe(true);
    }
  });
});

describe("copy in tutte e tre le lingue", () => {
  const SUFFISSI = [
    "title",
    "lede",
    "problem",
    "signals",
    "build",
    "excludes",
    "change",
    "phases",
    "integra",
    "faq",
    "time",
  ];

  it("traduce ogni soluzione", () => {
    const mancanti: string[] = [];
    for (const lang of LANGS) {
      for (const s of SOLUTIONS) {
        for (const suffisso of SUFFISSI) {
          const key = `sol.${s.key}.${suffisso}`;
          if (!dict[lang][key]?.trim()) mancanti.push(`${lang}:${key}`);
        }
      }
    }
    expect(mancanti).toEqual([]);
  });

  it("traduce l'etichetta di ogni famiglia", () => {
    for (const lang of LANGS) {
      for (const f of LIVE_FAMILIES) {
        expect(dict[lang][familyLabelKey(f)]?.trim(), `${lang}:${f}`).toBeTruthy();
      }
    }
  });

  it("traduce ogni settore", () => {
    const mancanti: string[] = [];
    for (const lang of LANGS) {
      for (const s of LIVE_SECTORS) {
        for (const suffisso of ["label", "title", "intro"]) {
          const key = `sec.${s.id}.${suffisso}`;
          if (!dict[lang][key]?.trim()) mancanti.push(`${lang}:${key}`);
        }
      }
    }
    expect(mancanti).toEqual([]);
  });

  // Le liste del catalogo hanno una forma precisa, e sbagliarla non rompe la
  // build: fa sparire un blocco dalla pagina in silenzio. Questi test sono il
  // solo posto in cui quella forma viene verificata.
  const parti = (raw: string) => raw.split("|").map((x) => x.trim()).filter(Boolean);

  it("scrive 'cosa è previsto' come voce piu' spiegazione", () => {
    for (const lang of LANGS) {
      for (const s of SOLUTIONS) {
        const voci = parti(dict[lang][`sol.${s.key}.build`]);
        expect(voci.length, `${lang}:${s.slug}`).toBeGreaterThanOrEqual(3);
        for (const voce of voci) {
          const [titolo, corpo] = voce.split("::");
          expect(titolo?.trim(), `${lang}:${s.slug}`).toBeTruthy();
          expect(corpo?.trim(), `${lang}:${s.slug} -> ${titolo}`).toBeTruthy();
        }
      }
    }
  });

  it("da' a ogni fase un nome, una durata e una descrizione", () => {
    for (const lang of LANGS) {
      for (const s of SOLUTIONS) {
        const fasi = parti(dict[lang][`sol.${s.key}.phases`]);
        expect(fasi.length, `${lang}:${s.slug}`).toBeGreaterThanOrEqual(2);
        for (const fase of fasi) {
          const parts = fase.split("::").map((x) => x.trim());
          expect(parts.length, `${lang}:${s.slug} -> ${parts[0]}`).toBe(3);
          for (const p of parts) expect(p, `${lang}:${s.slug}`).toBeTruthy();
        }
      }
    }
  });

  it("scrive ogni FAQ come domanda piu' risposta", () => {
    for (const lang of LANGS) {
      for (const s of SOLUTIONS) {
        const faq = parti(dict[lang][`sol.${s.key}.faq`]);
        expect(faq.length, `${lang}:${s.slug}`).toBeGreaterThanOrEqual(3);
        for (const voce of faq) {
          const [domanda, risposta] = voce.split("::");
          expect(domanda?.trim(), `${lang}:${s.slug}`).toBeTruthy();
          expect(risposta?.trim(), `${lang}:${s.slug} -> ${domanda}`).toBeTruthy();
        }
      }
    }
  });

  it("dichiara sempre cosa non è compreso e a cosa si collega", () => {
    for (const lang of LANGS) {
      for (const s of SOLUTIONS) {
        expect(parti(dict[lang][`sol.${s.key}.excludes`]).length, `${lang}:${s.slug}`)
          .toBeGreaterThanOrEqual(2);
        expect(parti(dict[lang][`sol.${s.key}.signals`]).length, `${lang}:${s.slug}`)
          .toBeGreaterThanOrEqual(3);
        expect(parti(dict[lang][`sol.${s.key}.integra`]).length, `${lang}:${s.slug}`)
          .toBeGreaterThanOrEqual(3);
      }
    }
  });

  // Le tre lingue devono avere lo stesso numero di voci in ogni lista: se una
  // traduzione ne perde una, la pagina in quella lingua promette meno senza che
  // nessuno se ne accorga.
  it("tiene le liste allineate fra le tre lingue", () => {
    for (const s of SOLUTIONS) {
      for (const suffisso of ["signals", "build", "excludes", "phases", "integra", "faq"]) {
        const conteggi = LANGS.map((l) => parti(dict[l][`sol.${s.key}.${suffisso}`]).length);
        expect(new Set(conteggi).size, `${s.slug}.${suffisso} -> ${conteggi.join("/")}`).toBe(1);
      }
    }
  });

  it("scrive l'introduzione dei settori in piu' di un capoverso", () => {
    for (const lang of LANGS) {
      for (const s of LIVE_SECTORS) {
        const capoversi = dict[lang][`sec.${s.id}.intro`].split("|").filter((p) => p.trim());
        expect(capoversi.length, `${lang}:${s.id}`).toBeGreaterThanOrEqual(2);
      }
    }
  });

  // Il sito ha una regola contro i tell dell'AI, e il trattino lungo e' quello
  // che rientra da solo ogni volta che si riscrive del copy.
  it("non usa trattini lunghi nel copy italiano", () => {
    const colpevoli = Object.entries(dict.it)
      .filter(([k, v]) => (k.startsWith("sol.") || k.startsWith("sec.")) && v.includes("—"))
      .map(([k]) => k);
    expect(colpevoli).toEqual([]);
  });
});

describe("le funzioni di lettura", () => {
  it("trova una soluzione e un settore dal loro slug", () => {
    expect(getSolution("sito-ristorante-prenotazione")?.key).toBe("ristorante");
    expect(getSector("ristorazione")?.id).toBe("ristorazione");
    expect(getSolution("non-esiste")).toBeUndefined();
    expect(getSector("non-esiste")).toBeUndefined();
  });

  it("non ripete gli stessi lavori dentro un settore", () => {
    for (const s of LIVE_SECTORS) {
      const slugs = sectorProof(s.id).map((p) => p.slug);
      expect(new Set(slugs).size, s.id).toBe(slugs.length);
    }
  });

  it("propone soluzioni vicine senza mai proporre se stessa", () => {
    for (const s of SOLUTIONS) {
      const vicine = relatedSolutions(s);
      expect(vicine.length).toBeLessThanOrEqual(3);
      expect(vicine.some((o) => o.slug === s.slug)).toBe(false);
      for (const o of vicine) {
        expect(o.sectors.some((x) => s.sectors.includes(x))).toBe(true);
      }
    }
  });
});
