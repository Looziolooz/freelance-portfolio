import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";

// Metadata e dati strutturati restano server-side: la pagina e' client component
// perche' deve seguire la lingua del visitatore, ma quello che leggono i crawler
// non passa da React.
export const metadata: Metadata = {
  title: "Visibilità su Google e nelle risposte AI",
  description: "Farsi trovare da chi cerca quello che vendi, sui motori di ricerca e dentro le risposte degli assistenti AI. Contenuti con una cadenza, dati di mercato, risultati misurati.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/visibilita#service`,
  name: "Visibilità su Google e nelle risposte AI",
  serviceType: "Consulenza di visibilità online, SEO e contenuti",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [
    { "@type": "Country", name: "Italia" },
    { "@type": "Place", name: "Europa" },
  ],
  description: "Farsi trovare da chi cerca quello che vendi, sui motori di ricerca e dentro le risposte degli assistenti AI. Contenuti con una cadenza, dati di mercato, risultati misurati.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
