"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";

const PROJECTS = [
  { id: "01", key: "01", href: "https://lexicon-ecommerce-group-project.vercel.app/", featured: true, swatch: "#eee9d9" },
  { id: "02", key: "02", href: "https://tragardhobby.netlify.app/", featured: true, swatch: "#ddeace" },
  { id: "03", key: "03", href: "https://loozio-pokedex.netlify.app/", featured: true, swatch: "#eee3cd" },
  { id: "04", key: "04", href: "https://planetchatbot.netlify.app/", featured: true, swatch: "#dfe6ee" },
  { id: "05", key: "05", href: "https://lorenzospizzaria.netlify.app/" },
  { id: "06", key: "06", href: "https://loozlibrary.netlify.app/" },
  { id: "07", key: "07", href: "https://weather-se.netlify.app/" },
  { id: "08", key: "08", href: "https://basketball-scoreboard-looz.netlify.app/" },
  { id: "09", key: "09", href: "https://traincounterpassenger.netlify.app/" },
  { id: "10", key: "10", href: "https://plannedplanthoodcss.netlify.app/" },
];

function FeaturedCard({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener"
      style={{ textDecoration: "none", color: "inherit" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          border: "1px solid var(--line)",
          borderRadius: 4,
          overflow: "hidden",
          background: "var(--panel)",
          display: "flex",
          flexDirection: "column",
          transition: "transform .35s cubic-bezier(.2,.7,.2,1), box-shadow .35s",
          transform: hover ? "translateY(-4px)" : "translateY(0)",
          boxShadow: hover
            ? "0 20px 40px -20px color-mix(in oklch, var(--fg) 25%, transparent)"
            : "0 0 0 transparent",
        }}
      >
        <div
          style={{
            aspectRatio: "16/10",
            background: p.swatch,
            position: "relative",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage:
                "repeating-linear-gradient(45deg, transparent 0 14px, color-mix(in oklch, var(--fg) 6%, transparent) 14px 15px)",
            }}
          />
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
            {t(`work.proj.${p.key}`) === `work.proj.${p.key}` ? "2024" : ""}
          </div>
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
                fontSize: 26,
                fontWeight: 500,
                letterSpacing: -0.6,
                color: "var(--fg)",
                margin: 0,
              }}
            >
              {t(`work.proj.${p.key}`)}
            </h3>
            <span
              style={{
                fontSize: 20,
                color: "var(--fg)",
                transition: "transform .3s",
                transform: hover ? "translate(4px,-4px)" : "translate(0,0)",
                display: "inline-block",
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
        </div>
      </div>
    </a>
  );
}

function IndexRow({ p, t }: { p: typeof PROJECTS[number]; t: (k: string) => string }) {
  const [hover, setHover] = useState(false);

  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener"
      style={{
        display: "grid",
        gridTemplateColumns: "60px 1fr 100px 280px 80px",
        alignItems: "center",
        padding: "24px 16px",
        borderBottom: "1px solid var(--line)",
        fontSize: 18,
        textDecoration: "none",
        color: "var(--fg)",
        transition: "background .2s, padding .2s",
        background: hover ? "var(--panel)" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
        {p.id}
      </div>
      <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>
        {t(`work.proj.${p.key}`)}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted)" }}>
        {p.id === "01" || p.id === "02" ? "2024" : p.id === "03" || p.id === "04" ? "2024" : "2023"}
      </div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 0.5 }}>
        {t(`work.proj.${p.key}.tags`)}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 14,
          color: "var(--fg)",
          textAlign: "right",
          transition: "transform .2s",
          transform: hover ? "translateX(4px)" : "translateX(0)",
        }}
      >
        {t("work.go")}
      </div>
    </a>
  );
}

export default function Work() {
  const { t } = useLang();
  const featured = PROJECTS.filter((p) => p.featured);
  const rest = PROJECTS.filter((p) => !p.featured);

  return (
    <section
      id="work"
      style={{
        padding: "clamp(80px, 8vw, 140px) clamp(24px, 4vw, 60px)",
        borderTop: "1px solid var(--line)",
      }}
    >
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
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          borderBottom: "1px solid var(--fg)",
          paddingBottom: 14,
          marginBottom: 8,
        }}
      >
        <h3 style={{ fontSize: 28, margin: 0, fontWeight: 500, letterSpacing: -0.5 }}>
          {t("work.archive")}
        </h3>
        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "var(--muted)",
            letterSpacing: 1.4,
            textTransform: "uppercase",
          }}
        >
          {t("work.archive.meta")}
        </div>
      </div>
      <div style={{ overflowX: "auto" }}>
        {rest.map((p) => (
          <IndexRow key={p.id} p={p} t={t} />
        ))}
      </div>
    </section>
  );
}
