import { dict } from "@/i18n";
import { DISCIPLINES } from "./disciplines";
import { PROJECTS } from "./projects";
import { SITE_URL } from "./launch";
import {
  LIVE_SECTORS,
  SOLUTIONS,
  familyLabelKey,
  getSector,
  getSolution,
  sectorProof,
  solutionProof,
  solutionsBySector,
} from "./solutions";

// La versione markdown del sito, per gli agenti (acceptmarkdown.com).
//
// Ogni pagina pubblica ha un gemello markdown reso DALLO STESSO dizionario e
// DALLO STESSO catalogo della pagina vera: non un secondo copy da tenere
// allineato, ma la stessa fonte in un altro vestito. Se una chiave cambia in
// i18n, cambia anche qui; se una soluzione si pubblica, il suo markdown
// esiste da solo. Il test in __tests__/agent-md.test.ts fa fallire la build
// se una rotta pubblica resta senza gemello o se nel testo finisce una chiave
// non tradotta.
//
// Lingua: italiano, come il lang="it" dell'HTML. Gli agenti che vogliono
// EN/SV trovano la nota in testa e /llms.txt.

const t = (k: string): string | undefined => dict.it[k];

/** Le voci "Titolo::Corpo|…" del dizionario, come coppie. */
function pairs(raw: string | undefined): { title: string; body: string }[] {
  if (!raw) return [];
  return raw
    .split("|")
    .map((chunk) => {
      const [title, body = ""] = chunk.split("::");
      return { title: title.trim(), body: body.trim() };
    })
    .filter((p) => p.title);
}

const list = (raw: string | undefined): string[] =>
  raw ? raw.split("|").map((x) => x.trim()).filter(Boolean) : [];

/** Il piede comune: dove un agente puo' andare da qualunque pagina. */
function footer(): string {
  return [
    "---",
    "",
    `Contatto: hello@looz.design · [Contatti](${SITE_URL}/contatti) (risposta entro 24 ore)`,
    `Mappa del sito: ${SITE_URL}/sitemap.xml · Guida per agenti: ${SITE_URL}/llms.txt`,
    "",
  ].join("\n");
}

function head(title: string, path: string): string {
  return [
    `# ${title}`,
    "",
    `> LOoz.design, studio freelance di una persona: siti su misura, automazioni e agenti AI per piccole imprese. Questa è la versione markdown di ${SITE_URL}${path} (contenuto in italiano; il sito esiste anche in inglese e svedese).`,
    "",
  ].join("\n");
}

function mdHome(): string {
  const out = [head(t("heroMotion.h1") ?? "LOoz.design", "/")];
  out.push(`${t("heroMotion.statement")}`, "", `${t("heroMotion.lede")}`, "");
  out.push("## Il tuo settore", "");
  for (const s of LIVE_SECTORS) {
    const n = solutionsBySector(s.id).length;
    out.push(`- [${t(`sec.${s.id}.label`)}](${SITE_URL}/soluzioni/settore/${s.slug}): ${t(`sec.${s.id}.title`)} (${n} soluzioni)`);
  }
  out.push("", "## Le sezioni del sito", "");
  out.push(`- [Soluzioni](${SITE_URL}/soluzioni): ${t("sol.hub.title")}`);
  out.push(`- [Lavori](${SITE_URL}/work): ${t("work.title")} Demo aperte e navigabili.`);
  out.push(`- [Processo](${SITE_URL}/processo): ${t("processo.title")}`);
  out.push(`- [Prezzi](${SITE_URL}/prezzi): ${t("prezzi.title")}`);
  out.push(`- [Chi sono](${SITE_URL}/chi-sono): ${t("chisono.title")}`);
  out.push(`- [Contatti](${SITE_URL}/contatti): ${t("contatti.title")}`);
  out.push("", "## Le garanzie", "");
  for (const k of ["own", "price", "speed", "lang"]) {
    out.push(`- **${t(`trust.${k}.title`)}**: ${t(`trust.${k}.desc`)}`);
  }
  out.push("", footer());
  return out.join("\n");
}

function mdSoluzioni(): string {
  const out = [head(t("sol.hub.title") ?? "Soluzioni", "/soluzioni")];
  out.push(`${t("sol.hub.lede")}`, "");
  out.push(`## ${t("sol.hub.sectors.title")}`, "");
  for (const s of LIVE_SECTORS) {
    out.push(`- [${t(`sec.${s.id}.label`)}](${SITE_URL}/soluzioni/settore/${s.slug}): ${t(`sec.${s.id}.title`)}`);
  }
  out.push("", `## ${t("sol.hub.listTitle")}`, "");
  for (const s of SOLUTIONS) {
    out.push(`- [${t(`sol.${s.key}.title`)}](${SITE_URL}/soluzioni/${s.slug}): ${t(`sol.${s.key}.lede`)}`);
  }
  out.push("", footer());
  return out.join("\n");
}

function mdSolution(slug: string): string | null {
  const s = getSolution(slug);
  if (!s) return null;
  const k = (x: string) => t(`sol.${s.key}.${x}`);
  const out = [head(k("title") ?? slug, `/soluzioni/${slug}`)];
  out.push(`${k("lede")}`, "");
  out.push(`Tipo di lavoro: ${t(familyLabelKey(s.family))}. Settori: ${s.sectors.map((id) => t(`sec.${id}.label`)).join(", ")}.`, "");
  out.push(`## ${t("sol.sec.problem")}`, "", `${k("problem")}`, "");
  const signals = list(k("signals"));
  if (signals.length) {
    out.push(`### ${t("sol.sec.signals")}`, "");
    for (const x of signals) out.push(`- ${x}`);
    out.push("");
  }
  out.push(`## ${t("sol.sec.build")}`, "");
  for (const p of pairs(k("build"))) out.push(`- **${p.title}**: ${p.body}`);
  out.push("", `## ${t("sol.sec.change")}`, "", `${k("change")}`, "");
  const { items, nearest } = solutionProof(s);
  if (items.length) {
    out.push(`## ${t(nearest ? "sol.sec.proof.nearest" : "sol.sec.proof")}`, "");
    if (nearest) out.push(`${t("sol.sec.proof.nearest.sub")}`, "");
    for (const p of items) {
      out.push(`- [${t(`work.proj.${p.key}`) ?? p.slug}](${SITE_URL}/work/${p.slug})`);
    }
    out.push("");
  }
  out.push(`## ${t("sol.sec.phases")}`, "");
  for (const f of list(k("phases"))) {
    const [name, when = "", body = ""] = f.split("::").map((x) => x.trim());
    out.push(`- **${name}** (${when}): ${body}`);
  }
  out.push("", `${t("sol.sec.time")}: ${k("time")}`, "");
  const excludes = list(k("excludes"));
  if (excludes.length) {
    out.push(`## ${t("sol.sec.excludes")}`, "");
    for (const x of excludes) out.push(`- ${x}`);
    out.push("");
  }
  const integra = list(k("integra"));
  if (integra.length) {
    out.push(`## ${t("sol.sec.integra")}`, "", integra.join(" · "), "");
  }
  const faq = pairs(k("faq"));
  if (faq.length) {
    out.push(`## ${t("sol.sec.faq")}`, "");
    for (const q of faq) out.push(`**${q.title}** ${q.body}`, "");
  }
  out.push(footer());
  return out.join("\n");
}

function mdSector(slug: string): string | null {
  const s = getSector(slug);
  if (!s) return null;
  const out = [head(t(`sec.${s.id}.title`) ?? slug, `/soluzioni/settore/${slug}`)];
  for (const p of list(t(`sec.${s.id}.intro`))) out.push(p, "");
  out.push(`## ${t("sec.sol.title")}`, "");
  for (const sol of solutionsBySector(s.id)) {
    out.push(`- [${t(`sol.${sol.key}.title`)}](${SITE_URL}/soluzioni/${sol.slug}): ${t(`sol.${sol.key}.lede`)}`);
  }
  const proof = sectorProof(s.id);
  if (proof.length) {
    out.push("", `## ${t("sec.proof.title")}`, "");
    for (const p of proof) out.push(`- [${t(`work.proj.${p.key}`) ?? p.slug}](${SITE_URL}/work/${p.slug})`);
  }
  out.push("", footer());
  return out.join("\n");
}

function mdServizio(slug: string): string | null {
  const d = DISCIPLINES.find((x) => x.slug === slug);
  if (!d) return null;
  const s = (x: string) => t(`serv.${d.id}.${x}`);
  const out = [head(s("title") ?? slug, `/servizi/${slug}`)];
  out.push(`${s("lede")}`, "");
  const inc = pairs(s("includes"));
  if (inc.length) {
    out.push(`## ${s("includes.title") ?? "Cosa comprende"}`, "");
    for (const p of inc) out.push(`- **${p.title}**: ${p.body}`);
    out.push("");
  }
  out.push(`Le soluzioni concrete, caso per caso: ${SITE_URL}/soluzioni`, "", footer());
  return out.join("\n");
}

function mdWork(): string {
  const out = [head(t("work.title") ?? "Progetti", "/work")];
  out.push(
    "Demo dimostrative aperte e navigabili, costruite per il portfolio. I marchi reali eventualmente citati appartengono ai rispettivi titolari.",
    "",
    "## I progetti",
    "",
  );
  for (const p of PROJECTS.filter((x) => x.featured && !x.hidden)) {
    const blurb = t(`work.proj.${p.key}.blurb`);
    out.push(`- [${t(`work.proj.${p.key}`) ?? p.slug}](${SITE_URL}/work/${p.slug})${blurb ? `: ${blurb}` : ""}`);
  }
  out.push("", footer());
  return out.join("\n");
}

function mdProcesso(): string {
  const out = [head(t("processo.title") ?? "Come lavoro", "/processo")];
  out.push(`${t("processo.sub")}`, "");
  for (const ph of ["p1", "p2"]) {
    out.push(`## ${t(`processo.${ph}.name`)}`, "", `${t(`processo.${ph}.statement`)} ${t(`processo.${ph}.body`)}`, "");
  }
  out.push("## Poi la strada si divide", "");
  for (const d of DISCIPLINES) {
    const time = t(`processo.fork.${d.id}.time`);
    out.push(`- **${t(`${d.key}.label`)}** (${t("processo.fork.lbl.time")?.toLowerCase()}: ${time}): ${SITE_URL}/servizi/${d.slug}`);
  }
  out.push("", footer());
  return out.join("\n");
}

function mdPrezzi(): string {
  const out = [head(t("prezzi.title") ?? "Prezzi", "/prezzi")];
  out.push(`${t("prezzi.sub")}`, "");
  out.push(
    "Nessun listino pubblicato: il preventivo si concorda prima di iniziare, in una chiamata. L'audit del sito è gratuito, con risposta entro 24 ore.",
    "",
    footer(),
  );
  return out.join("\n");
}

function mdContatti(): string {
  const out = [head(t("contatti.title") ?? "Contatti", "/contatti")];
  out.push(`${t("contatti.sub")}`, "");
  out.push(`- Email: hello@looz.design (${t("contatti.email.reply")?.toLowerCase()})`);
  out.push(`- ${t("contatti.way1.title")}: modulo su ${SITE_URL}/contatti`);
  out.push(`- ${t("contact.title")} ${SITE_URL}/contatti`);
  out.push("", footer());
  return out.join("\n");
}

function mdChiSono(): string {
  const out = [head(t("chisono.title") ?? "Chi sono", "/chi-sono")];
  for (const p of list(t("chisono.body"))) out.push(p, "");
  out.push(footer());
  return out.join("\n");
}

/** Tutte le rotte con un gemello markdown, per il sitemap dei test. */
export function markdownRoutes(): string[] {
  return [
    "/",
    "/soluzioni",
    ...SOLUTIONS.map((s) => `/soluzioni/${s.slug}`),
    ...LIVE_SECTORS.map((s) => `/soluzioni/settore/${s.slug}`),
    ...DISCIPLINES.map((d) => `/servizi/${d.slug}`),
    "/work",
    "/processo",
    "/prezzi",
    "/contatti",
    "/chi-sono",
  ];
}

/** Il gemello markdown di una rotta, o null se la rotta non esiste. */
export function renderAgentMarkdown(path: string): string | null {
  const p = path.length > 1 && path.endsWith("/") ? path.slice(0, -1) : path;
  if (p === "/" || p === "") return mdHome();
  if (p === "/soluzioni") return mdSoluzioni();
  if (p.startsWith("/soluzioni/settore/")) return mdSector(p.slice("/soluzioni/settore/".length));
  if (p.startsWith("/soluzioni/")) return mdSolution(p.slice("/soluzioni/".length));
  if (p.startsWith("/servizi/")) return mdServizio(p.slice("/servizi/".length));
  if (p === "/work") return mdWork();
  if (p === "/processo") return mdProcesso();
  if (p === "/prezzi") return mdPrezzi();
  if (p === "/contatti") return mdContatti();
  if (p === "/chi-sono") return mdChiSono();
  return null;
}

/** Il corpo markdown del 404: dice dove guardare, non solo che non c'e'. */
export function notFoundMarkdown(path: string): string {
  return [
    "# 404: pagina non trovata",
    "",
    `Il percorso \`${path}\` non esiste su ${SITE_URL}.`,
    "",
    "Dove guardare:",
    "",
    `- Mappa completa del sito: ${SITE_URL}/sitemap.xml`,
    `- Guida per agenti (cosa fa questo sito e quando usarlo): ${SITE_URL}/llms.txt`,
    `- [Soluzioni per settore](${SITE_URL}/soluzioni)`,
    `- [Progetti e demo](${SITE_URL}/work)`,
    `- [Contatti](${SITE_URL}/contatti): hello@looz.design, risposta entro 24 ore`,
    "",
  ].join("\n");
}

/**
 * true quando l'header Accept chiede markdown (acceptmarkdown.com): il tipo
 * text/markdown compare con q > 0. I browser non lo mandano mai, quindi il
 * default resta l'HTML e nessun visitatore umano cambia strada.
 */
export function prefersMarkdown(accept: string | null | undefined): boolean {
  if (!accept) return false;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.trim().split(";");
    if (type.trim().toLowerCase() !== "text/markdown") continue;
    for (const raw of params) {
      const [key, val] = raw.trim().split("=");
      if (key === "q" && parseFloat(val) === 0) return false;
    }
    return true;
  }
  return false;
}
