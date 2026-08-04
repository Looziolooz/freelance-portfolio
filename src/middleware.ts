import { NextResponse, type NextRequest } from "next/server";

// Server-side gate for the internal /admin area.
//
// Unlike a client-side PIN, this runs on the edge BEFORE any page HTML or JS is
// sent, so neither the strategy content nor the credentials ever reach a browser
// that hasn't authenticated. Credentials live in env vars, never in the bundle.
//
// Set in .env.local (and in Vercel → Settings → Environment Variables):
//   ADMIN_USER="lorenzo"
//   ADMIN_PASS="a-long-random-passphrase"
//
// If the vars are missing we FAIL CLOSED (503) so the area is never exposed by
// accident.
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function middleware(req: NextRequest) {
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
