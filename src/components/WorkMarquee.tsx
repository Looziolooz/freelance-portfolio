"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";
import { useRotation } from "@/lib/useRotation";

// A ticker of live project covers right under the hero: the demos ARE the proof,
// so they run before any claim about them. Parchment & Forest treatment — 3px ink
// frames and hard offset shadows, not soft floating cards.
//
// Cost control: a clip plays only under the cursor (touch keeps in-view autoplay
// — see Card), preload="none" keeps them out of the initial network, and the
// whole strip is static under prefers-reduced-motion.
// The whole eligible pool, not a slice: useRotation draws the visible 8 from
// it on each visit. Sliced here, the same eight showed forever and the other
// nine were published but unreachable from the home page.
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden && p.coverVideo);
const SHOWN = 8;

const CSS = `
/* --band-y both sides (globals.css): the old 44/30 left the card row landing
   30px from the tech strip below, so the two densest blocks on the page ran
   together. Symmetric padding also stops the band reading as top-heavy. */
.wmq { padding: var(--band-y) 0; border-top: 3px solid var(--ink-border); border-bottom: 3px solid var(--ink-border); background: var(--canvas-panel-yellow); }
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
/* First frame of the clip, under the video: what the loop dip reveals. */
.wmq__under { position: absolute; inset: 0; z-index: 0; }
.wmq__media video { position: relative; z-index: 1; }
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

function Card({ p, isClone }: { p: (typeof POOL)[number]; isClone?: boolean }) {
  const { t } = useLang();
  const vref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Seamless loop ──────────────────────────────────────────────────────
    // Native loop() cuts hard from the last frame to the first, and on a scroll
    // capture those two frames are the bottom and the top of a page — the jump
    // is unmissable if you hold the cursor still. So: dip the video's opacity
    // over the closing moments, restart it while it is faded, and bring it back.
    // The poster underneath is the frame it restarts on, so the dip reads as a
    // soft breath rather than a cut. Adapted from a reference that faded to
    // black; here the ground is a light panel, which would have flashed.
    const FADE = 0.5;   // seconds of fade at each end
    let raf = 0;
    const setDim = (o: number) => { v.style.opacity = o.toFixed(3); };
    const tick = () => {
      const d = v.duration;
      if (isFinite(d) && d > FADE * 2 && !v.paused) {
        const left = d - v.currentTime;
        // Ramp down over the last FADE seconds, ramp back up over the first.
        const o = left < FADE ? left / FADE : Math.min(1, v.currentTime / FADE);
        setDim(Math.max(0, Math.min(1, o)));
      }
      raf = requestAnimationFrame(tick);
    };
    const onEnd = () => {
      // Restart while invisible, so the seam is never on screen.
      try { v.currentTime = 0; } catch { /* not seekable */ }
      v.play().catch(() => {});
    };
    v.addEventListener("ended", onEnd);
    raf = requestAnimationFrame(tick);

    // Hover-capable pointer: the clip runs ONLY while the cursor is on the card.
    // The strip already pauses under the cursor (.marquee:hover), so one gesture
    // both stops the ticker and starts the demo you stopped on.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const card = v.closest(".wmq__card");
      if (!card) return;
      const enter = () => { v.play().catch(() => {}); };
      const leave = () => {
        // pause() aborts a still-pending play() (its promise rejects, caught above).
        v.pause();
        // Rewind so the card goes back to its opening frame instead of freezing
        // mid-clip — a strip of stopped-dead videos reads as broken.
        try { v.currentTime = 0; } catch { /* nothing loaded yet */ }
        // Back to full: leaving mid-dip would strand the card faded.
        setDim(1);
      };
      card.addEventListener("pointerenter", enter);
      card.addEventListener("pointerleave", leave);
      return () => {
        cancelAnimationFrame(raf);
        v.removeEventListener("ended", onEnd);
        card.removeEventListener("pointerenter", enter);
        card.removeEventListener("pointerleave", leave);
      };
    }

    // Touch has no hover. Those devices keep the in-view autoplay — otherwise the
    // "live demos" strip would be a wall of stills on phones, which is the one
    // thing this section exists to disprove.
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
    return () => {
      cancelAnimationFrame(raf);
      v.removeEventListener("ended", onEnd);
      io.disconnect();
    };
  }, []);

  const title = t(`work.proj.${p.key}`);
  const tags = t(`work.proj.${p.key}.tags`);

  const demoLabel = t(p.demo ? "work.viewDemo" : "work.viewFlow");
  const accessibleLabel = `${demoLabel} ↗: ${title}`;

  return (
    <Link href={`/work/${p.slug}`} prefetch={false} className="wmq__card" aria-label={accessibleLabel} tabIndex={isClone ? -1 : undefined}>
      <span className="wmq__media">
        {/* The clip's own first frame, sitting UNDER the video. The loop
            crossfade dips the video's opacity, and this is what shows through —
            the exact frame the clip restarts on, so the seam disappears. Fading
            to transparent instead would flash --canvas-panel, a light panel, on
            every dark cover. */}
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="wmq__under"
            src={`/_next/image?url=${encodeURIComponent(p.image)}&w=640&q=75`}
            alt=""
            aria-hidden="true"
            loading="lazy"
          />
        )}
        <video
          ref={vref}
          src={p.coverVideo}
          // q=75, like the other hand-built poster URLs: any quality not listed in
          // images.qualities 400s in PRODUCTION but passes in dev (see next.config.ts).
          poster={p.image ? `/_next/image?url=${encodeURIComponent(p.image)}&w=640&q=75` : undefined}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
        />
        {/* No demo URL means the detail page shows the flow, not an embedded
            site — promising "open demo" there would be a promise with nothing
            behind it. */}
        <span className="wmq__demo">{demoLabel} <span aria-hidden="true">↗</span></span>
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
  const items = useRotation(POOL, SHOWN);
  if (!POOL.length) return null;

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
            {items.map((p) => <Card key={p.id} p={p} />)}
          </div>
          <div style={{ display: "flex" }} aria-hidden="true">
            {items.map((p) => <Card key={`c-${p.id}`} p={p} isClone />)}
          </div>
        </div>
      </div>
    </section>
  );
}
