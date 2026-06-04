"use client";

import Link from "next/link";
import { useLang } from "./LangProvider";

// The "front door" of the site: four clear, equal-weight entry points so a
// visitor immediately sees where the important things are (projects, agents,
// membership, blog). Uses the system .neo-card so it matches the rest of the site.
const DOORS = [
  { key: "work", href: "/#work", accent: "var(--accent-coral)" },
  { key: "agents", href: "/agents", accent: "var(--accent-peach-deep)" },
  { key: "membership", href: "/membership", accent: "var(--accent-decor-green)" },
  { key: "blog", href: "/blog", accent: "var(--accent-peach)" },
];

export default function EntryGrid() {
  const { t } = useLang();

  return (
    <section className="section" aria-label={t("home.door.eyebrow")}>
      <div className="label" style={{ marginBottom: 24 }}>
        {t("home.door.eyebrow")}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 24,
        }}
      >
        {DOORS.map((d) => (
          <Link
            key={d.key}
            href={d.href}
            className="neo-card"
            style={{
              textDecoration: "none",
              color: "var(--ink-body)",
              display: "flex",
              flexDirection: "column",
              gap: 12,
              minHeight: 190,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 30,
                height: 30,
                borderRadius: "var(--radius-sm)",
                background: d.accent,
                border: "3px solid var(--ink-border)",
              }}
            />
            <h3
              style={{
                margin: 0,
                fontSize: "var(--fs-h2)",
                fontWeight: 700,
                letterSpacing: "var(--tracking-tight)",
              }}
            >
              {t(`home.door.${d.key}`)}
            </h3>
            <p
              style={{
                margin: 0,
                flex: 1,
                fontSize: "var(--fs-sm)",
                lineHeight: "var(--lh-normal)",
                color: "var(--ink-muted)",
              }}
            >
              {t(`home.door.${d.key}.sub`)}
            </p>
            <span
              className="arrow-blink"
              aria-hidden="true"
              style={{ fontFamily: "var(--font-mono)", fontSize: 16, fontWeight: 700 }}
            >
              →
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
