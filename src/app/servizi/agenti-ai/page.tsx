import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { SITE_URL } from "@/lib/launch";
import { SV_CSS } from "../shared-css";

// Third service landing. Unique advantage vs any local competitor: the proof is
// ALIVE — the site's own assistant is the demo, one click away. Real facts only
// (zero model cost on Groq's free tier is a genuine, verifiable claim).
export const metadata: Metadata = {
  title: "Agenti AI per piccole imprese e solo founder",
  description:
    "Un assistente AI su misura che risponde ai clienti, prende appuntamenti e scrive email, in più lingue, anche di notte. Provalo dal vivo su questo sito: è lui la demo.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/agenti-ai#service`,
  name: "Agenti AI per piccole imprese",
  serviceType: "Sviluppo di assistenti e agenti AI",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [{ "@type": "Country", name: "Italia" }, { "@type": "Place", name: "Europa" }],
  description:
    "Agenti AI su misura per chi lavora da solo: rispondono ai clienti sul sito in più lingue, gestiscono email e appuntamenti, preparano bozze e riassunti. Possono girare senza costi di modello; consulenza e preventivo dedicato, pronti anche in pochi giorni.",
};

export default function AgentiAiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, "\\u003c") }}
      />
      <style dangerouslySetInnerHTML={{ __html: SV_CSS }} />
      <Nav />
      <main className="container sv">
        <header className="sv-head">
          <span className="ct-kicker">SERVIZI · AGENTI AI</span>
          <h1 className="ct-title">Un assistente che non stacca mai.</h1>
          <p className="sv-lede">
            Risponde ai clienti sul tuo sito, prende appuntamenti, scrive bozze di email e ti
            riassume le richieste. In italiano e nelle lingue dei tuoi clienti, anche alle due
            di notte. Tu decidi cosa sa e come parla.
          </p>
          <p style={{ margin: "18px 0 0" }}>
            <Link href="/agents" className="neo-btn neo-btn--primary" style={{ textDecoration: "none", color: "var(--btn-ink)", padding: "12px 24px", fontSize: 15 }}>
              La prova? Parla con il mio →
            </Link>
          </p>
        </header>

        <section className="sv-sec" aria-label="Cosa può fare">
          <h2 className="sv-h2">Cosa può fare per te.</h2>
          <div className="sv-grid">
            <div className="sv-card"><h3>Rispondere ai clienti</h3><p>Sul sito, 24 ore su 24, nella lingua del visitatore. Le domande frequenti smettono di arrivare a te.</p></div>
            <div className="sv-card"><h3>Prendere appuntamenti</h3><p>Propone gli orari, conferma e manda i promemoria. L&apos;agenda si riempie da sola.</p></div>
            <div className="sv-card"><h3>Scrivere bozze</h3><p>Email, preventivi e risposte pronte da rileggere e inviare: tu firmi, lui prepara.</p></div>
            <div className="sv-card"><h3>Riassumere le richieste</h3><p>Ogni conversazione diventa un riepilogo ordinato: chi era, cosa vuole, cosa serve dopo.</p></div>
            <div className="sv-card"><h3>Conoscere la tua attività</h3><p>Addestrato sui tuoi contenuti: prezzi, orari, servizi. Risponde come risponderesti tu.</p></div>
            <div className="sv-card"><h3>Costare pochissimo</h3><p>Può girare senza costi di modello, come l&apos;assistente di questo sito. Nessun abbonamento AI obbligatorio.</p></div>
          </div>
        </section>

        <section className="sv-sec" aria-label="Prova dal vivo">
          <h2 className="sv-h2">La demo è viva, non uno screenshot.</h2>
          <div className="sv-price">
            <div className="sv-price__card">
              <span className="sv-price__name">L&apos;assistente di questo sito</span>
              <p className="sv-price__big">Fagli una domanda vera.</p>
              <p className="sv-price__body">
                Chiedigli i prezzi, i tempi o cosa può fare Lorenzo per la tua attività: risponde
                in tempo reale, nella tua lingua. È esattamente ciò che costruirei per te.{" "}
                <Link href="/agents" style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}>Provalo ora</Link>.
              </p>
            </div>
            <div className="sv-price__card">
              <span className="sv-price__name">Preventivo su misura</span>
              <p className="sv-price__big">Si parte da una consulenza.</p>
              <p className="sv-price__body">
                Capiamo insieme cosa deve sapere e fare il tuo agente, poi ti do un preventivo
                dedicato, deciso prima di iniziare. Pronto anche in pochi giorni.
              </p>
            </div>
          </div>
          <div className="sv-guar" style={{ marginTop: 22 }}>
            <span>Risponde in più lingue</span>
            <span>Zero costi di modello possibili</span>
            <span>Tu decidi cosa sa</span>
            <span>Rispondo entro 24h</span>
          </div>
        </section>

        <section className="sv-cta" aria-label="Contatto">
          <h2>Immagina cosa gli faresti fare.</h2>
          <p>
            Scrivimi che tipo di richieste ricevi ogni giorno: ti dico entro 24 ore come un
            agente potrebbe assorbirle, e quanto costerebbe. Senza impegno.
          </p>
          <Link href="/contatti" className="neo-btn neo-btn-lg" style={{ textDecoration: "none", color: "var(--ink-body)", background: "var(--canvas-page)", padding: "14px 30px", fontSize: 16 }}>
            Parliamone →
          </Link>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
