// Per-project "explore the demo" guides, shown on /work/[slug] next to the live,
// navigable demo: what to discover inside each site, plus admin-panel access where
// the project has a back office. Content is Italian-first (like the brand taglines);
// EN/SV can be mirrored later. `admin` is filled only with real demo credentials —
// projects flagged `adminPending` have a back office but await access details.

export type ProjectAdmin = {
  /** Full URL or path to the admin/login (e.g. the deploy + "/admin"). */
  url?: string;
  user?: string;
  pass?: string;
  /** Short note on what the admin panel controls. */
  note?: string;
};

export type ProjectGuide = {
  /** What a visitor can discover by clicking around the live demo. */
  highlights: string[];
  /** Admin/back-office access, when available and provided. */
  admin?: ProjectAdmin;
  /** True when the project has an admin panel but credentials aren't wired yet. */
  adminPending?: boolean;
};

export const GUIDES: Record<string, ProjectGuide> = {
  fotografo: {
    highlights: [
      "Gallerie di matrimoni reali tra Toscana e Costiera",
      "Sito multilingua con richiesta preventivo",
      "Racconto visivo dello studio e dello stile",
    ],
  },
  "real-estate": {
    highlights: [
      "Catalogo immobili con ricerca e filtri",
      "Schede proprietà dettagliate",
      "Esperienza trilingue (IT / EN / SV)",
    ],
  },
  aurelia: {
    highlights: [
      "Configuratore 3D della macchina espresso",
      "Varianti colore in tempo reale",
      "Landing premium orientata al prodotto",
    ],
  },
  "vespa-heritage": {
    highlights: [
      "Sequenza su canvas guidata dallo scroll",
      "Lo sfondo si tinge del colore di ogni fotogramma",
      "Racconto heritage della Vespa Primavera 1968",
    ],
  },
  bellitalia: {
    highlights: [
      "Carosello hero a tutto schermo con 8 destinazioni",
      "Cartoline polaroid che si spargono allo scroll",
      "Griglia di tradizioni e sapori che zooma",
    ],
  },
  "bella-calabria": {
    highlights: [
      "Listing alloggi con ricerca e filtri",
      "Prenotazione in stile Airbnb",
      "Ricerca voli, offerte e homepage animata (GSAP + Lenis)",
      "Dashboard admin per alloggi, prenotazioni e offerte",
    ],
    adminPending: true,
  },
  barberia: {
    highlights: [
      "Prenotazione online dell'appuntamento",
      "Listino servizi e galleria tagli",
      "Pannello admin per gestire l'agenda",
    ],
    adminPending: true,
  },
  gelateria: {
    highlights: [
      "Hero a carosello e racconto di processo e ingredienti",
      "Prenotazione del ritiro online",
      "Tre botteghe (Cosenza, Catanzaro, Lamezia), bilingue IT/EN",
      "Pannello gestionale",
    ],
    adminPending: true,
  },
  "ai-visibility": {
    highlights: [
      "Indice AVI 0–100 della visibilità nelle risposte AI",
      "Monitoraggio prompt e analisi competitor",
      "Audit AEO/GEO e heatmap del sentiment",
    ],
  },
  "pizzeria-restaurant": {
    highlights: [
      "Menu digitale e ordini online",
      "Prenotazione tavoli",
      "Pannello admin per ordini, prenotazioni e menu",
    ],
    adminPending: true,
  },
  brasilena: {
    highlights: [
      "Hero animato e storia del marchio dal 1930",
      "Catalogo bibite",
      "Presenza brand per un prodotto storico calabrese",
    ],
  },
};

export function getGuide(slug: string): ProjectGuide | undefined {
  return GUIDES[slug];
}
