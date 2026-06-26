"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Nav from "@/components/Nav";
import { useLang } from "@/components/LangProvider";

interface ComponentMeta {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  kind: "pen" | "prompt";
}

// Per-item title/description are localized via i18n keys components.cat.<slug>.{title,desc}
// when present, falling back to the server META value (IT) otherwise.
function loc(t: (k: string) => string, slug: string, field: "title" | "desc", fb: string) {
  const k = `components.cat.${slug}.${field}`;
  const v = t(k);
  return v === k ? fb : v;
}

export default function ComponentiPage() {
  const { t } = useLang();
  const [items, setItems] = useState<ComponentMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/componenti")
      .then((r) => r.json())
      .then((json) => json.success && setItems(json.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Nav />
      <main
        className="container"
        style={{ paddingTop: "calc(var(--topbar-h) + 48px)", paddingBottom: 96, maxWidth: 1200 }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            letterSpacing: 0.6,
            textTransform: "uppercase",
            textDecoration: "none",
            color: "var(--ink-muted)",
          }}
        >
          <span className="btn-arrow" aria-hidden="true" style={{ marginLeft: 0 }}>←</span> Home
        </Link>

        <header style={{ marginBottom: 40, maxWidth: 640 }}>
          <span className="cap-pill cap-pill--solid" style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>
            <span className="cap-pill__dot" />
            {t("components.eyebrow")}
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px, 5.4vw, 68px)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1.03,
              margin: "18px 0 12px",
            }}
          >
            {t("components.title")}
          </h1>
          <p style={{ fontSize: 16, lineHeight: 1.6, color: "var(--ink-muted)" }}>{t("components.intro")}</p>
        </header>

        {loading ? (
          <div style={{ padding: 80, textAlign: "center", color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("components.loading")}
          </div>
        ) : items.length === 0 ? (
          <div style={{ padding: 80, textAlign: "center", color: "var(--ink-muted)", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {t("components.empty")}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
              gap: 28,
            }}
          >
            {items.map((c) => (
              <ComponentCard key={c.slug} c={c} t={t} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}

function ComponentCard({ c, t }: { c: ComponentMeta; t: (k: string) => string }) {
  return (
    <div
      className="neo-card neo-card--shine"
      style={{ position: "relative", padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      {/* Mini live preview — non-interactive in the grid; full preview is on the detail page. */}
      <div style={{ position: "relative", height: 340, overflow: "hidden", borderBottom: "3px solid var(--ink-border)", background: "var(--canvas-panel-grey)" }}>
        <iframe
          src={`/api/componenti/${c.slug}/preview`}
          title={c.title}
          loading="lazy"
          sandbox="allow-scripts"
          tabIndex={-1}
          style={{ width: "100%", height: "100%", border: 0, display: "block", background: "#fff", pointerEvents: "none" }}
        />
        <span
          style={{
            position: "absolute",
            top: 10,
            left: 12,
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            padding: "2px 8px",
            borderRadius: "var(--radius-sm)",
            border: "2px solid var(--ink-border)",
            background: "var(--canvas-page)",
            color: "var(--ink-body)",
          }}
        >
          {t("components.preview")}
        </span>
        {c.kind === "prompt" && (
          <span
            style={{
              position: "absolute",
              top: 10,
              right: 12,
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: 0.5,
              padding: "2px 8px",
              borderRadius: "var(--radius-sm)",
              border: "2px solid var(--ink-border)",
              background: "var(--accent-green)",
              color: "var(--btn-ink)",
            }}
          >
            {t("components.promptBadge")}
          </span>
        )}
      </div>

      {/* Meta */}
      <div style={{ padding: "16px 18px 18px", display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600, margin: 0, letterSpacing: "-0.01em" }}>
            {loc(t, c.slug, "title", c.title)}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {c.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.4,
                padding: "2px 7px",
                borderRadius: "var(--radius-sm)",
                border: "1.5px solid var(--ink-border)",
                background: "var(--canvas-page)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        {loc(t, c.slug, "desc", c.description) && (
          <p
            style={{
              margin: 0,
              fontSize: 13.5,
              lineHeight: 1.5,
              color: "var(--ink-muted)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {loc(t, c.slug, "desc", c.description)}
          </p>
        )}
        <span
          className="arrow-blink"
          style={{ marginTop: "auto", paddingTop: 6, fontFamily: "var(--font-mono)", fontSize: 12.5, fontWeight: 700, color: "var(--accent-green-deep)" }}
        >
          {t("components.open")} →
        </span>
      </div>

      {/* Whole-card link (kept out of the iframe so we never nest interactive content). */}
      <Link
        href={`/componenti/${c.slug}`}
        aria-label={c.title}
        style={{ position: "absolute", inset: 0, zIndex: 3 }}
      />
    </div>
  );
}
