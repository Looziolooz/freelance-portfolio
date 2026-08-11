import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { SITE_URL } from "@/lib/launch";
import { SV_CSS } from "../shared-css";

// Fourth service landing: installing and configuring Claude Cowork for people
// who bought the subscription and never got past the chat box.
//
// Every capability listed below is taken from Anthropic's own documentation
// (product guide + Get started with Claude Cowork, Aug 2026) — folder access,
// folder instructions, global instructions, connectors, the three approval
// modes, /schedule, subagents, plugins, the org-level web search switch and the
// deletion guard. Nothing here is inferred. If a feature name changes upstream,
// this page is wrong and needs re-checking against the source, because the
// whole offer is "I know how to turn these on" and a made-up switch would show
// up in the first session.
export const metadata: Metadata = {
  title: "Claude Cowork: installazione e configurazione per la tua attività",
  description:
    "Ti configuro Claude Cowork sul tuo computer: cartelle, connettori, permessi e attività programmate. Lavora sui tuoi file e ti consegna report, documenti e presentazioni finiti.",
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/claude-cowork#service`,
  name: "Installazione e configurazione di Claude Cowork",
  serviceType: "Consulenza e setup di strumenti AI per il lavoro d'ufficio",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [{ "@type": "Country", name: "Italia" }, { "@type": "Place", name: "Europa" }],
  description:
    "Installazione, configurazione e affiancamento su Claude Cowork: accesso alle cartelle, istruzioni per cartella e globali, connettori Slack e Google Drive, modalità di approvazione, attività programmate, subagenti e plugin. Consulenza su preventivo.",
};

// Only what Anthropic documents. The order goes from the switch that changes the
// most to the one that changes the least, because that is also the order in
// which they get turned on during an install.
const FEATURES: { n: string; t: string; d: string }[] = [
  {
    n: "01",
    t: "Accesso alle tue cartelle",
    d: "Scegli quali cartelle del computer può leggere e scrivere. Da lì lavora sui file veri, senza che tu carichi e riscarichi niente.",
  },
  {
    n: "02",
    t: "Istruzioni per cartella",
    d: "Ogni cartella si porta dietro il suo contesto: come si chiamano i clienti, che formato hanno i preventivi, cosa non si tocca. Le imposti una volta.",
  },
  {
    n: "03",
    t: "Istruzioni globali",
    d: "Le regole che valgono sempre, dal tono con cui scrive alla lingua che usa con i tuoi clienti. Stanno nelle impostazioni di Cowork.",
  },
  {
    n: "04",
    t: "Connettori",
    d: "Si collega a Slack e Google Drive, e tu decidi quali può usare e fino a dove può spingersi su ognuno.",
  },
  {
    n: "05",
    t: "Modalità di approvazione",
    d: "Tre livelli. Manuale ti chiede il permesso ogni volta, Auto approva da solo le azioni in sola lettura e valuta quelle che scrivono o cancellano, Skip non chiede niente e salta i controlli di sicurezza.",
  },
  {
    n: "06",
    t: "Attività programmate",
    d: "Il report del lunedì, il riepilogo di fine mese, il controllo delle scadenze. Si imposta la cadenza e poi va da solo.",
  },
  {
    n: "07",
    t: "Subagenti",
    d: "Sui lavori lunghi divide il compito e ne delega dei pezzi, invece di macinare tutto in fila.",
  },
  {
    n: "08",
    t: "Plugin",
    d: "Estensioni per aree specifiche, come il marketing o la gestione di prodotto.",
  },
  {
    n: "09",
    t: "Uso del browser e del computer",
    d: "Può navigare e agire sulla macchina. Richiede che l'app desktop resti aperta per tutta la sessione.",
  },
  {
    n: "10",
    t: "Controlli per il team",
    d: "Sui piani Team ed Enterprise il titolare può spegnere funzioni per tutti dalle impostazioni dell'organizzazione, a partire dalla ricerca sul web.",
  },
  {
    n: "11",
    t: "Protezione sulle cancellazioni",
    d: "Prima di cancellare un file in modo definitivo chiede sempre il permesso esplicito. Questo non si disattiva per sbaglio.",
  },
];

export default function ClaudeCoworkPage() {
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
          <span className="ct-kicker">SERVIZI · CLAUDE COWORK</span>
          <h1 className="ct-title">Hai pagato l&apos;abbonamento. Ora facciamolo lavorare.</h1>
          <p className="sv-lede">
            Claude Cowork non è una chat a cui fai domande. Gli dai una cartella e un compito, e
            lui lavora sui tuoi file finché il documento non è finito. Il problema è che va
            configurato, e finché non lo è resta una finestra in cui scrivere. Te lo installo,
            te lo imposto sul tuo modo di lavorare e ti lascio autonomo.
          </p>
        </header>

        <section className="sv-sec" aria-label="Cosa si può attivare">
          <h2 className="sv-h2">Cosa si può attivare.</h2>
          <p className="sv-lede" style={{ marginBottom: 26 }}>
            Undici funzioni, tutte già dentro l&apos;abbonamento che hai. Nessuna richiede un
            acquisto in più.
          </p>
          <div className="sv-grid">
            {FEATURES.map((f) => (
              <div className="sv-card" key={f.n}>
                <h3>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-green-deep)", marginRight: 8 }}>{f.n}</span>
                  {f.t}
                </h3>
                <p>{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="sv-sec" aria-label="A cosa serve davvero">
          <h2 className="sv-h2">A cosa lo usa la gente.</h2>
          <p className="sv-lede" style={{ marginBottom: 26 }}>
            Anthropic ha analizzato 1,2 milioni di sessioni: un terzo è amministrazione e
            processi, un sesto è scrittura di contenuti. Lo sviluppo software è sotto il nove per
            cento. Non è uno strumento per programmatori.
          </p>
          <div className="sv-grid">
            <div className="sv-card"><h3>Rimettere in ordine i conti</h3><p>Riconcilia i fogli di calcolo e scrive la nota sugli scostamenti, con i riferimenti ai file da cui ha preso i numeri.</p></div>
            <div className="sv-card"><h3>Trasformare una cartella in un registro</h3><p>Da una cartella di contratti tira fuori lo scadenzario dei rinnovi, con segnalati i punti a rischio.</p></div>
            <div className="sv-card"><h3>Preparare la presentazione</h3><p>Dalle trascrizioni delle chiamate e dai dati di vendita costruisce le slide per il cliente di domani.</p></div>
            <div className="sv-card"><h3>Radunare gli aggiornamenti sparsi</h3><p>Quello che è finito su Slack, nelle mail e nei documenti diventa un unico report leggibile.</p></div>
            <div className="sv-card"><h3>Scrivere le bozze</h3><p>Proposte, post, comunicazioni. Escono già impaginate, da rileggere e mandare.</p></div>
            <div className="sv-card"><h3>Chiudere le pratiche</h3><p>Formattazione, archiviazione, checklist di ingresso per un nuovo collaboratore. Il lavoro attorno al lavoro.</p></div>
          </div>
        </section>

        <section className="sv-sec" aria-label="Cosa faccio io">
          <h2 className="sv-h2">Cosa faccio io.</h2>
          <div className="sv-price">
            <div className="sv-price__card">
              <span className="sv-price__name">Installazione</span>
              <p className="sv-price__big">Mezza giornata insieme.</p>
              <p className="sv-price__body">
                Installiamo l&apos;app, scegliamo quali cartelle può toccare e come organizzarle,
                scriviamo le istruzioni per cartella e quelle globali, colleghiamo Slack e Drive
                se li usi, e decidiamo la modalità di approvazione giusta per te. Alla fine gli
                fai fare un lavoro vero mentre guardo.
              </p>
            </div>
            <div className="sv-price__card">
              <span className="sv-price__name">Consulenza</span>
              <p className="sv-price__big">Su preventivo.</p>
              <p className="sv-price__body">
                Prima guardiamo cosa ti mangia le giornate, poi decidiamo cosa vale la pena
                automatizzare e cosa no. Ti imposto le attività programmate che servono e ti
                lascio una scheda con le istruzioni che abbiamo scritto, così le cambi da solo.
              </p>
            </div>
          </div>
          <div className="sv-guar" style={{ marginTop: 22 }}>
            <span>Resta tuo, gira sul tuo computer</span>
            <span>Nessun vincolo con me</span>
            <span>Rispondo entro 24h</span>
          </div>
        </section>

        <section className="sv-sec" aria-label="Prima di partire">
          <h2 className="sv-h2">Quello che ti dico prima, non dopo.</h2>
          <div className="sv-grid">
            <div className="sv-card"><h3>Serve un piano a pagamento</h3><p>Cowork è incluso in Pro, Max, Team ed Enterprise. L&apos;abbonamento lo paghi ad Anthropic e non passa da me: io ti faccio pagare il lavoro, non il software.</p></div>
            <div className="sv-card"><h3>L&apos;app deve restare aperta</h3><p>Per lavorare sui file del computer, usare il browser o agire sulla macchina, l&apos;app desktop va tenuta aperta e connessa per tutta la sessione. Su Windows e su Mac.</p></div>
            <div className="sv-card"><h3>Consuma più di una chat</h3><p>Un compito lungo brucia molti più crediti di una conversazione normale. Se lavori tutto il giorno, il piano Pro può starti stretto: meglio saperlo prima di scegliere.</p></div>
            <div className="sv-card"><h3>Da telefono è ancora in prova</h3><p>Su desktop è stabile. Su web e mobile è in beta, e per ora sui piani Max, Team ed Enterprise. Se ti serve seguire il lavoro dal telefono, mettiamolo in conto.</p></div>
          </div>
        </section>

        <section className="sv-cta" aria-label="Contatto">
          <h2>Dimmi cosa ti ruba il lunedì mattina.</h2>
          <p>
            Scrivimi qual è il lavoro che rifai ogni settimana sempre uguale. Ti rispondo entro 24
            ore dicendoti se Cowork lo risolve, come lo imposterei e quanto costa. Se non lo
            risolve te lo dico lo stesso.
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
