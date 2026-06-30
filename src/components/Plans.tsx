"use client";

import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import { RevealStagger, RevealItem } from "./Reveal";

// Engagements — three ways to work together (no fixed prices/subscriptions):
// a Brand System, a Conversion Website, or an ongoing Retainer. Laid out as a
// BENTO that echoes the Servizi grid: Brand + Web as two top cells, the ongoing
// Retainer (dark) as a full-width FEATURE bar (pitch left, deliverables right).
// The real scope is set in a short intro call, so the only CTA is "fill the form".
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
      className="plans"
      aria-label={t("home.plans.title")}
      style={{ position: "relative" }}
    >
      <SectionHeader eyebrow={t("home.plans.tag")} title={t("home.plans.title")} sub={t("home.plans.meta")} />

      <RevealStagger className="plans-bento">
        {ENGAGEMENTS.map((e, i) => {
          const feature = !!e.dark;
          const features = t(`home.eng.${e.key}.features`).split("|");
          const cta = (
            <a href="/contatti" className="neo-btn neo-btn--primary plan-card__cta">
              {t("home.plans.cta")} →
            </a>
          );
          return (
            <RevealItem
              key={e.key}
              className={`plan-card${feature ? " plan-card--feature" : ""}`}
            >
              <div className="plan-card__head">
                <span className="plan-card__badge">
                  {String(i + 1).padStart(2, "0")} · {t("home.plans.tag")}
                </span>
                <h3 className="plan-card__title">{t(`home.eng.${e.key}.title`)}</h3>
                <p className="plan-card__desc">{t(`home.eng.${e.key}.desc`)}</p>
                {feature && cta}
              </div>

              <ul className="plan-card__features">
                {features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>

              {!feature && cta}
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
