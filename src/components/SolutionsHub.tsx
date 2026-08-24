"use client";

import { useState } from "react";
import Link from "next/link";
import Nav from "./Nav";
import CinematicFooter from "./CinematicFooter";
import SolutionCard from "./SolutionCard";
import { useLang } from "./LangProvider";
import {
  LIVE_FAMILIES,
  LIVE_SECTORS,
  SOLUTIONS,
  familyLabelKey,
  solutionsBySector,
  type Family,
  type SectorId,
} from "@/lib/solutions";
import { SV_CSS } from "@/app/servizi/shared-css";
import { SOL_CSS } from "@/app/soluzioni/shared-css";

// L'hub del catalogo: due file di filtri e una griglia.
//
// I filtri sono stato locale e NON vivono nella query string, ed e' una
// correzione a una prima versione che ce li metteva.
//
// Misurato su una build di produzione: con useSearchParams l'intero
// sottoalbero esce dal prerender, e l'HTML statico di /soluzioni arrivava ai
// crawler con la sola fallback di Suspense. Cioe' la pagina da cui partono i
// link a tutte le altre non conteneva nessuno di quei link: e' lo stesso
// problema di orfanaggio che site-links.ts esiste per evitare, ricreato piu'
// in grande.
//
// Un filtro condivisibile non vale quel prezzo, anche perche' l'indirizzo da
// mandare a qualcuno esiste gia' ed e' migliore: /soluzioni/settore/<slug> e'
// una pagina vera, con la sua introduzione e i suoi lavori, e i motori la
// trattano come contenuto invece che come una vista filtrata.

export default function SolutionsHub() {
  const { t } = useLang();
  const [fam, setFam] = useState<Family | null>(null);
  const [sect, setSect] = useState<SectorId | null>(null);

  const visible = SOLUTIONS.filter(
    (s) => (!fam || s.family === fam) && (!sect || s.sectors.includes(sect)),
  );

  // I conteggi tengono conto dell'altro filtro gia' attivo: una pastiglia che
  // promette 4 e ne apre 0 e' peggio che non avere il numero.
  const countFam = (id: Family | null) =>
    SOLUTIONS.filter((s) => (!id || s.family === id) && (!sect || s.sectors.includes(sect))).length;
  const countSect = (id: SectorId | null) =>
    SOLUTIONS.filter((s) => (!fam || s.family === fam) && (!id || s.sectors.includes(id))).length;

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

        <div className="sol-filters" role="group" aria-label={t("sol.hub.byDisc")}>
          <span className="sol-filters__label">{t("sol.hub.byDisc")}</span>
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

        <div className="sol-filters" role="group" aria-label={t("sol.hub.bySector")}>
          <span className="sol-filters__label">{t("sol.hub.bySector")}</span>
          <div className="pg-filters">
            <button
              type="button"
              className={`pg-filter${!sect ? " is-active" : ""}`}
              aria-pressed={!sect}
              onClick={() => setSect(null)}
            >
              {t("sol.filter.all")} <i>{countSect(null)}</i>
            </button>
            {LIVE_SECTORS.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pg-filter${sect === s.id ? " is-active" : ""}`}
                aria-pressed={sect === s.id}
                onClick={() => setSect(sect === s.id ? null : s.id)}
              >
                {t(`sec.${s.id}.label`)} <i>{countSect(s.id)}</i>
              </button>
            ))}
          </div>
        </div>

        {visible.length > 0 ? (
          <ul className="sol-grid">
            {visible.map((s) => (
              <SolutionCard key={s.slug} s={s} />
            ))}
          </ul>
        ) : (
          <p className="sol-empty">
            {t("sol.hub.empty")}
            <button
              type="button"
              onClick={() => {
                setFam(null);
                setSect(null);
              }}
            >
              {t("sol.hub.reset")}
            </button>
          </p>
        )}

        <section className="sv-sec" aria-label={t("sol.hub.sectors.title")}>
          <h2 className="sv-h2">{t("sol.hub.sectors.title")}</h2>
          <p className="svp-proof-head">{t("sol.hub.sectors.sub")}</p>
          <ul className="sol-sectors">
            {LIVE_SECTORS.map((s) => {
              const n = solutionsBySector(s.id).length;
              return (
                <li key={s.id}>
                  <Link href={`/soluzioni/settore/${s.slug}`} className="sol-sector">
                    {t(`sec.${s.id}.label`)}
                    <i>
                      {n} {plural(n)}
                    </i>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

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
      <CinematicFooter />
    </>
  );
}
