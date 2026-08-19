import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/launch";
import { PROJECTS } from "@/lib/projects";
import { DISCIPLINES } from "@/lib/disciplines";

// Only the public (launched) surfaces. The hidden pre-launch routes are left out
// on purpose; add them back when their section goes live.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/work", "/processo", "/prezzi", "/agents", "/contatti", "/servizi/siti-web", "/servizi/automazioni", "/servizi/agenti-ai", "/servizi/claude-cowork", "/privacy", "/cookie"];

  // The five discipline pages sit between /work and the projects: they are the
  // pages that say what each kind of work IS, so they are worth indexing on
  // their own rather than being reachable only through the nav.
  const disciplineRoutes = DISCIPLINES.map((d) => `/work/${d.slug}`);

  const projectRoutes = PROJECTS.filter((p) => p.featured && !p.hidden).map(
    (p) => `/work/${p.slug}`,
  );

  const lastModified = new Date();
  return [...staticRoutes, ...disciplineRoutes, ...projectRoutes].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path.startsWith("/privacy") || path.startsWith("/cookie") ? "yearly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
