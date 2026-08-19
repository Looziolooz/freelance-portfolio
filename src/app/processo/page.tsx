"use client";

import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import ProcessTimeline, { type TimelineEntry } from "@/components/ProcessTimeline";
import ProcessForks from "@/components/ProcessForks";
import { useLang } from "@/components/LangProvider";

// /processo - "Come lavoro". The drawn journey, then the fork.
//
// The line used to run four phases for everybody, and phase 03 quietly carried
// "site, e-commerce, automations and AI" inside one bullet list. Those are four
// separate packages, each with its own path, and flattening them made the page
// vague exactly where a buyer wants it specific. So the timeline now covers only
// the two steps that really are shared - the call and the plan - and ProcessForks
// takes over where the roads part.
//
// The closing CTA block styles live in globals.css: /prezzi reuses them.

export default function ProcessoPage() {
  const { t } = useLang();

  // Only the shared stretch has photographs now; p3/p4 belonged to phases that
  // are no longer universal.
  const IMAGES = [
    { src: "/processo/p1.png", w: 1065, h: 1008 },
    { src: "/processo/p2.png", w: 1024, h: 1024 },
  ];

  const entries: TimelineEntry[] = [1, 2].map((n, i) => {
    const k = `processo.p${n}`;
    return {
      phase: `${t("processo.fase")} ${String(n).padStart(2, "0")}`,
      title: t(`${k}.name`),
      statement: t(`${k}.statement`),
      body: t(`${k}.body`),
      bullets: [t(`${k}.b1`), t(`${k}.b2`), t(`${k}.b3`)],
      meta: [
        { label: t("processo.meta.deliver"), value: t(`${k}.d1`) },
        { label: t("processo.meta.duration"), value: t(`${k}.d2`) },
        { label: t("processo.meta.you"), value: t(`${k}.d3`) },
      ],
      image: IMAGES[i].src,
      alt: t(`${k}.name`),
      w: IMAGES[i].w,
      h: IMAGES[i].h,
    };
  });

  return (
    <>
      <Nav />
      <main
        style={{
          paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))",
          paddingBottom: "clamp(70px, 9vw, 130px)",
        }}
      >
        <header className="container ct-head">
          <span className="ct-kicker">{t("processo.num")}</span>
          <h1 className="ct-title">{t("processo.title")}</h1>
          <p className="ct-sub">{t("processo.sub")}</p>
        </header>

        {/* The shared stretch: the same two steps whatever we end up building. */}
        <ProcessTimeline entries={entries} />

        {/* Where the roads part, one lane per package. */}
        <ProcessForks />

        <section className="container">
          <div className="proc-cta">
            <h2 className="proc-cta__title">{t("processo.cta.title")}</h2>
            <p className="proc-cta__body">{t("processo.cta.body")}</p>
            <div className="proc-cta__btns">
              <a
                href="/contatti"
                className="neo-btn neo-btn--primary"
                style={{ textDecoration: "none", padding: "14px 28px", fontSize: 15 }}
              >
                {t("processo.cta.btn1")} <span aria-hidden="true">→</span>
              </a>
              <a
                href="/work"
                className="neo-btn"
                style={{ textDecoration: "none", color: "var(--ink-body)", padding: "14px 28px", fontSize: 15 }}
              >
                {t("processo.cta.btn2")} <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
