"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import ParallaxIndex from "./ParallaxIndex";

const PROJECTS = [
  { id: "05", key: "05", href: "https://lorenzospizzaria.netlify.app/" },
  { id: "07", key: "07", href: "https://weather-se.netlify.app/" },
  { id: "11", key: "11", href: "https://github.com/Looziolooz/fotografo", featured: true, swatch: "#f0e6d8" },
  { id: "12", key: "12", href: "https://github.com/Looziolooz/real-estate", featured: true, swatch: "#dce8f0" },
  { id: "13", key: "13", href: "https://github.com/Looziolooz/aurelia", featured: true, swatch: "#e8d8d8" },
  { id: "14", key: "14", href: "https://github.com/Looziolooz/couffer" },
  { id: "15", key: "15", href: "https://github.com/Looziolooz/pizzeria-restaurant" },
];

function FeaturedCard({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener"
      style={{ textDecoration: "none", color: "inherit" }}
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
            background: p.swatch,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--fg) 6%, transparent) 14px 15px)",
            }}
          />
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
            {["01","02","03","04","11","12","13","14","15"].includes(p.id) ? "2026" : "2024"}
          </div>
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
        </div>
        <div
          style={{
            padding: "22px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
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
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: -0.6,
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
        </div>
      </div>
    </a>
  );
}

function IndexRow({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener"
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 100px 280px 80px",
        alignItems: "center",
        padding: "24px 16px",
        borderBottom: "3px solid var(--ink-border)",
        fontSize: 18,
        textDecoration: "none",
        color: "var(--ink-body)",
        transition: "background .2s, padding .2s",
        background: hover ? "var(--canvas-panel-yellow)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
        {p.id}
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>
        {t(`work.proj.${p.key}`)}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
        {["01","02","03","04","11","12","13","14","15"].includes(p.id) ? "2026" : "2023"}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 0.5 }}>
        {t(`work.proj.${p.key}.tags`)}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 6,
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--fg)",
          textAlign: "right",
        }}
      >
        {t("work.go")}
        <span className="arrow-blink" aria-hidden="true" style={{ marginLeft: 0 }}>→</span>
      </div>
    </a>
  );
}

export default function Work() {
  const { t } = useLang();
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="work"
      className="section-indexed"
      style={{
        padding: "clamp(80px, 8vw, 140px) 0",
        borderTop: "1px solid var(--line)",
        position: "relative",
      }}
    >
      <ParallaxIndex>03</ParallaxIndex>
      <SectionHeader
        num={t("work.num")}
        title={t("work.title")}
        meta={t("work.meta")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 96,
        }}
      >
        {featured.map((p) => (
          <FeaturedCard key={p.id} p={p} t={t} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "3px solid var(--ink-border)",
          paddingBottom: 14,
          marginBottom: 8,
        }}
      >
        <h3 style={{ fontSize: 28, margin: 0, fontWeight: 500, letterSpacing: -0.5 }}>
          {t("work.archive")}
        </h3>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          {t("work.archive.meta")}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        {rest.map((p) => (
          <IndexRow key={p.id} p={p} t={t} />
        ))}
      </div>
    </section>
  );
}
