"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangProvider";
import MagneticButton from "./MagneticButton";
import { EncryptedText } from "./ui/encrypted-text";

// Hero: the studio portrait (B&W + brand ochre disc) as full-bleed footage that
// the visitor SCRUBS by scroll — no autoplay/loop. A left-aligned studio
// statement + two CTAs sit over the light side and parallax out as you scroll.
// Desktop = tall sticky scrub; phones / reduced-motion = a static poster frame.
const VIDEO = "/hero-motion/clouds.mp4";
const POSTER = "/hero-motion/clouds-poster.jpg";

export default function HeroMotion() {
  const { t } = useLang();
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const video = videoRef.current;
    const content = contentRef.current;
    if (!section || !video) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ≥1100: full-bleed OVERLAY (text over the dissolved portrait, no stacking).
    // Below: STACKED (portrait on top, text below) so nothing overlaps — but the
    // portrait still scroll-scrubs exactly like desktop.
    const overlay = window.matchMedia("(min-width: 1440px)").matches && !reduce;
    section.dataset.mode = overlay ? "scrub" : "poster";

    if (reduce) return; // static poster, no motion

    gsap.registerPlugin(ScrollTrigger);

    // Shared: scroll-scrub the portrait video (both layouts). The 311KB clip and
    // its first-frame decode are DEFERRED until the first scroll — otherwise the
    // eager video frame becomes a slow LCP. Until then only the (preloaded) poster
    // shows, so LCP is the poster, not a late video frame.
    video.loop = false;
    video.muted = true;
    let ready = false;
    let loadStarted = false;
    let lastP = 0;
    let duration = 3.4;
    const seek = (p: number) => {
      if (!ready) return;
      const tt = Math.max(0, Math.min(duration - 0.05, p * duration));
      try { video.currentTime = tt; } catch { /* not seekable yet */ }
    };
    const onMeta = () => {
      duration = video.duration || 3.4;
      video.play().then(() => { video.pause(); ready = true; seek(lastP); }).catch(() => { ready = true; });
    };
    const ensureVideo = () => {
      if (loadStarted) return;
      loadStarted = true;
      video.addEventListener("loadedmetadata", onMeta);
      video.src = VIDEO;
      video.load();
    };

    if (!overlay) {
      // STACKED (phones / tablets): same scroll-scrub as desktop, but the text
      // sits BELOW the portrait. Entrance is TRANSFORM-ONLY (no opacity hide): the
      // portrait is the LCP element, so hiding it behind JS would tank LCP. Content
      // is visible in the SSR HTML and just rises into place once gsap runs.
      const ctxg = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.from(video, { scale: 1.04, duration: 0.9 });
        if (content) {
          tl.from(Array.from(content.children), { y: 22, duration: 0.6, stagger: 0.09 }, "-=0.5");
        }
        ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
          onUpdate: (self) => {
            const p = self.progress;
            lastP = p;
            if (p > 0) ensureVideo();
            seek(p);
            video.style.transform = `translateY(${(p * -28).toFixed(1)}px) scale(${(1 + p * 0.05).toFixed(3)})`;
            if (content) {
              content.style.transform = `translateY(${(p * 18).toFixed(1)}px)`;
              content.style.opacity = Math.max(0, 1 - p * 1.1).toFixed(3);
            }
          },
        });
      }, section);
      ScrollTrigger.refresh();
      return () => { video.removeEventListener("loadedmetadata", onMeta); ctxg.revert(); };
    }

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
        lastP = p;
        if (p > 0) ensureVideo();
        seek(p);
        // full-bleed; very subtle push-in; statement drifts up + fades
        video.style.transform = `scale(${(1 + p * 0.05).toFixed(3)})`;
        if (content) {
          content.style.transform = `translateY(calc(-50% - ${Math.round(p * 46)}px))`;
          content.style.opacity = Math.max(0, 1 - p * 1.25).toFixed(3);
        }
      },
    });
    ScrollTrigger.refresh();

    return () => {
      video.removeEventListener("loadedmetadata", onMeta);
      st.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="top" className="hero-motion" aria-label="Lorenzo.studio">
      {/* The poster is the LCP element — preload it at high priority so it paints
          immediately instead of waiting in the queue (React 19 hoists this to <head>). */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <link rel="preload" as="image" href={POSTER} fetchPriority="high" />
      <div className="hm-stage">
        {/* preload="metadata": the 311KB clip is NOT eagerly downloaded, so the
            poster (not a late video frame) is the LCP. The scroll-scrub loads the
            body on demand. */}
        <video ref={videoRef} className="hm-video" poster={POSTER} muted playsInline preload="metadata" aria-hidden="true" />

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
          <h2 className="hm-statement">{t("heroMotion.statement")}</h2>
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
