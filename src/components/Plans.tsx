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

      {/* The three things a small-business buyer wants settled before reading
          anything else. Mono chips, not prose — they are meant to be scanned. */}
      <ul className="plans-signals">
        {t("home.plans.signals").split("|").map((sig) => (
          <li key={sig} className="plans-signals__item">{sig}</li>
        ))}
      </ul>

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
                {/* The figure sits right under the title, before the pitch: the
                    card next door promises "Prezzo deciso prima", and until now
                    the only number on the site was buried in a collapsed FAQ. */}
                <p className="plan-card__price">
                  {t(`home.eng.${e.key}.price`)}
                  <span className="plan-card__pricenote">{t(`home.eng.${e.key}.priceNote`)}</span>
                </p>
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

      {/* What the figures do and don't cover. The clearest thing the reference
          site did was spell out which costs are mine and which are yours — that
          kind of note earns more trust than any reassuring adjective. */}
      <p className="plans-costnote">{t("home.plans.costnote")}</p>

      {/* The full breakdown (deliverables, process, hosting) lives on /prezzi —
          piling it in here would have made this the longest block on the page and
          pushed the FAQ and the contact form far down the scroll. */}
      <a href="/prezzi" className="plans-pricelink">
        {t("home.plans.pricelink")} <span aria-hidden="true">→</span>
      </a>
    </section>
  );
}
