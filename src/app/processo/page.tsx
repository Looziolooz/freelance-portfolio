"use client";

import { useEffect, useRef } from "react";
import Nav from "@/components/Nav";
import CinematicFooter from "@/components/CinematicFooter";
import { useLang } from "@/components/LangProvider";

// /processo — "Come lavoro": a four-phase method page. Inspiration (not a clone)
// from a branding-agency process page: bold numbered phases with sticky markers
// and content that scrolls past. Restyled to the brand — warm neo-brutalist,
// parchment canvas, Fraunces display, mono labels, hard ink borders + offsets,
// no blur/glass/gradients. Reveal is opacity-only so the sticky markers (which
// break under a transformed ancestor) keep working.
const CSS = `
.proc-list { display: flex; flex-direction: column; margin-top: clamp(20px, 4vw, 48px); }

.proc-phase {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  padding: clamp(38px, 6vw, 80px) 0;
  border-top: 3px solid var(--ink-border);
}
@media (min-width: 880px) {
  .proc-phase { grid-template-columns: minmax(240px, 0.85fr) 1.5fr; gap: 56px; align-items: start; }
}

.proc-marker { position: relative; }
@media (min-width: 880px) {
  .proc-marker { position: sticky; top: calc(var(--topbar-h) + 44px); align-self: start; }
}
.proc-num {
  display: block;
  font-family: var(--font-display);
  font-size: clamp(70px, 12vw, 176px);
  font-weight: 600;
  line-height: 0.8;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 2px var(--ink-border);
}
@media (min-width: 880px) { .proc-num { -webkit-text-stroke-width: 2.5px; } }
.proc-fase {
  display: inline-block;
  margin-top: 16px;
  font-family: var(--font-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--accent-green-deep);
}
.proc-name {
  margin: 6px 0 0;
  font-family: var(--font-display);
  font-size: clamp(26px, 3.4vw, 46px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.02;
  color: var(--ink-body);
}

.proc-body { max-width: 660px; }
.proc-statement {
  margin: 0 0 18px;
  font-family: var(--font-display);
  font-size: clamp(21px, 2.5vw, 32px);
  font-weight: 500;
  line-height: 1.16;
  letter-spacing: -0.01em;
  color: var(--ink-body);
}
.proc-text {
  margin: 0 0 24px;
  font-size: clamp(15px, 1.3vw, 17px);
  line-height: 1.66;
  color: var(--ink-muted);
}
.proc-bullets { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.proc-bullets li {
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: var(--ink-body);
  padding: 12px 0;
  border-bottom: 1.5px solid color-mix(in oklch, var(--ink-border) 22%, transparent);
}
.proc-bullets li:first-child { border-top: 1.5px solid color-mix(in oklch, var(--ink-border) 22%, transparent); }
.proc-tick { color: var(--accent-green-deep); font-weight: 800; flex-shrink: 0; }

.proc-cta {
  margin-top: clamp(54px, 7vw, 96px);
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

.proc-reveal { opacity: 0; transition: opacity 0.7s var(--ease, cubic-bezier(0.16,1,0.3,1)); }
.proc-reveal.in { opacity: 1; }
@media (prefers-reduced-motion: reduce) { .proc-reveal { opacity: 1; transition: none; } }
`;

export default function ProcessoPage() {
  const { t } = useLang();
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = rootRef.current?.querySelectorAll<HTMLElement>(".proc-reveal");
    if (!els || !els.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  const phases = [1, 2, 3, 4].map((n) => {
    const k = `processo.p${n}`;
    return {
      n: String(n).padStart(2, "0"),
      name: t(`${k}.name`),
      statement: t(`${k}.statement`),
      body: t(`${k}.body`),
      bullets: [t(`${k}.b1`), t(`${k}.b2`), t(`${k}.b3`)],
    };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <Nav />
      <main
        ref={rootRef}
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + clamp(44px, 7vw, 96px))", paddingBottom: "clamp(70px, 9vw, 130px)" }}
      >
        <header className="ct-head">
          <span className="ct-kicker">{t("processo.num")}</span>
          <h1 className="ct-title">{t("processo.title")}</h1>
          <p className="ct-sub">{t("processo.sub")}</p>
        </header>

        <div className="proc-list">
          {phases.map((p) => (
            <section key={p.n} className="proc-phase proc-reveal">
              <div className="proc-marker">
                <span className="proc-num" aria-hidden="true">{p.n}</span>
                <span className="proc-fase">{t("processo.fase")} {p.n}</span>
                <h2 className="proc-name">{p.name}</h2>
              </div>
              <div className="proc-body">
                <p className="proc-statement">{p.statement}</p>
                <p className="proc-text">{p.body}</p>
                <ul className="proc-bullets">
                  {p.bullets.map((b, i) => (
                    <li key={i}><span className="proc-tick" aria-hidden="true">+</span>{b}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="proc-cta proc-reveal">
          <h2 className="proc-cta__title">{t("processo.cta.title")}</h2>
          <p className="proc-cta__body">{t("processo.cta.body")}</p>
          <div className="proc-cta__btns">
            <a href="/contatti" className="neo-btn neo-btn--primary" style={{ textDecoration: "none", padding: "14px 28px", fontSize: 15 }}>
              {t("processo.cta.btn1")} <span aria-hidden="true">→</span>
            </a>
            <a href="/work" className="neo-btn" style={{ textDecoration: "none", color: "var(--ink-body)", padding: "14px 28px", fontSize: 15 }}>
              {t("processo.cta.btn2")} <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
      </main>
      <CinematicFooter />
    </>
  );
}
