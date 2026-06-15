"use client";

import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";

// The core sales band of the homepage: six service pillars, outcome-first
// (what the business gains), not a tool list. Uses the system .neo-card so
// every card on the site shares one shape.
const PILLARS = [
  "sites",
  "visibility",
  "social",
  "automation",
  "data",
  "agents",
] as const;

export default function Services() {
  const { t } = useLang();

  return (
    <section
      id="servizi"
      className="section section-indexed"
      aria-label={t("home.svc.title")}
      style={{ position: "relative" }}
    >
      <ParallaxIndex>02</ParallaxIndex>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="section-head__num">{t("home.svc.tag")}</span>
        <h2 className="section-head__title" style={{ fontSize: "clamp(28px, 5vw, 64px)" }}>
          {t("home.svc.title")}
        </h2>
        <span className="label" style={{ alignSelf: "end", textAlign: "right" }}>
          {t("home.svc.meta")}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 24,
        }}
      >
        {PILLARS.map((key, i) => (
          <div
            key={key}
            className="neo-card"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 210,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                alignSelf: "flex-start",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                fontWeight: 700,
                color: "#fff",
                background: "var(--accent-green)",
                border: "2px solid var(--ink-border)",
                borderRadius: "var(--radius-sm)",
                padding: "2px 8px",
                letterSpacing: 0.5,
                boxShadow: "var(--shadow-badge)",
              }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: 23,
                fontWeight: 600,
                letterSpacing: "-0.01em",
                color: "var(--ink-body)",
              }}
            >
              {t(`home.svc.${key}.title`)}
            </h3>
            <p
              style={{
                margin: 0,
                fontSize: 15,
                lineHeight: 1.55,
                color: "var(--ink-body)",
                opacity: 0.8,
              }}
            >
              {t(`home.svc.${key}.desc`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
