// Skill level for a piece of content — sets honest expectations so a total
// beginner doesn't assume every solution is one-click. Three levels:
//   base       — anyone can follow, no prior knowledge
//   intermedio — needs some basic knowledge
//   avanzato   — "del mestiere": for people with technical experience
//
// Kept in code (not the DB) to avoid a live migration; extend the maps below.

import type { Lang } from "@/i18n";

// Labels and blurbs are localised IT/EN/SV; colours are language-independent.
type Localized = Record<Lang, string>;

export type LevelKey = "base" | "intermedio" | "avanzato";

export const LEVELS: Record<
  LevelKey,
  { label: Localized; blurb: Localized; bg: string; fg: string }
> = {
  base: {
    label: { it: "Principiante", en: "Beginner", sv: "Nybörjare" },
    blurb: {
      it: "Adatto a chi parte da zero.",
      en: "Great if you're starting from scratch.",
      sv: "Perfekt om du börjar från noll.",
    },
    bg: "var(--accent-green)",
    fg: "var(--btn-ink)",
  },
  intermedio: {
    label: { it: "Intermedio", en: "Intermediate", sv: "Medel" },
    blurb: {
      it: "Serve una conoscenza di base.",
      en: "Some basic knowledge needed.",
      sv: "Kräver viss grundkunskap.",
    },
    bg: "var(--accent-peach-deep)",
    fg: "var(--btn-ink)",
  },
  avanzato: {
    label: { it: "Del mestiere", en: "Advanced", sv: "Avancerad" },
    blurb: {
      it: "Per chi ha esperienza tecnica.",
      en: "For people with technical experience.",
      sv: "För dig med teknisk erfarenhet.",
    },
    bg: "var(--ink-body)",
    fg: "var(--canvas-page)",
  },
};

export const LEVEL_ORDER: LevelKey[] = ["base", "intermedio", "avanzato"];

// Programming knowledge a piece of content assumes — a second, orthogonal axis
// to the difficulty level above (an API tutorial is "avanzato" AND needs real
// coding, while a Cowork lesson is "base" and needs no code at all).
export type ProgKey = "none" | "base" | "intermedia";

export const PROG: Record<
  ProgKey,
  { label: Localized; blurb: Localized; bg: string; fg: string }
> = {
  none: {
    label: { it: "Senza codice", en: "No code", sv: "Ingen kod" },
    blurb: {
      it: "Nessuna conoscenza di programmazione richiesta.",
      en: "No coding knowledge required.",
      sv: "Inga programmeringskunskaper krävs.",
    },
    bg: "var(--canvas-page)",
    fg: "var(--ink-body)",
  },
  base: {
    label: { it: "Codice base", en: "Basic code", sv: "Grundkod" },
    blurb: {
      it: "Serve dimestichezza base con editor e riga di comando.",
      en: "A little comfort with an editor and command line helps.",
      sv: "Viss vana vid en editor och kommandoraden behövs.",
    },
    bg: "var(--accent-peach-deep)",
    fg: "var(--btn-ink)",
  },
  intermedia: {
    label: { it: "Codice intermedio", en: "Intermediate code", sv: "Kod på medelnivå" },
    blurb: {
      it: "Serve saper leggere e scrivere codice.",
      en: "You'll need to read and write code.",
      sv: "Du behöver kunna läsa och skriva kod.",
    },
    bg: "var(--ink-body)",
    fg: "var(--canvas-page)",
  },
};

// Difficulty + programming knowledge per "... da zero" course pack. Applies to
// every article and guide whose slug starts with the pack prefix
// ("<pack>-..." or "guida-<pack>-...").
const PACK_LEVELS: Record<string, { level: LevelKey; prog: ProgKey }> = {
  "claude-da-zero": { level: "base", prog: "none" },
  "claude-cowork-da-zero": { level: "base", prog: "none" },
  "claude-code-da-zero": { level: "intermedio", prog: "base" },
  "claude-api-da-zero": { level: "avanzato", prog: "intermedia" },
  // Front-end build tutorials and coding-agent guides: for experienced devs.
  "frontend-effetti": { level: "avanzato", prog: "intermedia" },
  "ponytail": { level: "avanzato", prog: "intermedia" },
  // Lead-magnet blog for micro-businesses: beginner, no code required.
  "pmi": { level: "base", prog: "none" },
  // AI-tool reviews + how-to guides (Descript, OpusClip, ElevenLabs, SayWhat,
  // OpenCut…): for non-technical creators, no code required.
  "strumenti-ai": { level: "base", prog: "none" },
  // Developer-focused AI tooling (LLM observability/evals, agent frameworks…):
  // "del mestiere", assumes real coding.
  "dev-ai": { level: "avanzato", prog: "intermedia" },
};

function packOf(slug: string): string | null {
  const s = slug.replace(/^guida-/, "");
  for (const pack of Object.keys(PACK_LEVELS)) {
    if (s === pack || s.startsWith(pack + "-")) return pack;
  }
  return null;
}

/** Programming knowledge a piece of content assumes (course packs only). */
export function programmingForContent(slug: string): ProgKey | null {
  const pack = packOf(slug);
  return pack ? PACK_LEVELS[pack].prog : null;
}

// Difficulty per Claude connector (applies to both its free article and its
// paid guide, since the topic is the same).
const CONNECTOR_LEVELS: Record<string, LevelKey> = {
  wordpress: "base",
  "google-drive": "base",
  canva: "base",
  figma: "intermedio",
  adobe: "intermedio",
  exa: "intermedio",
  "magic-patterns": "intermedio",
  sketchup: "intermedio",
  supabase: "avanzato",
  sentry: "avanzato",
  sanity: "avanzato",
  threejs: "avanzato",
};

/** Resolve a content's level from its slug, falling back to a per-category default. */
export function levelForContent(slug: string, category: string): LevelKey | null {
  const pack = packOf(slug);
  if (pack) return PACK_LEVELS[pack].level;

  const connector = slug
    .replace(/^guida-connettore-/, "")
    .replace(/^connettore-/, "");
  if (CONNECTOR_LEVELS[connector]) return CONNECTOR_LEVELS[connector];

  switch (category) {
    case "prompts":
      return "base";
    case "tutorials":
    case "guide":
      return "avanzato";
    case "blog":
      return "intermedio";
    default:
      return null; // projects and anything else: no level badge
  }
}
