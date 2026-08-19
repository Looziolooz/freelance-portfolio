import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";

// Metadata e dati strutturati restano server-side: la pagina e' client component
// perche' deve seguire la lingua del visitatore, ma quello che leggono i crawler
// non passa da React.
export const metadata: Metadata = {
  title: "Automazioni e assistenti AI per piccole attività",
  description: "Email, fatture, promemoria e appuntamenti che si fanno da soli, e un assistente che risponde ai clienti quando non ci sei. Preventivo deciso prima, tutto resta a tuo nome.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/automazioni-ai#service`,
  name: "Automazioni e assistenti AI per piccole attività",
  serviceType: "Automazione dei processi e agenti AI",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [
    { "@type": "Country", name: "Italia" },
    { "@type": "Place", name: "Europa" },
  ],
  description: "Email, fatture, promemoria e appuntamenti che si fanno da soli, e un assistente che risponde ai clienti quando non ci sei. Preventivo deciso prima, tutto resta a tuo nome.",
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
