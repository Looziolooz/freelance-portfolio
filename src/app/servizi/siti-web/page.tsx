import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { SITE_URL } from "@/lib/launch";
import { getProject } from "@/lib/projects";
import { dict } from "@/i18n";

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

const CSS = `
.sv { padding-top: calc(var(--topbar-h) + clamp(44px, 7vw, 96px)); padding-bottom: clamp(70px, 9vw, 130px); }
.sv-head { max-width: 780px; }
.sv-lede { font-size: clamp(17px, 1.8vw, 20px); line-height: 1.6; color: var(--ink-muted); max-width: 640px; margin: 18px 0 0; }
.sv-sec { margin-top: clamp(48px, 7vw, 88px); }
.sv-h2 { font-family: var(--font-display); font-size: clamp(26px, 3.6vw, 40px); font-weight: 600; letter-spacing: -0.015em; margin: 0 0 18px; }
.sv-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 16px; }
.sv-card { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 18px 20px; }
.sv-card h3 { font-family: var(--font-display); font-size: 19px; font-weight: 600; margin: 0 0 6px; }
.sv-card p { margin: 0; font-size: 14.5px; line-height: 1.55; color: var(--ink-muted); }
.sv-proof { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 18px; }
.sv-proof__card { display: block; border: 3px solid var(--ink-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); text-decoration: none; color: var(--ink-body); transition: transform .15s ease-out, box-shadow .15s ease-out; }
.sv-proof__card:hover { transform: translate(-2px,-2px); box-shadow: 7px 7px 0 var(--ink-shadow); color: var(--ink-body); }
.sv-proof__img { position: relative; aspect-ratio: 16/10; }
.sv-proof__body { padding: 12px 16px 14px; }
.sv-proof__name { font-family: var(--font-display); font-size: 18px; font-weight: 600; }
.sv-proof__blurb { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 4px 0 0; font-size: 13px; line-height: 1.45; color: var(--ink-muted); }
.sv-price { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px; max-width: 880px; }
.sv-price__card { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-panel-yellow); box-shadow: 4px 4px 0 var(--ink-shadow); padding: 24px; }
.sv-price__name { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; color: var(--accent-green-deep); }
.sv-price__big { font-family: var(--font-display); font-size: clamp(24px, 3vw, 34px); font-weight: 600; margin: 8px 0 10px; }
.sv-price__body { margin: 0; font-size: 14.5px; line-height: 1.6; color: var(--ink-body); }
.sv-cta { margin-top: clamp(56px, 8vw, 100px); border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--accent-green); box-shadow: 6px 6px 0 var(--ink-shadow); padding: clamp(30px, 5vw, 56px); text-align: center; }
.sv-cta h2 { font-family: var(--font-display); font-size: clamp(26px, 4vw, 46px); font-weight: 600; letter-spacing: -0.02em; color: var(--btn-ink); margin: 0 0 10px; }
.sv-cta p { margin: 0 auto 24px; max-width: 520px; font-size: 16px; line-height: 1.6; color: var(--btn-ink); }
.sv-guar { display: flex; flex-wrap: wrap; gap: 12px; }
.sv-guar span { font-family: var(--font-mono); font-size: 12.5px; font-weight: 700; letter-spacing: .03em; padding: 9px 15px; border: 2px solid var(--ink-border); border-radius: 999px; background: var(--canvas-panel-yellow); }
`;

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
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
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
            <div className="sv-card"><h3>Trovabile su Google</h3><p>Struttura, testi e dati pensati per chi cerca &quot;ristorante vicino a me&quot; — e per gli assistenti AI.</p></div>
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
