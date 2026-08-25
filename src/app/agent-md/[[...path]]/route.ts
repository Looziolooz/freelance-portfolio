import { NextRequest, NextResponse } from "next/server";
import { notFoundMarkdown, renderAgentMarkdown } from "@/lib/agent-md";

// Bersaglio interno della negoziazione markdown (acceptmarkdown.com): il
// middleware riscrive qui le richieste con Accept: text/markdown, passando il
// percorso originale. Risponde text/markdown con Vary: Accept, e un vero 404
// (sempre markdown, con la mappa di dove guardare) per i percorsi inesistenti.
//
// La rotta e' raggiungibile anche direttamente: innocuo, e utile per il debug.
//
// Niente force-static: con un catch-all statico i percorsi NON prerenderizzati
// cadevano nel not-found HTML di Next prima che questo handler potesse
// rispondere il suo 404 markdown (verificato con curl). Il render dinamico
// costa poco: e' testo assemblato dal dizionario.
export const dynamic = "force-dynamic";

const HEADERS = {
  "Content-Type": "text/markdown; charset=utf-8",
  // Senza Accept dentro Vary una CDN puo' servire la variante HTML in cache a
  // un agente che chiede markdown, o viceversa: e' il punto intero del check.
  Vary: "Accept, Accept-Encoding",
  "X-Robots-Tag": "noindex",
};

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path?: string[] }> },
) {
  const { path } = await ctx.params;
  const p = "/" + (path ?? []).join("/");
  const md = renderAgentMarkdown(p);
  if (md) return new NextResponse(md, { status: 200, headers: HEADERS });
  return new NextResponse(notFoundMarkdown(p), { status: 404, headers: HEADERS });
}
