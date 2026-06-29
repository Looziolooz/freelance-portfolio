// Per-project brand identity kits, shown on the project detail pages (/work/[slug])
// and rendered as a print-ready brand sheet (/work/[slug]/brand-sheet). Each kit is
// a self-contained identity for that client: a monogram, a full colour palette with
// roles, a type direction, and stationery. Colours are scoped to the BrandKit
// section via CSS variables, so the rest of the site keeps its own palette.
//
// Fonts use widely-available stacks (plus the site faces) so each brand reads
// distinct with zero extra webfont loads.

export type BrandRole = "primary" | "secondary" | "accent" | "paper" | "ink";

export type BrandColor = {
  name: string;
  hex: string;
  role: BrandRole;
  /** Legible text colour on this swatch. */
  on: string;
};

export type BrandShape = "circle" | "square" | "ring" | "shield";
export type BrandMotif =
  | "sun" | "laurel" | "scooter" | "boot" | "razor"
  | "cone" | "signal" | "wave" | "flame" | "leaf" | "none";

export type BrandKit = {
  slug: string;
  /** Brand name (matches the project title shown on the detail page). */
  name: string;
  monogram: string;
  tagline: string;
  domain: string;
  shape: BrandShape;
  motif: BrandMotif;
  /** CSS font-family for the wordmark / monogram / display. */
  display: string;
  /** CSS font-family for body / captions. */
  body: string;
  /** Wordmark tracking (letter-spacing). */
  tracking: string;
  paper: string;
  ink: string;
  primary: string;
  accent: string;
  palette: BrandColor[];
};

const SANS = "var(--font-ui), system-ui, sans-serif";

export const BRAND_KITS: Record<string, BrandKit> = {
  fotografo: {
    slug: "fotografo",
    name: "Atelier Solari",
    monogram: "AS",
    tagline: "Matrimoni d'autore, luce e tempo.",
    domain: "ateliersolari.it",
    shape: "ring",
    motif: "sun",
    display: '"Didot", "Bodoni MT", "Playfair Display", Georgia, serif',
    body: '"Iowan Old Style", Georgia, serif',
    tracking: "0.22em",
    paper: "#F7EFE6",
    ink: "#2A1A1F",
    primary: "#6E2433",
    accent: "#C8A24B",
    palette: [
      { name: "Bordeaux", hex: "#6E2433", role: "primary", on: "#F7EFE6" },
      { name: "Terracotta", hex: "#C96F4A", role: "secondary", on: "#2A1A1F" },
      { name: "Oro foglia", hex: "#C8A24B", role: "accent", on: "#2A1A1F" },
      { name: "Avorio", hex: "#F7EFE6", role: "paper", on: "#2A1A1F" },
      { name: "Bruno", hex: "#2A1A1F", role: "ink", on: "#F7EFE6" },
    ],
  },

  "real-estate": {
    slug: "real-estate",
    name: "Nordhem",
    monogram: "N",
    tagline: "Nordic homes, quiet luxury.",
    domain: "nordhem.se",
    shape: "square",
    motif: "none",
    display: '"Futura", "Century Gothic", "Trebuchet MS", sans-serif',
    body: SANS,
    tracking: "0.28em",
    paper: "#EEF2F2",
    ink: "#1A2630",
    primary: "#1F3A4D",
    accent: "#B58A5E",
    palette: [
      { name: "Fjord", hex: "#1F3A4D", role: "primary", on: "#EEF2F2" },
      { name: "Slate", hex: "#5E7C8C", role: "secondary", on: "#FFFFFF" },
      { name: "Oak", hex: "#B58A5E", role: "accent", on: "#1A2630" },
      { name: "Frost", hex: "#EEF2F2", role: "paper", on: "#1A2630" },
      { name: "Charcoal", hex: "#1A2630", role: "ink", on: "#EEF2F2" },
    ],
  },

  aurelia: {
    slug: "aurelia",
    name: "Aurelia Pro X1",
    monogram: "A",
    tagline: "L'espresso, perfezionato.",
    domain: "aurelia.coffee",
    shape: "circle",
    motif: "laurel",
    display: '"Baskerville Old Face", "Baskerville", Georgia, serif',
    body: SANS,
    tracking: "0.3em",
    paper: "#F2E7D8",
    ink: "#1C120B",
    primary: "#3A2317",
    accent: "#B5703A",
    palette: [
      { name: "Espresso", hex: "#3A2317", role: "primary", on: "#F2E7D8" },
      { name: "Crema", hex: "#E7CFA8", role: "secondary", on: "#1C120B" },
      { name: "Rame", hex: "#B5703A", role: "accent", on: "#1C120B" },
      { name: "Panna", hex: "#F2E7D8", role: "paper", on: "#1C120B" },
      { name: "Tostato", hex: "#1C120B", role: "ink", on: "#F2E7D8" },
    ],
  },

  "vespa-heritage": {
    slug: "vespa-heritage",
    name: "Vespa Heritage",
    monogram: "VH",
    tagline: "1968, in movimento.",
    domain: "vespaheritage.it",
    shape: "shield",
    motif: "scooter",
    display: '"Futura", "Gill Sans", "Trebuchet MS", sans-serif',
    body: SANS,
    tracking: "0.2em",
    paper: "#EFE7D6",
    ink: "#1B2A2E",
    primary: "#6FA8B8",
    accent: "#C24A3A",
    palette: [
      { name: "Cielo vintage", hex: "#6FA8B8", role: "primary", on: "#1B2A2E" },
      { name: "Cromo", hex: "#9AA3A6", role: "secondary", on: "#1B2A2E" },
      { name: "Rosso", hex: "#C24A3A", role: "accent", on: "#EFE7D6" },
      { name: "Crema", hex: "#EFE7D6", role: "paper", on: "#1B2A2E" },
      { name: "Notte", hex: "#1B2A2E", role: "ink", on: "#EFE7D6" },
    ],
  },

  bellitalia: {
    slug: "bellitalia",
    name: "Bell'Italia",
    monogram: "BI",
    tagline: "Il bello dell'Italia, una cartolina.",
    domain: "bellitalia.travel",
    shape: "circle",
    motif: "boot",
    display: '"Palatino Linotype", Palatino, Georgia, serif',
    body: SANS,
    tracking: "0.18em",
    paper: "#F6EFDF",
    ink: "#23303A",
    primary: "#1E6E8C",
    accent: "#C96B3F",
    palette: [
      { name: "Adriatico", hex: "#1E6E8C", role: "primary", on: "#F6EFDF" },
      { name: "Oliva", hex: "#7C7A3A", role: "secondary", on: "#F6EFDF" },
      { name: "Terracotta", hex: "#C96B3F", role: "accent", on: "#F6EFDF" },
      { name: "Sabbia", hex: "#F6EFDF", role: "paper", on: "#23303A" },
      { name: "Mare", hex: "#23303A", role: "ink", on: "#F6EFDF" },
    ],
  },

  "bella-calabria": {
    slug: "bella-calabria",
    name: "Bella Calabria",
    monogram: "BC",
    tagline: "Sole, mare, ospitalità.",
    domain: "bellacalabria.it",
    shape: "circle",
    motif: "sun",
    display: "var(--font-display), Georgia, serif",
    body: SANS,
    tracking: "0.16em",
    paper: "#FBF3E2",
    ink: "#2A2018",
    primary: "#1C6E9C",
    accent: "#C53A2B",
    palette: [
      { name: "Tirreno", hex: "#1C6E9C", role: "primary", on: "#FBF3E2" },
      { name: "Oro sole", hex: "#E0A12E", role: "secondary", on: "#2A2018" },
      { name: "Peperoncino", hex: "#C53A2B", role: "accent", on: "#FBF3E2" },
      { name: "Sabbia", hex: "#FBF3E2", role: "paper", on: "#2A2018" },
      { name: "Inchiostro", hex: "#2A2018", role: "ink", on: "#FBF3E2" },
    ],
  },

  barberia: {
    slug: "barberia",
    name: "Barberia",
    monogram: "B",
    tagline: "Taglio, rasatura, rituale.",
    domain: "barberia.studio",
    shape: "shield",
    motif: "razor",
    display: '"Copperplate", "Big Caslon", Georgia, serif',
    body: SANS,
    tracking: "0.26em",
    paper: "#EFE6D2",
    ink: "#161311",
    primary: "#1E4D4A",
    accent: "#A9794B",
    palette: [
      { name: "Petrolio", hex: "#1E4D4A", role: "primary", on: "#EFE6D2" },
      { name: "Ottone", hex: "#C2A24A", role: "secondary", on: "#161311" },
      { name: "Cuoio", hex: "#A9794B", role: "accent", on: "#161311" },
      { name: "Crema", hex: "#EFE6D2", role: "paper", on: "#161311" },
      { name: "Carbone", hex: "#161311", role: "ink", on: "#EFE6D2" },
    ],
  },

  gelateria: {
    slug: "gelateria",
    name: "Artigiano Gelateria",
    monogram: "AG",
    tagline: "Gelato artigianale dal 1978.",
    domain: "artigianogelateria.it",
    shape: "circle",
    motif: "cone",
    display: '"Trebuchet MS", var(--font-ui), sans-serif',
    body: SANS,
    tracking: "0.14em",
    paper: "#FBF4E6",
    ink: "#2A2A20",
    primary: "#8FB36A",
    accent: "#E0708A",
    palette: [
      { name: "Pistacchio", hex: "#8FB36A", role: "primary", on: "#2A2A20" },
      { name: "Cacao", hex: "#5A3A2A", role: "secondary", on: "#FBF4E6" },
      { name: "Fragola", hex: "#E0708A", role: "accent", on: "#2A2A20" },
      { name: "Panna", hex: "#FBF4E6", role: "paper", on: "#2A2A20" },
      { name: "Inchiostro", hex: "#2A2A20", role: "ink", on: "#FBF4E6" },
    ],
  },

  "ai-visibility": {
    slug: "ai-visibility",
    name: "AI Visibility",
    monogram: "AI",
    tagline: "Be found by the machines.",
    domain: "aivisibility.io",
    shape: "square",
    motif: "signal",
    display: "var(--font-mono), \"Courier New\", monospace",
    body: SANS,
    tracking: "0.32em",
    paper: "#EDEBFF",
    ink: "#0E0D1A",
    primary: "#1B1A2E",
    accent: "#6C4CF1",
    palette: [
      { name: "Indigo", hex: "#1B1A2E", role: "primary", on: "#EDEBFF" },
      { name: "Cyan", hex: "#3CC8D8", role: "secondary", on: "#0E0D1A" },
      { name: "Violet", hex: "#6C4CF1", role: "accent", on: "#EDEBFF" },
      { name: "Mist", hex: "#EDEBFF", role: "paper", on: "#0E0D1A" },
      { name: "Void", hex: "#0E0D1A", role: "ink", on: "#EDEBFF" },
    ],
  },

  "pizzeria-restaurant": {
    slug: "pizzeria-restaurant",
    name: "Pizzeria Restaurant",
    monogram: "P",
    tagline: "Impasto, forno, tradizione.",
    domain: "pizzeria.it",
    shape: "circle",
    motif: "flame",
    display: '"Rockwell", "Courier New", Georgia, serif',
    body: SANS,
    tracking: "0.18em",
    paper: "#F7EBD6",
    ink: "#2A1C14",
    primary: "#C0392B",
    accent: "#D69A4C",
    palette: [
      { name: "Pomodoro", hex: "#C0392B", role: "primary", on: "#F7EBD6" },
      { name: "Basilico", hex: "#4C7A34", role: "secondary", on: "#F7EBD6" },
      { name: "Crosta", hex: "#D69A4C", role: "accent", on: "#2A1C14" },
      { name: "Mozzarella", hex: "#F7EBD6", role: "paper", on: "#2A1C14" },
      { name: "Forno", hex: "#2A1C14", role: "ink", on: "#F7EBD6" },
    ],
  },

  brasilena: {
    slug: "brasilena",
    name: "Brasilena",
    monogram: "B",
    tagline: "La gassosa al caffè, dal 1930.",
    domain: "brasilena.it",
    shape: "circle",
    motif: "leaf",
    display: "var(--font-display), Georgia, serif",
    body: SANS,
    tracking: "0.2em",
    paper: "#FFF6DD",
    ink: "#241A0B",
    primary: "#FFD21E",
    accent: "#3E7A4E",
    palette: [
      { name: "Giallo", hex: "#FFD21E", role: "primary", on: "#241A0B" },
      { name: "Caffè", hex: "#5A3A22", role: "secondary", on: "#FFF6DD" },
      { name: "Foglia", hex: "#3E7A4E", role: "accent", on: "#FFF6DD" },
      { name: "Crema", hex: "#FFF6DD", role: "paper", on: "#241A0B" },
      { name: "Inchiostro", hex: "#241A0B", role: "ink", on: "#FFF6DD" },
    ],
  },
};

export function getBrandKit(slug: string): BrandKit | undefined {
  return BRAND_KITS[slug];
}
