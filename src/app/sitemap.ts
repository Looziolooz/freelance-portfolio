import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/launch";
import { PROJECTS } from "@/lib/projects";
import { DISCIPLINES } from "@/lib/disciplines";
import { LIVE_SECTORS, SOLUTIONS } from "@/lib/solutions";

// Only the public (launched) surfaces. The hidden pre-launch routes are left out
// on purpose; add them back when their section goes live.
export default function sitemap(): MetadataRoute.Sitemap {
  // Le quattro pagine servizio arrivano dalla tassonomia, cosi' una disciplina
  // nuova entra nel sitemap insieme al menu invece che con un commit dopo.
  const staticRoutes = [
    "", "/work", "/work/fascicoli", "/processo", "/prezzi", "/agents", "/contatti",
    "/soluzioni", "/chi-sono", "/privacy", "/cookie",
  ];

  const disciplineRoutes = DISCIPLINES.map((d) => `/servizi/${d.slug}`);

  // Il catalogo e' la superficie che porta la coda lunga: sono le pagine per cui
  // esiste una ricerca ("sito per ristorante con prenotazione") e vanno tutte
  // dichiarate, comprese quelle per settore, che sono pagine vere e non filtri.
  const solutionRoutes = SOLUTIONS.map((s) => `/soluzioni/${s.slug}`);
  const sectorRoutes = LIVE_SECTORS.map((s) => `/soluzioni/settore/${s.slug}`);

  const projectRoutes = PROJECTS.filter((p) => p.featured && !p.hidden).map(
    (p) => `/work/${p.slug}`,
  );

  const lastModified = new Date();
  return [
    ...staticRoutes,
    ...disciplineRoutes,
    ...solutionRoutes,
    ...sectorRoutes,
    ...projectRoutes,
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path.startsWith("/privacy") || path.startsWith("/cookie") ? "yearly" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
