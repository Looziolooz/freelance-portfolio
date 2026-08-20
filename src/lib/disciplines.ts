import { PROJECTS, type Project } from "./projects";
import { getBrandKit } from "./brand-kits";

// LA tassonomia del sito. Una sola, quattro parole, usata ovunque.
//
// Prima ce n'erano sei, tutte diverse: la lista sotto la hero (4), il bento
// della home (6), le collaborazioni (3), le schede di /prezzi (6), la
// biforcazione di /processo (4) e la directory del footer (4). Nessuna
// coincideva con un'altra, "Marchio" compariva in quattro elenchi senza avere
// una pagina che lo vendesse, e "Claude Cowork" esisteva in un elenco solo. Un
// lettore che scorreva la home incontrava quattro discipline e poco più sotto
// sei servizi che non erano quelle quattro.
//
// Ora ogni superficie legge da qui. Aggiungere una disciplina la fa comparire
// nel menu, nella lista sotto la hero, nella biforcazione del processo e nel
// footer insieme.
//
// Le pagine-disciplina sotto /work sono state fuse dentro le pagine servizio:
// vendere e mostrare erano due metà della stessa pagina, e tenerle separate
// costava al lettore un clic per arrivare alla prova. /work resta l'archivio
// unico, /work/fascicoli l'archivio dei manuali di marca.

export type DisciplineId = "marchio" | "siti-web" | "automazioni-ai" | "visibilita";

export type Discipline = {
  id: DisciplineId;
  /** Segmento sotto /servizi. È anche l'URL della pagina che vende. */
  slug: string;
  /** Prefisso i18n: disc.<id>.label / .title / .sub */
  key: string;
  /**
   * Quali progetti fanno da prova a questa disciplina. Il nome visibile non sta
   * qui: un visitatore italiano legge "Marchio", uno svedese "Varumärke", e
   * solo lo slug resta fermo così gli URL non cambiano con la lingua.
   */
  select: (p: Project) => boolean;
  /**
   * Gli slug da mettere davanti nella griglia della pagina servizio, quando
   * alcuni lavori parlano al pubblico di quella pagina meglio di altri.
   */
  lead?: string[];
  /**
   * Che faccia ha la prova su questa pagina. `gallery` sono le schermate dei
   * lavori; `covers` sono le copertine dei fascicoli di marca.
   *
   * Serve perche' marchio e siti web pescano da bacini che si sovrappongono
   * quasi del tutto: con la stessa griglia le due pagine si leggevano come la
   * stessa pagina, e il lavoro di marca sparisce dietro la schermata di un sito
   * che ne e' solo una conseguenza.
   */
  proof: "gallery" | "covers";
};

const live = (p: Project) => Boolean(p.featured) && !p.hidden;

/** Visibilità: si vende come marketing, si costruisce come automazione. */
const VISIBILITA_SLUGS = ["audit-visibilita", "contenuti-social", "mappa-mercato"];

export const DISCIPLINES: Discipline[] = [
  {
    id: "marchio",
    slug: "marchio",
    key: "disc.marchio",
    // Ogni progetto con un fascicolo di marca. È il corpo di lavoro più ricco
    // del sito ed era l'unica disciplina venduta ovunque senza una pagina.
    select: (p) => live(p) && Boolean(getBrandKit(p.slug)),
    // La prova qui e la copertina del fascicolo, non la schermata di un sito:
    // con la stessa griglia questa pagina e quella dei siti si leggevano come
    // la stessa pagina.
    proof: "covers",
  },
  {
    id: "siti-web",
    slug: "siti-web",
    key: "disc.siti-web",
    proof: "gallery",
    select: (p) => live(p) && p.category === "website",
    // Ristorazione e ospitalità davanti: è il pubblico che questa pagina cerca.
    lead: ["nordbageriet", "sushi", "brado", "gelateria", "pizzeria-restaurant", "aliva"],
  },
  {
    id: "automazioni-ai",
    slug: "automazioni-ai",
    key: "disc.automazioni-ai",
    proof: "gallery",
    // Un solo bacino: le automazioni e gli agenti pescavano già dagli stessi
    // progetti, e due pagine separate erano costrette a citarsi a vicenda.
    select: (p) => live(p) && (p.category === "automazione" || p.category === "ai"),
  },
  {
    id: "visibilita",
    slug: "visibilita",
    key: "disc.visibilita",
    proof: "gallery",
    select: (p) => live(p) && VISIBILITA_SLUGS.includes(p.slug),
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return DISCIPLINES.find((d) => d.slug === slug);
}

/** I progetti della disciplina, con i lead davanti se ne ha. */
export function disciplineProjects(d: Discipline): Project[] {
  const all = PROJECTS.filter(d.select);
  if (!d.lead?.length) return all;
  const rank = (p: Project) => {
    const i = d.lead!.indexOf(p.slug);
    return i === -1 ? d.lead!.length : i;
  };
  return [...all].sort((a, b) => rank(a) - rank(b));
}
