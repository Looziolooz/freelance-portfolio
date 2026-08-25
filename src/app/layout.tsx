import type { Metadata } from "next";
import localFont from "next/font/local";
import CookieConsent from "@/components/CookieConsent";
import ThemeProvider from "@/components/ThemeProvider";
import LangProvider from "@/components/LangProvider";
import PerfProbe from "@/components/PerfProbe";
import ClientLayout from "./ClientLayout";
import { SITE_URL } from "@/lib/launch";
import "./globals.css";

// Display: Fraunces — an expressive "soft serif" with optical sizing. Carries
// the craft/taste signal that a neutral sans (the old Inter Tight) flattened.
// Self-hosted via next/font/local: a variable woff2 shipped from our own
// origin, so the build no longer reaches fonts.gstatic.com. That CDN 404'd on
// 2026-08-11 and failed a build; a site's fonts should not depend on a third
// party for reasons nobody controls.
const fraunces = localFont({
  src: "./fonts/fraunces/fraunces-variable.woff2",
  variable: "--font-fraunces",
  display: "swap",
  fallback: ["Georgia", "'Times New Roman'", "serif"],
});

// Mono: technical labels, code, stat readouts.
const jetbrainsMono = localFont({
  src: "./fonts/jetbrains-mono/jetbrains-mono-400.woff2",
  variable: "--font-mono",
  display: "swap",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});

// Body/UI face: General Sans — self-hosted via next/font/local. Removes the
// render-blocking 3rd-party request to fontshare and the late font swap: the
// woff2 ship from our own origin and next/font generates a size-adjusted
// fallback, so the face applies fast with ~0 CLS. Exposed as --font-general-sans;
// globals.css points --font-sans at it.
const generalSans = localFont({
  src: [
    { path: "./fonts/general-sans/general-sans-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/general-sans/general-sans-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/general-sans/general-sans-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/general-sans/general-sans-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
  fallback: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

const TITLE = "LOoz.design — Siti, automazioni e agenti AI per la tua impresa";
// ≤160 chars so search results don't truncate it (the old one was 193).
const DESCRIPTION =
  "Siti su misura, automazioni e agenti AI per piccole imprese e solo founder. Più visibilità, meno lavoro manuale, e un sito che lavora per te.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Child routes set their own short title; the template appends the brand.
  title: { default: TITLE, template: "%s — LOoz.design" },
  description: DESCRIPTION,
  // "./" resolves per-path → every page gets a self-referencing canonical
  // (protects against *.vercel.app preview deploys indexing as duplicates).
  alternates: { canonical: "./" },
  openGraph: {
    type: "website",
    siteName: "LOoz.design",
    locale: "it_IT",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "LOoz.design — siti, automazioni e agenti AI" }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
};

// Site-wide entity graph (SEO audit): Organization + Person + WebSite, all keyed
// on SITE_URL so JSON-LD, sitemap and canonicals always agree. Deliberately no
// street address / city (remote-first privacy posture): areaServed gives
// country-level grounding without doxxing. The Person carries the full name by
// the owner's explicit choice (2026-08-25): "Lorenzo Dastoli" is the string a
// motore deve legare a questo dominio, ed era gia' pubblico in hero.name.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "LOoz.design",
      // Le grafie con cui la marca viene davvero cercata: aiutano i motori a
      // legare "looz" e "looz design" a questo dominio (brand discoverability).
      alternateName: ["LOoz", "Looz", "looz design", "Looz Design"],
      url: `${SITE_URL}/`,
      description:
        "Studio freelance indipendente: siti web ed e-commerce su misura, automazioni dei processi ripetitivi, contenuti social e agenti AI per piccole imprese e solo founder.",
      // The owner picked this over four rounds of candidates.
      slogan: "Il sito che ti ripaga.",
      founder: { "@id": `${SITE_URL}/#lorenzo` },
      knowsLanguage: ["it", "en", "sv"],
      areaServed: [
        { "@type": "Country", name: "Italia" },
        { "@type": "Country", name: "Sverige" },
        { "@type": "Place", name: "Europa" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        email: "hello@looz.design",
        url: `${SITE_URL}/contatti`,
        availableLanguage: ["it", "en", "sv"],
      },
      sameAs: ["https://github.com/Looziolooz"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Servizi",
        // The floor prices are gone, on purpose, and the reason the earlier
        // comment gave for having them has gone with them.
        //
        // That comment said a priceless catalogue would contradict the prices
        // printed on /prezzi. It would have. Now /prezzi prints none: the owner
        // took every figure off the site so the cost is decided in a call, so
        // silence here is the CONSISTENT answer rather than the contradictory
        // one. The services stay enumerated and typed, which is the half of
        // this node that was never about money.
        //
        // The free audit keeps its price of zero. Free is not a quote, it is the
        // whole lead magnet, and stripping "free" off something that is free
        // would be the opposite of the change being asked for.
        itemListElement: [
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Siti web ed e-commerce", description: "Siti e negozi online su misura, veloci e fatti per trasformare i visitatori in clienti." } },
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Visibilità online (SEO)", description: "SEO, struttura e presenza pensate per i motori di ricerca e per chi cerca te." } },
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Contenuti social", description: "Contenuti per i social semplici e a costo zero, per restare presente e riconoscibile." } },
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Automazioni", description: "I processi ripetitivi li fa la macchina: email, fatture, report. Meno errori, più tempo." } },
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Dati dal web", description: "Dati dal web raccolti e trasformati in informazioni utili per le decisioni di marketing." } },
          { "@type": "Offer", url: `${SITE_URL}/prezzi`, itemOffered: { "@type": "Service", name: "Agenti AI", description: "Agenti su misura per email e appuntamenti, fatturazione, scrittura mail e riassunti dei clienti." } },
          { "@type": "Offer", price: "0", priceCurrency: "EUR", itemOffered: { "@type": "Service", name: "Audit gratuito del sito", description: "Tre cose concrete da migliorare subito per ottenere più clienti. Risposta entro 24 ore." } },
        ],
      },
    },
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#lorenzo`,
      url: `${SITE_URL}/chi-sono`,
      name: "Lorenzo Dastoli",
      // Le forme con cui la persona viene cercata o citata, come per l'Org.
      alternateName: ["Lorenzo", "Looz", "Looziolooz"],
      jobTitle: "Designer & Developer",
      worksFor: { "@id": `${SITE_URL}/#org` },
      knowsLanguage: ["it", "en", "sv"],
      sameAs: ["https://github.com/Looziolooz"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "LOoz.design",
      alternateName: "looz",
      publisher: { "@id": `${SITE_URL}/#org` },
      inLanguage: "it",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="it"
      className={`${fraunces.variable} ${jetbrainsMono.variable} ${generalSans.variable}`}
      data-theme="light"
    >
      {/* No inline style here: globals.css already sets `html,body{margin:0}` and
          body `-webkit-font-smoothing:antialiased`. An inline shorthand style on
          <body> serialized differently on server vs client → hydration mismatch. */}
      <body className="antialiased">
        {/* Server-rendered so it's in the initial HTML (JS-injected schema faces
            delayed processing). The < guard prevents </script> breakout. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
        />
        <ThemeProvider>
          <LangProvider>
            <ClientLayout>{children}</ClientLayout>
            {/* Dev-only performance timeline; compiles out of the prod bundle. */}
            <PerfProbe />
            {/* GDPR/ePrivacy consent gate — shows the cookie banner and loads the
                (cookieless) analytics only after the visitor accepts. Must live
                inside LangProvider so its copy is translated. */}
            <CookieConsent />
          </LangProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
