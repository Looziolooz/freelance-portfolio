import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/launch";
import { PROJECTS } from "@/lib/projects";

// Only the public (launched) surfaces. The hidden pre-launch routes are left out
// on purpose; add them back when their section goes live.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/processo", "/agents", "/contatti", "/privacy", "/cookie"];

  const projectRoutes = PROJECTS.filter((p) => p.featured && !p.hidden).map(
    (p) => `/work/${p.slug}`,
  );

  return [...staticRoutes, ...projectRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
