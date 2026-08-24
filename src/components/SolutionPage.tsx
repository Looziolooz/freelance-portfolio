"use client";

import Link from "next/link";
import Nav from "./Nav";
import SiteFooter from "./SiteFooter";
import ProjectGallery from "./ProjectGallery";
import SolutionCard from "./SolutionCard";
import { useLang } from "./LangProvider";
import {
  familyLabelKey,
  relatedSolutions,
  solutionProof,
  type Solution,
} from "@/lib/solutions";
import { SV_CSS } from "@/app/servizi/shared-css";
import { SOL_CSS } from "@/app/soluzioni/shared-css";

// Una soluzione, nell'ordine in cui si legge quando si sta valutando qualcuno:
// ti riconosci nel problema, controlli che parli di te, vedi cosa verrebbe
// costruito e cosa no, capisci cosa cambierebbe, e solo dopo guardi se la
// persona sa farlo davvero.
//
// Il catalogo da cui e' nata questa sezione mette ventidue sezioni per pagina,
// ma FAQ, integrazioni, funzionalita', confronto e tempi compaiono due volte
// ciascuno: e' conteggio parole, non informazione. Qui ogni cosa e' detta una
// volta sola.
//
// "Cosa non e' compreso" non e' un vezzo di onesta': e' la sezione che evita la
// discussione a lavoro iniziato, che e' il punto in cui un progetto piccolo si
// rovina. Per lo stesso motivo le fasi portano una durata e non una promessa.

/** "voce|voce" -> ["voce", …]. Vuoto se la chiave non e' tradotta. */
function list(raw: string, key: string): string[] {
  if (!raw || raw === key) return [];
  return raw.split("|").map((s) => s.trim()).filter(Boolean);
}

/** "Titolo::Corpo|…" -> [{title, body}] */
function pairs(raw: string, key: string): { title: string; body: string }[] {
  return list(raw, key)
    .map((chunk) => {
      const [title, body = ""] = chunk.split("::");
      return { title: title.trim(), body: body.trim() };
    })
    .filter((p) => p.title);
}

/** "Titolo::Durata::Corpo|…" -> [{title, when, body}] */
function triples(raw: string, key: string): { title: string; when: string; body: string }[] {
  return list(raw, key)
    .map((chunk) => {
      const [title, when = "", body = ""] = chunk.split("::");
      return { title: title.trim(), when: when.trim(), body: body.trim() };
    })
    .filter((p) => p.title);
}

export default function SolutionPage({ s }: { s: Solution }) {
  const { t } = useLang();
  const k = (suffix: string) => `sol.${s.key}.${suffix}`;
  const v = (suffix: string) => t(k(suffix));

  const signals = list(v("signals"), k("signals"));
  const build = pairs(v("build"), k("build"));
  const excludes = list(v("excludes"), k("excludes"));
  const phases = triples(v("phases"), k("phases"));
  const integra = list(v("integra"), k("integra"));
  const faq = pairs(v("faq"), k("faq"));

  const { items: proof, nearest } = solutionProof(s);
  const related = relatedSolutions(s);
  // Il disclaimer sui concept vale se anche uno solo dei lavori citati richiama
  // un marchio reale: e' la stessa nota che porta /work/[slug].
  const hasConcept = proof.some((p) => p.concept);

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
            {t(familyLabelKey(s.family))}
            {" · "}
            {s.sectors.map((id) => t(`sec.${id}.label`)).join(" · ")}
          </span>
          <h1 className="ct-title">{v("title")}</h1>
          <p className="sv-lede">{v("lede")}</p>
        </header>

        <section className="sv-sec" aria-label={t("sol.sec.problem")}>
          <h2 className="sv-h2">{t("sol.sec.problem")}</h2>
          <p className="sol-prose">{v("problem")}</p>
        </section>

        {signals.length > 0 && (
          <section className="sv-sec" aria-label={t("sol.sec.signals")}>
            <h2 className="sv-h2">{t("sol.sec.signals")}</h2>
            <ul className="sol-signals">
              {signals.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {build.length > 0 && (
          <section className="sv-sec" aria-label={t("sol.sec.build")}>
            <h2 className="sv-h2">{t("sol.sec.build")}</h2>
            <ul className="sol-build">
              {build.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {excludes.length > 0 && (
          <section className="sv-sec" aria-label={t("sol.sec.excludes")}>
            <h2 className="sv-h2">{t("sol.sec.excludes")}</h2>
            <p className="svp-proof-head">{t("sol.sec.excludes.sub")}</p>
            <ul className="sol-excludes">
              {excludes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        <section className="sv-sec" aria-label={t("sol.sec.change")}>
          <h2 className="sv-h2">{t("sol.sec.change")}</h2>
          <p className="sol-prose">{v("change")}</p>
        </section>

        {/* La prova, e che tipo di prova e'. Quando questa soluzione non ha
            ancora una demo sua, la pagina lo dice prima di mostrare i lavori
            vicini: un catalogo dove tutto sembra gia' fatto e' il catalogo di
            chiunque altro. */}
        {proof.length > 0 && (
          <section className="sv-sec svp-works" aria-label={t(nearest ? "sol.sec.proof.nearest" : "sol.sec.proof")}>
            <h2 className="sv-h2">{t(nearest ? "sol.sec.proof.nearest" : "sol.sec.proof")}</h2>
            <p className="svp-proof-head">
              {t(nearest ? "sol.sec.proof.nearest.sub" : "sol.sec.proof.sub")}
            </p>
            <ProjectGallery items={proof} showFilters={false} />
            {hasConcept && <p className="sol-note">{t("work.concept.note")}</p>}
          </section>
        )}

        <section className="sv-sec" aria-label={t("sol.sec.phases")}>
          <h2 className="sv-h2">{t("sol.sec.phases")}</h2>
          {phases.length > 0 && (
            <ol className="sol-phases">
              {phases.map((p) => (
                <li key={p.title} className="sol-phase">
                  <div className="sol-phase__head">
                    <span className="sol-phase__name">{p.title}</span>
                    {p.when && <span className="sol-phase__when">{p.when}</span>}
                  </div>
                  {p.body && <p className="sol-phase__body">{p.body}</p>}
                </li>
              ))}
            </ol>
          )}
          <p className="sol-time">
            <span className="sol-time__mark">{t("sol.sec.time")}</span>
            <span>{v("time")}</span>
          </p>
        </section>

        {integra.length > 0 && (
          <section className="sv-sec" aria-label={t("sol.sec.integra")}>
            <h2 className="sv-h2">{t("sol.sec.integra")}</h2>
            <p className="svp-proof-head">{t("sol.sec.integra.sub")}</p>
            <ul className="sol-chips">
              {integra.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        )}

        {faq.length > 0 && (
          <section className="sv-sec sol-faq" aria-label={t("sol.sec.faq")}>
            <h2 className="sv-h2">{t("sol.sec.faq")}</h2>
            {/* <details> nativi: accessibili, senza JavaScript, e la pagina
                resta leggibile anche se lo script non arriva mai. Stesso
                oggetto della FAQ in home. */}
            <div className="faq-list">
              {faq.map((q, i) => (
                <details key={q.title} className="faq-item" name={`sol-faq-${s.slug}`}>
                  <summary className="faq-q">
                    <span className="faq-n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{q.title}</span>
                    <span className="faq-mark" aria-hidden="true" />
                  </summary>
                  <div className="faq-a">
                    <p>{q.body}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="sv-sec" aria-label={t("sol.related")}>
            <h2 className="sv-h2">{t("sol.related")}</h2>
            <ul className="sol-grid">
              {related.map((o) => (
                <SolutionCard key={o.slug} s={o} />
              ))}
            </ul>
          </section>
        )}

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
