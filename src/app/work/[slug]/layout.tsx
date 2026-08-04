import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/launch";
import { getProject } from "@/lib/projects";
import { dict } from "@/i18n";

// Server wrapper for the (client) project viewer. Three audit fixes live here:
// 1. Real 404s — unknown or hidden slugs used to soft-404 with HTTP 200.
// 2. Per-project <title>/description via generateMetadata (from the i18n copy).
// 3. BreadcrumbList + CreativeWork JSON-LD per project.
type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || p.hidden) return {};
  const title = dict.it[`work.proj.${p.key}`] ?? slug;
  const blurb = dict.it[`work.proj.${p.key}.blurb`];
  return {
    title,
    description: blurb,
    // Non-featured projects stay reachable but out of the index (they're not
    // in the sitemap either).
    robots: p.featured ? undefined : { index: false, follow: true },
    openGraph: p.image ? { images: [{ url: p.image, alt: title }] } : undefined,
  };
}

export default async function WorkSlugLayout({
  children,
  params,
}: {
  children: React.ReactNode;
} & Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p || p.hidden) notFound();

  const title = dict.it[`work.proj.${p.key}`] ?? slug;
  const blurb = dict.it[`work.proj.${p.key}.blurb`] ?? "";
  const tags = dict.it[`work.proj.${p.key}.tags`] ?? "";

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Progetti", item: `${SITE_URL}/work` },
        { "@type": "ListItem", position: 3, name: title },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "@id": `${SITE_URL}/work/${p.slug}#work`,
      name: title,
      url: `${SITE_URL}/work/${p.slug}`,
      // The description keeps the site's own honesty: these are concept demos.
      description: `${blurb} Progetto dimostrativo realizzato a scopo di portfolio.`,
      creator: { "@id": `${SITE_URL}/#org` },
      inLanguage: "it",
      genre: "Web design concept",
      keywords: tags,
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
