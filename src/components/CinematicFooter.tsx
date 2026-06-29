"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangProvider";
import MagneticButton from "./MagneticButton";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// On-brand rebuild of the "cinematic curtain-reveal footer": the page scrolls
// away to reveal a fixed footer underneath. Restyled for lorenzo.studio —
// Parchment & Forest, Fraunces/General Sans/mono, neo-brutalist (hard ink
// borders + offset shadows, NO blur/glass/gradients). Reuses MagneticButton +
// i18n + the ticker terms. Lenis owns native scroll, so position:fixed is safe.

// Footer-scoped CSS (brand tokens only — no foreign fonts, no glass).
const CSS = `
@keyframes cine-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.cine-marquee__track { animation: cine-marquee 38s linear infinite; }
.cine-foot:hover .cine-marquee__track { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) { .cine-marquee__track { animation: none; } }

/* Giant outlined wordmark — same treatment as the section watermarks. */
.cine-giant {
  font-family: var(--font-display);
  font-size: clamp(96px, 24vw, 440px);
  line-height: 0.78;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 2px color-mix(in oklch, var(--ink-body) 13%, transparent);
}

/* Neo-brutalist pill (replaces the glass pill): hard border + offset shadow. */
.cine-pill {
  display: inline-flex; align-items: center; gap: 10px;
  border: 3px solid var(--ink-border);
  border-radius: var(--radius-full);
  background: var(--canvas-panel-yellow);
  color: var(--ink-body);
  text-decoration: none;
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 0.02em;
  box-shadow: 4px 4px 0 var(--ink-shadow);
  transition: box-shadow .2s var(--ease), background .2s var(--ease);
}
.cine-pill:hover { box-shadow: 6px 6px 0 var(--ink-shadow); }
.cine-pill--primary { background: var(--accent-green); color: var(--btn-ink); }
`;

function MarqueeRow({ terms }: { terms: string[] }) {
  return (
    <div className="cine-marquee__row" style={{ display: "inline-flex", alignItems: "center" }}>
      {terms.map((tterm, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center" }}>
          <span style={{ padding: "0 26px" }}>{tterm}</span>
          <span aria-hidden style={{ color: "var(--accent-green-deep)" }}>✦</span>
        </span>
      ))}
    </div>
  );
}

export default function CinematicFooter() {
  const { t } = useLang();
  const wrapRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  const terms = Array.from({ length: 10 }, (_, i) => t(`ticker.${i}`)).filter(Boolean);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantRef.current,
        { yPercent: 16, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          ease: "none",
          scrollTrigger: { trigger: wrapRef.current, start: "top 85%", end: "bottom bottom", scrub: 1 },
        },
      );
      gsap.fromTo(
        linksRef.current,
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: wrapRef.current, start: "top 55%", end: "center bottom", scrub: 1 },
        },
      );
    }, wrapRef);

    return () => ctx.revert();
  }, []);

  const navPills: { href: string; label: string }[] = [
    { href: "/work", label: t("nav.work") },
    { href: "/agents", label: t("nav.agents") },
    { href: "/componenti", label: t("nav.components") },
    { href: "/membership", label: t("nav.membership") },
    { href: "/blog", label: t("nav.blog") },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Curtain-reveal wrapper: clip-path windows the fixed footer underneath. */}
      <div ref={wrapRef} className="cine-foot" style={{ position: "relative", height: "100vh", width: "100%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <footer
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            overflow: "hidden",
            background: "var(--canvas-page)",
            color: "var(--ink-body)",
            fontFamily: "var(--font-ui)",
          }}
          aria-label="lorenzo.studio"
        >
          {/* Giant background wordmark */}
          <div
            ref={giantRef}
            className="cine-giant"
            aria-hidden
            style={{ position: "absolute", left: "50%", bottom: "-4vh", transform: "translateX(-50%)", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none" }}
          >
            lorenzo
          </div>

          {/* Services marquee */}
          <div style={{ position: "absolute", top: 56, left: 0, width: "100%", overflow: "hidden", borderTop: "3px solid var(--ink-border)", borderBottom: "3px solid var(--ink-border)", background: "var(--canvas-panel-yellow)", padding: "12px 0", zIndex: 1, transform: "rotate(-2deg) scale(1.06)", boxShadow: "var(--shadow-card)" }}>
            <div className="cine-marquee__track" style={{ display: "inline-flex", width: "max-content", fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
              <MarqueeRow terms={terms} />
              <MarqueeRow terms={terms} />
            </div>
          </div>

          {/* Center content */}
          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", marginTop: 80, width: "100%", maxWidth: 1040, marginInline: "auto", textAlign: "center" }}>
            <div ref={linksRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 6vw, 72px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "0 0 6px" }}>
                {t("footer.discover")}
              </h2>
              {/* Section links */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                {navPills.map((p) => (
                  <MagneticButton key={p.href} href={p.href} className="cine-pill" style={{ padding: "12px 24px", fontSize: 13, background: "var(--canvas-page)" }} strength={0.25}>
                    {p.label}
                  </MagneticButton>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar — everything left-aligned so the bottom-right corner
              stays free for the Assistant FAB (it was covering the back-to-top). */}
          <div style={{ position: "relative", zIndex: 3, width: "100%", padding: "0 24px 28px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start", gap: "clamp(14px, 2.5vw, 30px)" }}>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Top"
              className="cine-pill"
              style={{ width: 48, height: 48, justifyContent: "center", padding: 0, cursor: "pointer", flexShrink: 0 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
              {t("contact.footer.copy")}
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-muted)" }}>
              {t("contact.footer.made")}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
