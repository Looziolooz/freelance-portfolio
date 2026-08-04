import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { SITE_URL } from "@/lib/launch";
import { getProject } from "@/lib/projects";
import { dict } from "@/i18n";
import { SV_CSS } from "../shared-css";

// First service landing page (SEO audit: six services sold, zero with a URL —
// non-brand organic entry was structurally zero). Server component, Italian
// only on purpose: it's the crawlable, citable surface for "sito web ristorante"
// class queries, and the food demos are the proof. More /servizi/* pages follow
// the same pattern as they come online.
export const metadata: Metadata = {
  title: "Siti web per ristoranti e piccole attività",
  description:
    "Siti su misura per ristoranti, gelaterie, bar e piccole attività: menù, prenotazioni e ordini, pronti in poche settimane. Preventivo fisso o abbonamento da 25€ al mese.",
};

// The proof: food & hospitality demos already in the gallery.
const PROOF_SLUGS = ["sushi", "brado", "gelateria", "pizzeria-restaurant", "bella-calabria", "aliva"];

const JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": `${SITE_URL}/servizi/siti-web#service`,
  name: "Siti web per ristoranti e piccole attività",
  serviceType: "Web design e sviluppo siti web",
  provider: { "@id": `${SITE_URL}/#org` },
  areaServed: [{ "@type": "Country", name: "Italia" }, { "@type": "Place", name: "Europa" }],
  description:
    "Siti su misura per la ristorazione e le piccole attività: menù, prenotazioni, ordini e visibilità su Google, con preventivo fisso concordato prima o abbonamento tutto incluso da 25€ al mese.",
  offers: [
    { "@type": "Offer", name: "Pagamento unico", description: "Preventivo fisso concordato prima di iniziare, 3 mesi di supporto inclusi, nessun costo ricorrente." },
    { "@type": "Offer", name: "Abbonamento tutto incluso", price: "25", priceCurrency: "EUR", description: "Da 25€ al mese: sito, hosting, dominio e aggiornamenti. 39€ al mese con gestione dei contenuti." },
  ],
};


export default function SitiWebPage() {
  const proof = PROOF_SLUGS
    .map((slug) => getProject(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p && !p.hidden))
    .map((p) => ({
      slug: p.slug,
      image: p.image,
      name: dict.it[`work.proj.${p.key}`] ?? p.slug,
      blurb: dict.it[`work.proj.${p.key}.blurb`] ?? "",
    }));

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
          <span className="ct-kicker">SERVIZI · SITI WEB</span>
          <h1 className="ct-title">Un sito che porta clienti al tavolo.</h1>
          <p className="sv-lede">
            Costruisco siti su misura per ristoranti, gelaterie, bar, negozi e piccole attività:
            menù che si legge dal telefono, prenotazioni senza telefonate, ordini e visibilità su
            Google. Pronto in poche settimane, con un prezzo deciso prima di iniziare.
          </p>
        </header>

        <section className="sv-sec" aria-label="Cosa include">
          <h2 className="sv-h2">Cosa include, in concreto.</h2>
          <div className="sv-grid">
            <div className="sv-card"><h3>Design su misura</h3><p>Niente template riciclati: il sito ha la faccia della tua attività, dai colori al tono.</p></div>
            <div className="sv-card"><h3>Menù e prenotazioni</h3><p>Menù leggibile dal telefono, prenotazione del tavolo o dell&apos;appuntamento senza telefonate.</p></div>
            <div className="sv-card"><h3>Veloce e mobile-first</h3><p>I tuoi clienti arrivano dallo smartphone: il sito si apre subito e si usa con un pollice.</p></div>
            <div className="sv-card"><h3>Trovabile su Google</h3><p>Struttura, testi e dati pensati per chi cerca &quot;ristorante vicino a me&quot;, e per gli assistenti AI.</p></div>
            <div className="sv-card"><h3>Testi e foto</h3><p>Se non hai materiali, li preparo io: testi che vendono e immagini curate.</p></div>
            <div className="sv-card"><h3>Statistiche chiare</h3><p>Vedi quante persone visitano, da dove arrivano e cosa funziona. Senza gergo.</p></div>
          </div>
        </section>

        <section className="sv-sec" aria-label="Esempi">
          <h2 className="sv-h2">Guarda con i tuoi occhi.</h2>
          <p style={{ margin: "0 0 20px", color: "var(--ink-muted)", maxWidth: 640, lineHeight: 1.6 }}>
            Siti dimostrativi che ho costruito per mostrarti stile e possibilità — ognuno con demo
            navigabile e identità di marca completa.
          </p>
          <div className="sv-proof">
            {proof.map((p) => (
              <Link key={p.slug} href={`/work/${p.slug}`} className="sv-proof__card">
                {p.image && (
                  <span className="sv-proof__img" style={{ display: "block" }}>
                    <Image src={p.image} alt={p.name} fill sizes="(max-width: 720px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </span>
                )}
                <span className="sv-proof__body" style={{ display: "block" }}>
                  <span className="sv-proof__name">{p.name}</span>
                  <span className="sv-proof__blurb" style={{ display: "-webkit-box" }}>{p.blurb}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="sv-sec" aria-label="Prezzi">
          <h2 className="sv-h2">Due formule, nessuna sorpresa.</h2>
          <div className="sv-price">
            <div className="sv-price__card">
              <span className="sv-price__name">Pagamento unico</span>
              <p className="sv-price__big">Preventivo fisso, deciso prima.</p>
              <p className="sv-price__body">
                Paghi una volta e il sito è tuo: codice, account e dominio a tuo nome, con 3 mesi
                di supporto inclusi. Nessun costo ricorrente, nessun vincolo.
              </p>
            </div>
            <div className="sv-price__card">
              <span className="sv-price__name">Abbonamento tutto incluso</span>
              <p className="sv-price__big">Da 25€ al mese.</p>
              <p className="sv-price__body">
                Sito, hosting, dominio e aggiornamenti compresi. Con 39€ al mese aggiungo la
                gestione dei contenuti: testi, foto e piccole modifiche ogni mese.
              </p>
            </div>
          </div>
          <div className="sv-guar" style={{ marginTop: 22 }}>
            <span>Prezzo deciso prima</span>
            <span>Il codice è tuo</span>
            <span>Rispondo entro 24h</span>
            <span>Lavoro a tappe: vedi tutto prima di pagare</span>
          </div>
        </section>

        <section className="sv-cta" aria-label="Audit gratuito">
          <h2>Hai già un sito? Te lo controllo gratis.</h2>
          <p>
            Mandami l&apos;indirizzo: ti rispondo entro 24 ore con tre cose concrete da migliorare
            subito per ottenere più clienti. Senza impegno.
          </p>
          <Link href="/contatti" className="neo-btn neo-btn-lg" style={{ textDecoration: "none", color: "var(--ink-body)", background: "var(--canvas-page)", padding: "14px 30px", fontSize: 16 }}>
            Richiedi l&apos;audit gratuito →
          </Link>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
