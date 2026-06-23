"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangProvider";
import MagneticButton from "./MagneticButton";

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
    const desktop = window.matchMedia("(min-width: 861px)").matches;
    const scrub = desktop && !reduce;
    section.dataset.mode = scrub ? "scrub" : "poster";
    if (!scrub) return; // poster attribute shows a still; nothing to drive

    video.src = VIDEO;
    video.loop = false;
    video.muted = true;
    let ready = false;
    let duration = 3.4;

    const seek = (p: number) => {
      if (!ready) return;
      const tt = Math.max(0, Math.min(duration - 0.05, p * duration));
      try { video.currentTime = tt; } catch { /* not seekable yet */ }
    };
    const onMeta = () => {
      duration = video.duration || 3.4;
      video.play().then(() => { video.pause(); ready = true; seek(0); }).catch(() => { ready = true; });
    };
    video.addEventListener("loadedmetadata", onMeta);

    gsap.registerPlugin(ScrollTrigger);
    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => {
        const p = self.progress;
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
    <section ref={sectionRef} id="top" className="hero-motion" aria-label="lorenzo.studio">
      <div className="hm-stage">
        <video ref={videoRef} className="hm-video" poster={POSTER} muted playsInline preload="auto" aria-hidden="true" />

        <div ref={contentRef} className="hm-content">
          <span className="hm-kicker">{t("heroMotion.kicker")}</span>
          <h1 className="hm-statement">{t("heroMotion.statement")}</h1>
          <div className="hm-cta">
            <MagneticButton
              href="#work"
              className="neo-btn neo-btn-lg neo-btn--primary"
              style={{ textDecoration: "none", padding: "14px 26px", fontSize: 15 }}
            >
              {t("hero.cta.work")}
              <span className="btn-arrow" aria-hidden="true">→</span>
            </MagneticButton>
            <MagneticButton
              href="#contact"
              className="neo-btn neo-btn-lg"
              style={{ textDecoration: "none", color: "var(--ink-body)", padding: "14px 26px", fontSize: 15, background: "var(--canvas-panel-yellow)" }}
            >
              {t("heroMotion.talk")}
              <span className="btn-arrow" aria-hidden="true">↗</span>
            </MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
