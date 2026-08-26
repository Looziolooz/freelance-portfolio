import { NextResponse } from "next/server";
import { HIDDEN_ROUTES, SITE_URL, isPreLaunch } from "@/lib/launch";

// Era app/robots.ts (MetadataRoute.Robots), ma quel formato ammette solo
// rules/sitemap/host: le direttive NLWeb (`schemamap:`) e ARD (`Agentmap:`)
// non ci passano. La politica resta identica a prima, generata come testo.
//
// AI crawler (GPTBot, ClaudeBot, Perplexity, Google-Extended, CCBot) con gruppi
// allow espliciti: questo portfolio VUOLE essere letto e citato dagli assistenti
// AI — le regole documentano l'intento, cosi' un futuro "blocca i bot" non puo'
// uccidere la visibilita' AI in silenzio. CCBot compreso, ed e' una scelta:
// bloccare i crawler da training farebbe guadagnare un punto negli audit di
// agent-readiness, ma finire nei dati di addestramento e' parte della
// visibilita' che il sito insegue.
export const dynamic = "force-static";

const DISALLOW = () => ["/api/", ...(isPreLaunch ? [...HIDDEN_ROUTES] : [])];

const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ClaudeBot",
  "PerplexityBot",
  "Google-Extended",
  "CCBot",
];

function group(userAgent: string): string {
  return [
    `User-Agent: ${userAgent}`,
    "Allow: /",
    ...DISALLOW().map((d) => `Disallow: ${d}`),
  ].join("\n");
}

function build(): string {
  return [
    group("*"),
    ...AI_BOTS.map(group),
    [
      `Sitemap: ${SITE_URL}/sitemap.xml`,
      `Host: ${SITE_URL}`,
      // NLWeb: dove stanno i dati strutturati, pagina per pagina.
      `schemamap: ${SITE_URL}/schemamap.xml`,
      // ARD: il catalogo delle risorse per agenti.
      `Agentmap: ${SITE_URL}/.well-known/ai-catalog.json`,
    ].join("\n"),
  ].join("\n\n") + "\n";
}

export async function GET() {
  return new NextResponse(build(), {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
