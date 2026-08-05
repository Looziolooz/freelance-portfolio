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
  flex: 0 0 auto; margin-right: 18px; width: clamp(230px, 26vw, 340px);
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-page); box-shadow: 5px 5px 0 var(--ink-shadow);
  overflow: hidden; text-decoration: none; color: var(--ink-body);
  transition: transform .16s ease-out, box-shadow .16s ease-out;
}
.wmq__card:hover { transform: translate(-2px, -2px); box-shadow: 8px 8px 0 var(--ink-shadow); color: var(--ink-body); }
.wmq__media { position: relative; aspect-ratio: 16 / 10; background: var(--canvas-panel); border-bottom: 3px solid var(--ink-border); }
.wmq__media video, .wmq__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wmq__cap { display: flex; align-items: baseline; justify-content: space-between; gap: 10px; padding: 9px 13px 11px; }
.wmq__name { font-family: var(--font-display); font-size: 16px; font-weight: 600; letter-spacing: -0.01em; }
.wmq__tag { font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em; color: var(--ink-muted); white-space: nowrap; }
@media (max-width: 640px) { .wmq__card { width: 74vw; margin-right: 14px; } }
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
