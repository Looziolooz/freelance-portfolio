import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/launch";
import { getSector, solutionsBySector } from "@/lib/solutions";
import { dict } from "@/i18n";

type Params = { params: Promise<{ sector: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { sector } = await params;
  const s = getSector(sector);
  if (!s) return {};
  const label = dict.it[`sec.${s.id}.label`] ?? sector;
  // La descrizione prende il primo capoverso dell'introduzione scritta a mano:
  // e' gia' la frase che spiega il settore, e riscriverla qui la farebbe
  // divergere dalla pagina alla prima modifica.
  const intro = (dict.it[`sec.${s.id}.intro`] ?? "").split("|")[0];
  return {
    title: `Soluzioni per ${label.toLowerCase()}`,
    description: intro.slice(0, 300),
  };
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode } & Params) {
  const { sector } = await params;
  const s = getSector(sector);
  if (!s) notFound();

  const label = dict.it[`sec.${s.id}.label`] ?? sector;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Soluzioni", item: `${SITE_URL}/soluzioni` },
        { "@type": "ListItem", position: 3, name: label },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${SITE_URL}/soluzioni/settore/${s.slug}#page`,
      name: `Soluzioni per ${label.toLowerCase()}`,
      url: `${SITE_URL}/soluzioni/settore/${s.slug}`,
      inLanguage: "it",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: solutionsBySector(s.id).map((sol, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: dict.it[`sol.${sol.key}.title`] ?? sol.slug,
          url: `${SITE_URL}/soluzioni/${sol.slug}`,
        })),
      },
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
