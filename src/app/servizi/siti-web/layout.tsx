import type { Metadata } from "next";
import { SITE_URL } from "@/lib/launch";

// Metadata e dati strutturati restano server-side: la pagina e' client component
// perche' deve seguire la lingua del visitatore, ma quello che leggono i crawler
// non passa da React.
export const metadata: Metadata = {
  title: "Siti web per ristoranti e piccole attività",
  description: "Siti su misura per ristoranti, gelaterie, bar e piccole attività: menù, prenotazioni e ordini. Prima versione in 7–10 giorni, poi il sito resta tuo. Il costo si decide in una chiamata.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/siti-web#service`,
  name: "Siti web per ristoranti e piccole attività",
  serviceType: "Web design e sviluppo siti web",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [
    { "@type": "Country", name: "Italia" },
    { "@type": "Place", name: "Europa" },
  ],
  description: "Siti su misura per ristoranti, gelaterie, bar e piccole attività: menù, prenotazioni e ordini. Prima versione in 7–10 giorni, poi il sito resta tuo. Il costo si decide in una chiamata.",
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
