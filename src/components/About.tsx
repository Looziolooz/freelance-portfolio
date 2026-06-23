"use client";

import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import ParallaxIndex from "./ParallaxIndex";

const STRENGTHS = 6;

// Founder bio (hexart-style "Meet …"): intro + Personal note on the left, the
// Core Strengths list on the right.
export default function About() {
  const { t } = useLang();

  return (
    <section
      id="about"
      className="section-indexed"
      style={{ padding: "clamp(80px, 8vw, 140px) 0", position: "relative" }}
    >
      <ParallaxIndex>04</ParallaxIndex>
      <SectionHeader num={t("about.num")} title={t("about.title")} />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 360px), 1fr))",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "start",
          marginTop: "clamp(32px, 4vw, 56px)",
        }}
      >
        {/* Left: intro + personal note */}
        <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
          <p
            style={{
              fontSize: "clamp(20px, 2.4vw, 30px)",
              lineHeight: 1.3,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              color: "var(--fg)",
              margin: 0,
            }}
          >
            {t("about.intro")}
          </p>
          <div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 1.4,
                color: "var(--accent-green-deep)",
                marginBottom: 10,
              }}
            >
              {t("about.personal.label")}
            </div>
            <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--ink-body)", opacity: 0.85, margin: 0 }}>
              {t("about.personal.body")}
            </p>
          </div>
        </div>

        {/* Right: core strengths */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 1.4,
              color: "var(--accent-green-deep)",
              marginBottom: 16,
            }}
          >
            {t("about.strengths.label")}
          </div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {Array.from({ length: STRENGTHS }, (_, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "15px 0",
                  borderTop: "1px solid color-mix(in oklch, var(--fg) 14%, transparent)",
                  fontSize: "clamp(16px, 1.5vw, 19px)",
                  color: "var(--fg)",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, color: "var(--accent-green)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {t(`about.strength.${i}`)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
