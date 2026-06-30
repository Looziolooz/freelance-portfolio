"use client";

import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import ProcessTimeline, { type TimelineEntry } from "@/components/ProcessTimeline";
import { useLang } from "@/components/LangProvider";

// /processo — "Come lavoro": the four-phase method as an Aceternity-style vertical
// timeline, re-themed Parchment & Forest (ochre→forest scroll rail, sticky phase
// labels, content + a realistic photo scrolling past on the right).
const CTA_CSS = `
.proc-cta {
  margin-top: clamp(64px, 8vw, 110px);
  border: 3px solid var(--ink-border);
  border-radius: var(--radius);
  background: var(--canvas-panel-yellow);
  box-shadow: var(--shadow-card);
  padding: clamp(34px, 5vw, 68px) clamp(24px, 4vw, 48px);
  text-align: center;
}
.proc-cta__title { margin: 0 0 12px; font-family: var(--font-display); font-size: clamp(28px, 4vw, 54px); font-weight: 600; letter-spacing: -0.02em; line-height: 1.03; }
.proc-cta__body { margin: 0 auto 28px; max-width: 540px; font-size: 16px; line-height: 1.6; color: var(--ink-muted); }
.proc-cta__btns { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
`;

export default function ProcessoPage() {
  const { t } = useLang();

  const IMAGES = [
    "/processo/p1.png",
    "/processo/p2.jpg",
    "/processo/p3.jpg",
    "/processo/p4.jpg",
  ];

  const entries: TimelineEntry[] = [1, 2, 3, 4].map((n, i) => {
    const k = `processo.p${n}`;
    return {
      phase: `${t("processo.fase")} ${String(n).padStart(2, "0")}`,
      title: t(`${k}.name`),
      statement: t(`${k}.statement`),
      body: t(`${k}.body`),
      bullets: [t(`${k}.b1`), t(`${k}.b2`), t(`${k}.b3`)],
      image: IMAGES[i],
      alt: t(`${k}.name`),
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CTA_CSS }} />
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

        <ProcessTimeline entries={entries} />

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
