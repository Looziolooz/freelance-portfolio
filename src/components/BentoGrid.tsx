"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang } from "./LangProvider";

// The bento grid itself (no section wrapper), so it can be reused both as the
// standalone #servizi section and live inside the MacBook screen.
const PILLARS = ["sites", "visibility", "social", "automation", "data", "agents"] as const;

// Each pillar owns one cell class that carries BOTH its grid area (where the
// mosaic places it) and its ground colour, so a cell's position and its fill
// can never drift apart.
const CELL: Record<(typeof PILLARS)[number], string> = {
  sites: "bento-svc--sites",
  visibility: "bento-svc--visibility",
  social: "bento-svc--social",
  automation: "bento-svc--automation",
  data: "bento-svc--data",
  agents: "bento-svc--agents",
};

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

      {PILLARS.map((key) => {
        // Service cards become links as their landing pages come online
        // (SEO audit: six services sold, zero services with a URL).
        // Every cell now goes somewhere. The three that had no landing page were
        // selling a service and offering nothing to look at, which on the cell
        // that promises "contenuti pronti da pubblicare" was the worst possible
        // place to have nothing: the demos existed, they were just parked on
        // project pages reachable only from /work. These three point at the
        // project that IS the demo of that service, and unlike /servizi/* those
        // pages are fully translated, so a Swedish visitor does not land on an
        // Italian wall.
        const href =
          key === "sites" ? "/servizi/siti-web"
          : key === "automation" ? "/servizi/automazioni"
          : key === "agents" ? "/servizi/agenti-ai"
          : key === "social" ? "/work/contenuti-social"
          : key === "visibility" ? "/work/audit-visibilita"
          : key === "data" ? "/work/mappa-mercato"
          : undefined;
        const inner = (
          <>
            {/* Corner badge = this cell is a link. The bare arrow was doing the
                job for anyone who already reads ↗ as "goes somewhere"; the word
                in front of it says the same thing to everyone else, and says it
                at rest, which is the only state a touch visitor ever sees.
                aria-hidden: the link's own text already names the destination,
                so a screen reader would just hear "visita" twice. */}
            {href && (
              <span className="bento-svc__go" aria-hidden="true">
                {t("bento.go")} <i>↗</i>
              </span>
            )}
            <span className="bento-svc__icon">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/services/${key}.svg`} alt="" aria-hidden="true" loading="lazy" width={48} height={48} />
            </span>
            <h3 className="bento-svc__title">{t(`home.svc.${key}.title`)}</h3>
            <p className="bento-svc__desc">{t(`home.svc.${key}.desc`)}</p>
          </>
        );
        return href ? (
          <Link key={key} href={href} className={`bento-cell bento-svc ${CELL[key]}`} style={{ textDecoration: "none", color: "inherit" }}>
            {inner}
          </Link>
        ) : (
          <div key={key} className={`bento-cell bento-svc ${CELL[key]}`}>
            {inner}
          </div>
        );
      })}

      <div className="bento-cell bento-chart">
        <div className="bento-chart__top">
          <span className="bento-chart__n">{t("bento.chart.n")}</span>
          <span className="bento-chart__u">{t("bento.chart.unit")}</span>
        </div>
        {/* The sparkline is stretched to the cell (preserveAspectRatio="none"),
            which used to distort everything drawn in it: the 3-unit stroke came
            out thicker horizontally than vertically, and the end circle became a
            squashed ellipse sitting exactly ON x=200, so the cell's overflow
            clipped its right half.
            vector-effect="non-scaling-stroke" takes stroke geometry out of the
            stretch, and the dot is now a zero-length path with a round cap, which
            renders a true circle at any aspect. Both end at 193, inside the box. */}
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
          <polyline
            points="0,53 28,47 56,49 84,35 112,31 140,20 168,17 193,9"
            fill="none"
            stroke="var(--accent-green-deep)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M193 9 L193 9" stroke="var(--ink-border)" strokeWidth="12" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <path d="M193 9 L193 9" stroke="var(--accent-green)" strokeWidth="8" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="bento-chart__l">{t("bento.chart.label")}</span>
      </div>
    </div>
  );
}
