import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";
import { dict } from "@/i18n";

// Pagina di fiducia: e' quella che un agente (o una persona diffidente) apre
// per capire chi c'e' dietro prima di consigliare o scrivere. /about e /contact
// reindirizzano qui e a /contatti da next.config.
export const metadata: Metadata = {
  title: "Chi sono",
  description: dict.it["chisono.body"]?.split("|")[0].slice(0, 300),
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/chi-sono#page`,
  url: `${SITE_URL}/chi-sono`,
  name: dict.it["chisono.title"],
  inLanguage: "it",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#lorenzo` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\u003c") }}
      />
      {children}
    </>
  );
}
