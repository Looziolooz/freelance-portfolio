// Skill level for a piece of content — sets honest expectations so a total
// beginner doesn't assume every solution is one-click. Three levels:
//   base       — anyone can follow, no prior knowledge
//   intermedio — needs some basic knowledge
//   avanzato   — "del mestiere": for people with technical experience
//
// Kept in code (not the DB) to avoid a live migration; extend the maps below.

export type LevelKey = "base" | "intermedio" | "avanzato";

export const LEVELS: Record<
  LevelKey,
  { label: string; blurb: string; bg: string; fg: string }
> = {
  base: {
    label: "Principiante",
    blurb: "Adatto a chi parte da zero.",
    bg: "var(--accent-green)",
    fg: "#ffffff",
  },
  intermedio: {
    label: "Intermedio",
    blurb: "Serve una conoscenza di base.",
    bg: "var(--accent-peach-deep)",
    fg: "var(--ink-body)",
  },
  avanzato: {
    label: "Del mestiere",
    blurb: "Per chi ha esperienza tecnica.",
    bg: "var(--ink-body)",
    fg: "var(--canvas-page)",
  },
};

export const LEVEL_ORDER: LevelKey[] = ["base", "intermedio", "avanzato"];

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
