"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";
import { useRotation } from "@/lib/useRotation";

// Full-bleed project showcase near the end of the page: each demo plays large,
// at its native 16/9, with the label offset to the left so the eye lands on the
// name before the artifact. Proof at full size, right before the ask.
//
// Each item reveals independently (its own IntersectionObserver) and its clip
// only runs while on screen. Reduced-motion keeps the poster still.
// Three slots, seventeen candidates — drawn fresh each visit (see useRotation).
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden && p.coverVideo);
const SHOWN = 3;

const CSS = `
.psc { padding: clamp(48px, 8vw, 96px) 0 clamp(30px, 5vw, 60px); }
.psc__head { max-width: 720px; margin: 0 0 clamp(34px, 5vw, 60px); }
.psc__eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-green-deep); }
.psc__title { font-family: var(--font-display); font-size: clamp(30px, 5vw, 54px); font-weight: 600; letter-spacing: -0.02em; line-height: 1.04; margin: 10px 0 0; color: var(--ink-body); }
.psc__sub { margin: 14px 0 0; font-size: var(--fs-base); line-height: 1.6; color: var(--ink-muted); max-width: 560px; }

.psc__list { display: flex; flex-direction: column; gap: clamp(46px, 7vw, 84px); }
.psc__item { opacity: 0; transform: translateY(28px); transition: opacity .7s var(--ease), transform .7s var(--ease); }
.psc__item.is-in { opacity: 1; transform: none; }

/* Label offset from the left edge — the reference's signature move, which also
   keeps the media flush and uninterrupted. */
.psc__label { margin-left: clamp(0px, 7vw, 104px); margin-bottom: 16px; display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; }
.psc__n { font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; color: var(--accent-green-deep); }
.psc__name { font-family: var(--font-display); font-size: clamp(24px, 3.4vw, 38px); font-weight: 600; letter-spacing: -0.02em; color: var(--ink-body); }
.psc__blurb { margin: 6px 0 0 clamp(0px, 7vw, 104px); font-size: var(--fs-base); line-height: 1.55; color: var(--ink-muted); max-width: 620px; }

.psc__frame {
  display: block; position: relative; margin-top: 18px; aspect-ratio: 16 / 9;
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  overflow: hidden; background: var(--canvas-panel);
  box-shadow: 10px 10px 0 var(--ink-shadow);
  transition: transform .2s var(--ease), box-shadow .2s var(--ease);
}
.psc__frame:hover { transform: translate(-3px, -3px); box-shadow: 14px 14px 0 var(--ink-shadow); }
.psc__frame video { width: 100%; height: 100%; object-fit: cover; display: block; }
.psc__open {
  position: absolute; right: 14px; bottom: 14px; z-index: 2;
  font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: 0.06em;
  color: var(--btn-ink); background: var(--accent-green);
  border: 3px solid var(--ink-border); border-radius: var(--radius-full);
  padding: 8px 16px; box-shadow: 3px 3px 0 var(--ink-shadow);
}
@media (prefers-reduced-motion: reduce) {
  .psc__item { opacity: 1; transform: none; transition: none; }
}
`;

function Item({ p, i }: { p: (typeof POOL)[number]; i: number }) {
  const { t } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    const v = vref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            if (v && !reduce) v.play().catch(() => {});
          } else if (v) {
            v.pause();
          }
        }
      },
      { threshold: 0.18 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const title = t(`work.proj.${p.key}`);
  const blurb = t(`work.proj.${p.key}.blurb`);
  const tags = t(`work.proj.${p.key}.tags`);

  return (
    <div ref={ref} className="psc__item">
      <div className="psc__label">
        <span className="psc__n">{String(i + 1).padStart(2, "0")}</span>
        <h3 className="psc__name">{title}</h3>
        {tags !== `work.proj.${p.key}.tags` && <span className="psc__n">{tags}</span>}
      </div>
      {blurb !== `work.proj.${p.key}.blurb` && <p className="psc__blurb">{blurb}</p>}
      <Link href={`/work/${p.slug}`} className="psc__frame" aria-label={`${title} — ${t("work.viewDemo")}`}>
        <video
          ref={vref}
          src={p.coverVideo}
          poster={p.image ? `/_next/image?url=${encodeURIComponent(p.image)}&w=1200&q=75` : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <span className="psc__open">{t("work.viewDemo")} ↗</span>
      </Link>
    </div>
  );
}

export default function ProjectShowcase() {
  const { t } = useLang();
  const items = useRotation(POOL, SHOWN);
  if (!POOL.length) return null;

  return (
    <section className="psc" aria-label={t("psc.title")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <header className="psc__head">
        <span className="psc__eyebrow">{t("psc.eyebrow")}</span>
        <h2 className="psc__title">{t("psc.title")}</h2>
        <p className="psc__sub">{t("psc.sub")}</p>
      </header>
      <div className="psc__list">
        {items.map((p, i) => <Item key={p.id} p={p} i={i} />)}
      </div>
      <p style={{ marginTop: "clamp(34px, 5vw, 56px)" }}>
        <Link
          href="/contatti"
          className="neo-btn neo-btn-lg neo-btn--primary"
          style={{ textDecoration: "none", color: "var(--btn-ink)", padding: "14px 28px", fontSize: 15 }}
        >
          {t("psc.cta")} <span className="btn-arrow" aria-hidden="true">→</span>
        </Link>
      </p>
    </section>
  );
}
