import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

// Pin the Turbopack workspace root to this project. Without it, Next walks up
// and finds a stray lockfile (e.g. C:\Users\loren\package-lock.json) and warns
// about inferring the wrong root.
const projectRoot = dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  // Don't advertise the framework.
  poweredByHeader: false,
  // Baseline security headers (SEO audit): Vercel adds HSTS on its domains,
  // the rest is on us. CSP is deliberately omitted for now — the inline styles
  // and JSON-LD scripts would need nonces first.
  // I vecchi indirizzi restano validi. Le pagine-disciplina sotto /work sono
  // state fuse dentro le pagine servizio, e le tre pagine automazioni/agenti/
  // cowork in una sola: chi ha un vecchio link, o un motore che ha indicizzato
  // il vecchio URL, arriva dove il contenuto e' andato a stare.
  async redirects() {
    return [
      { source: "/work/branding", destination: "/work/fascicoli", permanent: true },
      { source: "/work/web-design", destination: "/servizi/siti-web", permanent: true },
      { source: "/work/marketing", destination: "/servizi/visibilita", permanent: true },
      { source: "/work/automazioni-ai", destination: "/servizi/automazioni-ai", permanent: true },
      { source: "/servizi/automazioni", destination: "/servizi/automazioni-ai", permanent: true },
      { source: "/servizi/agenti-ai", destination: "/servizi/automazioni-ai", permanent: true },
      { source: "/servizi/claude-cowork", destination: "/servizi/automazioni-ai", permanent: true },
      { source: "/chi-siamo", destination: "/chi-sono", permanent: true },
    ];
  },

  // Anchor di fiducia con lo slug inglese: gli agenti (e le persone che tirano
  // a indovinare) provano /about e /contact. Erano redirect 308, ma gli scanner
  // di agent-readiness non li seguono e bocciavano le ancore come assenti:
  // ora servono la pagina vera in 200. Il canonical esplicito nelle pagine
  // (chi-sono/layout, contatti/layout) evita il contenuto duplicato — il
  // canonical di default "./" del root layout sarebbe auto-riferito e sbagliato.
  async rewrites() {
    return [
      { source: "/about", destination: "/chi-sono" },
      { source: "/contact", destination: "/contatti" },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Frame-Options", value: "DENY" },
          // RFC 8288: dice agli agenti dove sono sitemap e guide macchina prima
          // ancora che parsino una pagina (check "link-headers-discovery").
          {
            key: "Link",
            value:
              '</sitemap.xml>; rel="sitemap", </llms.txt>; rel="alternate"; type="text/markdown", </agents.md>; rel="alternate"; type="text/markdown"',
          },
        ],
      },
    ];
  },
  // Serve next/image output as AVIF first (≈20% smaller than WebP), falling back
  // to WebP. Encoding is cached after the first request, so the cost is paid once.
  images: {
    formats: ["image/avif", "image/webp"],
    // Explicit even though [75] is the default, because the failure mode is
    // nasty: since Next 15.4 a `q` NOT listed here returns 400
    // (INVALID_IMAGE_OPTIMIZE_REQUEST) in production while dev happily serves
    // it — so a stray q=70 ships green and breaks live. It did: the work
    // marquee posters. Add a value here before using it anywhere.
    qualities: [75],
  },
  // Keep Prisma + the Postgres driver external to the bundler.
  serverExternalPackages: ["@prisma/client", "@prisma/adapter-pg", "pg"],
  // The component gallery reads the raw pens from /codepen at request time; make
  // sure those files are traced into the serverless functions on deploy.
  outputFileTracingIncludes: {
    "/api/componenti/**": ["./codepen/**"],
  },
};

export default nextConfig;
