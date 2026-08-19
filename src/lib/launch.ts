// Pre-launch gating.
//
// We go public with the studio's SERVICES first (home, work, process, agents,
// contact) and keep the not-yet-ready surfaces — the blog, the components shop,
// memberships and auth — OUT of the nav, the footer, and search engines. The
// routes still resolve by URL, so revealing them later is a one-line change:
// flip LAUNCH_MODE to "full".
export type LaunchMode = "minimal" | "full";

export const LAUNCH_MODE: LaunchMode = "minimal";

export const isPreLaunch = LAUNCH_MODE === "minimal";

// Route prefixes hidden pre-launch — used to filter nav/footer links and to tell
// crawlers not to index them (src/app/robots.ts).
export const HIDDEN_ROUTES = [
  "/blog",
  "/componenti",
  "/membership",
  "/login",
  "/register",
  "/account",
  "/members-only",
  "/admin",
  // Prototipo del barbiere: nessun percorso del sito ci arriva, la demo che il
  // portfolio mostra punta a un deploy esterno, e i suoi schermi sono in inglese
  // e fuori palette. Restava indicizzabile sul dominio dello studio.
  "/barberia",
] as const;

// Public site origin (used by robots.txt + sitemap). Override per environment.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://looz.design").replace(/\/$/, "");
