import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";
import { SOLUTIONS } from "@/lib/solutions";
import { dict } from "@/i18n";

// Metadata e dati strutturati restano server-side: l'hub e' client component
// perche' i filtri vivono nella query string e la lingua in localStorage, ma
// quello che leggono i crawler non passa da React.
export const metadata: Metadata = {
  title: "Soluzioni per settore",
  description:
    "Diciassette lavori concreti per ristoranti, bar, produttori, studi, saloni, turismo e marchi di prodotto. Ognuno con una demo aperta e navigabile.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/soluzioni#page`,
  name: "Soluzioni per settore",
  url: `${SITE_URL}/soluzioni`,
  inLanguage: "it",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#org` },
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: SOLUTIONS.length,
    itemListElement: SOLUTIONS.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: dict.it[`sol.${s.key}.title`] ?? s.slug,
      url: `${SITE_URL}/soluzioni/${s.slug}`,
    })),
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
