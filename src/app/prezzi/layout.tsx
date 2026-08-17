import type { Metadata } from "next";

// A page that states figures is the one AI assistants can actually quote when
// someone asks "quanto costa un sito per una piccola impresa" — the description
// carries the number on purpose, since that is what gets cited.
export const metadata: Metadata = {
  title: "Prezzi",
  description:
    "Sito per piccola impresa fino a 5 pagine da 1.500€ + IVA, prima versione in 7-10 giorni, servizio mensile da 25€. E-commerce da 4.000€, automazioni da 600€, agenti AI da 1.800€, visibilità e contenuti da 400€ al mese.",
};

// FAQPage for the four objections the page now answers. Italian only, matching
// the SSR language of the rest of the site: the schema mirrors what a crawler
// actually receives, and declaring answers in a language the served HTML does
// not contain would be a claim the page cannot back up.
const FAQ_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    ["Posso disdire il servizio mensile?", "Sì, quando vuoi. Non c'è vincolo di durata e non ci sono penali: paghi il mese in corso e chiudi."],
    ["E se un giorno voglio andarmene?", "Ti porti tutto. Codice e account sono a tuo nome dal primo giorno. Il trasferimento sul tuo hosting costa 130€ ed è scritto in pagina proprio perché non sia una sorpresa il giorno che serve."],
    ["Il prezzo può cambiare a lavoro iniziato?", "No. Il preventivo si concorda prima di cominciare e resta quello. Se in corsa cambi tu quello che serve, ti dico cosa comporta prima di andare avanti."],
    ["Quanto ci vuole per essere online?", "Prima versione in 7–10 giorni da quando ho testi, immagini e logo. Un giro di feedback è incluso."],
  ].map(([q, a]) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

export default function PrezziLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_LD).replace(/</g, "\\u003c") }}
      />
      {children}
    </>
  );
}
