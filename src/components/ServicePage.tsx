"use client";

import Link from "next/link";
import Nav from "./Nav";
import ProjectGallery from "./ProjectGallery";
import BrandCoverGrid from "./BrandCoverGrid";
import CinematicFooter from "./CinematicFooter";
import { useLang } from "./LangProvider";
import { disciplineProjects, type Discipline } from "@/lib/disciplines";
import { SV_CSS } from "@/app/servizi/shared-css";

// Una pagina per disciplina: quello che vendo e la prova che l'ho fatto, nella
// stessa schermata.
//
// Prima erano due pagine. /servizi/<x> vendeva e /work/<x> mostrava, e il
// lettore doveva tornare indietro per vedere i lavori di cui aveva appena letto.
// Erano due meta' della stessa pagina tenute separate, e la meta' che vendeva
// era anche l'unica costruita per essere trovata dai motori: chi arrivava da una
// ricerca leggeva la promessa e non vedeva mai il lavoro.
//
// Le pagine servizio erano server component con l'italiano scritto nel codice,
// perche' in questo sito la lingua vive in localStorage e un server component non
// puo' sapere in che lingua e' il visitatore. Ora sono client component che
// leggono dal dizionario come il resto del sito: chi sceglie inglese o svedese
// legge la sua lingua. I dati strutturati e i metadata restano lato server nel
// layout di ogni rotta, quindi per i crawler non cambia niente rispetto a prima.
// Perche' anche loro vedano inglese e svedese servirebbero URL per lingua, che e'
// una migrazione a se'.
//
// L'ordine delle sezioni e' l'ordine in cui si compra: cosa ottieni, la prova,
// quanto dura e cosa sposta il preventivo, poi la chiamata.

/** "Titolo::Corpo|Titolo::Corpo" -> [{title, body}] */
function pairs(raw: string, key: string): { title: string; body: string }[] {
  if (!raw || raw === key) return [];
  return raw
    .split("|")
    .map((chunk) => {
      const [title, body = ""] = chunk.split("::");
      return { title: title.trim(), body: body.trim() };
    })
    .filter((c) => c.title);
}

const CSS = `
.svp-proof-head { margin: 0 0 20px; color: var(--ink-muted); max-width: 640px; line-height: 1.6; }

/* La griglia dei lavori dentro la pagina servizio non ha bisogno del margine
   della sezione autonoma: qui e' un capitolo, non una pagina. */
.svp-works .pg { padding-top: 0; }

.svp-drivers { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: clamp(14px, 2vw, 26px); }
@media (max-width: 760px) { .svp-drivers { grid-template-columns: 1fr; } }
.svp-driver { border: 3px solid var(--ink-border); border-radius: var(--radius); padding: 22px 20px; background: var(--canvas-panel-grey); }
.svp-driver dt {
  font-family: var(--font-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-green-deep);
  margin-bottom: 8px;
}
.svp-driver dd { margin: 0; font-size: 15px; line-height: 1.55; color: var(--ink-body); }

.svp-steps { list-style: none; margin: 18px 0 0; padding: 0 0 0 22px; position: relative; }
.svp-steps::before {
  content: "";
  position: absolute;
  left: 4px; top: 10px; bottom: 10px;
  width: 1px;
  background: color-mix(in srgb, var(--ink-border) 34%, transparent);
}
.svp-steps li { position: relative; padding: 8px 0; font-size: 15px; line-height: 1.5; color: var(--ink-body); }
.svp-steps li::before {
  content: "";
  position: absolute;
  left: -22px; top: 16px;
  width: 9px; height: 9px;
  border-radius: 50%;
  background: var(--canvas-page);
  border: 2px solid var(--accent-green-deep);
}
`;

export default function ServicePage({ d }: { d: Discipline }) {
  const { t } = useLang();
  const s = (k: string) => t(`serv.${d.id}.${k}`);
  const has = (k: string) => s(k) !== `serv.${d.id}.${k}`;

  const items = disciplineProjects(d);
  const includes = pairs(s("includes"), `serv.${d.id}.includes`);
  const chapters = pairs(s("chapters"), `serv.${d.id}.chapters`);
  const cost = pairs(s("cost"), `serv.${d.id}.cost`);
  const guarantees = has("guar") ? s("guar").split("|").map((g) => g.trim()) : [];

  // Passi, tempi e driver sono gia' scritti per la biforcazione di /processo:
  // la pagina servizio racconta la stessa strada, quindi legge le stesse chiavi
  // invece di riscriverle con parole leggermente diverse.
  const fork = (k: string) => t(`processo.fork.${d.id}.${k}`);
  const steps = fork("steps") !== `processo.fork.${d.id}.steps` ? fork("steps").split("|") : [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SV_CSS + CSS }} />
      <Nav />
      <main className="container sv">
        <header className="sv-head">
          <span className="ct-kicker">
            {t("nav.services")} · {t(`${d.key}.label`)}
          </span>
          <h1 className="ct-title">{s("title")}</h1>
          <p className="sv-lede">{s("lede")}</p>
          {/* Questa pagina vende la disciplina in astratto. Chi arriva qui con
              un'attivita' precisa in testa ha bisogno del caso concreto, ed e'
              a un clic. Il link va al catalogo intero e non a una vista
              filtrata: i filtri dell'hub sono stato locale, per non far uscire
              la griglia dal prerender. */}
          <p style={{ margin: "16px 0 0" }}>
            <Link
              href="/soluzioni"
              style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}
            >
              {t("serv.sol.link")} ↗
            </Link>
          </p>
        </header>

        {includes.length > 0 && (
          <section className="sv-sec" aria-label={s("includes.title")}>
            <h2 className="sv-h2">{s("includes.title")}</h2>
            <div className="sv-grid">
              {includes.map((c) => (
                <div key={c.title} className="sv-card">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* La prova, nella stessa pagina della promessa. */}
        {items.length > 0 && (
          <section className="sv-sec svp-works" aria-label={s("proof.title")}>
            <h2 className="sv-h2">{s("proof.title")}</h2>
            {has("proof.sub") && <p className="svp-proof-head">{s("proof.sub")}</p>}
            {d.proof === "covers" ? (
              <BrandCoverGrid items={items} />
            ) : (
              <ProjectGallery items={items} showFilters={false} />
            )}
            {has("proof.more") && (
              <p style={{ margin: "18px 0 0", lineHeight: 1.6 }}>
                <Link href={s("proof.more.href")} style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}>
                  {s("proof.more")} ↗
                </Link>
              </p>
            )}
          </section>
        )}

        {/* Capitoli propri della disciplina: quello che non entra in una scheda. */}
        {chapters.length > 0 && (
          <section className="sv-sec" aria-label={s("chapters.title")}>
            <h2 className="sv-h2">{s("chapters.title")}</h2>
            {has("chapters.sub") && <p className="svp-proof-head">{s("chapters.sub")}</p>}
            <div className="sv-grid">
              {chapters.map((c) => (
                <div key={c.title} className="sv-card">
                  <h3>{c.title}</h3>
                  <p>{c.body}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="sv-sec" aria-label={s("how.title")}>
          <h2 className="sv-h2">{s("how.title")}</h2>
          {steps.length > 0 && (
            <ol className="svp-steps">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
          <dl className="svp-drivers" style={{ marginTop: 26 }}>
            <div className="svp-driver">
              <dt>{t("processo.fork.lbl.time")}</dt>
              <dd>{fork("time")}</dd>
            </div>
            <div className="svp-driver">
              <dt>{t("processo.fork.lbl.driver")}</dt>
              <dd>{fork("driver")}</dd>
            </div>
          </dl>

          {cost.length > 0 && (
            <div className="sv-price" style={{ marginTop: 22 }}>
              {cost.map((c) => (
                <div key={c.title} className="sv-price__card">
                  <span className="sv-price__name">{c.title}</span>
                  <p className="sv-price__body">{c.body}</p>
                </div>
              ))}
            </div>
          )}

          <p style={{ margin: "18px 0 0", color: "var(--ink-muted)", lineHeight: 1.6 }}>
            <Link href="/prezzi" style={{ color: "var(--accent-green-deep)", fontWeight: 600 }}>
              {t("serv.pricelink")}
            </Link>{" "}
            {t("serv.pricelink.after")}
          </p>

          {guarantees.length > 0 && (
            <div className="sv-guar" style={{ marginTop: 22 }}>
              {guarantees.map((g) => (
                <span key={g}>{g}</span>
              ))}
            </div>
          )}
        </section>

        <section className="sv-cta" aria-label={s("cta.title")}>
          <h2>{s("cta.title")}</h2>
          <p>{s("cta.body")}</p>
          <Link
            href="/contatti"
            className="neo-btn neo-btn-lg"
            style={{
              textDecoration: "none",
              color: "var(--ink-body)",
              background: "var(--canvas-page)",
              padding: "14px 30px",
              fontSize: 16,
            }}
          >
            {t("nav.cta")} →
          </Link>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
