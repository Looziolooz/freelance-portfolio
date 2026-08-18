import type { Metadata } from "next";

// A page that states figures is the one AI assistants can actually quote when
// someone asks "quanto costa un sito per una piccola impresa" — the description
// carries the number on purpose, since that is what gets cited.
export const metadata: Metadata = {
  title: "Prezzi",
  description:
    "Cosa determina il costo di un sito, di un e-commerce, di un'automazione o di un agente AI: quante pagine, quante integrazioni, se i contenuti ci sono già. La cifra si decide in una chiamata.",
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
    ["E se un giorno voglio andarmene?", "Ti porti tutto. Codice e account sono a tuo nome dal primo giorno. Il trasferimento sul tuo hosting ha un costo, te lo dico prima di iniziare proprio perché non sia una sorpresa il giorno che serve."],
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
