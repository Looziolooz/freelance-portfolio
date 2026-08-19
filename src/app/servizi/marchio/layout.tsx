import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";

// Metadata e dati strutturati restano server-side: la pagina e' client component
// perche' deve seguire la lingua del visitatore, ma quello che leggono i crawler
// non passa da React.
export const metadata: Metadata = {
  title: "Identità di marca e manuale del marchio",
  description: "Nome, segno, colori e caratteri, con il fascicolo che tiene insieme il marchio quando lo usano altre persone. Diciassette marchi già costruiti, ognuno col suo manuale sfogliabile.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/marchio#service`,
  name: "Identità di marca e manuale del marchio",
  serviceType: "Progettazione di identità visiva e brand design",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [
    { "@type": "Country", name: "Italia" },
    { "@type": "Place", name: "Europa" },
  ],
  description: "Nome, segno, colori e caratteri, con il fascicolo che tiene insieme il marchio quando lo usano altre persone. Diciassette marchi già costruiti, ognuno col suo manuale sfogliabile.",
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
