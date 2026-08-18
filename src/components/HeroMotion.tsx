"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang } from "./LangProvider";
import MagneticButton from "./MagneticButton";
import { EncryptedText } from "./ui/encrypted-text";

// Hero: the studio portrait (B&W + brand ochre disc) as full-bleed footage that
// the visitor SCRUBS by scroll — no autoplay/loop. A left-aligned studio
// statement + two CTAs sit over the light side and parallax out as you scroll.
// Desktop = tall sticky scrub; phones / reduced-motion = a static poster frame.
//
// Two renderers share one box (see .hm-media in globals.css):
//   1. the <video>, scrubbed by currentTime — always available, but seeking an
//      mp4 stutters (the browser decodes on demand and lands on keyframes);
//   2. a <canvas> blitting frames pre-decoded into ImageBitmaps — no decode in
//      the scroll path at all, so the motion is continuous.
// The canvas path is desktop-only and starts on the first scroll; until its
// frames exist the video covers, then they crossfade. Scroll progress is
// lerped every rAF rather than mapped 1:1, which is what makes the footage
// trail the scroll like inertia instead of snapping to it like a slider.
const VIDEO = "/hero-motion/clouds.mp4";
const POSTER = "/hero-motion/clouds-poster.jpg";

// Extraction budget for the canvas path: 20 × 768×432 RGBA ≈ 20–25 MB of
// bitmaps is enough to keep the scrub smooth without paying the full 64-frame
// decode cost on every desktop viewport. The hero still keeps its motion, but
// we only enable the expensive path on very large screens.
const FRAMES = 20;
const FRAME_W = 768;
// Per-frame lerp constant. Lower = heavier trail; 0.12 lands on "footage".
const SMOOTHING = 0.12;

export default function HeroMotion() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!section || !media || !video || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Only the very largest desktops pay the full scrub decode budget. On the
    // rest, the hero stays in the static-poster path so the page can keep a
    // healthy LCP and TBT budget.
    const overlay = window.matchMedia("(min-width: 1600px)").matches && !reduce;
    section.dataset.mode = overlay ? "scrub" : "poster";

    if (reduce) return; // static poster, no motion

    // The 311KB clip and its first-frame decode are DEFERRED until the first
    // scroll — otherwise the eager video frame becomes a slow LCP. Until then
    // only the (preloaded) poster shows, so LCP is the poster.
    video.loop = false;
    video.muted = true;

    let alive = true;
    let raf = 0;
    let smoothed = 0;

    // ── renderer 1: the <video>, scrubbed by currentTime ──────────────────
    let ready = false;
    let loadStarted = false;
    let duration = 3.4;
    const seek = (p: number) => {
      if (!ready) return;
      const tt = Math.max(0, Math.min(duration - 0.05, p * duration));
      try { video.currentTime = tt; } catch { /* not seekable yet */ }
    };
    const onMeta = () => {
      duration = video.duration || 3.4;
      video.play().then(() => { video.pause(); ready = true; seek(smoothed); }).catch(() => { ready = true; });
    };

    // ── renderer 2: the <canvas>, blitting pre-decoded ImageBitmaps ───────
    const ctx = canvas.getContext("2d");
    let frames: ImageBitmap[] = [];
    let lastIdx = -1;

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      // clientWidth/Height, NOT getBoundingClientRect(): the rect includes the
      // push-in scale() on .hm-media, so the backing store would be sized off a
      // transformed box and would churn as the scale changes mid-scroll.
      const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      if (canvas.width === w && canvas.height === h) return;
      canvas.width = w;
      canvas.height = h;
      lastIdx = -1; // the backing store was cleared — force a repaint
    };

    const draw = (p: number) => {
      if (!ctx || !frames.length) return;
      const i = Math.min(frames.length - 1, Math.max(0, Math.round(p * (frames.length - 1))));
      if (i === lastIdx) return;
      const f = frames[i];
      // Replicate object-fit:cover so the canvas frames the portrait exactly
      // like the <video> it replaces — otherwise the crossfade would shift it.
      const cw = canvas.width;
      const ch = canvas.height;
      const s = Math.max(cw / f.width, ch / f.height);
      const w = f.width * s;
      const h = f.height * s;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(f, (cw - w) / 2, (ch - h) / 2, w, h);
      lastIdx = i;
    };

    // Decode the clip once into bitmaps, off the scroll path. Runs on its own
    // <video> so it can seek freely without disturbing the one on screen.
    const extract = async () => {
      const out: ImageBitmap[] = [];
      const drop = () => out.forEach((f) => f.close());
      try {
        const v = document.createElement("video");
        v.muted = true;
        v.playsInline = true;
        v.preload = "auto";
        v.src = VIDEO;
        await new Promise<void>((res, rej) => {
          v.onloadeddata = () => res();
          v.onerror = () => rej(new Error("hero clip failed to decode"));
          v.load();
        });
        const dur = v.duration;
        if (!isFinite(dur) || dur <= 0) return;
        const w = Math.min(FRAME_W, v.videoWidth || FRAME_W);
        const h = Math.round((w * (v.videoHeight || 432)) / (v.videoWidth || 768));
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const cx = c.getContext("2d");
        if (!cx) return;
        for (let i = 0; i < FRAMES; i++) {
          if (!alive) return drop();
          const t = (i / (FRAMES - 1)) * Math.max(0, dur - 0.05);
          await new Promise<void>((res) => {
            let done = false;
            const fin = () => { if (!done) { done = true; res(); } };
            v.onseeked = fin;
            // A seek that never reports back must not stall the whole run.
            setTimeout(fin, 400);
            v.currentTime = t;
          });
          cx.drawImage(v, 0, 0, w, h);
          out.push(await createImageBitmap(c));
        }
        if (!alive) return drop();
        frames = out;
        sizeCanvas();
        draw(smoothed);
        // Hand over: the canvas fades in on top, the video fades out under it.
        canvas.style.opacity = "1";
        video.style.opacity = "0";
      } catch {
        drop();
        /* stay on the video seek path — it renders the same footage */
      }
    };

    const ensureVideo = () => {
      if (loadStarted) return;
      loadStarted = true;
      video.addEventListener("loadedmetadata", onMeta);
      video.src = VIDEO;
      video.load();
      if (overlay) void extract();
    };

    // ── per-frame paint (parallax + fades), one per layout ────────────────
    const paint = overlay
      ? (p: number) => {
          media.style.transform = `scale(${(1 + p * 0.05).toFixed(3)})`;
          // Deliberately NO opacity tail here. Dissolving the footage into the
          // parchment before the end empties the stage while it is still pinned,
          // so the run finishes on a blank viewport before the marquee arrives —
          // worse than the cut it was meant to soften. The portrait stays at full
          // strength and the sticky stage carries it away on its own.
          if (content) {
            content.style.transform = `translateY(calc(-50% - ${Math.round(p * 46)}px))`;
            // ×1.6, not ×1.25: the run is 220vh now, so the statement needs a
            // steeper curve to clear before the tail — but not so steep that the
            // last third is nothing but portrait.
            content.style.opacity = Math.max(0, 1 - p * 1.6).toFixed(3);
          }
        }
      : (p: number) => {
          media.style.transform = `translateY(${(p * -28).toFixed(1)}px) scale(${(1 + p * 0.05).toFixed(3)})`;
          if (content) {
            content.style.transform = `translateY(${(p * 18).toFixed(1)}px)`;
            content.style.opacity = Math.max(0, 1 - p * 1.1).toFixed(3);
          }
        };

    // ── the loop: raw progress → lerp → render ────────────────────────────
    // Progress is read straight off the section rect rather than via
    // ScrollTrigger: the smoothing here IS the effect, and layering it on top
    // of a scrub tween would double-smooth it (and fight Lenis for timing).
    const loop = () => {
      if (!alive) return;
      const rect = section.getBoundingClientRect();
      // overlay: the stage is sticky, so the travel is the section minus one
      // viewport. stacked: the stage scrolls normally, travel is its height.
      const travel = Math.max(1, overlay ? section.offsetHeight - window.innerHeight : section.offsetHeight);
      const target = Math.min(1, Math.max(0, -rect.top / travel));
      smoothed += (target - smoothed) * SMOOTHING;
      if (target > 0) ensureVideo();
      // Keep lerping while off-screen (so re-entry is already settled), but
      // skip the pixel work — nothing is watching.
      if (rect.bottom > 0 && rect.top < window.innerHeight) {
        if (frames.length) draw(smoothed);
        else seek(smoothed);
        paint(smoothed);
      }
      raf = requestAnimationFrame(loop);
    };

    const onResize = () => { sizeCanvas(); draw(smoothed); };
    window.addEventListener("resize", onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(canvas);
    sizeCanvas();

    // STACKED entrance: content rises into place. TRANSFORM-ONLY (no opacity
    // hide) — the portrait is the LCP element, and the copy ships visible in the
    // SSR HTML. The media itself gets no entrance tween: `paint` owns its
    // transform every frame and would fight one.
    let ctxg: gsap.Context | undefined;
    if (!overlay && content) {
      ctxg = gsap.context(() => {
        // The slow register (vault: Luxury). Micro-hovers stay at 150-200ms;
        // the opening statement is the one place the page is allowed to take
        // its time, and the fade makes the cascade legible as direction.
        gsap.from(Array.from(content.children), {
          y: 30, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out",
        });
      }, section);
    }

    raf = requestAnimationFrame(loop);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", onMeta);
      window.removeEventListener("resize", onResize);
      ro.disconnect();
      // ~85 MB of bitmaps — release them, don't wait for GC to notice.
      frames.forEach((f) => f.close());
      frames = [];
      ctxg?.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className="hero-motion" aria-label="LO.oz">
      {/* The poster is the LCP element — preload it at high priority so it paints
          immediately instead of waiting in the queue (React 19 hoists this to <head>). */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <link rel="preload" as="image" href={POSTER} fetchPriority="high" />
      <div className="hm-stage">
        <div ref={mediaRef} className="hm-media">
          {/* preload="metadata": the 311KB clip is NOT eagerly downloaded, so the
              poster (not a late video frame) is the LCP. The scroll-scrub loads the
              body on demand. */}
          <video ref={videoRef} className="hm-video" poster={POSTER} muted playsInline preload="metadata" aria-hidden="true" />
          {/* Takes over from the video once its frames are decoded (desktop). */}
          <canvas ref={canvasRef} className="hm-canvas" aria-hidden="true" />
        </div>

        <div ref={contentRef} className="hm-content">
          <span className="hm-kicker">{t("heroMotion.kicker")}</span>
          <h1 className="hm-h1 hm-h1--enc">
            {/* Ghost holds the FINAL text's exact box so the scramble's reflow
                can't shift the statement/lede below it (kills the hero CLS). */}
            <span className="hm-h1__ghost" aria-hidden="true">{t("heroMotion.h1")}</span>
            <span className="hm-h1__live">
              <EncryptedText
                text={t("heroMotion.h1")}
                encryptedClassName="hm-enc"
                revealDelayMs={18}
                flipDelayMs={28}
              />
            </span>
          </h1>
          <h2 className="hm-statement">
            {t("heroMotion.statement").split("Looz").map((part, i, arr) => (
              <Fragment key={i}>
                {part}
                {/* Same mark as the nav: wm-dot, not the old forest .accent.
                    The brand appearing twice on one screen in two different
                    colours reads as a mistake, not as a variation. */}
                {i < arr.length - 1 && (
                  <span className="hm-brand">
                    LO<span className="wm-dot">.</span>oz
                  </span>
                )}
              </Fragment>
            ))}
          </h2>
          <p className="hm-lede">{t("heroMotion.lede")}</p>
          <div className="hm-cta">
            <MagneticButton
              href="/contatti"
              className="neo-btn neo-btn-lg neo-btn--primary"
              style={{ textDecoration: "none", padding: "14px 26px", fontSize: 15 }}
            >
              {t("hero.cta.call")}
              <span className="btn-arrow" aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton
              href="/work"
              className="neo-btn neo-btn-lg"
              style={{ textDecoration: "none", color: "var(--ink-body)", padding: "14px 26px", fontSize: 15, background: "var(--canvas-panel-yellow)" }}
            >
              {t("hero.cta.work")}
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </MagneticButton>
          </div>

          {/* Honest social proof — no invented testimonials, just verifiable signals. */}
          <ul className="hm-proof" aria-label={t("heroMotion.kicker")}>
            {t("heroMotion.proof").split("|").map((p) => (
              <li key={p} className="hm-proof__item">{p}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
