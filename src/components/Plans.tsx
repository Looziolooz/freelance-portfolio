"use client";

import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import { RevealStagger, RevealItem } from "./Reveal";

// Engagements — three ways to work together (no fixed prices/subscriptions):
// a Brand System, a Conversion Website, or an ongoing Retainer. Each card lists
// what's included and points to the contact form. The real scope is set in a
// short intro call, so the only CTA is "fill the form".
type Engagement = {
  key: "brand" | "web" | "retainer";
  dark?: boolean;
};

const ENGAGEMENTS: Engagement[] = [
  { key: "brand" },
  { key: "web" },
  { key: "retainer", dark: true },
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
      <ParallaxIndex>05</ParallaxIndex>
      <div className="section-head" style={{ marginBottom: 40 }}>
        <span className="section-head__num">{t("home.plans.tag")}</span>
        <h2 className="section-head__title" style={{ fontSize: "clamp(28px, 5vw, 64px)" }}>
          {t("home.plans.title")}
        </h2>
        <span className="label" style={{ alignSelf: "end", textAlign: "right", maxWidth: 340 }}>
          {t("home.plans.meta")}
        </span>
      </div>

      <RevealStagger
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
          gap: 24,
        }}
      >
        {ENGAGEMENTS.map((e, i) => {
          const dark = e.dark;
          const ink = dark ? "var(--canvas-page)" : "var(--ink-body)";
          const features = t(`home.eng.${e.key}.features`).split("|");
          return (
            <RevealItem key={e.key} style={{ display: "flex" }}>
            <div
              className="neo-card neo-card--shine accent-rail"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
                minHeight: 360,
                width: "100%",
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
                  color: "var(--btn-ink)",
                  background: "var(--accent-green)",
                  border: "2px solid var(--ink-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "2px 9px",
                  boxShadow: "var(--shadow-badge)",
                }}
              >
                {String(i + 1).padStart(2, "0")} · {t("home.plans.tag")}
              </span>

              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 28,
                  fontWeight: 600,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.05,
                  color: dark ? "var(--accent-green-bright)" : "var(--accent-green-deep)",
                }}
              >
                {t(`home.eng.${e.key}.title`)}
              </div>

              <p
                style={{
                  margin: 0,
                  fontSize: 15,
                  lineHeight: 1.55,
                  color: ink,
                  opacity: dark ? 0.88 : 0.82,
                }}
              >
                {t(`home.eng.${e.key}.desc`)}
              </p>

              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  gap: 9,
                  borderTop: dark
                    ? "1px solid color-mix(in oklch, var(--canvas-page) 22%, transparent)"
                    : "1px solid color-mix(in oklch, var(--ink-body) 16%, transparent)",
                  paddingTop: 16,
                }}
              >
                {features.map((f) => (
                  <li
                    key={f}
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 10,
                      fontSize: 14,
                      lineHeight: 1.45,
                      color: ink,
                      opacity: dark ? 0.92 : 0.88,
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        flexShrink: 0,
                        color: dark ? "var(--accent-green-bright)" : "var(--accent-green-deep)",
                        fontWeight: 700,
                      }}
                    >
                      ↳
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <a
                href="/contatti"
                className="neo-btn neo-btn--primary"
                style={{
                  alignSelf: "flex-start",
                  padding: "11px 20px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 13,
                  letterSpacing: 0.3,
                  textDecoration: "none",
                }}
              >
                {t("home.plans.cta")} →
              </a>
            </div>
            </RevealItem>
          );
        })}
      </RevealStagger>

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
