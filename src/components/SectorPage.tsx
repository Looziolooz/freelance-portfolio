"use client";

import Link from "next/link";
import Nav from "./Nav";
import SiteFooter from "./SiteFooter";
import ProjectGallery from "./ProjectGallery";
import SolutionCard from "./SolutionCard";
import { useLang } from "./LangProvider";
import {
  LIVE_SECTORS,
  sectorProof,
  solutionsBySector,
  type Sector,
} from "@/lib/solutions";
import { SV_CSS } from "@/app/servizi/shared-css";
import { SOL_CSS } from "@/app/soluzioni/shared-css";

// La pagina settore. E' il motivo per cui questa sezione non e' solo una
// griglia con dei filtri: /soluzioni?settore=ristorazione e
// /soluzioni/settore/ristorazione mostrano lo stesso insieme, ma solo la
// seconda e' un indirizzo che un motore tratta come contenuto proprio, con un
// suo titolo, una sua introduzione e i suoi lavori.
//
// Per questo l'introduzione e' scritta a mano settore per settore invece di
// essere generata dal nome: una pagina che ripete la lista che ha gia' sotto
// non merita di esistere e non si posiziona.

export default function SectorPage({ sector }: { sector: Sector }) {
  const { t } = useLang();
  const solutions = solutionsBySector(sector.id);
  const proof = sectorProof(sector.id);
  const others = LIVE_SECTORS.filter((s) => s.id !== sector.id);
  const hasConcept = proof.some((p) => p.concept);

  const introKey = `sec.${sector.id}.intro`;
  const introRaw = t(introKey);
  const intro = introRaw === introKey ? [] : introRaw.split("|").map((p) => p.trim());

  const plural = (n: number) => (n === 1 ? t("sol.count.one") : t("sol.count.many"));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: SV_CSS + SOL_CSS }} />
      <Nav />
      <main className="container sv">
        <header className="sv-head">
          <Link href="/soluzioni" className="sol-crumb">
            ← {t("sol.back")}
          </Link>
          <span className="ct-kicker">
            {t("sol.hub.eyebrow")} · {t(`sec.${sector.id}.label`)}
          </span>
          <h1 className="ct-title">{t(`sec.${sector.id}.title`)}</h1>
          {intro.map((p, i) => (
            <p key={i} className={i === 0 ? "sv-lede" : "sol-prose"} style={i > 0 ? { marginTop: 14, maxWidth: 640 } : undefined}>
              {p}
            </p>
          ))}
        </header>

        {solutions.length > 0 && (
          <section className="sv-sec" aria-label={t("sec.sol.title")}>
            <h2 className="sv-h2">{t("sec.sol.title")}</h2>
            <ul className="sol-grid">
              {solutions.map((s) => (
                <SolutionCard key={s.slug} s={s} showSectors={false} />
              ))}
            </ul>
          </section>
        )}

        {proof.length > 0 && (
          <section className="sv-sec svp-works" aria-label={t("sec.proof.title")}>
            <h2 className="sv-h2">{t("sec.proof.title")}</h2>
            <p className="svp-proof-head">{t("sol.sec.proof.sub")}</p>
            <ProjectGallery items={proof} showFilters={false} />
            {hasConcept && <p className="sol-note">{t("work.concept.note")}</p>}
          </section>
        )}

        <section className="sv-sec" aria-label={t("sec.other.title")}>
          <h2 className="sv-h2">{t("sec.other.title")}</h2>
          <ul className="sol-sectors">
            {others.map((s) => {
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
      <SiteFooter />
    </>
  );
}
