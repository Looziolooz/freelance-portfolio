"use client";

import { useLang } from "./LangProvider";
import ParallaxIndex from "./ParallaxIndex";
import { RevealStagger, RevealItem } from "./Reveal";

// Core sales band: six service pillars in an asymmetric BENTO grid, each with a
// representative placeholder image (/public/services/<key>.svg — on-brand vector
// motifs, swap for real photos/renders later). Outcome-first copy.
const PILLARS = [
  "sites",
  "visibility",
  "social",
  "automation",
  "data",
  "agents",
] as const;

// Bento areas, in source order (sites is the 2x2 feature cell).
const AREAS = ["a", "b", "c", "d", "e", "f"] as const;

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

      <RevealStagger className="svc-bento">
        {PILLARS.map((key, i) => (
          <RevealItem key={key} className={`svc-cell svc-cell--${AREAS[i]}`}>
            <div className="svc-cell__media">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/services/${key}.svg`} alt="" aria-hidden="true" loading="lazy" />
            </div>
            <div className="svc-cell__body">
              <span className="svc-cell__num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="svc-cell__title">{t(`home.svc.${key}.title`)}</h3>
              <p className="svc-cell__desc">{t(`home.svc.${key}.desc`)}</p>
            </div>
          </RevealItem>
        ))}
      </RevealStagger>
    </section>
  );
}
