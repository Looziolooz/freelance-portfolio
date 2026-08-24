"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";
import { familyLabelKey, isDemonstrated, type Solution } from "@/lib/solutions";

// La scheda del catalogo. Vive in un componente suo perche' la usano tre
// superfici: l'hub, la pagina settore e il piede "altre soluzioni vicine".
//
// Tutta la scheda e' il link. Un titolo cliccabile dentro un riquadro che non
// lo e' costringe a mirare, e su questa griglia si mira col pollice.
//
// La pastiglia in alto a destra dice se dietro c'e' una demo o no. E' scomoda e
// va tenuta: un catalogo dove tutto sembra gia' fatto e' il catalogo di
// chiunque altro, e la differenza si vede solo se e' dichiarata.
export default function SolutionCard({
  s,
  /** La pagina settore nasconde i tag: li' sono tutti dello stesso settore e
   *  ripeterlo su ogni scheda non dice niente a chi legge. */
  showSectors = true,
}: {
  s: Solution;
  showSectors?: boolean;
}) {
  const { t } = useLang();
  const demo = isDemonstrated(s);

  return (
    <li>
      <Link href={`/soluzioni/${s.slug}`} className="sol-card">
        <span className="sol-card__top">
          <span className="sol-card__disc">{t(familyLabelKey(s.family))}</span>
          <span className={`sol-card__tier${demo ? " is-demo" : ""}`}>
            {t(demo ? "sol.badge.demo" : "sol.badge.commessa")}
          </span>
        </span>
        <h3 className="sol-card__title">{t(`sol.${s.key}.title`)}</h3>
        <p className="sol-card__lede">{t(`sol.${s.key}.lede`)}</p>
        {showSectors && (
          <span className="sol-card__tags">
            {s.sectors.slice(0, 3).map((id) => (
              <span key={id} className="sol-tag">
                {t(`sec.${id}.label`)}
              </span>
            ))}
            {s.sectors.length > 3 && (
              <span className="sol-tag">+{s.sectors.length - 3}</span>
            )}
          </span>
        )}
      </Link>
    </li>
  );
}
