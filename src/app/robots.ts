import type { MetadataRoute } from "next";
import { HIDDEN_ROUTES, SITE_URL, isPreLaunch } from "@/lib/launch";

// Keep private/API and the pre-launch surfaces out of search; point crawlers at
// the sitemap. Reveal a hidden section later by flipping LAUNCH_MODE in launch.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", ...(isPreLaunch ? [...HIDDEN_ROUTES] : [])],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
