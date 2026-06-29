"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";

// The bento grid itself (no section wrapper), so it can be reused both as the
// standalone #servizi section and live inside the MacBook screen.
const PILLARS = ["sites", "visibility", "social", "automation", "data", "agents"] as const;

export default function BentoGrid() {
  const { t } = useLang();

  return (
    <div className="bento">
      <div className="bento-cell bento-img">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bento/shift.jpg" alt={t("bento.img.alt")} loading="lazy" />
      </div>

      <div className="bento-cell bento-head">
        <span className="bento-kicker">{t("bento.kicker")}</span>
        <h2 className="bento-title">{t("bento.title")}</h2>
        <p className="bento-body">{t("bento.body")}</p>
      </div>

      <div className="bento-cell bento-stat">
        <span className="bento-stat__n">{t("bento.s1.n")}</span>
        <span className="bento-stat__l">{t("bento.s1.label")}</span>
      </div>
      <div className="bento-cell bento-stat">
        <span className="bento-stat__n">{t("bento.s2.n")}</span>
        <span className="bento-stat__l">{t("bento.s2.label")}</span>
      </div>
      <div className="bento-cell bento-stat">
        <span className="bento-stat__n">{t("bento.s3.n")}</span>
        <span className="bento-stat__l">{t("bento.s3.label")}</span>
      </div>

      {PILLARS.map((key) => (
        <div key={key} className="bento-cell bento-svc">
          <span className="bento-svc__icon">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/services/${key}.svg`} alt="" aria-hidden="true" loading="lazy" />
          </span>
          <h3 className="bento-svc__title">{t(`home.svc.${key}.title`)}</h3>
          <p className="bento-svc__desc">{t(`home.svc.${key}.desc`)}</p>
        </div>
      ))}

      <div className="bento-cell bento-chart">
        <div className="bento-chart__top">
          <span className="bento-chart__n">{t("bento.chart.n")}</span>
          <span className="bento-chart__u">{t("bento.chart.unit")}</span>
        </div>
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points="0,52 28,46 56,48 84,34 112,30 140,18 168,16 200,6"
            fill="none"
            stroke="var(--accent-green-deep)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="200" cy="6" r="4.5" fill="var(--accent-green)" stroke="var(--ink-border)" strokeWidth="1.5" />
        </svg>
        <span className="bento-chart__l">{t("bento.chart.label")}</span>
      </div>

      <Link href="/contatti" className="bento-cell bento-cta">
        <span className="bento-cta__arrow" aria-hidden="true">↗</span>
        <span className="bento-cta__txt">{t("bento.cta")}</span>
      </Link>
    </div>
  );
}
