import { NextResponse } from "next/server";
import { SITE_URL } from "@/lib/launch";
import { LIVE_SECTORS, SOLUTIONS } from "@/lib/solutions";

// Schema Map NLWeb (referenziata da robots.txt con `schemamap:`): dichiara
// quale tipo schema.org vive su quale URL, cosi' un agente sa dove trovare i
// dati strutturati senza strisciare tutto. Generata dal catalogo vivo, come
// sitemap e llms.txt: una scheda nuova entra qui senza un commit a parte.
export const dynamic = "force-static";

function url(loc: string, schema: string, lastmod: string): string {
  return [
    "  <url>",
    `    <loc>${SITE_URL}${loc}</loc>`,
    `    <schema>https://schema.org/${schema}</schema>`,
    `    <lastmod>${lastmod}</lastmod>`,
    "  </url>",
  ].join("\n");
}

function build(): string {
  const today = new Date().toISOString().slice(0, 10);
  const rows = [
    url("/", "Organization", today),
    url("/soluzioni", "CollectionPage", today),
    ...SOLUTIONS.map((s) => url(`/soluzioni/${s.slug}`, "Service", today)),
    ...LIVE_SECTORS.map((s) => url(`/soluzioni/settore/${s.slug}`, "CollectionPage", today)),
    url("/chi-sono", "AboutPage", today),
    url("/contatti", "ContactPage", today),
    url("/prezzi", "WebPage", today),
    url("/work", "CollectionPage", today),
  ];
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<schemamap xmlns="http://www.nlweb.ai/schemas/schemamap/0.1">',
    ...rows,
    "</schemamap>",
    "",
  ].join("\n");
}

export async function GET() {
  return new NextResponse(build(), {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
