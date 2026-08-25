import type { DisciplineId } from "./disciplines";
import { PROJECTS, type Project } from "./projects";

// Il catalogo delle soluzioni: la superficie che mancava fra /servizi e /work.
//
// /servizi vende quattro discipline e /work mostra le demo. In mezzo non c'era
// niente che rispondesse alla domanda con cui arriva davvero un cliente: "io ho
// un ristorante / uno studio dentistico / un'autoscuola, tu cosa mi costruisci
// esattamente?". E' anche l'unica leva di traffico organico del sito, perche'
// intercetta la coda lunga ad alto intento ("software gestione autoscuola")
// dove chi cerca ha gia' il problema.
//
// ── Due livelli, ed e' la decisione portante di questo file ────────────────
//
// Ottantasette soluzioni sono piu' di quante demo esistano. Il sito ha una
// regola per cui ogni pagina porta una prova vera, e quella regola non si
// piega: si dichiara.
//
//   tier "demo"      → esiste una demo che MOSTRA questa soluzione (`proof`)
//   tier "commessa"  → non esiste ancora una demo propria. La pagina dice
//                      esattamente questo, e porta la prova piu' vicina
//                      (`nearest`): lavori che dimostrano la capacita' sotto.
//
// La prova vicina non e' un ripiego travestito. Il back office di /barberia
// gestisce agenda, magazzino e prodotti; quello di /work/pizzeria-restaurant
// ordini, prenotazioni e menu; bella-calabria fa listing, prenotazioni e
// dashboard. E' lo scheletro di meta' dei gestionali qui sotto, ed e' onesto
// mostrarlo dicendo cos'e'.
//
// Un test in __tests__/solutions.test.ts fa fallire la build se una soluzione
// non ha ne' `proof` ne' `nearest`, o se cita uno slug che non esiste.
//
// ── draft ─────────────────────────────────────────────────────────────────
//
// Una soluzione entra nel sito solo quando il suo copy e' scritto in tutte e
// tre le lingue. Finche' non lo e' resta `draft: true`: e' registrata qui
// perche' il lavoro da fare sia visibile nel codice invece che in una lista
// altrove, ma non ha rotta, non entra nel sitemap e non compare nell'hub.
// Nessuna pagina sottile puo' finire in produzione per distrazione.
//
// Le fasce di prezzo NON stanno qui ed e' voluto: le pagine soluzione chiudono
// sull'audit gratuito, il listino vive solo in /prezzi.

export type SectorId =
  | "trasversale"
  | "ristorazione"
  | "bar-forni"
  | "produttori-food"
  | "benessere-sport"
  | "servizi-persona"
  | "turismo"
  | "studi-creativi"
  | "commercio-prodotto"
  | "retail"
  | "manifattura"
  | "edilizia"
  | "sanita"
  | "logistica"
  | "automotive"
  | "formazione"
  | "servizi-professionali"
  | "eventi"
  | "immobiliare"
  | "agricoltura";

export type Sector = {
  id: SectorId;
  /** Segmento sotto /soluzioni/settore. Coincide con l'id, ma tenuto esplicito
   *  perche' l'URL e' un contratto pubblico e l'id no. */
  slug: string;
};

/**
 * La famiglia sotto cui cade una soluzione, e con cui si filtra l'hub.
 *
 * Sono le quattro discipline del sito piu' `software`. I gestionali su misura
 * non sono un sito, non sono un marchio e non sono un'automazione: metterli
 * sotto "Automazioni AI" avrebbe reso quel filtro una discarica e l'occhiello
 * della scheda una bugia. `software` per ora vive solo qui dentro; se il
 * catalogo dimostra che tira, merita una pagina in /servizi come le altre
 * quattro, ed e' una decisione da prendere guardando i numeri.
 */
export type Family = DisciplineId | "software";

export const FAMILIES: Family[] = [
  "siti-web",
  "software",
  "automazioni-ai",
  "visibilita",
  "marchio",
];

export type Solution = {
  /** Segmento sotto /soluzioni. */
  slug: string;
  /** Prefisso i18n: sol.<key>.* */
  key: string;
  family: Family;
  sectors: SectorId[];
  /** Demo che mostrano QUESTA soluzione. Chi ce l'ha e' di livello "demo". */
  proof?: string[];
  /** Lavori che dimostrano la capacita' quando manca una demo propria. */
  nearest?: string[];
  /** Registrata ma non ancora scritta: niente rotta, niente sitemap, niente hub. */
  draft?: boolean;
};

export const SECTORS: Sector[] = [
  { id: "trasversale", slug: "trasversale" },
  { id: "ristorazione", slug: "ristorazione" },
  { id: "bar-forni", slug: "bar-forni" },
  { id: "produttori-food", slug: "produttori-food" },
  { id: "benessere-sport", slug: "benessere-sport" },
  { id: "servizi-persona", slug: "servizi-persona" },
  { id: "turismo", slug: "turismo" },
  { id: "studi-creativi", slug: "studi-creativi" },
  { id: "commercio-prodotto", slug: "commercio-prodotto" },
  { id: "retail", slug: "retail" },
  { id: "manifattura", slug: "manifattura" },
  { id: "edilizia", slug: "edilizia" },
  { id: "sanita", slug: "sanita" },
  { id: "logistica", slug: "logistica" },
  { id: "automotive", slug: "automotive" },
  { id: "formazione", slug: "formazione" },
  { id: "servizi-professionali", slug: "servizi-professionali" },
  { id: "eventi", slug: "eventi" },
  { id: "immobiliare", slug: "immobiliare" },
  { id: "agricoltura", slug: "agricoltura" },
];

/** Vale per chiunque abbia un'impresa, a prescindere da cosa vende. */
const OVUNQUE: SectorId[] = ["trasversale"];

export const ALL_SOLUTIONS: Solution[] = [
  // ══ Pubblicate: hanno una demo che le mostra ═══════════════════════════
  {
    slug: "sito-ristorante-prenotazione",
    key: "ristorante",
    family: "siti-web",
    sectors: ["ristorazione"],
    proof: ["sushi", "brado", "pizzeria-restaurant"],
  },
  {
    slug: "menu-digitale",
    key: "menu",
    family: "siti-web",
    sectors: ["ristorazione", "bar-forni"],
    proof: ["sushi", "gelateria"],
  },
  {
    slug: "sito-bar-gelateria-forno",
    key: "bar",
    family: "siti-web",
    sectors: ["bar-forni"],
    proof: ["gelateria", "nordbageriet"],
  },
  {
    slug: "vetrina-produttore-food",
    key: "produttore",
    family: "siti-web",
    sectors: ["produttori-food", "agricoltura"],
    proof: ["aliva", "brasilena", "mirzz"],
  },
  {
    slug: "sito-studio-benessere",
    key: "benessere",
    family: "siti-web",
    sectors: ["benessere-sport"],
    proof: ["yoga"],
  },
  {
    slug: "prenotazione-lezioni-corsi",
    key: "prenotazioni",
    family: "siti-web",
    sectors: ["benessere-sport", "servizi-persona", "sanita"],
    proof: ["yoga", "barberia"],
  },
  {
    slug: "sito-barbiere-salone",
    key: "barbiere",
    family: "siti-web",
    sectors: ["servizi-persona"],
    proof: ["barberia"],
  },
  {
    slug: "sito-fotografo-portfolio",
    key: "fotografo",
    family: "siti-web",
    sectors: ["studi-creativi"],
    proof: ["fotografo"],
  },
  {
    slug: "sito-turismo-tour",
    key: "turismo",
    family: "siti-web",
    sectors: ["turismo"],
    proof: ["buss-travel", "bella-calabria"],
  },
  {
    slug: "landing-prodotto-configuratore",
    key: "prodotto",
    family: "siti-web",
    sectors: ["commercio-prodotto"],
    proof: ["aurelia", "vespa-heritage", "ferrari-f8-tributo"],
  },
  {
    slug: "sito-multilingua",
    key: "multilingua",
    family: "siti-web",
    sectors: ["turismo", "studi-creativi", "produttori-food", "trasversale"],
    proof: ["fotografo", "barberia"],
  },
  {
    slug: "assistente-whatsapp",
    key: "whatsapp",
    family: "automazioni-ai",
    sectors: ["ristorazione", "benessere-sport", "servizi-persona", "turismo"],
    proof: ["assistente-whatsapp"],
  },
  {
    slug: "risposte-email-assistite",
    key: "email",
    family: "automazioni-ai",
    sectors: ["studi-creativi", "turismo", "commercio-prodotto", "servizi-professionali"],
    proof: ["risposte-email"],
  },
  {
    slug: "solleciti-pagamento",
    key: "solleciti",
    family: "automazioni-ai",
    sectors: ["studi-creativi", "commercio-prodotto", "produttori-food", "servizi-professionali"],
    proof: ["solleciti-pagamento"],
  },
  {
    slug: "contenuti-social",
    key: "social",
    family: "visibilita",
    sectors: ["ristorazione", "bar-forni", "benessere-sport", "servizi-persona"],
    proof: ["contenuti-social"],
  },
  {
    slug: "audit-visibilita-ai",
    key: "audit",
    family: "visibilita",
    sectors: OVUNQUE,
    proof: ["audit-visibilita", "ai-visibility"],
  },
  {
    slug: "mappa-mercato-locale",
    key: "mercato",
    family: "visibilita",
    sectors: OVUNQUE,
    proof: ["mappa-mercato"],
  },

  // ══ Registrate, copy da scrivere ═══════════════════════════════════════
  // Automazioni e dati
  { slug: "automatizzare-excel", key: "excel", family: "automazioni-ai", sectors: OVUNQUE, nearest: ["mappa-mercato", "solleciti-pagamento"] },
  { slug: "portale-fornitori", key: "fornitori", family: "automazioni-ai", sectors: ["manifattura", "retail", "trasversale"], nearest: ["solleciti-pagamento", "risposte-email"], draft: true },
  { slug: "automazione-logistica-magazzino", key: "magazzino", family: "automazioni-ai", sectors: ["logistica", "manifattura", "retail"], nearest: ["barberia", "solleciti-pagamento"], draft: true },
  { slug: "automazione-analisi-spese", key: "spese", family: "automazioni-ai", sectors: OVUNQUE, nearest: ["solleciti-pagamento", "mappa-mercato"], draft: true },
  { slug: "automazione-report-direzionali", key: "report", family: "automazioni-ai", sectors: OVUNQUE, nearest: ["ai-visibility", "mappa-mercato"], draft: true },
  { slug: "automazione-preventivazione", key: "preventivi", family: "automazioni-ai", sectors: ["manifattura", "edilizia", "servizi-professionali"], nearest: ["risposte-email", "solleciti-pagamento"], draft: true },
  { slug: "automazione-analisi-qualita", key: "qualita", family: "automazioni-ai", sectors: ["manifattura"], nearest: ["ai-visibility", "mappa-mercato"], draft: true },
  { slug: "email-clienti-ecommerce", key: "emailEcom", family: "automazioni-ai", sectors: ["commercio-prodotto", "retail"], nearest: ["risposte-email", "solleciti-pagamento"], draft: true },
  { slug: "assistenza-clienti-ai", key: "assistenzaAi", family: "automazioni-ai", sectors: OVUNQUE, nearest: ["assistente-whatsapp", "risposte-email"], draft: true },
  { slug: "analisi-sentiment-ai", key: "sentiment", family: "automazioni-ai", sectors: ["trasversale", "retail"], nearest: ["ai-visibility", "mappa-mercato"], draft: true },
  { slug: "analisi-statistica-ai", key: "statistica", family: "automazioni-ai", sectors: OVUNQUE, nearest: ["ai-visibility", "mappa-mercato"], draft: true },

  // Gestionali su misura
  { slug: "gestionale-ordini", key: "ordini", family: "software", sectors: ["manifattura"], nearest: ["pizzeria-restaurant", "barberia"], draft: true },
  { slug: "crm-pmi", key: "crm", family: "software", sectors: OVUNQUE, nearest: ["barberia", "ai-visibility"] },
  { slug: "dashboard-kpi", key: "kpi", family: "software", sectors: OVUNQUE, nearest: ["ai-visibility", "weather-se"] },
  { slug: "gestionale-cantieri", key: "cantieri", family: "software", sectors: ["edilizia"], nearest: ["barberia", "bella-calabria"], draft: true },
  { slug: "gestionale-hr", key: "hr", family: "software", sectors: OVUNQUE, nearest: ["barberia"], draft: true },
  { slug: "gestionale-noleggi", key: "noleggi", family: "software", sectors: ["automotive", "logistica"], nearest: ["bella-calabria", "barberia"], draft: true },
  { slug: "gestionale-parcellazione", key: "parcelle", family: "software", sectors: ["servizi-professionali"], nearest: ["solleciti-pagamento", "barberia"], draft: true },
  { slug: "piattaforma-field-service", key: "field", family: "software", sectors: ["trasversale", "edilizia"], nearest: ["barberia", "bella-calabria"], draft: true },
  { slug: "gestionale-membership", key: "membership", family: "software", sectors: ["benessere-sport"], nearest: ["yoga", "barberia"], draft: true },
  { slug: "gestionale-flotte", key: "flotte", family: "software", sectors: ["logistica"], nearest: ["bella-calabria", "barberia"], draft: true },
  { slug: "controllo-accessi-badge", key: "badge", family: "software", sectors: ["trasversale", "manifattura"], nearest: ["barberia"], draft: true },
  { slug: "gestionale-eventi", key: "eventiGest", family: "software", sectors: ["eventi"], nearest: ["bella-calabria", "yoga"], draft: true },
  { slug: "collaborazione-progetti", key: "progetti", family: "software", sectors: ["trasversale", "servizi-professionali"], nearest: ["barberia", "couffer"], draft: true },
  { slug: "gestionale-ricambi-garanzie", key: "ricambi", family: "software", sectors: ["retail", "automotive"], nearest: ["barberia"], draft: true },
  { slug: "gestionale-turni", key: "turni", family: "software", sectors: ["sanita", "ristorazione"], nearest: ["barberia", "yoga"] },
  { slug: "marketplace-b2b", key: "marketplace", family: "software", sectors: ["commercio-prodotto", "manifattura"], nearest: ["aliva", "bella-calabria"], draft: true },
  { slug: "gestionale-ristorante", key: "gestRistorante", family: "software", sectors: ["ristorazione"], nearest: ["pizzeria-restaurant", "sushi"] },
  { slug: "gestionale-hotel-pms", key: "pms", family: "software", sectors: ["turismo"], nearest: ["bella-calabria", "buss-travel"] },
  { slug: "gestionale-palestra", key: "gestPalestra", family: "software", sectors: ["benessere-sport"], nearest: ["yoga", "barberia"] },
  { slug: "gestionale-clinica", key: "clinica", family: "software", sectors: ["sanita"], nearest: ["barberia", "yoga"] },
  { slug: "tracciabilita-haccp", key: "haccp", family: "software", sectors: ["ristorazione", "produttori-food"], nearest: ["barberia", "aliva"] },
  { slug: "gestionale-scuola", key: "scuola", family: "software", sectors: ["formazione"], nearest: ["yoga", "barberia"], draft: true },
  { slug: "gestionale-agricolo", key: "agricolo", family: "software", sectors: ["agricoltura"], nearest: ["aliva", "barberia"], draft: true },
  { slug: "gestionale-officina", key: "officina", family: "software", sectors: ["automotive"], nearest: ["barberia", "pizzeria-restaurant"], draft: true },
  { slug: "gestionale-immobiliare", key: "immobiliare", family: "software", sectors: ["immobiliare"], nearest: ["bella-calabria"], draft: true },
  { slug: "gestionale-dentistico", key: "dentistico", family: "software", sectors: ["sanita"], nearest: ["barberia", "yoga"] },
  { slug: "gestionale-estetica", key: "estetica", family: "software", sectors: ["servizi-persona", "benessere-sport"], nearest: ["barberia", "yoga"] },
  { slug: "gestionale-lavanderia", key: "lavanderia", family: "software", sectors: ["trasversale", "retail"], nearest: ["barberia"], draft: true },
  { slug: "gestionale-teatro-biglietteria", key: "teatro", family: "software", sectors: ["eventi"], nearest: ["bella-calabria", "yoga"], draft: true },
  { slug: "gestionale-autoscuola", key: "autoscuola", family: "software", sectors: ["formazione", "automotive"], nearest: ["yoga", "barberia"], draft: true },
  { slug: "gestionale-parcheggio", key: "parcheggio", family: "software", sectors: ["logistica", "immobiliare"], nearest: ["barberia", "bella-calabria"], draft: true },
  { slug: "gestionale-coworking", key: "coworking", family: "software", sectors: ["immobiliare", "servizi-professionali"], nearest: ["bella-calabria", "yoga"], draft: true },
  { slug: "gestionale-biblioteca", key: "biblioteca", family: "software", sectors: ["formazione"], nearest: ["barberia"], draft: true },
  { slug: "gestionale-condominio", key: "condominio", family: "software", sectors: ["immobiliare"], nearest: ["bella-calabria", "solleciti-pagamento"], draft: true },
  { slug: "gestionale-pet-shop", key: "pet", family: "software", sectors: ["retail"], nearest: ["barberia", "gelateria"], draft: true },
  { slug: "gestionale-ciclofficina", key: "ciclofficina", family: "software", sectors: ["retail", "automotive"], nearest: ["barberia", "gelateria"], draft: true },
  { slug: "gestionale-onoranze", key: "onoranze", family: "software", sectors: ["servizi-professionali"], nearest: ["barberia"], draft: true },
  { slug: "gestionale-tatuaggi", key: "tatuaggi", family: "software", sectors: ["servizi-persona"], nearest: ["barberia", "fotografo"], draft: true },
  { slug: "gestionale-vivaio", key: "vivaio", family: "software", sectors: ["agricoltura", "retail"], nearest: ["gelateria", "aliva"], draft: true },
  { slug: "gestionale-studio-fotografico", key: "gestFotografo", family: "software", sectors: ["studi-creativi"], nearest: ["fotografo", "barberia"], draft: true },
  { slug: "gestionale-no-profit", key: "noprofit", family: "software", sectors: OVUNQUE, nearest: ["yoga", "solleciti-pagamento"], draft: true },
  { slug: "gestionale-cantina", key: "cantina", family: "software", sectors: ["agricoltura", "produttori-food"], nearest: ["aliva", "barberia"], draft: true },
  { slug: "gestionale-franchising", key: "franchising", family: "software", sectors: ["retail", "ristorazione"], nearest: ["gelateria", "barberia"], draft: true },
  { slug: "gestionale-yacht-club", key: "yacht", family: "software", sectors: ["turismo"], nearest: ["bella-calabria", "buss-travel"], draft: true },
  { slug: "gestionale-rsa", key: "rsa", family: "software", sectors: ["sanita"], nearest: ["barberia", "yoga"], draft: true },
  { slug: "gestionale-birrificio", key: "birrificio", family: "software", sectors: ["agricoltura", "produttori-food"], nearest: ["aliva", "brasilena"], draft: true },
  { slug: "piattaforma-elearning", key: "elearning", family: "software", sectors: ["formazione", "trasversale"], nearest: ["yoga", "couffer"], draft: true },
  { slug: "piattaforma-crowdfunding", key: "crowdfunding", family: "software", sectors: OVUNQUE, nearest: ["bella-calabria", "aliva"], draft: true },
  { slug: "app-cross-platform", key: "app", family: "software", sectors: OVUNQUE, nearest: ["yoga", "couffer"], draft: true },
  { slug: "mvp-startup", key: "mvp", family: "software", sectors: OVUNQUE, nearest: ["ai-visibility", "couffer"], draft: true },

  // Siti, design, esperienze
  { slug: "sito-vetrina-aziendale", key: "vetrina", family: "siti-web", sectors: OVUNQUE, nearest: ["aliva", "brado"], draft: true },
  { slug: "restyling-conversion-audit", key: "restyling", family: "siti-web", sectors: OVUNQUE, nearest: ["audit-visibilita", "brado"], draft: true },
  { slug: "design-ecommerce", key: "ecomDesign", family: "siti-web", sectors: ["commercio-prodotto", "retail"], nearest: ["aurelia", "mirzz"], draft: true },
  { slug: "landing-conversione", key: "landing", family: "siti-web", sectors: OVUNQUE, nearest: ["mirzz", "brasilena"], draft: true },
  { slug: "sito-portfolio-professionisti", key: "portfolioPro", family: "siti-web", sectors: ["servizi-professionali", "studi-creativi"], nearest: ["fotografo", "aurelia"], draft: true },
  { slug: "microsito-lancio", key: "microsito", family: "siti-web", sectors: ["commercio-prodotto", "eventi"], nearest: ["ferrari-f8-tributo", "mirzz"], draft: true },
  { slug: "esperienze-web-3d", key: "web3d", family: "siti-web", sectors: ["commercio-prodotto", "trasversale"], nearest: ["vespa-heritage", "aurelia", "ferrari-f8-tributo"], draft: true },
  { slug: "configuratore-3d", key: "config3d", family: "siti-web", sectors: ["commercio-prodotto", "manifattura"], nearest: ["aurelia", "ferrari-f8-tributo"], draft: true },
  { slug: "design-system-ui-kit", key: "designSystem", family: "marchio", sectors: OVUNQUE, nearest: ["aurelia", "yoga"], draft: true },
];

/** Quelle che il sito mostra davvero. Tutto il resto del file parte da qui. */
export const SOLUTIONS: Solution[] = ALL_SOLUTIONS.filter((s) => !s.draft);

/** Le registrate ma non ancora scritte. Serve al test che conta il lavoro fatto. */
export const DRAFTS: Solution[] = ALL_SOLUTIONS.filter((s) => s.draft);

export function solutionsBySector(id: SectorId): Solution[] {
  return SOLUTIONS.filter((s) => s.sectors.includes(id));
}

/**
 * I settori che hanno almeno una soluzione pubblicata.
 *
 * SECTORS elenca la tassonomia intera, comprese le caselle che si riempiranno
 * quando il copy dei gestionali sara' scritto. Una pagina settore vuota e'
 * esattamente la pagina sottile che questa sezione e' nata per non fare, quindi
 * rotte, sitemap e filtri leggono da qui e non da SECTORS.
 */
export const LIVE_SECTORS: Sector[] = SECTORS.filter(
  (s) => solutionsBySector(s.id).length > 0,
);

export function getSolution(slug: string): Solution | undefined {
  return SOLUTIONS.find((s) => s.slug === slug);
}

export function getSector(slug: string): Sector | undefined {
  return LIVE_SECTORS.find((s) => s.slug === slug);
}

/** Le famiglie con almeno una soluzione pubblicata, per le pastiglie dell'hub. */
export const LIVE_FAMILIES: Family[] = FAMILIES.filter((f) =>
  SOLUTIONS.some((s) => s.family === f),
);

/** Quattro famiglie sono discipline del sito e hanno gia' la loro etichetta
 *  tradotta; `software` no, perche' non ha ancora una pagina in /servizi. */
export function familyLabelKey(f: Family): string {
  return f === "software" ? "fam.software.label" : `disc.${f}.label`;
}

export function solutionsByFamily(f: Family): Solution[] {
  return SOLUTIONS.filter((s) => s.family === f);
}

/** true quando la soluzione ha una demo che la mostra davvero. */
export function isDemonstrated(s: Solution): boolean {
  return Boolean(s.proof?.length);
}

/** I lavori da mostrare, e se sono la cosa stessa o solo la piu' vicina.
 *  Gli slug sconosciuti cadono invece di rompere la pagina; il test li prende
 *  prima che arrivino in produzione. */
export function solutionProof(s: Solution): { items: Project[]; nearest: boolean } {
  const slugs = s.proof?.length ? s.proof : (s.nearest ?? []);
  const items = slugs
    .map((slug) => PROJECTS.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p) && !p!.hidden);
  return { items, nearest: !s.proof?.length };
}

/** Tutti i lavori che fanno da prova a un settore, senza ripetizioni. */
export function sectorProof(id: SectorId): Project[] {
  const seen = new Set<string>();
  const out: Project[] = [];
  for (const s of solutionsBySector(id)) {
    for (const p of solutionProof(s).items) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push(p);
    }
  }
  return out;
}

/** Le altre soluzioni che toccano gli stessi settori, per il piede della pagina.
 *  Ordinate per quanti settori condividono, cosi' "altre soluzioni" propone
 *  prima quelle davvero vicine e non la prima della lista. */
export function relatedSolutions(s: Solution, limit = 3): Solution[] {
  return SOLUTIONS.filter((o) => o.slug !== s.slug)
    .map((o) => ({ o, shared: o.sectors.filter((x) => s.sectors.includes(x)).length }))
    .filter((x) => x.shared > 0)
    .sort((a, b) => b.shared - a.shared)
    .slice(0, limit)
    .map((x) => x.o);
}
