"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";

// A ticker of live project covers right under the hero: the demos ARE the proof,
// so they run before any claim about them. Parchment & Forest treatment — 3px ink
// frames and hard offset shadows, not soft floating cards.
//
// Cost control: only the clips currently on screen play (IntersectionObserver),
// preload="none" keeps them out of the initial network, and the whole strip is
// static under prefers-reduced-motion.
const ITEMS = PROJECTS.filter((p) => p.featured && !p.hidden && p.coverVideo).slice(0, 8);

const CSS = `
.wmq { padding: clamp(26px, 4vw, 44px) 0 clamp(18px, 3vw, 30px); border-top: 3px solid var(--ink-border); border-bottom: 3px solid var(--ink-border); background: var(--canvas-panel-yellow); }
.wmq__lead { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; max-width: 1200px; margin: 0 auto clamp(18px, 2.5vw, 26px); padding: 0 clamp(18px, 4vw, 40px); }
.wmq__eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-green-deep); }
.wmq__note { font-size: 14px; color: var(--ink-muted); }
.wmq__note a { color: var(--accent-green-deep); font-weight: 600; text-decoration: none; border-bottom: 2px solid currentColor; }

.wmq__card {
  flex: 0 0 auto; margin-right: 22px; width: clamp(320px, 38vw, 560px);
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-page); box-shadow: 6px 6px 0 var(--ink-shadow);
  overflow: hidden; text-decoration: none; color: var(--ink-body);
  transition: transform .18s var(--ease), box-shadow .18s var(--ease);
}
.wmq__card:hover { transform: translate(-3px, -3px); box-shadow: 10px 10px 0 var(--ink-shadow); color: var(--ink-body); }
/* 16/9 matches the source clips (1280x720) exactly, so cover crops nothing. */
/* display:block is required — aspect-ratio is ignored on inline elements, and
   this is a <span> inside the card link. */
.wmq__media { display: block; position: relative; aspect-ratio: 16 / 9; background: var(--canvas-panel); border-bottom: 3px solid var(--ink-border); }
.wmq__media video, .wmq__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* Pinned bottom-right over the clip: doubles as the demo affordance and as the
   mask for the Gemini mark the cover captures carry in that corner. */
.wmq__demo {
  position: absolute; right: 10px; bottom: 10px; z-index: 2; pointer-events: none;
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em;
  color: var(--btn-ink); background: var(--accent-green);
  border: 2px solid var(--ink-border); border-radius: var(--radius-full);
  padding: 7px 14px; box-shadow: 3px 3px 0 var(--ink-shadow);
  transition: transform .18s var(--ease);
}
.wmq__card:hover .wmq__demo { transform: translate(-2px, -2px); }
.wmq__cap { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px 13px; }
.wmq__name { font-family: var(--font-display); font-size: 19px; font-weight: 600; letter-spacing: -0.015em; }
.wmq__tag { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: var(--btn-ink); background: var(--accent-green); border: 2px solid var(--ink-border); border-radius: var(--radius-full); padding: 3px 10px; white-space: nowrap; }
@media (max-width: 640px) { .wmq__card { width: 82vw; margin-right: 14px; } .wmq__name { font-size: 17px; } }
`;

function Card({ p }: { p: (typeof ITEMS)[number] }) {
  const { t } = useLang();
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const title = t(`work.proj.${p.key}`);
  const tags = t(`work.proj.${p.key}.tags`);

  return (
    <Link href={`/work/${p.slug}`} className="wmq__card" aria-label={title}>
      <span className="wmq__media">
        <video
          ref={vref}
          src={p.coverVideo}
          poster={p.image ? `/_next/image?url=${encodeURIComponent(p.image)}&w=640&q=70` : undefined}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
        <span className="wmq__demo">{t("work.viewDemo")} ↗</span>
      </span>
      <span className="wmq__cap">
        <span className="wmq__name">{title}</span>
        {tags !== `work.proj.${p.key}.tags` && <span className="wmq__tag">{tags.split("·")[0].trim()}</span>}
      </span>
    </Link>
  );
}

export default function WorkMarquee() {
  const { t } = useLang();
  if (!ITEMS.length) return null;

  return (
    <section className="wmq" aria-label={t("workmq.eyebrow")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wmq__lead">
        <span className="wmq__eyebrow">{t("workmq.eyebrow")}</span>
        <span className="wmq__note">
          {t("workmq.note")} <Link href="/work">{t("workmq.link")}</Link>
        </span>
      </div>
      {/* Duplicated track: the ticker keyframe translates -50%, so the copy makes
          the loop seamless. The clone is hidden from a11y and from crawlers. */}
      <div className="marquee" style={{ ["--marquee-dur" as string]: "52s" }}>
        <div className="marquee__track">
          <div style={{ display: "flex" }}>
            {ITEMS.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div style={{ display: "flex" }} aria-hidden="true">
            {ITEMS.map((p) => <Card key={`c-${p.id}`} p={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}
