"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import ParallaxIndex from "./ParallaxIndex";
import { PROJECTS } from "@/lib/projects";

function FeaturedCard({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  const valueKey = `work.proj.${p.key}.value`;
  const value = t(valueKey);
  const hasValue = value !== valueKey;

  return (
    <Link
      href={`/work/${p.slug}`}
      style={{ textDecoration: "none", color: "inherit", display: "flex", height: "100%", width: "100%" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          border: "3px solid var(--ink-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--canvas-panel-yellow)",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s cubic-bezier(.16,1,.3,1)",
          transform: hover ? "translate(-2px, -2px)" : "translateY(0)",
          boxShadow: hover
            ? "8px 8px 0 var(--ink-shadow)"
            : "6px 6px 0 var(--ink-shadow)",
        }}
      >
        <div
          style={{
            aspectRatio: "16/10",
            background: p.swatch ?? "var(--canvas-panel-grey)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt={t(`work.proj.${p.key}`)}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: p.imagePosition ?? "center",
                transform: hover ? "scale(1.03)" : "scale(1)",
                transition: "transform .4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--fg) 6%, transparent) 14px 15px)",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "color-mix(in oklch, var(--fg) 60%, transparent)",
              letterSpacing: 1,
            }}
          >
            P / {p.id}
          </div>
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "color-mix(in oklch, var(--fg) 60%, transparent)",
              letterSpacing: 1,
            }}
          >
            {["01","02","03","04","11","12","13","14","15","16","17","18","19","20","21"].includes(p.id) ? "2026" : "2024"}
          </div>
          {!p.image && (
            <div
              style={{
                position: "relative",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: 1.4,
                color: "color-mix(in oklch, var(--fg) 55%, transparent)",
                textTransform: "uppercase",
              }}
            >
              [ {t(`work.proj.${p.key}`).toUpperCase()} — {t("work.preview")} ]
            </div>
          )}
        </div>
        <div
          style={{
            padding: "22px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
            flex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--fg)",
                margin: 0,
              }}
            >
              {t(`work.proj.${p.key}`)}
            </h3>
          <span
                className="arrow-blink"
                style={{
                  fontSize: 20,
                  color: "var(--fg)",
                  display: "inline-block",
                  marginLeft: 0,
                }}
              >
                ↗
              </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            {t(`work.proj.${p.key}.tags`)}
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--fg)",
              marginTop: 8,
              opacity: 0.85,
            }}
          >
            {t(`work.proj.${p.key}.blurb`)}
          </p>
          {hasValue && (
            <div
              style={{
                marginTop: "auto",
                paddingTop: 14,
                borderTop: "1px solid color-mix(in oklch, var(--fg) 14%, transparent)",
                display: "flex",
                gap: 10,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--accent-green-deep)",
                  flexShrink: 0,
                }}
              >
                {t("work.value.label")}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg)", opacity: 0.92 }}>
                {value}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Work() {
  const { t } = useLang();
  const featured = PROJECTS.filter((p) => p.featured && !p.hidden);

  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const wrapper = wrapperRef.current;
    const strip = stripRef.current;
    if (!track || !wrapper || !strip) return;

    // Sticky-driven horizontal scroll. The sticky child pins itself natively
    // (no GSAP pin-spacer, so nothing to desync and no jump on release); we just
    // map the page's scroll progress through the tall track onto the strip's
    // translateX. Everything is read live from getBoundingClientRect each frame,
    // so async layout shifts (typewriter title, font load, lazy images above)
    // can't throw it off. Must mirror the globals.css media query below.
    const mq = window.matchMedia(
      "(min-width: 769px) and (prefers-reduced-motion: no-preference)"
    );
    let raf = 0;

    const distance = () => Math.max(0, strip.scrollWidth - wrapper.clientWidth);

    const update = () => {
      if (!mq.matches) return;
      const dist = distance();
      // -track.top is how far we've scrolled into the sticky range (0 → dist).
      const progress = dist > 0 ? Math.min(1, Math.max(0, -track.getBoundingClientRect().top / dist)) : 0;
      strip.style.transform = `translateX(${-(progress * dist)}px)`;
    };

    const layout = () => {
      if (mq.matches) {
        // Extra scroll height = how far the strip must travel horizontally.
        track.style.height = `${window.innerHeight + distance()}px`;
        update();
      } else {
        track.style.height = "";
        strip.style.transform = "";
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    mq.addEventListener("change", layout);
    if (document.fonts?.ready) document.fonts.ready.then(layout);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      mq.removeEventListener("change", layout);
      track.style.height = "";
      strip.style.transform = "";
    };
  }, []);

  return (
    <section
      id="work"
      className="section-indexed"
      style={{
        padding: "clamp(80px, 8vw, 140px) 0",
        borderTop: "1px solid var(--line)",
        position: "relative",
        // The global `section { overflow: hidden }` rule would break the
        // position:sticky child the horizontal gallery relies on.
        overflow: "visible",
      }}
    >
      <ParallaxIndex>03</ParallaxIndex>
      <div ref={trackRef} className="work-track">
        <div className="work-sticky">
          <SectionHeader
            num={t("work.num")}
            title={t("work.title")}
            meta={t("work.meta")}
          />
          <div ref={wrapperRef} className="work-gallery">
            <div
              ref={stripRef}
              style={{
                display: "flex",
                flexWrap: "nowrap",
                gap: "clamp(28px, 3vw, 44px)",
                // room so the hard offset shadows aren't clipped by the wrapper
                padding: "8px 8px 16px 4px",
                willChange: "transform",
              }}
            >
              {featured.map((p) => (
                <div
                  key={p.id}
                  className="work-gallery__item"
                  style={{ flex: "0 0 auto", width: "clamp(340px, 40vw, 520px)" }}
                >
                  <FeaturedCard p={p} t={t} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
