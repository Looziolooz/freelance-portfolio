import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/launch";
import { familyLabelKey, getSolution } from "@/lib/solutions";
import { dict } from "@/i18n";

// Wrapper server della pagina soluzione, con lo stesso lavoro che fa
// /work/[slug]: 404 veri sugli slug inventati, titolo e descrizione per
// soluzione, breadcrumb e Service in JSON-LD.
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) return {};
  return {
    title: dict.it[`sol.${s.key}.title`] ?? slug,
    description: dict.it[`sol.${s.key}.lede`],
  };
}

export default async function Layout({
  children,
  params,
}: { children: React.ReactNode } & Params) {
  const { slug } = await params;
  const s = getSolution(slug);
  if (!s) notFound();

  const title = dict.it[`sol.${s.key}.title`] ?? slug;
  const lede = dict.it[`sol.${s.key}.lede`] ?? "";

  // Le voci di "cosa e' previsto" e le FAQ sono gia' scritte per il lettore:
  // qui vengono ripetute in JSON-LD per i motori. FAQPage e' il pezzo che puo'
  // valere un risultato ricco, e il catalogo da cui e' nata questa sezione le
  // FAQ le scrive due volte nella pagina senza dichiararle mai ai crawler.
  const split = (suffix: string) =>
    (dict.it[`sol.${s.key}.${suffix}`] ?? "").split("|").map((x) => x.trim()).filter(Boolean);

  const faq = split("faq")
    .map((chunk) => {
      const [q, a = ""] = chunk.split("::");
      return { q: q.trim(), a: a.trim() };
    })
    .filter((x) => x.q && x.a);

  const included = split("build")
    .map((chunk) => chunk.split("::")[0].trim())
    .filter(Boolean);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Soluzioni", item: `${SITE_URL}/soluzioni` },
        { "@type": "ListItem", position: 3, name: title },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": `${SITE_URL}/soluzioni/${s.slug}#service`,
      name: title,
      url: `${SITE_URL}/soluzioni/${s.slug}`,
      description: lede,
      serviceType: dict.it[familyLabelKey(s.family)],
      provider: { "@id": `${SITE_URL}/#org` },
      areaServed: [
        { "@type": "Country", name: "Italia" },
        { "@type": "Place", name: "Europa" },
      ],
      audience: {
        "@type": "Audience",
        audienceType: s.sectors.map((id) => dict.it[`sec.${id}.label`]).join(", "),
      },
      hasOfferCatalog: included.length
        ? {
            "@type": "OfferCatalog",
            name: dict.it["sol.sec.build"],
            itemListElement: included.map((name) => ({
              "@type": "Offer",
              itemOffered: { "@type": "Service", name },
            })),
          }
        : undefined,
    },
    ...(faq.length
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${SITE_URL}/soluzioni/${s.slug}#faq`,
            mainEntity: faq.map((x) => ({
              "@type": "Question",
              name: x.q,
              acceptedAnswer: { "@type": "Answer", text: x.a },
            })),
          },
        ]
      : []),
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
