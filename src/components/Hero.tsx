"use client";

import { useState, useEffect } from "react";
import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";

const dots = (t: (k: string) => string) => [
  { num: "40+", label: t("hero.stat.workflows") },
  { num: "10", label: t("hero.stat.projects") },
  { num: "6a", label: t("hero.stat.web") },
  { num: "2026", label: t("hero.stat.bookings") },
];

export default function Hero() {
  const [time, setTime] = useState("");
  const [typed, setTyped] = useState(false);
  const { t, lang } = useLang();

  useEffect(() => {
    const tick = () => {
      setTime(
        new Date().toLocaleTimeString(
          lang === "sv" ? "sv-SE" : lang === "en" ? "en-GB" : "it-IT",
          { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Stockholm" }
        )
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lang]);

  return (
    <section
      id="top"
      className="section-indexed"
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) minmax(360px, 460px)",
        gap: 0,
        padding: "120px 0 60px",
        position: "relative",
      }}
    >
      <ParallaxIndex>01</ParallaxIndex>
      <div
        style={{
          padding: "60px 48px 48px 60px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          gap: 40,
          minWidth: 0,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: 1.8,
              color: "var(--muted)",
              marginBottom: 32,
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
            }}
          >
            <span>
              <span
                style={{
                  display: "inline-block",
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "var(--accent-coral)",
                  marginRight: 8,
                  verticalAlign: "middle",
                  border: "2px solid var(--ink-border)",
                }}
              />
              {t("hero.available")}
            </span>
            <span>{t("hero.version")}</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 112px)",
              lineHeight: 0.95,
              fontWeight: 500,
              letterSpacing: -3,
              margin: 0,
              color: "var(--fg)",
              overflowWrap: "break-word",
              wordBreak: "break-word",
              hyphens: "auto",
              minHeight: "2.85em",
            }}
          >
            {typed ? (
              <>
                <CursorTrack strength={12}>
                  {t("hero.line1")}
                  <br />
                </CursorTrack>
                <span
                  style={{
                    background: "var(--accent-coral)",
                    color: "var(--fg-on-coral)",
                    padding: "0.04em 0.08em",
                    boxDecorationBreak: "clone",
                    WebkitBoxDecorationBreak: "clone",
                    lineHeight: 1.1,
                  }}
                >
                  {t("hero.highlight")}
                </span>
                <br />
                {t("hero.line2")}
              </>
            ) : (
              <Typewriter
                text={t("hero.typed")}
                speed={50}
                onDone={() => setTyped(true)}
              />
            )}
          </h1>
          <div
            style={{ marginTop: 32, display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}
          >
            <span className="neo-sparkle">✦</span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                background: "var(--fg)",
                color: "var(--bg)",
                borderRadius: 999,
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.ai")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.n8n")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.designer")}
            </span>
            <span
              style={{
                padding: "9px 16px",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                border: "1px solid var(--line)",
                borderRadius: 999,
                color: "var(--fg)",
                letterSpacing: 0.3,
              }}
            >
              {t("hero.pill.scraper")}
            </span>
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
          <a
            href="#work"
            className="neo-btn neo-btn-lg"
            style={{ textDecoration: "none", color: "var(--ink-body)", padding: "13px 26px", fontSize: 16 }}
          >
            {t("hero.cta.work")}
          </a>
          <a
            href="/agents"
            className="neo-btn neo-btn-lg"
            style={{ textDecoration: "none", color: "var(--ink-body)", padding: "13px 26px", fontSize: 16, background: "var(--canvas-page)" }}
          >
            {t("hero.cta.agents")}
          </a>
        </div>
        <div
          style={{
            display: "flex",
            gap: 40,
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {dots(t).map((s) => (
              <div
                key={s.label}
                style={{
                  borderTop: "3px solid var(--ink-border)",
                  paddingTop: 12,
                  minWidth: 130,
                }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  letterSpacing: -1,
                  color: "var(--fg)",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  textTransform: "uppercase",
                  letterSpacing: 1.4,
                  color: "var(--muted)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
          style={{
            padding: "60px 24px 48px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 24,
          }}
      >
        <div
          style={{
            width: "min(clamp(260px, 24vw, 400px), 100%)",
            aspectRatio: "3/4",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
            position: "relative",
            background: "var(--canvas-page)",
            flexShrink: 0,
            border: "3px solid var(--ink-border)",
            boxShadow: "8px 8px 0 var(--ink-shadow)",
          }}
        >
          <img
            src="/lorenzo.webp"
            alt="Lorenzo Dastoli"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 1,
              filter: "grayscale(100%) contrast(1.1)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 3,
              backgroundImage:
                "repeating-linear-gradient(0deg, transparent, transparent 12px, color-mix(in oklch, var(--fg) 6%, transparent) 12px, color-mix(in oklch, var(--fg) 6%, transparent) 13px), repeating-linear-gradient(90deg, transparent, transparent 12px, color-mix(in oklch, var(--fg) 6%, transparent) 12px, color-mix(in oklch, var(--fg) 6%, transparent) 13px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.35,
              mixBlendMode: "overlay",
              pointerEvents: "none",
              zIndex: 4,
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='hn'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/></filter><rect width='100%' height='100%' filter='url(%23hn)'/></svg>\")",
            }}
          />
          <span className="reticule-corners" aria-hidden="true" style={{ zIndex: 5, color: "var(--accent)" }}><span /><span /><span /><span /></span>
        </div>

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--fg)",
            background: "color-mix(in oklch, var(--bg) 85%, transparent)",
            padding: "6px 14px",
            borderRadius: 999,
            letterSpacing: 0.8,
            border: "1px solid var(--line)",
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent)",
              display: "inline-block",
            }}
          />
          STO · {time}
        </div>
      </div>
    </section>
  );
}
