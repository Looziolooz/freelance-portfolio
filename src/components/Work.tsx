"use client";

import { useState } from "react";
import Link from "next/link";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import ParallaxIndex from "./ParallaxIndex";
import { PROJECTS } from "@/lib/projects";

function FeaturedCard({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  // The "value" line is the business outcome, not the tech. Falls back to
  // nothing when a project has no value copy yet (t() echoes the key on miss).
  const valueKey = `work.proj.${p.key}.value`;
  const value = t(valueKey);
  const hasValue = value !== valueKey;

  return (
    <Link
      href={`/work/${p.slug}`}
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          border: "3px solid var(--ink-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: "var(--canvas-panel-yellow)",
          display: "flex",
          flexDirection: "column",
          transition: "transform .25s cubic-bezier(.16,1,.3,1), box-shadow .25s cubic-bezier(.16,1,.3,1)",
          transform: hover ? "translate(-2px, -2px)" : "translateY(0)",
          boxShadow: hover
            ? "8px 8px 0 var(--ink-shadow)"
            : "6px 6px 0 var(--ink-shadow)",
        }}
      >
        <div
          style={{
            aspectRatio: "16/10",
            background: p.swatch ?? "var(--canvas-panel-grey)",
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image}
              alt={t(`work.proj.${p.key}`)}
              loading="lazy"
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                transform: hover ? "scale(1.03)" : "scale(1)",
                transition: "transform .4s cubic-bezier(.16,1,.3,1)",
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--fg) 6%, transparent) 14px 15px)",
              }}
            />
          )}
          <div
            style={{
              position: "absolute",
              top: 14,
              left: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "color-mix(in oklch, var(--fg) 60%, transparent)",
              letterSpacing: 1,
            }}
          >
            P / {p.id}
          </div>
          <div
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "color-mix(in oklch, var(--fg) 60%, transparent)",
              letterSpacing: 1,
            }}
          >
            {["01","02","03","04","11","12","13","14","15","16"].includes(p.id) ? "2026" : "2024"}
          </div>
          {!p.image && (
            <div
              style={{
                position: "relative",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: 1.4,
                color: "color-mix(in oklch, var(--fg) 55%, transparent)",
                textTransform: "uppercase",
              }}
            >
              [ {t(`work.proj.${p.key}`).toUpperCase()} — {t("work.preview")} ]
            </div>
          )}
        </div>
        <div
          style={{
            padding: "22px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 16,
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 27,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--fg)",
                margin: 0,
              }}
            >
              {t(`work.proj.${p.key}`)}
            </h3>
          <span
                className="arrow-blink"
                style={{
                  fontSize: 20,
                  color: "var(--fg)",
                  display: "inline-block",
                  marginLeft: 0,
                }}
              >
                ↗
              </span>
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--muted)",
              letterSpacing: 0.6,
              textTransform: "uppercase",
            }}
          >
            {t(`work.proj.${p.key}.tags`)}
          </div>
          <p
            style={{
              fontSize: 15,
              lineHeight: 1.55,
              color: "var(--fg)",
              marginTop: 8,
              opacity: 0.85,
            }}
          >
            {t(`work.proj.${p.key}.blurb`)}
          </p>
          {hasValue && (
            <div
              style={{
                marginTop: 14,
                paddingTop: 14,
                borderTop: "1px solid color-mix(in oklch, var(--fg) 14%, transparent)",
                display: "flex",
                gap: 10,
                alignItems: "baseline",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "var(--accent-green-deep)",
                  flexShrink: 0,
                }}
              >
                {t("work.value.label")}
              </span>
              <span style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--fg)", opacity: 0.92 }}>
                {value}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function Work() {
  const { t } = useLang();
  const featured = PROJECTS.filter((p) => p.featured);

  return (
    <section
      id="work"
      className="section-indexed"
      style={{
        padding: "clamp(80px, 8vw, 140px) 0",
        borderTop: "1px solid var(--line)",
        position: "relative",
      }}
    >
      <ParallaxIndex>03</ParallaxIndex>
      <SectionHeader
        num={t("work.num")}
        title={t("work.title")}
        meta={t("work.meta")}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 32,
          marginBottom: 96,
        }}
      >
        {featured.map((p) => (
          <FeaturedCard key={p.id} p={p} t={t} />
        ))}
      </div>
    </section>
  );
}
