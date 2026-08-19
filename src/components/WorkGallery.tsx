"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";

// "Lavori dal vivo": a sticky-driven horizontal gallery in place of the grid.
//
// Adapted from the motion.dev "scroll horizontal gallery" reference: the page
// scrolls through a tall track while a pinned stage slides the strip sideways,
// so the reader walks every project instead of clicking through a grid. Two
// things from this repo's own history shape it.
//
//  1. The first horizontal gallery here (Work.tsx, 2026-06) measured the strip
//     live and set the track height to viewport + distance, which makes the
//     travel exactly 1px of horizontal per 1px of vertical — the reference's
//     fixed 300vh is a speed knob; the measured version cannot throw the strip
//     off by a font load or a lazy image.
//  2. DESIGN.md forbids wrapping this pinned stage in a transformed motion
//     container (a transform ancestor breaks position:sticky), so the section
//     must stay bare in page.tsx — no ScrollReveal — and only the inner strip
//     carries the x transform.
//
// Fallbacks: below 769px and under prefers-reduced-motion the track collapses
// and the viewport becomes a native horizontal swipe with scroll-snap, so the
// work stays reachable without any JavaScript position:sticky.
//
// The card is the same one WorkGrid used: hover-only playback on desktop,
// in-view autoplay on touch, preload="none", and the opacity dip that hides
// the loop seam. Those choices are load-bearing; their reasons are in the
// comments inside Card.
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden && p.coverVideo);

// Interleave categories round-robin (website, saas, automazione, ai, then
// repeat) instead of showing the authored order. The pool is automation-first,
// so the plain list would open with six near-identical flow diagrams and not
// one built site on a strip whose whole job is proving sites get built.
const CATEGORY_ORDER = ["website", "saas", "automazione", "ai"] as const;
function spread() {
  const buckets = new Map<string, typeof POOL>();
  for (const p of POOL) {
    const c = p.category ?? "website";
    if (!buckets.has(c)) buckets.set(c, []);
    buckets.get(c)!.push(p);
  }
  const keys = CATEGORY_ORDER.filter((k) => buckets.has(k));
  const out: typeof POOL = [];
  let i = 0;
  while (out.length < POOL.length) {
    for (const k of keys) {
      const b = buckets.get(k)!;
      if (i < b.length) out.push(b[i]);
    }
    i += 1;
  }
  return out;
}
// Five, not the whole pool. The strip is proof, not an archive: /work holds
// every project and the lead links to it. The horizontal run adapts on its own
// (the track height is viewport + scrollWidth - stageWidth), so a shorter strip
// simply means a shorter pin rather than dead scroll.
const SHOWN = 5;
const ITEMS = spread().slice(0, SHOWN);

const CSS = `
/* The section must stay overflow:visible — an overflow on an ancestor turns the
   pinned stage into a sticky against the SECTION, not the page, and the gallery
   never pins (the same trap that bit the first horizontal gallery here). */
.wgal { position: relative; background: var(--canvas-panel-yellow); border-top: 3px solid var(--ink-border); border-bottom: 3px solid var(--ink-border); overflow: visible; }
.wgal__track { position: relative; }

/* Default (mobile + reduced motion): native horizontal swipe, title in flow. */
.wgal__stage { display: flex; flex-direction: column; gap: clamp(20px, 3vh, 40px); }
.wgal__lead { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; max-width: var(--container-max); margin: 0 auto; width: 100%; padding: var(--band-y) var(--container-pad) 0; }
.wgal__eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-green-deep); }
.wgal__note { font-size: 14px; color: var(--ink-muted); }
.wgal__note a { color: var(--accent-green-deep); font-weight: 600; text-decoration: none; background: linear-gradient(currentColor, currentColor) no-repeat left 100% / 0% 2px; transition: background-size .3s var(--ease); padding-bottom: 2px; }
.wgal__note a:hover, .wgal__note a:focus-visible { background-size: 100% 2px; }
.wgal__viewport { overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch; scroll-snap-type: x proximity; }
.wgal__viewport::-webkit-scrollbar { display: none; }
.wgal__strip { display: flex; gap: clamp(20px, 2vw, 30px); width: max-content; padding: 0 var(--container-pad) clamp(40px, 6vh, 72px); }
.wgal__card { scroll-snap-align: start; }

/* Desktop with motion allowed: the stage pins at top:0 while .wgal__track
   scrolls past; the strip is moved via the x motion value driven by scroll
   progress. Must mirror the matchMedia() condition in the component. */
@media (min-width: 769px) and (prefers-reduced-motion: no-preference) {
  .wgal__stage { position: sticky; top: 0; height: 100vh; height: 100svh; justify-content: center; overflow: hidden; }
  .wgal__lead { padding-top: clamp(28px, 4vh, 48px); }
  .wgal__viewport { overflow: hidden; scroll-snap-type: none; width: 100%; }
  .wgal__strip { padding: 0; will-change: transform; }
  .wgal__strip .wgal__card { scroll-snap-align: none; }
}

/* Card chrome — same neo-brutalist shape as the grid it replaces. */
.wgal__card { border: 3px solid var(--ink-border); border-radius: var(--radius-lg); background: var(--canvas-page); box-shadow: var(--shadow-card); overflow: hidden; text-decoration: none; color: var(--ink-body); transition: transform .18s var(--ease), box-shadow .18s var(--ease); width: clamp(320px, 44vw, 620px); flex-shrink: 0; }
.wgal__card:hover { transform: translate(-3px, -3px); box-shadow: var(--shadow-card-hover); color: var(--ink-body); }
.wgal__media { display: block; position: relative; aspect-ratio: 16 / 9; background: var(--canvas-panel); border-bottom: 3px solid var(--ink-border); }
.wgal__media video, .wgal__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
.wgal__under { position: absolute; inset: 0; z-index: 0; }
.wgal__media video { position: relative; z-index: 1; }
.wgal__demo { position: absolute; right: 10px; bottom: 10px; z-index: 2; pointer-events: none; display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em; color: var(--btn-ink); background: var(--accent-green); border: 2px solid var(--ink-border); border-radius: var(--radius-full); padding: 7px 14px; box-shadow: 3px 3px 0 var(--ink-shadow); transition: transform .18s var(--ease); }
.wgal__card:hover .wgal__demo { transform: translate(-2px, -2px); }
.wgal__cap { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px 13px; }
.wgal__name { font-family: var(--font-display); font-size: 19px; font-weight: 600; letter-spacing: -0.015em; }
.wgal__tag { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: var(--ink-muted); background: transparent; border: 1px solid color-mix(in oklch, var(--ink-border) 38%, transparent); border-radius: var(--radius-full); padding: 3px 10px; white-space: nowrap; }
`;

function Card({ p }: { p: (typeof POOL)[number] }) {
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
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const card = v.closest(".wgal__card");
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
  const demoLabel = t(p.demo ? "work.viewDemo" : "work.viewFlow");
  const accessibleLabel = `${demoLabel} ↗: ${title}`;

  return (
    <Link href={`/work/${p.slug}`} prefetch={false} className="wgal__card" aria-label={accessibleLabel}>
      <span className="wgal__media">
        {/* The clip's own first frame, sitting UNDER the video. The loop
            crossfade dips the video's opacity, and this is what shows through —
            the exact frame the clip restarts on, so the seam disappears. Fading
            to transparent instead would flash --canvas-panel, a light panel, on
            every dark cover. */}
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="wgal__under"
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
        <span className="wgal__demo">{demoLabel} <span aria-hidden="true">↗</span></span>
      </span>
      <span className="wgal__cap">
        <span className="wgal__name">{title}</span>
        <span className="wgal__tag">{t(`work.filter.${p.category ?? "website"}`)}</span>
      </span>
    </Link>
  );
}

export default function WorkGallery() {
  const { t } = useLang();
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const mqRef = useRef<MediaQueryList | null>(null);

  // Track height = viewport + distance, so scrolling through the track moves the
  // strip exactly 1:1 with the page. Reads are live (scrollWidth / clientWidth)
  // so async layout shifts (font load, lazy poster above) cannot throw it off.
  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const strip = stripRef.current;
    if (!track || !stage || !strip) return;

    // Must mirror the globals/component media query below.
    const mq = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)",
    );
    mqRef.current = mq;

    const distance = () => Math.max(0, strip.scrollWidth - stage.clientWidth);
    const layout = () => {
      if (mq.matches) {
        track.style.height = `${window.innerHeight + distance()}px`;
      } else {
        track.style.height = "";
      }
    };

    layout();
    window.addEventListener("resize", layout);
    mq.addEventListener("change", layout);
    if (document.fonts?.ready) document.fonts.ready.then(layout);

    return () => {
      window.removeEventListener("resize", layout);
      mq.removeEventListener("change", layout);
      track.style.height = "";
    };
  }, []);

  // Progress across the track → horizontal position of the strip. The translate
  // is driven from the motion value, never via a transform on the sticky stage
  // itself (that would break the pin — see the docblock).
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const x = useMotionValue(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const stage = stageRef.current;
    const strip = stripRef.current;
    const mq = mqRef.current;
    if (!stage || !strip) return;
    // Native-swipe fallback: keep the strip parked at the origin.
    if (!mq || !mq.matches) {
      x.set(0);
      return;
    }
    const dist = Math.max(0, strip.scrollWidth - stage.clientWidth);
    x.set(-p * dist);
  });

  return (
    <section className="wgal" aria-label={t("workmq.eyebrow")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div ref={trackRef} className="wgal__track">
        <div ref={stageRef} className="wgal__stage">
          <div className="wgal__lead">
            <span className="wgal__eyebrow">{t("workmq.eyebrow")}</span>
            <span className="wgal__note">
              {t("workmq.note")} <Link href="/work">{t("workmq.link")}</Link>
            </span>
          </div>
          <div className="wgal__viewport">
            <motion.div ref={stripRef} className="wgal__strip" style={{ x }}>
              {ITEMS.map((p) => <Card key={p.id} p={p} />)}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
