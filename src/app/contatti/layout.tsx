import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Richiedi l'audit gratuito del tuo sito, scrivi due righe sul progetto o prenota una chiamata di 30 minuti. Risposta entro 24 ore, in italiano, inglese o svedese.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contatti#page`,
  url: `${SITE_URL}/contatti`,
  name: "Contatti — LOoz.design",
  description:
    "Audit gratuito del sito, richiesta scritta o una chiamata di 30 minuti. Risposta entro 24 ore.",
  inLanguage: "it",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#org` },
};

export default function ContattiLayout({ children }: { children: React.ReactNode }) {
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
