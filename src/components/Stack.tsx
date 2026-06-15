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

// One tinted palette per category so the four tool families read apart at a
// glance. Soft pastels on the cream canvas — the ink border + offset shadow do
// the structural work; per-card colour is the user-requested differentiator.
type Palette = { bg: string; head: string; accent: string };
const PALETTES: Palette[] = [
  { bg: "#E9F4ED", head: "#D4EADD", accent: "#0E8A57" }, // AI / Automation — emerald
  { bg: "#E9F1FE", head: "#D6E4FC", accent: "#2563EB" }, // Frontend — blue
  { bg: "#FFF1DC", head: "#FFE3BC", accent: "#C9791A" }, // Data / Backend — amber
  { bg: "#F4EAF8", head: "#E7D6F0", accent: "#8A4FAE" }, // Design / Craft — violet
];

// Every tool surfaced across the portfolio projects and the Claude content
// packs, grouped into the four families. Primary = headline tools; secondary =
// supporting chips. Proper nouns, so they stay identical in every language.
const cols = (t: (k: string) => string) => [
  {
    label: t("stack.col.0"),
    primary: ["Claude", "Claude Code", "MCP", "n8n", "OpenAI", "LangChain"],
    secondary: ["Groq", "Make", "Zapier", "Prompt design"],
  },
  {
    label: t("stack.col.1"),
    primary: ["React", "Next.js", "TypeScript", "Tailwind", "GSAP"],
    secondary: ["Framer Motion", "ScrollTrigger", "Lenis", "Three.js", "MDX"],
  },
  {
    label: t("stack.col.2"),
    primary: ["Supabase", "Postgres", "Prisma", "Node.js", "Playwright"],
    secondary: ["Puppeteer", "REST", "Webhook", "Vercel", "Python"],
  },
  {
    label: t("stack.col.3"),
    primary: ["Figma", "Illustrator", "Photoshop", "Canva"],
    secondary: ["Branding", "Strategy", "UX/UI", "Copywriting"],
  },
];

function StackCard({ c, i }: { c: ReturnType<typeof cols>[number]; i: number }) {
  const [hover, setHover] = useState(false);
  const pal = PALETTES[i % PALETTES.length];

  return (
      <div
        style={{
          border: "3px solid var(--ink-border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          background: pal.bg,
          display: "flex",
          flexDirection: "column",
          height: "100%",
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
          background: pal.head,
          padding: "26px 24px 22px",
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
            fontSize: 13.5,
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
            color: pal.accent,
            fontWeight: 700,
          }}
        >
          0{i + 1}
        </span>
        <span
          aria-hidden="true"
          style={{
            display: "inline-flex",
            color: pal.accent,
            opacity: hover ? 0.22 : 0.12,
            transition: "opacity .3s, transform .4s cubic-bezier(.22,1,.36,1)",
            transform: hover ? "scale(1.15) rotate(-8deg)" : "scale(1) rotate(0)",
            pointerEvents: "none",
            flexShrink: 0,
            position: "absolute",
            right: 18,
            bottom: -2,
          }}
        >
          {icons[i]}
        </span>
      </div>
      <div
        style={{
          padding: "22px 24px 24px",
          display: "flex",
          flexDirection: "column",
          gap: 9,
          flex: 1,
        }}
      >
        {c.primary.map((x) => (
          <div
            key={x}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: -0.3,
              color: "var(--fg)",
              transition: "transform .2s",
              transform: hover ? "translateX(4px)" : "translateX(0)",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: pal.accent,
                flexShrink: 0,
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
            marginTop: "auto",
            paddingTop: 14,
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
                color: "var(--fg)",
                padding: "3px 8px",
                border: "1px solid var(--ink-border)",
                borderRadius: 999,
                background: "color-mix(in oklch, var(--canvas-page) 60%, transparent)",
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
      <div className="tools-grid">
        {cols(t).map((c, i) => (
          <StackCard key={i} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}
