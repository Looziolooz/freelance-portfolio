"use client";

import { useState } from "react";
import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";
import ParallaxIndex from "./ParallaxIndex";

const icons = [
  <svg key="0" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
  </svg>,
  <svg key="1" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>,
  <svg key="2" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
  </svg>,
  <svg key="3" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>,
];

const cols = (t: (k: string) => string) => [
  {
    label: t("stack.col.0"),
    primary: ["n8n", "OpenAI", "Claude", "LangChain"],
    secondary: ["Zapier", "Make"],
  },
  {
    label: t("stack.col.1"),
    primary: ["React", "Next.js", "TypeScript", "Tailwind"],
    secondary: ["Framer Motion", "MDX"],
  },
  {
    label: t("stack.col.2"),
    primary: ["Puppeteer", "Playwright", "Supabase", "Postgres"],
    secondary: ["REST", "Webhook"],
  },
  {
    label: t("stack.col.3"),
    primary: ["Figma", "Illustrator", "Photoshop"],
    secondary: ["Branding", "Strategia"],
  },
];

function StackCard({ c, i }: { c: ReturnType<typeof cols>[number]; i: number }) {
  const [hover, setHover] = useState(false);

  return (
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
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        style={{
          background: "var(--canvas-panel-grey)",
          padding: "32px 28px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "3px solid var(--ink-border)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <span
          className="label"
          style={{
            fontSize: 14,
            color: "var(--fg)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {c.label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--muted)",
            opacity: 0.6,
          }}
        >
          0{i + 1}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            color: hover ? "var(--accent)" : "var(--muted)",
            opacity: hover ? 0.15 : 0.08,
            transition: "color .3s, opacity .3s, transform .4s cubic-bezier(.22,1,.36,1)",
            transform: hover ? "scale(1.15) rotate(-8deg)" : "scale(1) rotate(0)",
            pointerEvents: "none",
            flexShrink: 0,
          }}
        >
          {icons[i]}
        </span>
      </div>
      <div
        style={{
          padding: "24px 28px 28px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        {c.primary.map((x) => (
          <div
            key={x}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 20,
              fontWeight: 500,
              letterSpacing: -0.3,
              color: "var(--fg)",
              transition: "transform .2s",
              transform: hover ? "translateX(4px)" : "translateX(0)",
            }}
          >
            <span
              style={{
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
                opacity: hover ? 1 : 0,
                transition: "opacity .2s",
              }}
            />
            {x}
          </div>
        ))}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginTop: 8,
            paddingTop: 12,
            borderTop: "3px solid var(--ink-border)",
          }}
        >
          {c.secondary.map((x) => (
            <span
              key={x}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                letterSpacing: 0.5,
                color: "var(--muted)",
                padding: "3px 8px",
                border: "1px solid var(--line)",
                borderRadius: 999,
                opacity: hover ? 1 : 0.6,
                transition: "opacity .2s",
              }}
            >
              {x}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Stack() {
  const { t } = useLang();

  return (
    <section
      id="stack"
      className="section-indexed"
      style={{
        padding: "clamp(80px, 8vw, 140px) 0",
        borderTop: "1px solid var(--line)",
        position: "relative",
      }}
    >
      <ParallaxIndex>04</ParallaxIndex>
      <SectionHeader num={t("stack.num")} title={t("stack.title")} meta={t("stack.meta")} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {cols(t).map((c, i) => (
          <StackCard key={i} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
