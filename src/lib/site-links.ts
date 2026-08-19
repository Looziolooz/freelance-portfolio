import { DISCIPLINES } from "./disciplines";

// The four service pages, in one place because two footers link to them.
//
// Measured against a production build before this existed:
// `/servizi/claude-cowork` was linked from ZERO pages while sitting in the
// sitemap, and the other three were reachable only from the homepage bento. A
// page in the sitemap that nothing links to is the textbook orphan — crawlers
// deprioritise it and it inherits no internal authority — and these four are
// the commercial core of the site.
//
// I nomi ora vengono dalla tassonomia e seguono la lingua del visitatore,
// perche le pagine servizio non sono piu italiane a codice fisso.
export const SERVICE_LINKS: { href: string; labelKey: string }[] = DISCIPLINES.map(
  (d) => ({ href: "/servizi/" + d.slug, labelKey: d.key + ".label" }),
);
