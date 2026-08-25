import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "@/lib/agent-md";

// Due lavori, in ordine:
//
// 1. Cancello dell'area /admin (Basic Auth, fail-closed). Gira sull'edge PRIMA
//    che qualunque HTML o JS parta, cosi' ne' i contenuti ne' le credenziali
//    raggiungono un browser non autenticato. Credenziali in env, mai nel bundle:
//    ADMIN_USER / ADMIN_PASS (in .env.local e su Vercel).
//
// 2. Negoziazione markdown (acceptmarkdown.com). Una richiesta GET con
//    Accept: text/markdown viene riscritta sul gemello markdown della pagina
//    (/agent-md/<path>), che risponde text/markdown con Vary: Accept. Le
//    risposte HTML delle stesse rotte ricevono anch'esse Vary: Accept, o una
//    CDN potrebbe servire la variante sbagliata a seconda di quale e' entrata
//    in cache per prima. I browser non mandano mai text/markdown, quindi per
//    i visitatori umani non cambia niente.
export const config = {
  // /admin per il cancello; tutto il resto (senza asset con estensione, _next
  // e api) per la negoziazione markdown.
  // Niente esclusione degli asset dentro il regex: "\." attraversa due strati
  // di escaping (stringa JS, compilatore del matcher) e nel manifest compilato
  // era diventato ".", cioe' "qualunque carattere": il lookahead scartava OGNI
  // percorso di due o piu' lettere e la negoziazione valeva solo per "/"
  // (verificato in .next/server/middleware-manifest.json). I file con
  // estensione si scartano nel codice, dove un punto e' un punto.
  matcher: ["/admin", "/admin/:path*", "/((?!_next/|api/|agent-md).*)"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return adminGate(req);
  }

  // Asset con estensione (llms.txt, sitemap.xml, immagini): mai negoziati.
  if (pathname.includes(".")) {
    return NextResponse.next();
  }

  if (req.method === "GET" && prefersMarkdown(req.headers.get("accept"))) {
    const url = req.nextUrl.clone();
    url.pathname = "/agent-md" + (pathname === "/" ? "" : pathname);
    return NextResponse.rewrite(url);
  }

  // Nota su Vary della variante HTML: sia l'append qui sia un header in
  // next.config vengono scartati dal layer RSC di Next, che riscrive Vary
  // (verificato con curl su build di produzione). La conformita' resta piena:
  // e' la risposta MARKDOWN a dover dichiarare Vary: Accept, e lo fa; e su
  // Vercel il middleware gira PRIMA della cache edge, quindi una richiesta
  // markdown viene riscritta su /agent-md/* e non puo' mai ricevere ne'
  // avvelenare la voce di cache dell'HTML. Il rischio residuo esiste solo con
  // una CDN terza davanti al dominio, che oggi non c'e'.
  return NextResponse.next();
}

function adminGate(req: NextRequest) {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  if (!user || !pass) {
    return new NextResponse("Area riservata non configurata.", { status: 503 });
  }

  const header = req.headers.get("authorization");
  if (header?.startsWith("Basic ")) {
    let decoded = "";
    try {
      decoded = atob(header.slice(6));
    } catch {
      decoded = "";
    }
    const sep = decoded.indexOf(":");
    if (sep !== -1) {
      const u = decoded.slice(0, sep);
      const p = decoded.slice(sep + 1);
      if (u === user && p === pass) {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse("Autenticazione richiesta.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="LOoz.design area riservata", charset="UTF-8"',
    },
  });
}
