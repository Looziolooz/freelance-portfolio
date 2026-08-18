"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import { PROJECTS } from "@/lib/projects";

// Six live demos under the hero, standing still.
//
// This replaces the ticker that used to sit here. The covers scrolled away
// before you could read a name, and once a second moving band shared the page
// the two competed. A grid shows more work at once and asks nothing of the
// reader's timing.
//
// What carried over unchanged is the Card: hover-only playback, in-view autoplay
// on touch, preload="none", and the opacity dip that hides the loop seam. Those
// choices are all load-bearing and their reasons are in the comments below.
const POOL = PROJECTS.filter((p) => p.featured && !p.hidden && p.coverVideo);
const SHOWN = 6;

/**
 * Six that show the RANGE, chosen deterministically.
 *
 * The pool is authored automation-first, so the plain first six came back as six
 * automations: six near-identical flow diagrams, every card reading "vedi il
 * flusso", and not one built site on a strip whose whole job is proving that
 * sites get built. It also runs 12 websites to 3 automations, so picking at
 * random would swing the other way.
 *
 * So: one per category first, in the order a visitor cares about, then fill from
 * the sites. Deterministic on purpose — the strip that used to shuffle here is
 * how /work earned a 0.318 CLS, because reordering keyed nodes after hydration
 * moves every card at once.
 */
function pickRange() {
  const order = ["website", "automazione", "ai", "saas"];
  const seen = new Set<string>();
  const out: typeof POOL = [];
  for (const category of order) {
    const first = POOL.find((p) => p.category === category);
    if (first) {
      out.push(first);
      seen.add(first.slug);
    }
  }
  for (const p of POOL) {
    if (out.length >= SHOWN) break;
    if (!seen.has(p.slug)) {
      out.push(p);
      seen.add(p.slug);
    }
  }
  return out.slice(0, SHOWN);
}

const CSS = `
.wgr { padding: var(--band-y) 0; border-top: 3px solid var(--ink-border); border-bottom: 3px solid var(--ink-border); background: var(--canvas-panel-yellow); }

/* A grid, not a ticker. The page already had a moving strip here and the covers
   slid away before you could read a name; six of them standing still say the
   same thing and let you compare. Nothing animates on its own: a clip runs only
   while the cursor is on its card (touch keeps in-view autoplay, see Card).
   No rotation either. The strip used to draw its eight from the pool on every
   visit, which is how /work earned a 0.318 CLS: reordering keyed nodes after
   hydration moves every card at once. The first six, always, and the link goes
   to the rest. */
.wgr__grid {
  display: grid; gap: clamp(16px, 2vw, 26px);
  grid-template-columns: 1fr;
  max-width: 1200px; margin: 0 auto; padding: 0 clamp(18px, 4vw, 40px);
}
.wgr__card {
  border: 3px solid var(--ink-border); border-radius: var(--radius-lg);
  background: var(--canvas-page); box-shadow: 6px 6px 0 var(--ink-shadow);
  overflow: hidden; text-decoration: none; color: var(--ink-body);
  transition: transform .18s var(--ease), box-shadow .18s var(--ease);
}
.wgr__card:hover { transform: translate(-3px, -3px); box-shadow: 10px 10px 0 var(--ink-shadow); color: var(--ink-body); }

@media (min-width: 660px) { .wgr__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1000px) { .wgr__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
.wgr__lead { display: flex; align-items: baseline; gap: 14px; flex-wrap: wrap; max-width: 1200px; margin: 0 auto clamp(18px, 2.5vw, 26px); padding: 0 clamp(18px, 4vw, 40px); }
.wgr__eyebrow { font-family: var(--font-mono); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: var(--accent-green-deep); }
.wgr__note { font-size: 14px; color: var(--ink-muted); }
/* Drawn underline (u-draw in globals): grows from the left on hover. */
.wgr__note a { color: var(--accent-green-deep); font-weight: 600; text-decoration: none; background: linear-gradient(currentColor, currentColor) no-repeat left 100% / 0% 2px; transition: background-size .3s var(--ease); padding-bottom: 2px; }
.wgr__note a:hover, .wgr__note a:focus-visible { background-size: 100% 2px; }

/* 16/9 matches the source clips (1280x720) exactly, so cover crops nothing. */
/* display:block is required — aspect-ratio is ignored on inline elements, and
   this is a <span> inside the card link. */
.wgr__media { display: block; position: relative; aspect-ratio: 16 / 9; background: var(--canvas-panel); border-bottom: 3px solid var(--ink-border); }
.wgr__media video, .wgr__media img { width: 100%; height: 100%; object-fit: cover; display: block; }
/* First frame of the clip, under the video: what the loop dip reveals. */
.wgr__under { position: absolute; inset: 0; z-index: 0; }
.wgr__media video { position: relative; z-index: 1; }
/* Pinned bottom-right over the clip: doubles as the demo affordance and as the
   mask for the Gemini mark the cover captures carry in that corner. */
.wgr__demo {
  position: absolute; right: 10px; bottom: 10px; z-index: 2; pointer-events: none;
  display: inline-flex; align-items: center; gap: 6px; white-space: nowrap;
  font-family: var(--font-mono); font-size: 11.5px; font-weight: 700; letter-spacing: 0.05em;
  color: var(--btn-ink); background: var(--accent-green);
  border: 2px solid var(--ink-border); border-radius: var(--radius-full);
  padding: 7px 14px; box-shadow: 3px 3px 0 var(--ink-shadow);
  transition: transform .18s var(--ease);
}
.wgr__card:hover .wgr__demo { transform: translate(-2px, -2px); }
.wgr__cap { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px 16px 13px; }
.wgr__name { font-family: var(--font-display); font-size: 19px; font-weight: 600; letter-spacing: -0.015em; }
/* Mono ink, not a second ochre pill: with the demo badge already ochre, two
   accents per card diluted both. One accent per card, and ochre means action. */
.wgr__tag { font-family: var(--font-mono); font-size: 10.5px; font-weight: 700; letter-spacing: 0.1em; color: var(--ink-muted); background: transparent; border: 1px solid color-mix(in oklch, var(--ink-border) 38%, transparent); border-radius: var(--radius-full); padding: 3px 10px; white-space: nowrap; }
@media (max-width: 640px) { .wgr__card { width: 82vw; margin-right: 14px; } .wgr__name { font-size: 17px; } }
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
    // The strip already pauses under the cursor (.marquee:hover), so one gesture
    // both stops the ticker and starts the demo you stopped on.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const card = v.closest(".wgr__card");
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
    <Link href={`/work/${p.slug}`} prefetch={false} className="wgr__card" aria-label={accessibleLabel}>
      <span className="wgr__media">
        {/* The clip's own first frame, sitting UNDER the video. The loop
            crossfade dips the video's opacity, and this is what shows through —
            the exact frame the clip restarts on, so the seam disappears. Fading
            to transparent instead would flash --canvas-panel, a light panel, on
            every dark cover. */}
        {p.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="wgr__under"
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
        <span className="wgr__demo">{demoLabel} <span aria-hidden="true">↗</span></span>
      </span>
      <span className="wgr__cap">
        <span className="wgr__name">{title}</span>
        <span className="wgr__tag">{t(`work.filter.${p.category ?? "website"}`)}</span>
      </span>
    </Link>
  );
}

export default function WorkGrid() {
  const { t } = useLang();
  // "Random" without the hydration reshuffle that cost /work its CLS: the
  // shuffle is seeded by the day, so server and client agree and the mix
  // changes per day, not per render.
  const day = Math.floor(Date.now() / 86400000);
  const shuffled = [...POOL]
    .map((p, i) => ({ p, k: Math.sin(day * 97 + i * 31) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.p);
  // Spread first, then fill: without this one seed showed six of a kind, which
  // is the exact failure the deterministic picker existed to prevent.
  const seen = new Set<string>();
  const lead = shuffled.filter((p) => {
    const c = p.category ?? "altro";
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });
  const items = [...lead, ...shuffled.filter((p) => !lead.includes(p))].slice(0, SHOWN);
  if (!items.length) return null;

  return (
    <section className="wgr" aria-label={t("workmq.eyebrow")}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="wgr__lead">
        <span className="wgr__eyebrow">{t("workmq.eyebrow")}</span>
        <span className="wgr__note">
          {t("workmq.note")} <Link href="/work">{t("workmq.link")}</Link>
        </span>
      </div>
      <div className="wgr__grid">
        {items.map((p) => <Card key={p.id} p={p} />)}
      </div>
    </section>
  );
}
