import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";
import { PROJECTS } from "@/lib/projects";
import { dict } from "@/i18n";

// Route-level metadata: the page itself is a client component, so title,
// description and the CollectionPage JSON-LD live here (SEO audit — every
// route used to ship the identical root title).
export const metadata: Metadata = {
  // Re-declare the template: children ([slug]) resolve against the NEAREST
  // parent template, and without this the project pages rendered bare titles.
  title: { default: "Progetti e demo", template: "%s — LOoz.design" },
  description:
    "Siti dimostrativi con demo navigabili: ristorazione, benessere, e-commerce e brand identity. Lo stile e il metodo dello studio, progetto per progetto.",
};

const VISIBLE = PROJECTS.filter((p) => p.featured && !p.hidden);

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/work#page`,
  url: `${SITE_URL}/work`,
  name: "Progetti e demo — LOoz.design",
  description:
    "Siti dimostrativi e progetti concept che mostrano stile e metodo di lavoro dello studio.",
  inLanguage: "it",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: VISIBLE.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE_URL}/work/${p.slug}`,
      name: dict.it[`work.proj.${p.key}`] ?? p.slug,
    })),
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
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
