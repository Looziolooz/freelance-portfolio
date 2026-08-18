// The four service pages, in one place because two footers link to them.
//
// Measured against a production build before this existed:
// `/servizi/claude-cowork` was linked from ZERO pages while sitting in the
// sitemap, and the other three were reachable only from the homepage bento. A
// page in the sitemap that nothing links to is the textbook orphan — crawlers
// deprioritise it and it inherits no internal authority — and these four are
// the commercial core of the site.
//
// Labels stay Italian because the pages are Italian-only on purpose: they are
// the crawlable surface for "sito web ristorante" class queries. Only the group
// heading above them is translated, so the framing follows the visitor while
// the destinations are named as what they are.
export const SERVICE_LINKS: { href: string; label: string }[] = [
  { href: "/servizi/siti-web", label: "Siti web" },
  { href: "/servizi/automazioni", label: "Automazioni" },
  { href: "/servizi/agenti-ai", label: "Agenti AI" },
  { href: "/servizi/claude-cowork", label: "Claude Cowork" },
];
