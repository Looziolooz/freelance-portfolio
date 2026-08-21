"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { useLang } from "./LangProvider";
import Wordmark from "./Wordmark";
import MagneticButton from "./MagneticButton";
import { EncryptedText } from "./ui/encrypted-text";

// Hero: the studio portrait (B&W + brand ochre disc) as full-bleed footage that
// the visitor SCRUBS by scroll — no autoplay/loop. A left-aligned studio
// statement + two CTAs sit over the light side and parallax out as you scroll.
// Desktop (>=1440) = tall sticky scrub; tablet and phone = the same footage
// scrubbed through a stacked card, over that card's own transit; reduced motion
// = a static poster frame.
//
// Two renderers share one box (see .hm-media in globals.css):
//   1. the <video>, scrubbed by currentTime — always available, but seeking an
//      mp4 stutters (the browser decodes on demand and lands on keyframes);
//   2. a <canvas> blitting frames pre-decoded into ImageBitmaps — no decode in
//      the scroll path at all, so the motion is continuous.
// The canvas path is desktop-only and starts on the first scroll; until its
// frames exist the video covers, then they crossfade. Tablet and phone stay on
// renderer 1 for good: the clip is downloaded there either way, so the scrub
// costs them nothing extra, while the ~25MB of bitmaps would. Scroll progress is
// lerped every rAF rather than mapped 1:1, which is what makes the footage
// trail the scroll like inertia instead of snapping to it like a slider.
const VIDEO = "/hero-motion/clouds.mp4";
const POSTER = "/hero-motion/clouds-poster.jpg";

// The machine under the man: the same portrait, same pose, same ochre disc, in
// cyborg form. A spotlight reveals it through the base footage, which is the
// whole positioning of this studio in one gesture. The spotlight follows the
// cursor where there is one, and the scroll where there is not.
//
// The file is composed to the base frame's geometry: the source was 1065x1008
// with its disc at radius 0.319w, the base is 1280x720 at 0.187w, so it was
// scaled by 0.703 and offset until both discs share a centre (verified: 604,339
// against 605,339, radius 239 either way). That alignment is what lets the
// reveal sit under `object-fit: cover` and register exactly.
const REVEAL = "/hero-motion/cyborg-reveal.jpg";
const SPOTLIGHT_R = 260;   // px, as specified
const CURSOR_EASE = 0.1;   // per frame, toward the raw pointer

// Extraction budget for the canvas path: 20 × 768×432 RGBA ≈ 20–25 MB of
// bitmaps is enough to keep the scrub smooth without paying the full 64-frame
// decode cost on every desktop viewport. Below 1440 the hero still scrubs, it
// just does it through renderer 1 — only this bitmap budget is desktop-gated.
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
  const revealRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // Installed by the touch-reveal effect once (and only if) it has decided the
  // 105KB cyborg frame is affordable on this connection. Null everywhere else,
  // so the stacked paint pays one null check a frame and nothing more.
  const revealDriveRef = useRef<((p: number) => void) | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    if (!section || !media || !video || !canvas) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // 1440, NOT 1600: this number MUST equal the CSS stacked breakpoint in
    // globals.css (`@media (max-width: 1439px)`). It used to be 1600, and the
    // 160px gap was a live layout bug — between 1440 and 1599 the CSS put
    // .hm-content in the sticky path (top:50% + translateY(-50%)) while this
    // flag put `paint` in the stacked path, which overwrites that transform
    // with translateY(0) and dropped the whole statement half a screen. If you
    // move one of the two, move the other in the same commit.
    const overlay = window.matchMedia("(min-width: 1440px)").matches && !reduce;
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
          // The statement is deliberately NOT touched here. It used to drift and
          // fade like the desktop one, and that was wrong twice over.
          //
          // Wrong in principle: the fade exists on desktop because the stage is
          // PINNED. The copy has to clear itself out or it would sit on top of
          // the portrait for the whole 220vh run. Stacked, nothing is pinned —
          // the card is above the text and the page scroll carries both away on
          // its own. There is nothing to clear.
          //
          // Wrong in fact, since progress became the card's transit: p hits 1
          // when the card's bottom edge leaves the top of the viewport, and at
          // that moment the statement underneath it is sitting dead centre on
          // screen, fully readable and at opacity 0. The copy was dissolving in
          // front of the reader.
          //
          // So on tablet and phone the statement is fixed: it enters once with
          // the GSAP cascade below and then behaves like ordinary text.
          //
          // Touch builds drive the spotlight from this same progress — see the
          // reveal effect below. Deliberately NOT a second rAF loop: the ref is
          // null until (and unless) that effect decides the reveal is affordable.
          revealDriveRef.current?.(p);
        };

    // ── the loop: raw progress → lerp → render ────────────────────────────
    // Progress is read straight off the section rect rather than via
    // ScrollTrigger: the smoothing here IS the effect, and layering it on top
    // of a scrub tween would double-smooth it (and fight Lenis for timing).
    const loop = () => {
      if (!alive) return;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      let target: number;
      if (overlay) {
        // The stage is sticky, so the travel is the section minus one viewport.
        target = Math.min(1, Math.max(0, -rect.top / Math.max(1, section.offsetHeight - vh)));
      } else {
        // Stacked, the section is the WRONG ruler. The portrait card is a
        // 240-380px band pinned to the top of the stack (order:-1) with the
        // whole statement below it, so by the time the section is a third
        // scrolled the card has already left the screen — the visitor saw the
        // first third of the clip and nothing else. That is why the hero read
        // as "not animating" on tablet and phone.
        //
        // Progress is the CARD's own transit instead: 0 as its top edge enters
        // at the bottom of the viewport, 1 as its bottom edge exits at the top.
        // The whole clip now plays across exactly the span where it is visible.
        //
        // Measured off .hm-stage + offsetTop/offsetHeight rather than the
        // card's own rect on purpose: `paint` writes a translate+scale to the
        // card every frame, so reading its rect here would feed the transform
        // back into the progress that produced it.
        const stageTop = (media.offsetParent as HTMLElement | null)?.getBoundingClientRect().top ?? rect.top;
        const mTop = stageTop + media.offsetTop;
        const mH = media.offsetHeight;
        target = Math.min(1, Math.max(0, (vh - mTop) / Math.max(1, vh + mH)));
      }
      smoothed += (target - smoothed) * SMOOTHING;
      // `rect.top < 0`, NOT `target > 0`. They were the same thing while both
      // paths measured the section, but the stacked path now measures the card
      // — which is on screen at rest, so its progress starts around 0.4 and
      // `target > 0` would fire the 311KB download at load, racing the poster
      // that is this page's LCP. This still means "the visitor has scrolled".
      if (rect.top < 0) ensureVideo();
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
      // Clear anything the overlay paint may have written before a resize put
      // us here: it leaves a translateY(calc(-50% ...)) and a faded opacity
      // behind, and stacked nobody overwrites them any more.
      content.style.transform = "";
      content.style.opacity = "";
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

  // ── The spotlight reveal ───────────────────────────────────────────────────
  //
  // Deliberately NOT the canvas-per-frame approach the reference uses. That one
  // rebuilds a radial gradient on a full-viewport canvas, calls toDataURL() and
  // hands the base64 PNG to `mask-image` on EVERY frame: an encode plus a decode
  // per frame, at viewport size. A CSS radial-gradient mask whose centre is two
  // custom properties gets the identical picture, stays on the compositor, and
  // costs two style writes a frame.
  //
  // Three guards, each earning its place:
  //   - hover-capable fine pointers only. There is no cursor to follow on a
  //     phone, and a spotlight that cannot move is just a blurry patch.
  //   - reduced motion opts out entirely.
  //   - the image is attached on the FIRST pointer entry, never at load: the
  //     poster is this page's LCP element and nothing may race it.
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const reveal = revealRef.current;
    if (!section || !media || !reveal) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let attached = false;
    let inside = false;
    const raw = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const frame = () => {
      eased.x += (raw.x - eased.x) * CURSOR_EASE;
      eased.y += (raw.y - eased.y) * CURSOR_EASE;
      reveal.style.setProperty("--mx", `${eased.x.toFixed(1)}px`);
      reveal.style.setProperty("--my", `${eased.y.toFixed(1)}px`);
      // Stop when the pointer is gone AND the easing has caught up: an idle hero
      // should not hold a rAF loop open.
      if (inside || Math.abs(raw.x - eased.x) > 0.5 || Math.abs(raw.y - eased.y) > 0.5) {
        raf = requestAnimationFrame(frame);
      } else {
        raf = 0;
      }
    };

    const onMove = (e: PointerEvent) => {
      const box = media.getBoundingClientRect();
      raw.x = e.clientX - box.left;
      raw.y = e.clientY - box.top;
      if (!attached) {
        // First contact: fetch the image, and start the spotlight already under
        // the cursor rather than sliding in from the corner.
        reveal.style.backgroundImage = `url("${REVEAL}")`;
        eased.x = raw.x;
        eased.y = raw.y;
        attached = true;
      }
      inside = true;
      reveal.style.setProperty("--on", "1");
      if (!raf) raf = requestAnimationFrame(frame);
    };

    const onLeave = () => {
      inside = false;
      reveal.style.setProperty("--on", "0");
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // ── The same reveal on touch, driven by SCROLL instead of a finger ────────
  //
  // The desktop effect above bails on coarse pointers, and a finger-follow
  // version would not fix either reason it bails: the finger sits exactly on
  // top of the thing being revealed, and tracking touchmove on the hero means
  // wrestling the page scroll. So the touch build does not move the spotlight
  // with the touch at all — it sweeps across the portrait as the card transits
  // the viewport, off the progress the stacked paint already computes. No
  // second rAF loop, no listener on the scroll path, no scroll hijack.
  //
  // The 105KB frame is the whole cost, and it is spent only when all of this
  // holds:
  //   - Save-Data is off and the connection reports 4g. A hero easter egg is
  //     not worth 105KB on a metered phone.
  //   - the hero is actually on screen (IntersectionObserver, so a visitor who
  //     lands deep-linked further down the page never pays for it).
  //   - the browser is idle, so it queues behind the poster (LCP) and the clip.
  // If any of those fails the ref stays null and the layer stays display:none.
  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    const reveal = revealRef.current;
    if (!section || !media || !reveal) return;
    // The pointer version owns fine pointers; this one is the touch build only.
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Only the stacked path calls revealDrive. A touch laptop wide enough for
    // the sticky scrub would otherwise arm the layer, composite it, and never
    // move it. Read back off the flag the first effect just set rather than
    // re-testing the width, so there is one definition of the threshold.
    if (section.dataset.mode !== "poster") return;

    const conn = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    if (conn?.saveData) return;
    if (conn?.effectiveType && conn.effectiveType !== "4g") return;

    let alive = true;
    let cancelIdle: (() => void) | undefined;

    const arm = () => {
      if (!alive) return;
      reveal.style.backgroundImage = `url("${REVEAL}")`;
      // CSS holds this layer at display:none under (pointer: coarse); the flag
      // is the opt-in that turns it back on, so a device that never reaches
      // here never composites an extra full-card layer either.
      section.dataset.reveal = "scroll";

      revealDriveRef.current = (p) => {
        const w = media.clientWidth;
        const h = media.clientHeight;
        // The stacked card is short and wide, so the desktop 260px circle would
        // cover most of it and read as a haze instead of a spotlight.
        const r = Math.max(90, Math.min(SPOTLIGHT_R, Math.round(Math.min(w, h) * 0.55)));
        // Left to right across the portrait, crossing the face rather than the
        // empty side: the ochre disc sits at ~0.47 of the frame.
        const x = (0.24 + 0.52 * p) * w;
        // A shallow arc, not a ruler line — a flat horizontal sweep reads as a
        // UI wipe, the curve reads as something looking around.
        const y = (0.44 + 0.07 * Math.sin(p * Math.PI)) * h;
        // Up through the middle of the transit, out at both ends, so the cyborg
        // is never left frozen half-revealed at the edge of the screen.
        const on = Math.max(0, Math.min(1, Math.sin(p * Math.PI) * 1.7 - 0.1));
        reveal.style.setProperty("--sr", `${r}px`);
        reveal.style.setProperty("--mx", `${x.toFixed(1)}px`);
        reveal.style.setProperty("--my", `${y.toFixed(1)}px`);
        reveal.style.setProperty("--on", on.toFixed(3));
      };
    };

    // Fetch first, arm second: flipping the flag before the bytes are in would
    // show the mask sweeping over an empty layer for the length of the fetch.
    const install = () => {
      const img = new Image();
      img.decoding = "async";
      img.onload = arm;
      img.src = REVEAL;
    };

    // Only once the hero is on screen, and only when the main thread is free.
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      const ric = window.requestIdleCallback;
      if (ric) {
        const id = ric(install, { timeout: 3000 });
        cancelIdle = () => window.cancelIdleCallback?.(id);
      } else {
        const id = window.setTimeout(install, 1200);
        cancelIdle = () => window.clearTimeout(id);
      }
    });
    io.observe(media);

    return () => {
      alive = false;
      io.disconnect();
      cancelIdle?.();
      revealDriveRef.current = null;
      delete section.dataset.reveal;
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
          {/* Above the footage, masked to a spotlight. No background-image until
              the pointer arrives (see the effect), so it never races the LCP. */}
          <div ref={revealRef} className="hm-reveal" aria-hidden="true" />
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
                {/* Il marchio passa dal componente, non e' riscritto qui.
                    Prima lo era, ed e' per questo che e' rimasto indietro
                    quando il marchio e' diventato un timbro: due posti che
                    disegnano la stessa cosa divergono al primo che si tocca.
                    Taglia compatta e senza la parola accanto, perche' qui sta
                    dentro una frase. */}
                {i < arr.length - 1 && (
                  <Wordmark className="hm-brand" suffix={false} compact />
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
