"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "./Nav";
import SiteFooter from "./SiteFooter";
import SolutionCard from "./SolutionCard";
import { useLang } from "./LangProvider";
import {
  LIVE_FAMILIES,
  LIVE_SECTORS,
  SOLUTIONS,
  familyLabelKey,
  solutionsBySector,
  type Family,
} from "@/lib/solutions";
import { SERVICE_LINKS } from "@/lib/site-links";
import { SV_CSS } from "@/app/servizi/shared-css";
import { SOL_CSS } from "@/app/soluzioni/shared-css";

// L'hub del catalogo, seconda versione.
//
// La prima apriva con diciotto pastiglie di filtro su due assi e ripeteva gli
// stessi dodici settori come directory in fondo: un pannello di controllo, non
// una vetrina, e il visitatore doveva imparare la nostra tassonomia prima di
// trovare la sua risposta. Ora la pagina fa una domanda sola, subito: che
// attivita' hai. I settori sono card grandi in testa, ognuna una pagina vera
// (/soluzioni/settore/<slug>, che i motori trattano come contenuto, non come
// vista filtrata). Sotto, l'elenco completo con UN filtro secondario per tipo
// di lavoro.
//
// Il filtro resta stato locale e MAI useSearchParams: misurato su una build di
// produzione, con useSearchParams l'intero sottoalbero usciva dal prerender e
// l'HTML statico arrivava ai crawler senza un solo link.

export default function SolutionsHub() {
  const { t } = useLang();
  const [fam, setFam] = useState<Family | null>(null);

  const visible = SOLUTIONS.filter((s) => !fam || s.family === fam);
  const countFam = (id: Family | null) =>
    SOLUTIONS.filter((s) => !id || s.family === id).length;

  const plural = (n: number) => (n === 1 ? t("sol.count.one") : t("sol.count.many"));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SV_CSS + SOL_CSS }} />
      <Nav />
      <main className="container sv">
        <header className="sv-head">
          <span className="ct-kicker">{t("sol.hub.eyebrow")}</span>
          <h1 className="ct-title">{t("sol.hub.title")}</h1>
          <p className="sv-lede">{t("sol.hub.lede")}</p>
        </header>

        {/* La domanda giusta per prima: il settore. Ogni card porta il titolo
            della sua pagina, cosi' la promessa e' la stessa che si trova
            dall'altra parte del clic. */}
        <section className="sv-sec" aria-label={t("sol.hub.sectors.title")}>
          <h2 className="sv-h2">{t("sol.hub.sectors.title")}</h2>
          <p className="svp-proof-head">{t("sol.hub.sectors.sub")}</p>
          <ul className="sol-seccards">
            {LIVE_SECTORS.map((s) => {
              const n = solutionsBySector(s.id).length;
              return (
                <li key={s.id}>
                  <Link href={`/soluzioni/settore/${s.slug}`} className="sol-seccard">
                    <span className="sol-seccard__name">{t(`sec.${s.id}.label`)}</span>
                    <span className="sol-seccard__promise">{t(`sec.${s.id}.title`)}</span>
                    <span className="sol-seccard__n">
                      {n} {plural(n)}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* L'elenco completo, con l'unico filtro rimasto: il tipo di lavoro. */}
        <section className="sv-sec" aria-label={t("sol.hub.listTitle")}>
          <h2 className="sv-h2">{t("sol.hub.listTitle")}</h2>
          <div className="sol-filters" role="group" aria-label={t("sol.hub.byDisc")}>
            <div className="pg-filters">
              <button
                type="button"
                className={`pg-filter${!fam ? " is-active" : ""}`}
                aria-pressed={!fam}
                onClick={() => setFam(null)}
              >
                {t("sol.filter.all")} <i>{countFam(null)}</i>
              </button>
              {LIVE_FAMILIES.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`pg-filter${fam === f ? " is-active" : ""}`}
                  aria-pressed={fam === f}
                  onClick={() => setFam(fam === f ? null : f)}
                >
                  {t(familyLabelKey(f))} <i>{countFam(f)}</i>
                </button>
              ))}
            </div>
          </div>
          <ul className="sol-grid">
            {visible.map((s) => (
              <SolutionCard key={s.slug} s={s} />
            ))}
          </ul>
        </section>

        {/* I quattro mestieri, in sordina: le pagine disciplina sono lander
            secondari usciti dalla barra, e questa riga con il footer e' cio'
            che le tiene raggiungibili. Una riga, non una griglia: qui non
            devono competere con le soluzioni che hanno sopra. */}
        <nav className="sol-trades" aria-label={t("footer.services")}>
          <span className="sol-trades__lbl">{t("footer.services")}</span>
          {SERVICE_LINKS.map((sv) => (
            <Link key={sv.href} href={sv.href} className="sol-trades__link">
              {t(sv.labelKey)}
            </Link>
          ))}
        </nav>

        <section className="sv-cta" aria-label={t("sol.cta.title")}>
          <h2>{t("sol.cta.title")}</h2>
          <p>{t("sol.cta.body")}</p>
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
      <SiteFooter />
    </>
  );
}
