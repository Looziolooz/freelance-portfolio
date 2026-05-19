"use client";

import { useLang } from "./LangProvider";
import SectionHeader from "./SectionHeader";

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

export default function Stack() {
  const { t } = useLang();

  return (
    <section
      id="stack"
      style={{
        padding: "clamp(80px, 8vw, 140px) clamp(24px, 4vw, 60px)",
        borderTop: "1px solid var(--line)",
      }}
    >
      <SectionHeader num={t("stack.num")} title={t("stack.title")} meta={t("stack.meta")} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 40,
        }}
      >
        {cols(t).map((c, i) => (
          <div key={i}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                textTransform: "uppercase",
                letterSpacing: 1.6,
                color: "var(--muted)",
                paddingBottom: 14,
                borderBottom: "1px solid var(--line)",
                marginBottom: 24,
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <span>{c.label}</span>
              <span>0{i + 1}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {c.primary.map((x) => (
                <div
                  key={x}
                  style={{
                    fontSize: 22,
                    fontWeight: 500,
                    letterSpacing: -0.3,
                    color: "var(--fg)",
                  }}
                >
                  {x}
                </div>
              ))}
              {c.secondary.map((x) => (
                <div
                  key={x}
                  style={{
                    fontSize: 22,
                    fontWeight: 400,
                    letterSpacing: -0.3,
                    color: "var(--muted)",
                  }}
                >
                  {x}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
