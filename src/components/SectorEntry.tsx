"use client";

import Link from "next/link";
import { useRef } from "react";
import { useInView } from "framer-motion";
import { useLang } from "./LangProvider";
import { LIVE_SECTORS, solutionsBySector, type Sector } from "@/lib/solutions";

// La porta della home verso il catalogo: un settore per riga, ogni riga un link
// alla sua pagina. Prende il posto della lista delle quattro discipline
// (SkillsList): quella chiedeva al visitatore di riconoscersi in un nostro
// mestiere ("Visibilita'"), questa gli chiede solo che attivita' ha, che e'
// l'unica domanda a cui sa gia' rispondere.
//
// La meccanica e' la stessa, presa di peso perche' era gia' tarata: la riga che
// attraversa la meta' del viewport si accende (useInView con margine
// -50% 0px -50%: il root collassa a una linea, "in view" significa "sulla
// linea di mezzo"), il puntatore su una spegne le altre, tutto in transizioni
// CSS cosi' hover, focus e reduced-motion compongono da sole.
//
// I settori mostrati sono i sei piu' ricchi di soluzioni pubblicate, calcolati
// dai dati e non scritti a mano: quando il catalogo cresce, la home segue da
// sola. "trasversale" e' escluso perche' non risponde alla domanda "che
// attivita' hai". L'ultima riga porta al catalogo intero.
const ROWS: Sector[] = LIVE_SECTORS
  .filter((s) => s.id !== "trasversale")
  .map((s) => ({ s, n: solutionsBySector(s.id).length }))
  .sort((a, b) => b.n - a.n)
  .slice(0, 6)
  .map((x) => x.s);

const CSS = `
.sce {
  --sce-ground: #1B1813;
  --sce-ink: #F4F1EA;
  --sce-dim: #6E675C;
  position: relative;
  background: var(--sce-ground);
  color: var(--sce-ink);
  border-top: 3px solid var(--ink-border);
  border-bottom: 3px solid var(--ink-border);
  padding: clamp(48px, 8vw, 120px) 0;
  overflow: hidden;
}
.sce__inner { display: flex; align-items: flex-start; gap: clamp(18px, 4vw, 56px); }

.sce__label {
  flex: 0 0 auto;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: var(--font-mono);
  font-size: clamp(11px, 1.1vw, 13px);
  font-weight: 700;
  letter-spacing: 0.34em;
  text-transform: uppercase;
  color: var(--sce-ink);
  padding-top: 0.4em;
}

.sce__list { list-style: none; margin: 0; padding: 0; min-width: 0; flex: 1 1 auto; }
.sce__item + .sce__item { margin-top: clamp(2px, 0.6vw, 10px); }

/* I nomi di settore sono piu' lunghi di una parola-disciplina, quindi il corpo
   scende di un gradino rispetto alla lista che c'era prima: "Barbieri e saloni"
   deve restare su una riga anche a 390px. */
.sce__link {
  display: flex;
  align-items: baseline;
  gap: 0.45em;
  text-decoration: none;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(27px, 6.4vw, 84px);
  line-height: 1.04;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--sce-dim);
  transition: color 0.4s var(--ease), opacity 0.4s var(--ease);
}
/* Accesa vuol dire ocra: su questo fondo d'inchiostro il testo ocra regge il
   contrasto (la regola del testo scuro vale per i riempimenti chiari). */
.sce__item.is-on .sce__link,
.sce__link:hover,
.sce__link:focus-visible { color: var(--accent-green); }
.sce__link:focus-visible { outline: 2px solid var(--accent-green); outline-offset: 6px; }

.sce__list:hover .sce__link { opacity: 0.45; }
.sce__list:hover .sce__link:hover { opacity: 1; }

/* Il conteggio dice che dietro la parola c'e' sostanza, non una landing vuota. */
.sce__n {
  font-family: var(--font-mono);
  font-size: clamp(10px, 1vw, 12.5px);
  font-weight: 700;
  letter-spacing: 0.08em;
  color: var(--sce-dim);
  transition: color 0.4s var(--ease);
  white-space: nowrap;
}
.sce__item.is-on .sce__n,
.sce__link:hover .sce__n,
.sce__link:focus-visible .sce__n { color: var(--sce-ink); }

.sce__arrow {
  font-size: 0.34em;
  color: var(--accent-green);
  opacity: 0;
  transform: translateX(-0.3em);
  transition: opacity 0.35s var(--ease), transform 0.35s var(--ease);
}
.sce__item.is-on .sce__arrow,
.sce__link:hover .sce__arrow,
.sce__link:focus-visible .sce__arrow { opacity: 1; transform: translateX(0); }

/* L'ultima riga e' l'uscita verso il catalogo intero: piu' piccola, mono, con
   il filo sotto. Non compete con i settori, li chiude. */
.sce__all {
  margin-top: clamp(20px, 3vw, 36px);
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: clamp(12px, 1.2vw, 14px);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sce-ink);
  text-decoration: none;
  border-bottom: 2px solid var(--accent-green);
  padding-bottom: 4px;
}
.sce__all:hover, .sce__all:focus-visible { color: var(--accent-green); }

@media (prefers-reduced-motion: reduce) {
  .sce__link, .sce__arrow, .sce__n { transition: none; }
}
`;

function Row({ sector }: { sector: Sector }) {
  const { t } = useLang();
  const ref = useRef<HTMLLIElement>(null);
  const onCentre = useInView(ref, { margin: "-50% 0px -50% 0px" });
  const n = solutionsBySector(sector.id).length;
  return (
    <li ref={ref} className={`sce__item${onCentre ? " is-on" : ""}`}>
      <Link href={`/soluzioni/settore/${sector.slug}`} className="sce__link">
        {t(`sec.${sector.id}.label`)}
        <span className="sce__n">
          {n} {n === 1 ? t("sol.count.one") : t("sol.count.many")}
        </span>
        <span className="sce__arrow" aria-hidden="true">&#8599;</span>
      </Link>
    </li>
  );
}

export default function SectorEntry() {
  const { t } = useLang();
  return (
    <section className="sce" aria-labelledby="sce-title">
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="container sce__inner">
        {/* h2 vero, non uno span decorativo: la home aveva una struttura di
            intestazioni piatta (audit agent-readiness) e questa sezione era
            l'unica fermata senza titolo. Stessa veste di prima, via classe. */}
        <h2 id="sce-title" className="sce__label" style={{ margin: 0, fontWeight: 700 }}>{t("home.sectors.label")}</h2>
        <div style={{ minWidth: 0, flex: "1 1 auto" }}>
          <ul className="sce__list">
            {ROWS.map((s) => (
              <Row key={s.id} sector={s} />
            ))}
          </ul>
          <Link href="/soluzioni" className="sce__all">
            {t("home.sectors.all")} <span aria-hidden="true">&#8594;</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
