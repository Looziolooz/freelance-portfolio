"use client";

import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";

// How Lorenzo charges. Two standard variants — a flat monthly fee, or a lower
// fee plus a commission on the revenue the site generates — and a consultation
// track for complex work. Figures are indicative; the real quote happens in a
// call (or with the assistant). The first two CTAs open the site-wide widget.
function openAssistant() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("open-assistant"));
}

type Plan = {
  key: "fixed" | "rev" | "custom";
  dark?: boolean;
  custom?: boolean;
};

const PLANS: Plan[] = [
  { key: "fixed" },
  { key: "rev" },
  { key: "custom", dark: true, custom: true },
];

export default function Plans() {
  const { t } = useLang();

  return (
    <section
      id="piani"
      className="section section-indexed"
      aria-label={t("home.plans.title")}
      style={{ position: "relative" }}
    >
      <ParallaxIndex>06</ParallaxIndex>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="section-head__num">{t("home.plans.tag")}</span>
        <h2 className="section-head__title" style={{ fontSize: "clamp(28px, 5vw, 64px)" }}>
          {t("home.plans.title")}
        </h2>
        <span className="label" style={{ alignSelf: "end", textAlign: "right" }}>
          {t("home.plans.meta")}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {PLANS.map((p, i) => {
          const dark = p.dark;
          const ink = dark ? "var(--canvas-page)" : "var(--ink-body)";
          return (
            <div
              key={p.key}
              className="neo-card"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
                minHeight: 280,
                background: dark ? "var(--ink-body)" : "var(--canvas-panel-yellow)",
                color: ink,
              }}
            >
              <span
                style={{
                  alignSelf: "flex-start",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  color: "#fff",
                  background: "var(--accent-green)",
                  border: "2px solid var(--ink-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "2px 9px",
                  boxShadow: "var(--shadow-badge)",
                }}
              >
                {String(i + 1).padStart(2, "0")} · {t(`home.plans.${p.key}.tag`)}
              </span>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  color: dark ? "var(--accent-green-bright)" : "var(--accent-green-deep)",
                }}
              >
                {t(`home.plans.${p.key}.price`)}
              </div>

              <p
                style={{
                  margin: 0,
                  flex: 1,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: ink,
                  opacity: dark ? 0.88 : 0.8,
                }}
              >
                {t(`home.plans.${p.key}.desc`)}
              </p>

              {p.custom ? (
                <a
                  href="#contact"
                  className="neo-btn"
                  style={{
                    alignSelf: "flex-start",
                    padding: "10px 18px",
                    background: "var(--accent-green)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    letterSpacing: 0.3,
                    textDecoration: "none",
                  }}
                >
                  {t("home.plans.cta.custom")} →
                </a>
              ) : (
                <button
                  type="button"
                  onClick={openAssistant}
                  className="neo-btn"
                  style={{
                    alignSelf: "flex-start",
                    padding: "10px 18px",
                    background: "var(--accent-green)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    letterSpacing: 0.3,
                  }}
                >
                  {t("home.plans.cta")} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      <p
        style={{
          marginTop: 20,
          fontFamily: "var(--font-mono)",
          fontSize: 12,
          color: "var(--ink-muted)",
        }}
      >
        {t("home.plans.note")}
      </p>
    </section>
  );
}
