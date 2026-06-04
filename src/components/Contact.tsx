"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import CursorTrack from "./CursorTrack";
import Typewriter from "./Typewriter";

export default function Contact() {
  const { t } = useLang();
  const [typed, setTyped] = useState(false);

  const channels = [
    { l: t("contact.channel.email"), v: "hello@lorenzo.hacks", h: "mailto:hello@lorenzo.hacks" },
    { l: t("contact.channel.phone"), v: "+46 (0)763 12 33 45", h: "tel:+460763123345" },
    { l: t("contact.channel.linkedin"), v: "in/lorenzo-dastoli", h: "https://www.linkedin.com/in/lorenzo-dastoli/" },
    { l: t("contact.channel.github"), v: "@Looziolooz", h: "https://github.com/Looziolooz/" },
  ];

  return (
    <section
      id="contact"
      className="section-indexed"
      style={{
        padding: "clamp(100px, 10vw, 160px) 0 120px",
        borderTop: "1px solid var(--line)",
        position: "relative",
      }}
    >
      <ParallaxIndex>06</ParallaxIndex>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "80px 1fr auto",
          gap: 24,
          alignItems: "flex-end",
          paddingBottom: 28,
          borderBottom: "3px solid var(--ink-border)",
          marginBottom: 60,
        }}
      >
        <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
          {t("contact.num")}
        </div>
        <h2
          style={{
            fontSize: "clamp(40px, 7vw, 128px)",
            letterSpacing: -3,
            fontWeight: 500,
            lineHeight: 0.95,
            margin: 0,
            overflowWrap: "break-word",
            wordBreak: "break-word",
            hyphens: "auto",
          }}
        >
          {typed ? (
            <>
              <CursorTrack strength={12}>
                {t("contact.title.p1")}{" "}
              </CursorTrack>
              <span
                style={{
              background: "var(--accent-coral)",
              color: "#ffffff",
              padding: "0 0.08em",
                }}
              >
                {t("contact.title.highlight")}
              </span>
              {t("contact.title.p2")}
            </>
          ) : (
            <Typewriter text={t("contact.title.p1") + " " + t("contact.title.highlight") + t("contact.title.p2")} speed={40} onDone={() => setTyped(true)} />
          )}
        </h2>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            textTransform: "uppercase",
            letterSpacing: 1.4,
            color: "var(--muted)",
            textAlign: "right",
          }}
        >
          {t("contact.meta")}
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(260px, 320px) 1fr",
          gap: "clamp(32px, 4vw, 60px)",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "min(240px, 100%)",
            aspectRatio: "3/4",
            borderRadius: "var(--radius-lg)",
            background: "var(--canvas-page)",
            position: "relative",
            overflow: "hidden",
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
                "repeating-linear-gradient(0deg, transparent, transparent 10px, color-mix(in oklch, var(--fg) 5%, transparent) 10px, color-mix(in oklch, var(--fg) 5%, transparent) 11px), repeating-linear-gradient(90deg, transparent, transparent 10px, color-mix(in oklch, var(--fg) 5%, transparent) 10px, color-mix(in oklch, var(--fg) 5%, transparent) 11px)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.3,
              mixBlendMode: "overlay",
              pointerEvents: "none",
              zIndex: 4,
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='cn'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0'/></filter><rect width='100%' height='100%' filter='url(%23cn)'/></svg>\")",
            }}
          />
          <span className="reticule-corners" aria-hidden="true" style={{ zIndex: 5, color: "var(--accent)" }}><span /><span /><span /><span /></span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          <p
            style={{
              fontSize: "clamp(22px, 2vw, 28px)",
              lineHeight: 1.3,
              letterSpacing: -0.6,
              fontWeight: 500,
              color: "var(--fg)",
              margin: 0,
              maxWidth: 640,
            }}
          >
            {t("contact.lede")}
          </p>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid var(--line)",
            }}
          >
            {channels.map((c) => (
              <a
                key={c.l}
                href={c.h}
                target={c.h.startsWith("http") ? "_blank" : undefined}
                rel="noopener"
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr auto",
                  padding: "22px 0",
                  borderBottom: "3px solid var(--ink-border)",
                  alignItems: "center",
                  textDecoration: "none",
                  color: "var(--fg)",
                  transition: "padding-left .2s",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 1.4,
                    color: "var(--muted)",
                  }}
                >
                  {c.l}
                </div>
                <div style={{ fontSize: "clamp(18px, 1.5vw, 22px)", fontWeight: 500, letterSpacing: -0.3 }}>
                  {c.v}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--muted)" }}>
                  {t("contact.open")}
                  <span className="arrow-blink" aria-hidden="true" style={{ marginLeft: 0 }}>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 30,
          left: "clamp(24px, 4vw, 60px)",
          right: "clamp(24px, 4vw, 60px)",
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          color: "var(--muted)",
          letterSpacing: 1.4,
          textTransform: "uppercase",
        }}
      >
        <span>{t("contact.footer.copy")}</span>
        <span>{t("contact.footer.made")}</span>
        <span>{t("contact.footer.up")}</span>
      </div>
    </section>
  );
}
