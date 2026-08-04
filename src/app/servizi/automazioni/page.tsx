import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { SITE_URL } from "@/lib/launch";
import { SV_CSS } from "../shared-css";

// Second service landing (SEO audit: the automation persona had the best
// homepage copy and no URL that could rank for his query). Same mold as
// /servizi/siti-web: server-rendered Italian, real facts only.
export const metadata: Metadata = {
  title: "Automazioni per piccole imprese e partite IVA",
  description:
    "Email, fatture, report e appuntamenti in automatico: le automazioni assorbono il lavoro ripetitivo di chi manda avanti tutto da solo. Pronte in pochi giorni, preventivo su misura.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/automazioni#service`,
  name: "Automazioni per piccole imprese",
  serviceType: "Automazione dei processi aziendali",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [{ "@type": "Country", name: "Italia" }, { "@type": "Place", name: "Europa" }],
  description:
    "Automazione dei processi ripetitivi per piccole imprese e partite IVA: email, fatture, report, appuntamenti e dati dal web. Consulenza personalizzata e preventivo dedicato; un'automazione è pronta anche in pochi giorni.",
};

export default function AutomazioniPage() {
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
          <span className="ct-kicker">SERVIZI · AUTOMAZIONI</span>
          <h1 className="ct-title">Il lavoro ripetitivo lo fa la macchina.</h1>
          <p className="sv-lede">
            Se mandi avanti tutto da solo, le ore se ne vanno in email, fatture e promemoria.
            Costruisco automazioni che assorbono quella routine: tu controlli, la macchina esegue.
            Un&apos;automazione è pronta anche in pochi giorni.
          </p>
        </header>

        <section className="sv-sec" aria-label="Cosa automatizzo">
          <h2 className="sv-h2">Cosa posso togliere dalla tua giornata.</h2>
          <div className="sv-grid">
            <div className="sv-card"><h3>Email ripetitive</h3><p>Risposte alle domande frequenti, conferme e follow-up che partono da soli, col tuo tono.</p></div>
            <div className="sv-card"><h3>Fatture e promemoria</h3><p>Emissione, invio e solleciti gentili per i pagamenti in ritardo, senza che tu li rincorra.</p></div>
            <div className="sv-card"><h3>Report automatici</h3><p>I numeri che ti servono, in un riepilogo ordinato ogni settimana. Niente fogli da compilare.</p></div>
            <div className="sv-card"><h3>Appuntamenti</h3><p>Prenotazioni, conferme e promemoria ai clienti: l&apos;agenda si riempie senza telefonate.</p></div>
            <div className="sv-card"><h3>Dati dal web</h3><p>Prezzi dei concorrenti, recensioni, mercato: raccolti e ordinati in un foglio che si aggiorna.</p></div>
            <div className="sv-card"><h3>Documenti a posto</h3><p>Allegati, ricevute e contratti archiviati nel posto giusto appena arrivano.</p></div>
          </div>
        </section>

        <section className="sv-sec" aria-label="Come funziona">
          <h2 className="sv-h2">Come funziona.</h2>
          <div className="sv-grid">
            <div className="sv-card"><h3>1 · Mi racconti la routine</h3><p>Una chiamata di 30 minuti: mi descrivi le attività che ti mangiano tempo ogni settimana.</p></div>
            <div className="sv-card"><h3>2 · Costruisco e testo</h3><p>Preparo l&apos;automazione e la provo con i tuoi casi reali. In pochi giorni, non mesi.</p></div>
            <div className="sv-card"><h3>3 · Lavora da sola</h3><p>L&apos;automazione gira; io la tengo d&apos;occhio e la aggiusto se qualcosa cambia.</p></div>
          </div>
        </section>

        <section className="sv-sec" aria-label="Prezzi">
          <h2 className="sv-h2">Quanto costa.</h2>
          <div className="sv-price">
            <div className="sv-price__card">
              <span className="sv-price__name">Preventivo su misura</span>
              <p className="sv-price__big">Si parte da una consulenza.</p>
              <p className="sv-price__body">
                Ogni routine è diversa, quindi niente listino finto: una chiamata senza impegno,
                capiamo cosa automatizzare e ti do un preventivo dedicato, deciso prima di iniziare.
              </p>
            </div>
            <div className="sv-price__card">
              <span className="sv-price__name">L&apos;esempio vivo</span>
              <p className="sv-price__big">Provalo su questo sito.</p>
              <p className="sv-price__body">
                L&apos;assistente che risponde qui è costruito con lo stesso approccio, e gira senza
                costi di modello. <Link href="/agents" style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}>Fagli una domanda</Link>.
              </p>
            </div>
          </div>
          <div className="sv-guar" style={{ marginTop: 22 }}>
            <span>Prezzo deciso prima</span>
            <span>Pronta in pochi giorni</span>
            <span>Tutto resta a tuo nome</span>
            <span>Rispondo entro 24h</span>
          </div>
        </section>

        <section className="sv-cta" aria-label="Contatto">
          <h2>Quale routine ti pesa di più?</h2>
          <p>
            Raccontamela in due righe: ti dico entro 24 ore se si può automatizzare, come, e cosa
            ci guadagni in ore. Senza impegno.
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
