"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLang } from "./LangProvider";
import MagneticButton from "./MagneticButton";
import { isPreLaunch, HIDDEN_ROUTES } from "@/lib/launch";
import { SERVICE_LINKS } from "@/lib/site-links";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

// On-brand rebuild of the "cinematic curtain-reveal footer": the page scrolls
// away to reveal a fixed footer underneath. Restyled for LOoz.design —
// Parchment & Forest, Fraunces/General Sans/mono, neo-brutalist (hard ink
// borders + offset shadows, NO blur/glass/gradients). Reuses MagneticButton +
// i18n + the ticker terms. Lenis owns native scroll, so position:fixed is safe.

// Footer-scoped CSS (brand tokens only — no foreign fonts, no glass).
const CSS = `
/* Giant outlined wordmark — same treatment as the section watermarks. */
/* The footer runs on its own four colours, deliberately literal rather than
   token-derived: --canvas-page and --ink-body swap places in dark mode, so
   reading them here would have flipped the footer light exactly when the page
   went dark. The ground is the palette's own warm near-black, not #000, which
   would read cold against parchment. */
.cine-foot-black {
  --cf-ground: #1B1813;
  --cf-ink: #F4F1EA;
  --cf-muted: #A89E8B;
  --cf-line: rgba(244, 241, 234, 0.22);
}

/* Pills inside the black footer are pinned to the footer's own two colours.
   Left on the page tokens they were light-on-black in light mode and then
   dark-on-black in dark mode, which is the same bug the footer itself had. */
.cine-foot-black .cine-pill {
  background: var(--cf-ink);
  color: var(--cf-ground);
  border-color: var(--cf-ground);
  box-shadow: 4px 4px 0 rgba(244, 241, 234, 0.16);
}
.cine-foot-black .cine-pill:hover,
.cine-foot-black .cine-pill:focus-visible {
  background: var(--accent-green);
  color: var(--cf-ground);
  border-color: var(--accent-green);
}

/* The dot opts out of the outline and fills, so the wordmark keeps its one
   piece of colour at watermark scale. */
.cine-giant__dot {
  -webkit-text-stroke: 0;
  color: var(--accent-green);
  opacity: 0.55;
}

.cine-giant {
  font-family: var(--font-display);
  font-size: clamp(96px, 24vw, 440px);
  line-height: 0.78;
  font-weight: 600;
  letter-spacing: -0.04em;
  color: transparent;
  -webkit-text-stroke: 2px color-mix(in oklch, var(--cf-ink, var(--ink-body)) 16%, transparent);
}

/* Neo-brutalist pill (replaces the glass pill): hard border + offset shadow. */
/* Footer service directory. Deliberately quieter than the pills above it: this
   row exists so every page has a path to the four /servizi pages (one of which
   was linked from nowhere at all), and a link hub that shouts would compete
   with the call to action it sits under. */
.cine-svc {
  display: flex; flex-wrap: wrap; align-items: baseline; justify-content: center;
  gap: 8px 14px; max-width: 720px;
}
.cine-svc__label {
  font-family: var(--font-mono); font-size: 10.5px; font-weight: 700;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--cf-muted, var(--ink-muted));
}
.cine-svc__links { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px 16px; }
.cine-svc__link {
  font-size: 13.5px; line-height: 1.4; color: var(--cf-ink, var(--accent-green-deep));
  text-decoration: none; border-bottom: 1.5px solid transparent;
  transition: border-color 0.16s var(--ease), color 0.16s var(--ease);
}
/* color set explicitly, not only the underline: the global a:hover rule paints
   links coral-deep, fine on parchment and black-on-black here. Class+pseudo
   (0,2,0) outweighs the global (0,1,1), so the ochre wins here and nowhere
   else. (No backticks in this block: it is a JS template literal.) */
.cine-svc__link:hover,
.cine-svc__link:focus-visible { color: var(--accent-green); border-bottom-color: var(--accent-green); }

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
/* La riga legale in fondo. La misura sta qui e non nello stile in linea proprio
   perche' sul telefono deve poter salire: 11px in mano non si leggono, e uno
   stile scritto in linea non lo corregge nessun foglio. */
.cine-bottombar { padding: 0 24px 28px; }
.cine-legal { font-size: 11px; }
@media (max-width: 900px), (pointer: coarse) {
  /* La bolla dell'assistente galleggia nell'angolo in basso a destra. Su uno
     schermo stretto la barra va a capo e la seconda riga le finisce sotto:
     "Cookie" spariva. Il fondo si alza quanto basta a passarci sotto. */
  .cine-bottombar { padding-bottom: 96px; }
  .cine-legal { font-size: 12px; }
  a.cine-legal,
  .cine-legal a { display: inline-flex; align-items: center; min-height: 44px; }
}

`;

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
    { href: "/processo", label: t("nav.process") },
    { href: "/prezzi", label: t("nav.pricing") },
    { href: "/agents", label: t("nav.agents") },
    { href: "/componenti", label: t("nav.components") },
    { href: "/membership", label: t("nav.membership") },
    { href: "/blog", label: t("nav.blog") },
  ].filter((p) => !(isPreLaunch && (HIDDEN_ROUTES as readonly string[]).includes(p.href)));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      {/* Curtain-reveal wrapper: clip-path windows the fixed footer underneath. */}
      <div ref={wrapRef} className="cine-foot" style={{ position: "relative", height: "100vh", width: "100%", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
        <footer
          className="cine-foot-black"
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
            background: "var(--cf-ground)",
            color: "var(--cf-ink)",
            fontFamily: "var(--font-ui)",
          }}
          aria-label="LO.oz"
        >
          {/* Giant background wordmark */}
          <div
            ref={giantRef}
            className="cine-giant"
            aria-hidden
            style={{ position: "absolute", left: "50%", bottom: "-4vh", transform: "translateX(-50%)", whiteSpace: "nowrap", zIndex: 0, pointerEvents: "none", userSelect: "none" }}
          >
            {/* Outlined letters, ochre dot. The earlier note here said a dot
                would read as a blob, and that was true of the NAV treatment,
                which is an ochre fill PLUS an ink ring: at ~200px the ring
                closes up. A plain fill at the glyph's own size is just a dot,
                and it is the one piece of the wordmark that carries colour. */}
            LO<span className="cine-giant__dot">.</span>oz
          </div>

          {/* Center content */}
          <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", marginTop: 80, width: "100%", maxWidth: 1040, marginInline: "auto", textAlign: "center" }}>
            <div ref={linksRef} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 22, width: "100%" }}>
              {/* p, not h2: a nav prompt repeated on every page was polluting
                  every document outline (SEO audit). */}
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(34px, 6vw, 72px)", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1.02, margin: "0 0 6px" }}>
                {t("footer.discover")}
              </p>
              {/* Section links */}
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12 }}>
                {navPills.map((p) => (
                  <MagneticButton key={p.href} href={p.href} className="cine-pill" style={{ padding: "12px 24px", fontSize: 13 }} strength={0.25}>
                    {p.label}
                  </MagneticButton>
                ))}
              </div>

              {/* Services, quieter than the pills on purpose: this row is a
                  directory, not a second call to action. It is also the only
                  site-wide path to these four pages. */}
              <nav aria-label={t("footer.services")} className="cine-svc">
                <span className="cine-svc__label">{t("footer.services")}</span>
                <span className="cine-svc__links">
                  {SERVICE_LINKS.map((sv) => (
                    <a key={sv.href} href={sv.href} className="cine-svc__link">{t(sv.labelKey)}</a>
                  ))}
                </span>
              </nav>
            </div>
          </div>

          {/* Bottom bar — everything left-aligned so the bottom-right corner
              stays free for the Assistant FAB (it was covering the back-to-top). */}
          <div className="cine-bottombar" style={{ position: "relative", zIndex: 3, width: "100%", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "flex-start", gap: "clamp(14px, 2.5vw, 30px)" }}>
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
            <div className="cine-legal" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cf-muted)" }}>
              {t("contact.footer.copy")}
            </div>
            <div className="cine-legal" style={{ fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--cf-muted)" }}>
              {t("contact.footer.made")}
            </div>
            {/* A real mailto. The address was on the page as plain text and in the
                JSON-LD contactPoint, but never once as a link a machine or a
                visitor could act on. */}
            <a
              href="mailto:hello@looz.design"
              className="cine-legal"
              style={{ fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.08em", color: "var(--cf-muted)", textDecoration: "none" }}
            >
              hello@looz.design
            </a>
            {/* Legal — always reachable (not gated by the pre-launch flag). */}
            <div className="cine-legal" style={{ display: "flex", gap: 16, fontFamily: "var(--font-mono)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <a href="/privacy" style={{ color: "var(--cf-muted)", textDecoration: "none" }}>{t("nav.privacy")}</a>
              <a href="/cookie" style={{ color: "var(--cf-muted)", textDecoration: "none" }}>{t("nav.cookie")}</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
