import { DISCIPLINES } from "./disciplines";

// La fonte unica dei link di piede. Due footer la leggono entrambi, ed e' il
// motivo per cui esiste: quando le voci stavano scritte dentro ciascun footer,
// i due elenchi divergevano al primo commit e una pagina in sitemap poteva
// restare orfana (era successo: /servizi/claude-cowork linkata da zero pagine).
//
// Dal 2026-08-24 il footer e' anche il paracadute della demozione: Processo,
// Assistente e le quattro pagine disciplina sono usciti dalla barra (una parola
// sola per l'offerta: Soluzioni) e QUESTI elenchi sono cio' che li tiene
// raggiungibili e scansionabili. Se una voce sparisce da qui, sparisce dal
// sito: toglierla e' una decisione, non un refuso.

/** Le sezioni del sito, nell'ordine in cui si leggono nel piede. */
export const SECTION_LINKS: { href: string; labelKey: string }[] = [
  { href: "/soluzioni", labelKey: "nav.solutions" },
  { href: "/work", labelKey: "nav.work" },
  { href: "/processo", labelKey: "nav.process" },
  { href: "/prezzi", labelKey: "nav.pricing" },
  { href: "/agents", labelKey: "nav.agents" },
];

/** Le sezioni nascoste finche' LAUNCH_MODE resta "minimal". */
export const LAUNCH_LINKS: { href: string; labelKey: string }[] = [
  { href: "/componenti", labelKey: "nav.components" },
  { href: "/membership", labelKey: "nav.membership" },
  { href: "/blog", labelKey: "nav.blog" },
];

/** Le quattro pagine disciplina: lander secondari, vivono solo nel piede
 *  e dentro /soluzioni. I nomi seguono la lingua del visitatore. */
export const SERVICE_LINKS: { href: string; labelKey: string }[] = DISCIPLINES.map(
  (d) => ({ href: "/servizi/" + d.slug, labelKey: d.key + ".label" }),
);
