import type { MetadataRoute } from "next";
import { HIDDEN_ROUTES, SITE_URL, isPreLaunch } from "@/lib/launch";

// Keep private/API and the pre-launch surfaces out of search; point crawlers at
// the sitemap. Reveal a hidden section later by flipping LAUNCH_MODE in launch.ts.
//
// AI crawlers (GPTBot, ClaudeBot, Perplexity, Google-Extended, CCBot) get their
// own explicit allow groups: this portfolio WANTS to be read and cited by AI
// assistants — the rules document that intent so a future "block bots" refactor
// can't silently kill AI visibility. They share the same disallow list as *.
const DISALLOW = () => ["/api/", ...(isPreLaunch ? [...HIDDEN_ROUTES] : [])];

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW() },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/", disallow: DISALLOW() })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
