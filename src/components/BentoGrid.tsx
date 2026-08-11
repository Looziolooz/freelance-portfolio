"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangProvider";

// The bento grid itself (no section wrapper), so it can be reused both as the
// standalone #servizi section and live inside the MacBook screen.
const PILLARS = ["sites", "visibility", "social", "automation", "data", "agents"] as const;

export default function BentoGrid() {
  const { t } = useLang();

  return (
    <div className="bento">
      <div className="bento-cell bento-img">
        <Image
          src="/bento/shift.jpg"
          alt={t("bento.img.alt")}
          width={670}
          height={700}
          sizes="(max-width: 760px) 90vw, 300px"
          loading="lazy"
        />
      </div>

      <div className="bento-cell bento-head">
        <span className="bento-kicker">{t("bento.kicker")}</span>
        <h2 className="bento-title">{t("bento.title")}</h2>
        <p className="bento-body">{t("bento.body")}</p>
      </div>

      {PILLARS.map((key, i) => {
        // Service cards become links as their landing pages come online
        // (SEO audit: six services sold, zero services with a URL).
        const href =
          key === "sites" ? "/servizi/siti-web"
          : key === "automation" ? "/servizi/automazioni"
          : key === "agents" ? "/servizi/agenti-ai"
          : undefined;
        const inner = (
          <>
            {/* Corner arrow = this cell is a link. Same mark the Parliamone cell
                uses, so the grid teaches one rule instead of leaving the visitor
                to notice a small arrow inside a heading. */}
            {href && <span className="bento-svc__go" aria-hidden="true">↗</span>}
            <span className="bento-svc__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/services/${key}.svg`} alt="" aria-hidden="true" loading="lazy" />
            </span>
            <h3 className="bento-svc__title">
              {t(`home.svc.${key}.title`)}

            </h3>
            <p className="bento-svc__desc">{t(`home.svc.${key}.desc`)}</p>
          </>
        );
        // Ground variety so the six pillars don't read as one slab: neutrals
        // alternate, and the flagship (agents) takes the dark accent. Assigned by
        // index rather than :nth-child because these render as <a> OR <div>
        // depending on whether the landing page exists yet, which makes
        // type-based selectors quietly wrong.
        const ground =
          key === "agents" ? " bento-svc--deep" : i % 2 ? " bento-svc--alt" : "";
        return href ? (
          <Link key={key} href={href} className={`bento-cell bento-svc${ground}`} style={{ textDecoration: "none", color: "inherit" }}>
            {inner}
          </Link>
        ) : (
          <div key={key} className={`bento-cell bento-svc${ground}`}>
            {inner}
          </div>
        );
      })}

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
    </div>
  );
}
